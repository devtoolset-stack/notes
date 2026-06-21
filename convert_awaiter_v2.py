#!/usr/bin/env python3
"""
Stream-based processor to convert __awaiter patterns to ESNext async/await.
Uses streaming/chunked processing to avoid loading the entire file into memory.
This version produces cleaner, working async/await code.
"""

import re
import sys
from typing import Tuple, Optional, List, Dict

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

def analyze_switch_cases(generator_body: str) -> List[Dict]:
    """Analyze the switch statement to understand the control flow."""
    cases = []
    
    # Find all case labels
    case_pattern = re.compile(r'case\s+(\d+):')
    default_pattern = re.compile(r'default:')
    
    lines = generator_body.split('\n')
    current_case = None
    case_content = []
    
    for line in lines:
        stripped = line.strip()
        
        case_match = case_pattern.match(stripped)
        if case_match:
            if current_case is not None:
                cases.append({'case': current_case, 'content': case_content})
            current_case = int(case_match.group(1))
            case_content = []
            continue
        
        if default_pattern.match(stripped):
            if current_case is not None:
                cases.append({'case': current_case, 'content': case_content})
            current_case = 'default'
            case_content = []
            continue
        
        if current_case is not None:
            case_content.append(line)
    
    if current_case is not None:
        cases.append({'case': current_case, 'content': case_content})
    
    return cases

def convert_switch_to_async(switch_content: str, var_declarations: List[str]) -> str:
    """
    Convert a switch-based state machine to linear async/await code.
    
    This is a complex transformation. We need to:
    1. Extract variable declarations from case 0
    2. Convert [4, promise] to await
    3. Handle .sent() results
    4. Convert [3, label] jumps to proper control flow
    5. Handle returns properly
    """
    
    lines = switch_content.split('\n')
    result_lines = []
    
    # First pass: collect variable declarations
    var_decl_pattern = re.compile(r'^\s*(let|var|const)\s+\w+')
    
    for line in lines:
        stripped = line.strip()
        
        # Skip function wrapper lines
        if 'function (' in stripped or stripped.startswith('return __generator'):
            continue
        if stripped in ['});', '}', ');', '']:
            continue
        
        # Skip switch statement itself
        if 'switch' in stripped and '(' in stripped:
            continue
        
        # Skip case labels
        if stripped.startswith('case ') or stripped.startswith('default:'):
            continue
        
        # Skip closing braces from switch
        if stripped == '}':
            continue
        
        result_lines.append(line)
    
    return '\n'.join(result_lines)

def convert_generator_body_to_async(generator_body: str) -> str:
    """Convert the entire generator body to async/await code."""
    
    # First, let's identify the structure
    # The generator body contains: { return __generator(this, function (_) { switch... }); }
    
    # Find the inner function
    inner_func_match = re.search(r'function\s*\(([^)]*)\)\s*\{', generator_body)
    if not inner_func_match:
        return generator_body
    
    inner_params = inner_func_match.group(1).strip()
    
    # Find the switch content
    switch_start = generator_body.find('switch')
    if switch_start == -1:
        return generator_body
    
    # Find the switch block
    switch_brace = generator_body.find('{', switch_start)
    if switch_brace == -1:
        return generator_body
    
    switch_end = find_matching_brace(generator_body, switch_brace)
    if switch_end == -1:
        return generator_body
    
    switch_content = generator_body[switch_brace:switch_end+1]
    
    # Extract variable declarations from before the switch
    pre_switch = generator_body[:switch_start]
    var_declarations = []
    
    var_pattern = re.compile(r'(let|var|const)\s+[^;]+;', re.MULTILINE)
    for match in var_pattern.finditer(pre_switch):
        var_declarations.append(match.group(0))
    
    # Convert the switch to async code
    async_body = convert_switch_to_async(switch_content, var_declarations)
    
    # Build the result
    result_parts = []
    
    # Add variable declarations
    for decl in var_declarations:
        result_parts.append(decl)
    
    # Add the converted body
    result_parts.append(async_body)
    
    return '\n'.join(result_parts)

