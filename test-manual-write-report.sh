# Replace 'example.com' with your target domain
domain="dainedvorak.com"

# Sanitize the domain name
sanitized_domain=$(echo $domain | tr -cd '[:alnum:]_-')

# Set the time zone
export TZ="America/Chicago"

# Get the current date and time
current_date=$(date +"%m-%d-%Y")
current_time=$(date +"%I-%M-%S_%p")

# Construct the filename
filename="${sanitized_domain}_date_${current_date}_time_${current_time}_CDT.csv"

# Define the output directory
output_dir="/var/www/cmd-app-v1.brokenlinksfinder.com/user-reports"

# Ensure the output directory exists
mkdir -p "$output_dir"

# Run Linkinator and redirect the output to the file
linkinator "https://$domain" --recurse --format csv > "$output_dir/$filename"

# Notify the user
echo "Report saved to $output_dir/$filename"
