#!/usr/bin/env bash

set -e

curl -s \
  -X POST \
  --user "$MAILJET_KEY:$MAILJET_SECRET" \
  https://api.mailjet.com/v3.1/send \
  -H 'Content-Type: application/json' \
  -d '{
    "Messages":[
      {
        "From": {
          "Email": "'$MAILJET_FROM_MAIL'"
        },
        "To": [
          {
            "Email": "'$MAILJET_TO_MAIL'"
          }
        ],
        "TemplateID": 4829964,
        "TemplateLanguage": true,
        "Subject": "'$MAILJET_SUBJECT'",
        "Variables": {
          "project_name": "'$CI_PROJECT_TITLE' -- ('$CI_PROJECT_NAME')",
          "project_url": "'$CI_PIPELINE_URL'"
        }
      }
    ]
  }'
