"""
HTTP Range-enabled media serving.

Django's ``django.views.static.serve`` (used by ``static()`` while ``DEBUG`` is
``True``) does not honour the ``Range`` header. Browsers rely on range requests
to seek inside videos and to download just enough data to render a preview
frame; without it they download the entire file (potentially hundreds of MB)
before showing a thumbnail.

This view adds the missing Range handling while keeping the same behaviour for
regular, non-range requests.
"""
from __future__ import annotations

import mimetypes
import re
from pathlib import Path

from django.http import (
    FileResponse,
    Http404,
    HttpResponse,
    HttpResponseNotModified,
    StreamingHttpResponse,
)
from django.utils._os import safe_join
from django.utils.http import http_date
from django.views.static import was_modified_since

_RANGE_RE = re.compile(r"bytes=(\d*)-(\d*)")
_CHUNK_SIZE = 64 * 1024


def _file_iterator(fileobj, offset: int, length: int):
    """Yield ``length`` bytes from ``fileobj`` starting at ``offset``."""
    fileobj.seek(offset)
    remaining = length
    while remaining > 0:
        chunk = fileobj.read(min(_CHUNK_SIZE, remaining))
        if not chunk:
            break
        remaining -= len(chunk)
        yield chunk


def serve_media(request, path, document_root=None):
    """Serve ``path`` from ``document_root`` with HTTP Range support."""
    fullpath = Path(safe_join(str(document_root or ""), path))
    if not fullpath.is_file():
        raise Http404(f"'{path}' does not exist")

    stat = fullpath.stat()
    if not was_modified_since(
        request.META.get("HTTP_IF_MODIFIED_SINCE"), stat.st_mtime
    ):
        return HttpResponseNotModified()

    content_type, _ = mimetypes.guess_type(str(fullpath))
    content_type = content_type or "application/octet-stream"
    size = stat.st_size

    range_header = request.META.get("HTTP_RANGE", "").strip()
    match = _RANGE_RE.fullmatch(range_header) if range_header else None

    # No (valid) Range header -> serve the whole file.
    if not match:
        response = FileResponse(fullpath.open("rb"), content_type=content_type)
        response["Content-Length"] = str(size)
        response["Accept-Ranges"] = "bytes"
        response["Last-Modified"] = http_date(stat.st_mtime)
        return response

    start_raw, end_raw = match.groups()
    if start_raw:
        start = int(start_raw)
        end = int(end_raw) if end_raw else size - 1
    else:
        # Suffix range ("bytes=-N"): the last N bytes.
        suffix = int(end_raw or 0)
        start = max(size - suffix, 0) if suffix > 0 else 0
        end = size - 1

    if start >= size or start > end:
        response = HttpResponse(status=416)
        response["Content-Range"] = f"bytes */{size}"
        response["Accept-Ranges"] = "bytes"
        return response

    end = min(end, size - 1)
    length = end - start + 1

    if request.method == "HEAD":
        response = HttpResponse(status=206, content_type=content_type)
    else:
        response = StreamingHttpResponse(
            _file_iterator(fullpath.open("rb"), start, length),
            status=206,
            content_type=content_type,
        )

    response["Content-Length"] = str(length)
    response["Content-Range"] = f"bytes {start}-{end}/{size}"
    response["Accept-Ranges"] = "bytes"
    response["Last-Modified"] = http_date(stat.st_mtime)
    return response
