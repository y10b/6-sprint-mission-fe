export function getImageUrl(imagePath?: string | null) {
  const BASE_URL = "http://localhost:5000"; // public 폴더 내 기본 이미지
  const DEFAULT_IMAGE = "/img/making.png"; // Default image path

  if (!imagePath) {
    return DEFAULT_IMAGE;
  }

  const isRelativeUpload = imagePath.startsWith("/uploads");
  return isRelativeUpload ? `${BASE_URL}${imagePath}` : imagePath;
}
