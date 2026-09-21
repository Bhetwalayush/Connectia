
# Plain REST endpoint for image uploads (profile pictures, post images)
import os
import uuid

from fastapi import APIRouter, File, HTTPException, Request, UploadFile

router = APIRouter()

UPLOAD_DIR = "uploads"
ALLOWED_EXTENSIONS = {".png", ".jpg", ".jpeg", ".gif", ".webp"}
MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB

os.makedirs(UPLOAD_DIR, exist_ok=True)


@router.post("/upload/image")
async def upload_image(request: Request, file: UploadFile = File(...)):

    ext = os.path.splitext(file.filename or "")[1].lower()

    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(status_code=400, detail="Unsupported file type.")

    contents = await file.read()

    if len(contents) > MAX_FILE_SIZE:
        raise HTTPException(status_code=400, detail="File too large (max 5MB).")

    filename = f"{uuid.uuid4().hex}{ext}"
    filepath = os.path.join(UPLOAD_DIR, filename)

    with open(filepath, "wb") as f:
        f.write(contents)

    # Absolute URL, so it works correctly whether served from
    # localhost:8000 in dev or a real domain in production
    base_url = str(request.base_url).rstrip("/")

    return {"url": f"{base_url}/uploads/{filename}"}