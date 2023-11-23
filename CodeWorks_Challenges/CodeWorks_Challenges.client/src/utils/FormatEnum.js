export function formatEnum(str) {
  const words = str.split('_');
  const formattedEnum = words.map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  return formattedEnum;
}