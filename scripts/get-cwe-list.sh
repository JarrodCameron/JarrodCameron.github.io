#!/bin/sh

# Author: Jarrod Cameron (z5210220)
# Date:   09/01/2024 16:33

# Exit on non-zero return status
set -e

# NOTE: It would be better to use the API
# (https://github.com/CWE-CAPEC/REST-API-wg/tree/main), but it times out when
# we download all of the CWEs. So we just download it from GitHub.

URL='https://raw.githubusercontent.com/CWE-CAPEC/REST-API-wg/main/json_repo/W/weaknesses.json'

curl "$URL" | jq '[
		.[] | {
			ID: .ID | tonumber,
			Name: .Name,
			Status: .Status
		}
	] | sort_by(.ID)'



