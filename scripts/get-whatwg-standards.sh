#!/bin/sh

# Author: Jarrod Cameron (z5210220)
# Date:   03/07/2024 19:11

# Exit on non-zero return status
set -e

url='https://raw.githubusercontent.com/whatwg/sg/main/db.json'

curl "$url" | jq '.workstreams[].standards[] | {
        "name": .name,
        "href": .href
}' | jq '[inputs] | sort_by(.name)'
