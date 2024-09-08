#!/bin/sh

get_github_cidrs () {

	tmp="$(mktemp)"
	curl --output "$tmp" 'https://api.github.com/meta'

	for key in 'actions' 'actions_macos' 'api' 'copilot' 'dependabot' 'git' \
			'github_enterprise_importer' 'hooks' 'importer' 'packages' \
			'pages' 'web'
	do
		jq --arg key "$key" '.[$key][] | {
			"cidrStr": .,
			"name": "GitHub",
			"service": $key,
		}' "$tmp"
	done

	rm -f "$tmp"
}


{
	# Cloudflare IPv4 Addresses
	curl 'https://www.cloudflare.com/ips-v4/#' | jq -ncR '[inputs]' | jq '.[] | {
		"cidrStr": .,
		"name": "Cloudflare4",
		"url": "https://www.cloudflare.com/ips-v4/#",
	}'

	# Cloudflare IPv6 Addresses
	curl 'https://www.cloudflare.com/ips-v6/#' | jq -ncR '[inputs]' | jq '.[] | {
		"cidrStr": .,
		"name": "Cloudflare6",
		"url": "https://www.cloudflare.com/ips-v6/#",
	}'

	# AWS Addresses
	curl 'https://ip-ranges.amazonaws.com/ip-ranges.json' | jq '.prefixes[]
		| .cidrStr = .ip_prefix
		| .name = "AWS"
		| .url = "https://ip-ranges.amazonaws.com/ip-ranges.json"
		| del(.ip_prefix)'

	get_github_cidrs
} | jq --slurp


## https://www.microsoft.com/en-us/download/confirmation.aspx?id=57062
##        private readonly Dictionary<string, AzureCloudName> downloadIdMapping = new Dictionary<string, AzureCloudName>
##        {
##            { "56519", AzureCloudName.AzureCloud },
##            { "57062", AzureCloudName.AzureChinaCloud },
##            { "57063", AzureCloudName.AzureUSGovernment },
##            { "57064", AzureCloudName.AzureGermanCloud }
##        };
##https://download.microsoft.com/download/9/D/0/9D03B7E2-4B80-4BF3-9B91-DA8C7D3EE9F9/ServiceTags_China_20240902.json
#
#
#url="$(sed 's/"/\n/g' index.html | grep '^https:\/\/download\.microsoft\.com\/.*json' | head -n1)"
#echo "$url"
#https://download.microsoft.com/download/9/D/0/9D03B7E2-4B80-4BF3-9B91-DA8C7D3EE9F9/ServiceTags_China_20240902.json
#
#https://www.microsoft.com/en-us/download/confirmation.aspx?id=57062
