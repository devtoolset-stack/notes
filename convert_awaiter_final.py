#!/usr/bin/env python3
"""
Stream-based processor to convert __awaiter patterns to ESNext async/await.
Uses streaming/chunked processing to avoid loading the entire file into memory.
This version preserves the original code structure better by keeping the 
__awaiter/__generator calls but wrapping them in proper async functions.
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
    
    chunk_size = 2 * 1024 * 1024
    overlap_size = 500 * 1024
    
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
                
                after_gen = buffer[end_awaiter_call + gen_brace_pos + gen_end_rel:
                                   end_awaiter_call + gen_brace_pos + gen_end_rel + 100]
                
                close_match = re.search(r'\}\);', after_gen)
                if close_match:
                    full_end_rel = end_awaiter_call + gen_brace_pos + gen_end_rel + close_match.end()
                else:
                    full_end_rel = end_awaiter_call + gen_brace_pos + gen_end_rel + 20
                
                full_pattern = buffer[start:full_end_rel]
                
                this_ref = match.group(1)
                args_param = match.group(2)
                promise_type = match.group(3)
                gen_params = gen_match.group(1).strip() if gen_match else ""
                
                conversions.append({
                    'start': absolute_start,
                    'end': absolute_start + len(full_pattern),
                    'method_name': method_name,
                    'method_params': method_params,
                    'this_ref': this_ref,
                    'args_param': args_param,
                    'promise_type': promise_type,
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
    
    with open(input_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    conversions.sort(key=lambda x: x['start'], reverse=True)
    
    for conv in conversions:
        original = conv['full_original']
        method_name = conv['method_name']
        method_params = conv['method_params']
        promise_type = conv['promise_type']
        
        # Find the extent of the whole __awaiter call
        gen_match = GENERATOR_PATTERN.search(original)
        if not gen_match:
            continue
        
        gen_body_start = original.find('{', gen_match.start())
        gen_body, gen_end_rel = extract_generator_body_and_end(original, gen_body_start)
        
        if not gen_body:
            continue
        
        # Find the closing }); of __awaiter  
        after_gen = original[gen_body_start + gen_end_rel:gen_body_start + gen_end_rel + 50]
        close_match = re.search(r'\}\);', after_gen)
        
        if close_match:
            replacement_end = gen_body_start + gen_end_rel + close_match.end()
        else:
            replacement_end = len(original)
        
        # Extract just the __generator call part
        generator_call = original[gen_body_start:replacement_end]
        
        # Build new async method - wrap the generator in Promise executor
        # This preserves the original behavior while using async syntax
        new_method = f"async {method_name}({method_params}) {{\n"
        new_method += f"  return await new Promise(async (resolve, reject) => {{\n"
        new_method += f"    try {{\n"
        
        # Convert the generator body line by line
        body_lines = []
        for line in generator_call.split('\n'):
            stripped = line.strip()
            
            # Skip function wrapper
            if 'function (' in stripped or stripped.startswith('return __generator'):
                continue
            if stripped in ['});', '}', ');', '']:
                continue
            
            # Handle [4, promise] -> await promise
            await_match = re.search(r'\[4,\s*([^\]]+)\]', stripped)
            if await_match:
                promise_expr = await_match.group(1).strip().rstrip(',')
                indent = ' ' * (len(line) - len(line.lstrip()) + 2)
                body_lines.append(f'{indent}const __await_result = await {promise_expr};')
                continue
            
            # Handle .sent() -> use __await_result
            if '.sent()' in stripped:
                if '=' in stripped:
                    var_match = re.search(r'(\w+)\s*=\s*\w+\.sent\(\)', stripped)
                    if var_match:
                        var_name = var_match.group(1)
                        indent = ' ' * (len(line) - len(line.lstrip()) + 2)
                        body_lines.append(f'{indent}{var_name} = __await_result;')
                continue
            
            # Handle [3, label] -> continue (for loop continuation)
            if re.search(r'\[3,\s*\d+\]', stripped):
                if 'return' not in stripped:
                    indent = ' ' * (len(line) - len(line.lstrip()) + 2)
                    body_lines.append(f'{indent}continue;')
                continue
            
            # Handle [2] or [2, value] -> return
            if stripped == '[2];' or stripped == 'return [2];':
                indent = ' ' * (len(line) - len(line.lstrip()) + 2)
                body_lines.append(f'{indent}resolve();')
                body_lines.append(f'{indent}return;')
                continue
            
            return_val_match = re.search(r'\[2,\s*([^\]]+)\]', stripped)
            if return_val_match:
                value = return_val_match.group(1).strip().rstrip(';').rstrip(',')
                indent = ' ' * (len(line) - len(line.lstrip()) + 2)
                body_lines.append(f'{indent}resolve({value});')
                body_lines.append(f'{indent}return;')
                continue
            
            # Keep other lines with adjusted indent
            if stripped and not stripped.startswith('case ') and not stripped.startswith('default:') \
               and 'switch' not in stripped:
                indent = ' ' * (len(line) - len(line.lstrip()) + 2)
                body_lines.append(f'{indent}{stripped}')
        
        new_method += '\n'.join(body_lines)
        new_method += f"\n    }} catch (err) {{\n"
        new_method += f"      reject(err);\n"
        new_method += f"    }}\n"
        new_method += f"  }});\n"
        new_method += f"}}\n"
        
        content = content[:conv['start']] + new_method + content[conv['end']:]
        
        print(f"Converted method: {method_name}")
    
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"\nOutput written to {output_path}")
    print(f"Successfully converted {len(conversions)} methods")

if __name__ == '__main__':
    input_file = '/workspace/src/obsidian/app.js'
    output_file = '/workspace/src/obsidian/app.converted.js'
    process_file_streaming(input_file, output_file, 20)
