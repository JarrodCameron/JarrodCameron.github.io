#!/bin/sh

# Author: Jarrod Cameron (z5210220)
# Date:   03/07/2024 16:23

# Exit on non-zero return status
set -e

# To get the total number of records:
#curl \
#    --get \
#    -d 'offset=9999999' \
#    -d 'states__slug=published' \
#    -d 'format=json' \
#    'https://datatracker.ietf.org/api/v1/doc/document/' \
#    | jq '.meta.total_count'

for offset in '0' '1000' '2000' '3000' '4000' '5000' '6000' '7000' '8000' '9000'
do
	curl \
		--get \
		-d "offset=$offset" \
		-d 'states__slug=published' \
		-d 'format=json' \
		-d 'limit=1000' \
		'https://datatracker.ietf.org/api/v1/doc/document/'
done | jq '.objects[] | {
	"id": .rfc_number,
	"name": ("[RFC" + (.rfc_number|tostring) + "] " + .title)
}' | jq '[inputs] | sort_by(.id)'

