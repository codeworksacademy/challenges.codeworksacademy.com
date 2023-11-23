export function formatStatus(status) {
  const words = status.split('_');
  const formattedStatus = words.map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  return formattedStatus;
}