export function getImageUrl(imagePath?: string | null) {
  const BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || "https://api.toieeeeeea.shop";
  const DEFAULT_IMAGE = "/img/making.png"; // Default image path

  if (!imagePath) {
    return DEFAULT_IMAGE;
  }

  const isRelativeUpload = imagePath.startsWith("/uploads");
  return isRelativeUpload ? `${BASE_URL}${imagePath}` : imagePath;
}