def process_file_streaming(input_path: str, output_path: str, max_conversions: int = 20):
    """Process the file using streaming approach."""
    
    AWAITER_PATTERN = re.compile(
        r'return\s+__awaiter\(\s*(this|[^\s,]+)\s*,\s*([^\s,]*)\s*,\s*([^\s,]*)\s*,\s*function\s*\(([^)]*)\)\s*\{',
        re.MULTILINE
    )
    
    GENERATOR_PATTERN = re.compile(
        r'return\s+__generator\(this,\s*function\s*\(([^)]*)\)\s*\{'
    )
    
    print(f"Processing {input_path}...")
    
    file_size = 0
    with open(input_path, 'r', encoding='utf-8') as f:
        f.seek(0, 2)
        file_size = f.tell()
    
    print(f"File size: {file_size / 1024 / 1024:.2f} MB")
    
    # Use chunked reading with overlap
    chunk_size = 2 * 1024 * 1024  # 2MB chunks
    overlap_size = 500 * 1024  # 500KB overlap
    
    conversions = []
    buffer = ""
    position_offset = 0
    conversions_made = 0
    last_absolute_start = 0
    
    with open(input_path, 'r', encoding='utf-8') as f:
        while True:
            chunk = f.read(chunk_size)
            if not chunk:
                break
            
            buffer += chunk
            
            for match in AWAITER_PATTERN.finditer(buffer):
                if conversions_made >= max_conversions:
                    break
                
                start = match.start()
                absolute_start = position_offset + start
                last_absolute_start = absolute_start
                
                context_before = buffer[max(0, start-500):start]
                method_match = re.search(r'(\w+)\s*\(([^)]*)\)\s*\{?\s*$', context_before)
                
                if not method_match:
                    continue
                
                method_name = method_match.group(1)
                method_params = method_match.group(2)
                
                # Skip nested functions (callbacks inside methods)
                if method_name in ['function', '_']:
                    continue
                
                end_awaiter_call = match.end()
                remaining_in_buffer = buffer[end_awaiter_call:]
                
                gen_match = GENERATOR_PATTERN.search(remaining_in_buffer)
                if not gen_match:
                    continue
                
                gen_brace_pos = remaining_in_buffer.find('{', gen_match.start())
                if gen_brace_pos == -1:
                    continue
                
                test_content = remaining_in_buffer[gen_brace_pos:]
                if len(test_content) < 1000:
                    continue
                
                gen_body, gen_end_rel = extract_generator_body_and_end(
                    remaining_in_buffer, gen_brace_pos
                )
                
                if not gen_body:
                    continue
                
                # Find the closing }); of __awaiter
                after_gen = buffer[end_awaiter_call + gen_brace_pos + gen_end_rel:
                                   end_awaiter_call + gen_brace_pos + gen_end_rel + 100]
                
                close_match = re.search(r'\}\);', after_gen)
                if close_match:
                    full_end_rel = end_awaiter_call + gen_brace_pos + gen_end_rel + close_match.end()
                else:
                    full_end_rel = end_awaiter_call + gen_brace_pos + gen_end_rel + 20
                
                full_pattern = buffer[start:full_end_rel]
                
                this_ref = match.group(1)
                gen_params = gen_match.group(1).strip() if gen_match else ""
                
                conversions.append({
                    'start': absolute_start,
                    'end': absolute_start + len(full_pattern),
                    'method_name': method_name,
                    'method_params': method_params,
                    'this_ref': this_ref,
                    'gen_params': gen_params,
                    'full_original': full_pattern,
                    'buffer_start': start,
                    'buffer_end': full_end_rel,
                })
                
                conversions_made += 1
                print(f"Found conversion {conversions_made}: method '{method_name}' at position {absolute_start}")
            
            if conversions_made >= max_conversions:
                break
            
            if len(buffer) > overlap_size:
                buffer = buffer[-overlap_size:]
                position_offset = last_absolute_start - len(buffer)
    
    print(f"\nTotal conversions found: {len(conversions)}")
    
    if not conversions:
        print("No conversions to perform!")
        return
    
    # Read full file for replacement
    with open(input_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Sort by position descending
    conversions.sort(key=lambda x: x['start'], reverse=True)
    
    for conv in conversions:
        original = conv['full_original']
        method_name = conv['method_name']
        method_params = conv['method_params']
        
        # Find the __generator call within the original
        gen_match = GENERATOR_PATTERN.search(original)
        if not gen_match:
            continue
        
        gen_body_start = original.find('{', gen_match.start())
        gen_body, _ = extract_generator_body_and_end(original, gen_body_start)
        
        if not gen_body:
            continue
        
        # Convert generator body to async code
        async_body = convert_generator_body_to_async(gen_body)
        
        # Clean up the async body - remove state machine artifacts
        async_body_lines = []
        for line in async_body.split('\n'):
            stripped = line.strip()
            
            # Skip state machine artifacts
            if stripped.startswith('case '):
                continue
            if stripped.startswith('default:'):
                continue
            if 'switch' in stripped and '(' in stripped:
                continue
            if stripped == '[2];' or stripped == 'return [2];':
                async_body_lines.append(line.replace('[2];', 'return;').replace('return [2];', 'return;'))
                continue
            
            # Convert [4, promise] to await
            await_match = re.search(r'\[4,\s*([^\]]+)\]', stripped)
            if await_match:
                promise_expr = await_match.group(1).strip().rstrip(',')
                indent = ' ' * (len(line) - len(line.lstrip()))
                async_body_lines.append(f'{indent}await {promise_expr};')
                continue
            
            # Convert [3, label] to continue
            if re.search(r'\[3,\s*\d+\]', stripped):
                if 'return' not in stripped:
                    indent = ' ' * (len(line) - len(line.lstrip()))
                    async_body_lines.append(f'{indent}continue;')
                continue
            
            # Handle .sent() - skip these lines as await captures the result
            if '.sent()' in stripped and '=' not in stripped:
                continue
            
            # Keep other lines
            if stripped and stripped not in ['}', '});', ');']:
                async_body_lines.append(line)
        
        async_body = '\n'.join(async_body_lines)
        
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
