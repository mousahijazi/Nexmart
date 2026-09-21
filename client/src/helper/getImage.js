export function getImageUrl(path) {
  if (!path) return "/placeholder.png";

  if (path.startsWith("http://") || path.startsWith("https://") || path.startsWith("blob:")) {
    return path;
  }

  return `${process.env.NEXT_PUBLIC_API_URL}${path}`;
}