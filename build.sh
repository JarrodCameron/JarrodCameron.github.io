#!/bin/sh

# Author: Jarrod Cameron (z5210220)
# Date:   09/11/24 22:15

# Exit on non-zero return status
set -e

OUTPUT='public/static'

echo '+----------------------------+'
echo '| get-cidrs.sh -> cidrs.json |'
echo '+----------------------------+'
bash 'scripts/get-cidrs.sh' > "$OUTPUT/cidrs.json"

echo '+-----------------------------------+'
echo '| get-cwe-list.sh -> cwe-list.json |'
echo '+-----------------------------------+'
bash 'scripts/get-cwe-list.sh' > "$OUTPUT/cwe-list.json"

echo '+--------------------------------------------------------+'
echo '| get-microsoft-standards.sh -> microsoft-standards.json |'
echo '+--------------------------------------------------------+'
bash 'scripts/get-microsoft-standards.sh' > "$OUTPUT/microsoft-standards.json"

echo '+----------------------------------+'
echo '| get-rfc-list.sh -> rfc-list.json |'
echo '+----------------------------------+'
bash 'scripts/get-rfc-list.sh' > "$OUTPUT/rfc-list.json"

echo '+-----------------------------------------------+'
echo '| get-whatwg-standards.sh -> web-standards.json |'
echo '+-----------------------------------------------+'
bash 'scripts/get-whatwg-standards.sh' > "$OUTPUT/web-standards.json"


