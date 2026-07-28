#!/bin/bash
set -euo pipefail

# Uploads a local file to Yandex Disk via its REST API
# (https://yandex.ru/dev/disk/api/reference/).
#
# Usage: upload_to_yandex_disk.sh <local_file_path> <remote_disk_path>
#
# Requires the YANDEX_DISK_TOKEN environment variable (an OAuth token with
# Yandex Disk access, see https://yandex.ru/dev/disk/api/concepts/quickstart.html).

if [ "$#" -ne 2 ]; then
  echo "Usage: $0 <local_file_path> <remote_disk_path>" >&2
  exit 1
fi

local_file="$1"
remote_path="$2"

if [ -z "${YANDEX_DISK_TOKEN:-}" ]; then
  echo "YANDEX_DISK_TOKEN environment variable is required" >&2
  exit 1
fi

if [ ! -s "$local_file" ]; then
  echo "Local file not found or empty: $local_file" >&2
  exit 1
fi

api_base="https://cloud-api.yandex.net/v1/disk/resources"
auth_header="Authorization: OAuth ${YANDEX_DISK_TOKEN}"

create_folder() {
  local folder_path="$1"
  local http_code
  http_code=$(curl -sS -o /dev/null -w '%{http_code}' -X PUT \
    -H "$auth_header" \
    -G "$api_base" --data-urlencode "path=${folder_path}")
  # 201 - created, 409 - already exists, both are fine.
  if [ "$http_code" != "201" ] && [ "$http_code" != "409" ]; then
    echo "Failed to create Yandex Disk folder '$folder_path' (HTTP $http_code)" >&2
    exit 1
  fi
}

# Yandex Disk requires every ancestor folder to exist before uploading into it.
remote_dir="${remote_path%/*}"
path_so_far=""
IFS='/' read -ra parts <<< "$remote_dir"
for part in "${parts[@]}"; do
  [ -z "$part" ] && continue
  path_so_far="${path_so_far}/${part}"
  create_folder "$path_so_far"
done

echo "Requesting Yandex Disk upload URL for ${remote_path}..."
upload_href=$(curl -sS -G "${api_base}/upload" \
  -H "$auth_header" \
  --data-urlencode "path=${remote_path}" \
  --data-urlencode "overwrite=true" | jq -r '.href')

if [ -z "$upload_href" ] || [ "$upload_href" = "null" ]; then
  echo "Failed to obtain Yandex Disk upload URL for ${remote_path}" >&2
  exit 1
fi

echo "Uploading ${local_file} to disk:${remote_path}..."
http_code=$(curl -sS -o /dev/null -w '%{http_code}' -X PUT --upload-file "$local_file" "$upload_href")

if [ "$http_code" != "201" ] && [ "$http_code" != "202" ]; then
  echo "Upload to Yandex Disk failed (HTTP $http_code)" >&2
  exit 1
fi

echo "Backup uploaded successfully to disk:${remote_path}"
