export const DateTime = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }) + ' ' + new Date(dateString).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: 'numeric',
  });
};