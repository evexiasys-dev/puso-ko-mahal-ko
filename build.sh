#!/usr/bin/env bash
# Cloudflare Pages build step: copies only the public website into dist/, so
# BACKUP/, email-confirmation/ (Apps Script source) and the README are not published.
set -euo pipefail

rm -rf dist
mkdir dist
cp index.html privacypolicy.html dist/
cp -R css js assets dist/
find dist -name '.DS_Store' -delete
