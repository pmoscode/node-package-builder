#!/usr/bin/env bash

set -e

# Get latest changes for packages
RESULT=$(node ./node_modules/npm-check-updates/bin/cli.js --jsonUpgraded -p yarn)

# Count lines (>1 line: json object has changes)
CHANGES_COUNT=$(echo "$RESULT" | wc -l)

if [[ "$CHANGES_COUNT" -eq 1 ]]; then
  echo "Everything is up-tp-date. Nothing to do..."
else
  echo "There are dependency updates available:"

  LATEST_VERSION=$(echo "$RESULT" | jq '[. | to_entries[] | .value ] | first' | sed -e 's/^"//' -e 's/"$//')
  node ./node_modules/npm-check-updates/bin/cli.js -p yarn

  echo "Sending email notification..."
  ./pipeline/send_mail.sh
  echo "done."
fi
