#!/bin/bash

# Output file
OUTPUT_FILE="project_overview.txt"

# Files and directories to ignore
IGNORE_PATTERNS=(
    "node_modules"
    ".git"
    ".vercel"
    ".netlify"
    "dist"
    ".astro"
    ".vscode"
    ".idea"
    "pnpm-lock.yaml"
    "package-lock.json"
    "yarn.lock"
    ".DS_Store"
    "*.sh"
    "coverage"
    "$OUTPUT_FILE"  # Don't include our output file
)

# Create ignore pattern for tree command
TREE_IGNORE=$(printf '%s|' "${IGNORE_PATTERNS[@]}")
TREE_IGNORE=${TREE_IGNORE%|}  # Remove trailing pipe

# Clear or create the output file
echo "# Project Overview" > "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

# Write directory structure
echo "Directory structure:" >> "$OUTPUT_FILE"
tree -a -I "$TREE_IGNORE" --dirsfirst >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

# Function to process a file
process_file() {
    local file="$1"
    echo "================================================" >> "$OUTPUT_FILE"
    echo "File: $file" >> "$OUTPUT_FILE"
    echo "================================================" >> "$OUTPUT_FILE"
    
    if [[ "$file" == .env* ]]; then
        # Process .env files - mask values
        while IFS= read -r line || [ -n "$line" ]; do
            if [[ $line =~ ^[[:space:]]*# || -z $line ]]; then
                echo "$line" >> "$OUTPUT_FILE"
            else
                key=${line%%=*}
                echo "$key=XXXXXXXXXX" >> "$OUTPUT_FILE"
            fi
        done < "$file"
    else
        # Process regular files
        cat "$file" >> "$OUTPUT_FILE"
    fi
    echo "" >> "$OUTPUT_FILE"
}

# Process root config files
echo "Processing root files..."
for file in *; do
    # Skip if file matches ignore patterns or is a directory
    if [[ -f "$file" ]]; then
        skip=false
        for pattern in "${IGNORE_PATTERNS[@]}"; do
            if [[ "$file" == $pattern ]]; then
                skip=true
                break
            fi
        done
        
        if ! $skip; then
            process_file "$file"
        fi
    fi
done

# Process src directory
echo "Processing src directory..."
if [ -d "src" ]; then
    while IFS= read -r -d '' file; do
        process_file "$file"
    done < <(find src -type f \( -name "*.astro" -o -name "*.tsx" -o -name "*.ts" -o -name "*.js" -o -name "*.jsx" -o -name "*.md" \) -print0)
fi

echo "Project overview has been generated in $OUTPUT_FILE"