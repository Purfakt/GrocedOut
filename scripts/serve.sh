#!/bin/bash
set -eo pipefail

# Function to print error messages and exit
error_exit() {
    echo "$1" 1>&2
    exit 1
}

# Sanity checks
[[ -z "${DATA_DIRECTORY}" ]] && echo "DATA_DIRECTORY environment variable missing, will not export or import data to firebase"
[[ -z "${FIREBASE_PROJECT}" ]] && error_exit "FIREBASE_PROJECT environment variable missing"

dirs=("/srv/firebase/firestore")

for dir in "${dirs[@]}"; do
  if [[ -d "$dir" ]]; then
    echo "Installing npm packages in $dir"
    npm install --prefix "$dir" || error_exit "npm install failed in $dir"
  fi
done

# Start Firebase emulators
emulator_cmd="firebase emulators:start --project=${FIREBASE_PROJECT}"
[[ -n "${DATA_DIRECTORY}" ]] && emulator_cmd+=" --import=./${DATA_DIRECTORY}"
$emulator_cmd &
firebase_pid=$!

cleanup() {
    echo "Stopping services..."
    # Gracefully stop background processes
    echo "Terminating background services..."
    if [[ -n "$firebase_pid" ]]; then
        kill -SIGTERM "$firebase_pid" || echo "Failed to terminate Firebase process"
        wait "$firebase_pid" 2>/dev/null
    fi
    if [[ -n "$npm_pid" ]]; then
        kill -SIGTERM "$npm_pid" || echo "Failed to terminate NPM process"
        wait "$npm_pid" 2>/dev/null
    fi
}

trap cleanup INT TERM SIGTERM SIGINT

wait