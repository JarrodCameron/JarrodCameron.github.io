#!/bin/sh

{
	# Cloudflare IPv4 Addresses
	curl 'https://www.cloudflare.com/ips-v4/#' | jq -ncR '[inputs]' | jq '[.[] | {
		"cidrStr": .,
		"name": "Cloudflare4",
		"url": "https://www.cloudflare.com/ips-v4/#",
	}]'

	# Cloudflare IPv6 Addresses
	curl 'https://www.cloudflare.com/ips-v6/#' | jq -ncR '[inputs]' | jq '[.[] | {
		"cidrStr": .,
		"name": "Cloudflare6",
		"url": "https://www.cloudflare.com/ips-v6/#",
	}]'

	# AWS Addresses
	curl 'https://ip-ranges.amazonaws.com/ip-ranges.json' | jq '[.prefixes[]
		| .cidrStr = .ip_prefix
		| .name = "AWS"
		| .url = "https://ip-ranges.amazonaws.com/ip-ranges.json"
		| del(.ip_prefix)]'
} | jq '.[]' | jq -s



