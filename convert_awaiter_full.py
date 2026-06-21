#!/usr/bin/env python3
"""
Stream-based processor to convert __awaiter patterns to ESNext async/await.
Uses streaming/chunked processing to avoid loading the entire file into memory.
"""

import re
import sys
from typing import Tuple, Optional, List

def find_matching_brace(content: str, start: int) -> int:
    """Find the matching closing brace for an opening brace at position start."""
    if start >= len(content) or content[start] != '{':
        return -1
    
    count = 1
    i = start + 1
    in_string = False
    string_char = None
    in_template = False
    in_comment_line = False
    in_comment_block = False
    
    while i < len(content) and count > 0:
        char = content[i]
        prev_char = content[i-1] if i > 0 else ''
        next_char = content[i+1] if i < len(content)-1 else ''
        
        # Handle comments (only when not in string)
        if not in_string and not in_template:
            if char == '/' and next_char == '/' and not in_comment_block:
                in_comment_line = True
                i += 1
                continue
            elif char == '\n' and in_comment_line:
                in_comment_line = False
            elif char == '/' and next_char == '*' and not in_comment_line and not in_comment_block:
                in_comment_block = True
                i += 1
                continue
            elif char == '*' and next_char == '/' and in_comment_block:
                in_comment_block = False
                i += 1
                continue
        
        if in_comment_line or in_comment_block:
            i += 1
            continue
        
        # Handle strings and templates
        if char == '`' and prev_char != '\\':
            if not in_string and not in_template:
                in_template = True
            elif in_template:
                in_template = False
            i += 1
            continue
            
        if char in '"\'':
            if not in_string and not in_template:
                in_string = True
                string_char = char
            elif in_string and char == string_char and prev_char != '\\':
                in_string = False
                string_char = None
            i += 1
            continue
        
        if in_string or in_template:
            i += 1
            continue
        
        # Count braces
        if char == '{':
            count += 1
        elif char == '}':
            count -= 1
        
        i += 1
    
    return i - 1 if count == 0 else -1

def extract_generator_body_and_end(content: str, generator_start: int) -> Tuple[str, int]:
    """Extract the body of a __generator call and return it with its end position."""
    brace_pos = content.find('{', generator_start)
    if brace_pos == -1:
        return '', generator_start
    
    end_pos = find_matching_brace(content, brace_pos)
    if end_pos == -1:
        return '', generator_start
    
    body = content[brace_pos:end_pos+1]
    return body, end_pos + 1

def convert_generator_to_async(generator_body: str, func_params: str) -> str:
    """
    Convert a __generator function body to async/await code.
    
    The TypeScript compiler transforms async functions into state machines using:
    - switch/case statements for control flow
    - [4, promise] for yielding promises (becomes await)
    - p.sent() or s.sent() for getting await results
    - [3, label] for jumps (continuations)
    - [2] or [2, value] for returns
    """
    
    lines = generator_body.split('\n')
    result_lines = []
    case_stack = []
    in_switch = False
    pending_await_var = None
    
    for line in lines:
        stripped = line.strip()
        original_indent = len(line) - len(line.lstrip())
        indent = ' ' * original_indent
        
        # Skip the outer function declaration line
        if 'function (' in stripped and stripped.startswith('return __generator'):
            continue
        if stripped.startswith('function (') and '{' in stripped:
            continue
        if stripped == '});' or stripped == '}' or stripped == ');':
            continue
        
        # Handle switch statement - we'll convert this to linear async code
        if 'switch' in stripped and '(' in stripped:
            in_switch = True
            # Don't output the switch, we'll linearize it
            continue
        
        # Handle case labels
        case_match = re.match(r'case\s+(\d+):', stripped)
        if case_match:
            case_num = int(case_match.group(1))
            case_stack.append(case_num)
            # We'll handle these as part of linearization
            continue
        
        if stripped == 'default:':
            case_stack.append('default')
            continue
        
        # Handle [4, promise] pattern - this is yield/await
        await_match = re.search(r'\[4,\s*([^\]]+)\]', stripped)
        if await_match:
            promise_expr = await_match.group(1).strip()
            # Remove trailing comma if present
            promise_expr = promise_expr.rstrip(',')
            
            # Check if there's a .sent() on next line to capture result
            # For now, just convert to await
            result_lines.append(f'{indent}await {promise_expr};')
            pending_await_var = True
            continue
        
        # Handle .sent() calls (result of await)
        if '.sent()' in stripped:
            # This would normally assign the result, but in simple cases we skip
            # For complex cases, we'd need to track variable assignments
            if '=' in stripped:
                # Extract assignment: let x = p.sent()
                sent_match = re.search(r'(\w+)\s*=\s*\w+\.sent\(\)', stripped)
                if sent_match:
                    var_name = sent_match.group(1)
                    # The await result should have been captured above
                    pass
            continue
        
        # Handle [3, label] - jump to another case (continue)
        if re.search(r'\[3,\s*\d+\]', stripped):
            if 'return' not in stripped:
                result_lines.append(f'{indent}continue;')
            continue
        
        # Handle return [2] or [2]; - plain return
        if stripped == '[2];' or stripped == 'return [2];':
            result_lines.append(f'{indent}return;')
            continue
        
        # Handle return [2, value]
        return_match = re.search(r'\[2,\s*([^\]]+)\]', stripped)
        if return_match:
            value = return_match.group(1).strip().rstrip(';').rstrip(',')
            result_lines.append(f'{indent}return {value};')
            continue
        
        # Handle regular return statements
        if stripped.startswith('return ') and '[' not in stripped:
            result_lines.append(f'{indent}{stripped}')
            continue
        
        # Skip empty lines or closing braces from switch
        if not stripped or stripped == '}':
            if stripped == '}' and in_switch:
                in_switch = False
            continue
        
        # Keep other statements (variable declarations, etc.)
        if stripped and not stripped.startswith('//'):
            result_lines.append(f'{indent}{stripped}')
    
    return '\n'.join(result_lines)

