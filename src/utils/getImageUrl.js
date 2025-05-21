export function getImageUrl(imagePath) {
    const BASE_URL = "http://localhost:5000";
    const DEFAULT_IMAGE = "/img/making.png"; // public 폴더 내 기본 이미지

    if (!imagePath) return DEFAULT_IMAGE;

    const isRelativeUpload = imagePath.startsWith("/uploads");
    return isRelativeUpload ? `${BASE_URL}${imagePath}` : imagePath;
}
