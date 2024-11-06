#!/bin/bash

# Prompt the user for the domain to scan
echo -n "Please enter the domain to scan (e.g., example.com): "
read domain


# Sanitize the domain name for use in a filename (replace special characters)
sanitized_domain=$(echo $domain | tr -cd '[:alnum:]_-')

# Set the time zone to Central Daylight Time (CDT)
export TZ="America/Chicago"

# Get the current date and time in the desired format
current_date=$(date +"%m-%d-%Y")
current_time=$(date +"%I-%M-%S_%p")

# Construct the filename with the desired naming convention
filename="${sanitized_domain}_date_${current_date}_time_${current_time}_CDT.csv"

# Define the output directory
output_dir="/var/www/cmd-app-v1.brokenlinksfinder.com/user-reports"

# Ensure the output directory exists
#mkdir -p "$output_dir"

# Run Linkinator and save the report
linkinator "http://$domain" --format CSV --output "$output_dir/$filename"

# Notify the user
echo "Report saved to $output_dir/$filename"
