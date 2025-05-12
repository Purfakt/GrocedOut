#!/bin/bash

# Run this script from inside the container to export data from the Firebase emulator
firebase emulators:export ./export && \
chown -R node:node ./export