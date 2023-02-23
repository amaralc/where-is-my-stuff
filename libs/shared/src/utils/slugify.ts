// Convert string to slug, removing spaces and special characters
export default function slugify(string: string) {
  if (!string) return '';
  return string
    .toString()
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}
