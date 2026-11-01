import os
from PIL import Image, ImageOps

src = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "album"))
dst = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "public", "album"))
out_ts = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "src", "content", "album-photos.ts"))
os.makedirs(dst, exist_ok=True)
Image.MAX_IMAGE_PIXELS = 80_000_000

names = sorted(n for n in os.listdir(src) if n.lower().endswith((".jpg", ".jpeg")))
lines = []
for index, name in enumerate(names, start=1):
    file_name = f"{index:02d}.jpg"
    with Image.open(os.path.join(src, name)) as image:
        image = ImageOps.exif_transpose(image).convert("RGB")
        image.thumbnail((1100, 1400), Image.Resampling.LANCZOS)
        image.save(os.path.join(dst, file_name), "JPEG", quality=72, optimize=True, progressive=True)
    lines.append("  '/album/%s'," % file_name)
    print("%s/%s %s" % (index, len(names), file_name), flush=True)

content = "export const albumPhotos = [\n" + "\n".join(lines) + "\n]\n"
with open(out_ts, "w", encoding="utf-8", newline="\n") as handle:
    handle.write(content)
print("done", len(names))
