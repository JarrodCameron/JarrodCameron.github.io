#!/bin/sh

# Author: Jarrod Cameron (z5210220)
# Date:   03/07/2024 15:33

# Exit on non-zero return status
set -e

foo () {
	url="$1"
	curl --silent "$url" | jq \
		--arg url "$url" \
		'.items | .. | select(.toc_title? | test("^\\[[A-Z0-9-]*\\]: ")) | {
			"title": .toc_title,
			"href": ($url + "/../" + .href)
		}'
}

{
	foo 'https://learn.microsoft.com/en-us/openspecs/sql_server_protocols/MS-SQLPROTLP/toc.json'
	foo 'https://learn.microsoft.com/en-us/openspecs/exchange_server_protocols/MS-OXPROTLP/toc.json'
	foo 'https://learn.microsoft.com/en-us/openspecs/office_protocols/MS-OFFPROTLP/toc.json'
	foo 'https://learn.microsoft.com/en-us/openspecs/sharepoint_protocols/MS-SPPROTLP/toc.json'
	foo 'https://learn.microsoft.com/en-us/openspecs/windows_protocols/MS-WINPROTLP/toc.json'
} | jq '[inputs] | sort_by(.title)'
