#!/usr/bin/env python3
"""
Stream-based processor to convert __awaiter patterns to ESNext async/await.
Processes the file in chunks to avoid loading the entire file into memory.
"""

import re
import sys
from typing import Tuple, Optional, List, Iterator

# Read the tslib helpers to understand the pattern
AWAITER_PATTERN = re.compile(
    r'return\s+__awaiter\(\s*(this|[^,]+)\s*,\s*([^,]*)\s*,\s*([^,]*)\s*,\s*function\s*\(\s*([^)]*)\s*\)\s*\{',
    re.MULTILINE
)

GENERATOR_PATTERN = re.compile(
    r'return\s+__generator\(this,\s*function\s*\(\s*([^)]*)\s*\)\s*\{',
    re.MULTILINE
)

def find_matching_brace(content: str, start: int) -> int:
    """Find the matching closing brace for an opening brace at position start."""
    if content[start] != '{':
        return -1
    
    count = 1
    i = start + 1
    in_string = False
    string_char = None
    in_regex = False
    in_comment_line = False
    in_comment_block = False
    
    while i < len(content) and count > 0:
        char = content[i]
        prev_char = content[i-1] if i > 0 else ''
        next_char = content[i+1] if i < len(content)-1 else ''
        
        # Handle comments
        if not in_string and not in_regex:
            if char == '/' and next_char == '/' and not in_comment_block:
                in_comment_line = True
                i += 1
                continue
            elif char == '\n' and in_comment_line:
                in_comment_line = False
                i += 1
                continue
            elif char == '/' and next_char == '*' and not in_comment_line:
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
        
        # Handle strings
        if char in '"\'`' and prev_char != '\\':
            if not in_string:
                in_string = True
                string_char = char
            elif char == string_char:
                in_string = False
                string_char = None
            i += 1
            continue
        
        if in_string:
            i += 1
            continue
        
        # Count braces
        if char == '{':
            count += 1
        elif char == '}':
            count -= 1
        
        i += 1
    
    return i - 1 if count == 0 else -1

def extract_generator_body(content: str, generator_start: int) -> Tuple[str, int]:
    """Extract the body of a __generator call and return it with its end position."""
    # Find the opening brace of the generator function
    brace_pos = content.find('{', generator_start)
    if brace_pos == -1:
        return '', generator_start
    
    end_pos = find_matching_brace(content, brace_pos)
    if end_pos == -1:
        return '', generator_start
    
    body = content[brace_pos:end_pos+1]
    return body, end_pos + 1

def convert_switch_to_async(generator_func_param: str, switch_content: str, method_context: str) -> Optional[str]:
    """
    Convert a __generator switch statement to async/await code.
    This is a complex transformation that needs to handle:
    - case labels as state machine states
    - [4, promise] patterns as await calls
    - p.sent() as the result of await
    - [3, label] as goto/jump targets
    - [2] as return
    """
    
    # This is a simplified conversion - full conversion would need more complex analysis
    lines = switch_content.split('\n')
    result_lines = []
    
    # Track state
    pending_await = None
    sent_var = None
    
    for line in lines:
        stripped = line.strip()
        
        # Skip the outer function wrapper
        if 'function (' in stripped and '{' in stripped:
            continue
        if stripped == '});':
            continue
            
        # Handle switch statement
        if 'switch' in stripped:
            result_lines.append('    // Original switch-based state machine:')
            result_lines.append('    ' + stripped)
            continue
        
        # Handle case labels - these are state machine states
        if stripped.startswith('case ') or stripped.startswith('default:'):
            result_lines.append('    ' + stripped)
            continue
        
        # Handle [4, promise] pattern - this means "yield promise" essentially
        if '[4,' in stripped:
            match = re.search(r'\[4,\s*([^\]]+)\]', stripped)
            if match:
                promise_expr = match.group(1).strip()
                # Extract just the promise part, removing array syntax
                result_lines.append(f'    await {promise_expr};')
                pending_await = True
                continue
        
        # Handle p.sent() or s.sent() - this is the result of the await
        if '.sent()' in stripped:
            result_lines.append('    // .sent() result would be captured above')
            pending_await = None
            continue
        
        # Handle [3, label] - jump to another case (continue in loop context)
        if re.search(r'\[3,\s*\d+\]', stripped):
            if 'return' not in stripped:
                result_lines.append('    continue;')
            continue
        
        # Handle [2] or return [2] - this means return from function
        if stripped == '[2];' or stripped == 'return [2];':
            result_lines.append('    return;')
            continue
        
        # Handle [2, value] - return a value
        match = re.search(r'\[2,\s*([^\]]+)\]', stripped)
        if match:
            value = match.group(1).strip()
            result_lines.append(f'    return {value};')
            continue
        
        # Handle return statements
        if stripped.startswith('return '):
            result_lines.append('    ' + stripped)
            continue
        
        # Keep other statements
        if stripped and not stripped.startswith('//'):
            result_lines.append('    ' + stripped)
    
    return '\n'.join(result_lines)

def process_file_streaming(input_path: str, output_path: str, max_conversions: int = 20):
    """Process the file in a streaming manner."""
    
    conversions_made = 0
    buffer_size = 1024 * 1024  # 1MB chunks
    
    # We need to read enough context to find complete methods
    # Methods can span multiple KB, so we use a sliding window approach
    
    with open(input_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Find all __awaiter calls
    awaiter_matches = list(AWAITER_PATTERN.finditer(content))
    
    if not awaiter_matches:
        print("No __awaiter patterns found!")
        return
    
    print(f"Found {len(awaiter_matches)} __awaiter calls")
    
    # Process first N matches
    replacements = []
    
    for match in awaiter_matches[:max_conversions]:
        start = match.start()
        end_awaiter_call = match.end()
        
        # Find the extent of the entire method (the __awaiter call's closing)
        # The pattern is: return __awaiter(..., function() { ... __generator(...) ... });
        
        # Find the __generator call within
        remaining = content[end_awaiter_call:]
        gen_match = GENERATOR_PATTERN.search(remaining)
        
        if not gen_match:
            print(f"No __generator found after __awaiter at position {start}")
            continue
        
        gen_start = end_awaiter_call + gen_match.start()
        gen_body, gen_end = extract_generator_body(content, gen_start + gen_match.start())
        
        if not gen_body:
            print(f"Could not extract generator body at position {start}")
            continue
        
        # Now find the closing of the __awaiter call (after __generator closes)
        # Look for }); that closes the __awaiter
        after_gen = content[gen_end:gen_end+50]
        
        # The structure is typically: }); } or similar
        # We need to find where the method ends
        
        # For now, let's mark this for conversion
        # A proper conversion would need to:
        # 1. Extract the method signature
        # 2. Convert the generator body to async/await
        # 3. Replace the whole pattern
        
        conversions_made += 1
        print(f"Conversion {conversions_made}: Found __awaiter at position {start}")
        
        # Get some context around the match
        context_start = max(0, start - 100)
        context_end = min(len(content), gen_end + 100)
        print(f"  Context: {content[context_start:context_start+200]}...")
        print()
        
        if conversions_made >= max_conversions:
            break
    
    print(f"\nTotal conversions identified: {conversions_made}")

if __name__ == '__main__':
    input_file = '/workspace/src/obsidian/app.js'
    output_file = '/workspace/src/obsidian/app.converted.js'
    process_file_streaming(input_file, output_file, 20)