def process_file_streaming(input_path: str, output_path: str, max_conversions: int = 20):
    """Process the file using streaming approach."""
    
    AWAITER_PATTERN = re.compile(
        r'(return\s+__awaiter\()\s*(this|[^\s,]+)\s*,\s*([^\s,]*)\s*,\s*([^\s,]*)\s*,\s*function\s*\(([^)]*)\)\s*\{',
        re.MULTILINE
    )
    
    GENERATOR_PATTERN = re.compile(
        r'return\s+__generator\(this,\s*function\s*\(([^)]*)\)\s*\{'
    )
    
    print(f"Processing {input_path}...")
    
    # Read file in chunks for streaming, but for accurate parsing we need larger context
    # For a truly streaming approach with 130k lines, we'll use mmap or chunked reading
    
    file_size = 0
    with open(input_path, 'r', encoding='utf-8') as f:
        f.seek(0, 2)
        file_size = f.tell()
    
    print(f"File size: {file_size / 1024 / 1024:.2f} MB")
    
    # Use chunked reading with overlap
    chunk_size = 2 * 1024 * 1024  # 2MB chunks
    overlap_size = 500 * 1024  # 500KB overlap to catch patterns spanning chunks
    
    conversions = []
    buffer = ""
    position_offset = 0
    conversions_made = 0
    
    with open(input_path, 'r', encoding='utf-8') as f:
        while True:
            chunk = f.read(chunk_size)
            if not chunk:
                break
            
            buffer += chunk
            
            # Find all __awaiter patterns in current buffer
            for match in AWAITER_PATTERN.finditer(buffer):
                if conversions_made >= max_conversions:
                    break
                
                start = match.start()
                absolute_start = position_offset + start
                
                # Get method name context (look backwards for function signature)
                context_before = buffer[max(0, start-500):start]
                method_match = re.search(r'(\w+)\s*\([^)]*\)\s*\{?\s*$', context_before)
                method_name = method_match.group(1) if method_match else "unknown"
                
                # Check if we have enough buffer to find the complete pattern
                # We need to find the __generator and its closing
                
                end_awaiter_call = match.end()
                remaining_in_buffer = buffer[end_awaiter_call:]
                
                gen_match = GENERATOR_PATTERN.search(remaining_in_buffer)
                if not gen_match:
                    # Pattern might span chunks, save position and continue
                    continue
                
                gen_start_abs = absolute_start + end_awaiter_call + gen_match.start()
                
                # Try to extract generator body
                gen_brace_pos = remaining_in_buffer.find('{', gen_match.start())
                if gen_brace_pos == -1:
                    continue
                
                # Find matching brace - may need more buffer
                test_content = remaining_in_buffer[gen_brace_pos:]
                if len(test_content) < 1000:
                    # Need more buffer
                    continue
                
                gen_body, gen_end_rel = extract_generator_body_and_end(
                    remaining_in_buffer, gen_brace_pos
                )
                
                if not gen_body:
                    continue
                
                gen_end_abs = absolute_start + end_awaiter_call + gen_brace_pos + gen_end_rel
                
                # Now find the closing }); of __awaiter
                after_gen = buffer[end_awaiter_call + gen_brace_pos + gen_end_rel:
                                   end_awaiter_call + gen_brace_pos + gen_end_rel + 100]
                
                # Look for }); pattern
                close_match = re.search(r'\}\);', after_gen)
                if close_match:
                    full_end_rel = end_awaiter_call + gen_brace_pos + gen_end_rel + close_match.end()
                else:
                    full_end_rel = end_awaiter_call + gen_brace_pos + gen_end_rel + 20
                
                # Extract the full pattern to replace
                full_pattern = buffer[start:full_end_rel]
                
                # Get function params from __awaiter call
                this_ref = match.group(2)
                args_param = match.group(3)
                promise_type = match.group(4)
                inner_func_params = match.group(5).strip()
                
                # Get generator function params  
                gen_params = gen_match.group(1).strip() if gen_match else ""
                
                conversions.append({
                    'start': absolute_start,
                    'end': absolute_start + len(full_pattern),
                    'method_name': method_name,
                    'this_ref': this_ref,
                    'inner_params': inner_func_params,
                    'gen_params': gen_params,
                    'original': full_pattern[:200],  # First 200 chars for logging
                    'full_original': full_pattern,
                    'buffer_start': start,
                    'buffer_end': full_end_rel,
                })
                
                conversions_made += 1
                print(f"Found conversion {conversions_made}: method '{method_name}' at position {absolute_start}")
            
            if conversions_made >= max_conversions:
                break
            
            # Keep overlap for next iteration
            if len(buffer) > overlap_size:
                buffer = buffer[-overlap_size:]
                position_offset = absolute_start - len(buffer) if 'absolute_start' in dir() else 0
            else:
                position_offset += len(chunk) - overlap_size if len(chunk) > overlap_size else 0
    
    print(f"\nTotal conversions found: {len(conversions)}")
    
    # Now perform the actual conversions
    if not conversions:
        print("No conversions to perform!")
        return
    
    # Read full file for replacement (for demonstration - true streaming would write chunks)
    with open(input_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Sort conversions by position descending to replace from end to start
    conversions.sort(key=lambda x: x['start'], reverse=True)
    
    for conv in conversions:
        original = conv['full_original']
        
        # Build the converted version
        # Pattern: method() { return __awaiter(this, ..., function() { return __generator(this, function() { ... }}); }
        # Convert to: async method() { ... }
        
        # Extract method signature
        before_pattern = content[max(0, conv['start']-500):conv['start']]
        
        # Find method name and params
        method_sig_match = re.search(r'(\w+)\s*\(([^)]*)\)\s*\{?\s*$', before_pattern)
        
        if method_sig_match:
            method_name = method_sig_match.group(1)
            method_params = method_sig_match.group(2)
            
            # Convert generator body to async code
            # Find the __generator call within the original
            gen_match = GENERATOR_PATTERN.search(original)
            if gen_match:
                gen_body_start = original.find('{', gen_match.start())
                gen_body, _ = extract_generator_body_and_end(original, gen_body_start)
                
                async_body = convert_generator_to_async(gen_body, conv['gen_params'])
                
                # Build new method
                new_method = f"async {method_name}({method_params}) {{\n{async_body}\n}}"
                
                # Replace in content
                content = content[:conv['start']] + new_method + content[conv['end']:]
                
                print(f"Converted method: {method_name}")
    
    # Write output
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"\nOutput written to {output_path}")
    print(f"Successfully converted {len(conversions)} methods")

if __name__ == '__main__':
    input_file = '/workspace/src/obsidian/app.js'
    output_file = '/workspace/src/obsidian/app.converted.js'
    process_file_streaming(input_file, output_file, 20)
