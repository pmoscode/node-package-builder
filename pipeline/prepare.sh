#!/usr/bin/env bash

set -e

# Get latest changes for packages
RESULT=$(ncu --jsonUpgraded -p yarn)

# Count lines (>1 line: json object has changes)
CHANGES_COUNT=$(echo "$RESULT" | wc -l)

if [[ "$CHANGES_COUNT" -eq 1 ]]; then
  echo "Everything is up-tp-date. Nothing to do..."
else
  echo "There are dependency updates available:"

  LATEST_VERSION=$(echo "$RESULT" | jq '[. | to_entries[] | .value ] | first' | sed -e 's/^"//' -e 's/"$//')
  ncu -p yarn

  echo "Sending email notification..."
  ./pipeline/send_mail.sh
  echo "done."
fi
