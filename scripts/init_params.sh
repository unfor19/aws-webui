#!/usr/bin/env bash

set -e
set -o pipefail

trap ctrl_c INT
ctrl_c() {
    exit 0
}

# Helper Functions
error_msg(){
  local msg="$1"
  echo -e "[ERROR] $(date) :: $msg"
  exit 1
}


log_msg(){
  local msg="$1"
  echo -e "[LOG] $(date) :: $msg"
}

_NUM_OF_PARAMS="${1:-"10"}"

export \
AWS_ACCESS_KEY_ID="mock_aws" \
AWS_SECRET_ACCESS_KEY="mock_aws" \
AWS_REGION="us-east-1" \
AWS_SSM_ENDPOINT_URL="http://localhost:4566"

declare -a _P_TYPES=("String" "SecureString" "StringList")
log_msg "Starting to put ${_NUM_OF_PARAMS} SSM Parameters ..."
for (( c=0, i=0; c<"$_NUM_OF_PARAMS"; c++,i++ )); do
    P_NAME="/myapp/dev/test${c}"
    P_VALUE="testvalue${c}"

    if [[ "$i" -ge "${#_P_TYPES[@]}" ]]; then
        i=0
    fi
    P_TYPE="${_P_TYPES[$i]}"
    log_msg "Putting parameter: ${P_NAME} , Value: ${P_VALUE}, Type: ${P_TYPE}"
    # Puts parameters in parallel with `&` which sets a command as a "background-job"
    aws ssm --endpoint-url="$AWS_SSM_ENDPOINT_URL" put-parameter --overwrite --name "$P_NAME" --value "$P_VALUE" --type "$P_TYPE" 1>/dev/null &
done

# Wait for all background jobs "put all parameters" to complete
# For 20 parameters, doing it parallel decreases the time from 25 seconds to 5 seconds
wait

log_msg "Completed successfully puting ${_NUM_OF_PARAMS} SSM Parameters"
