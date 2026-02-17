import dayjs from 'dayjs';

export function formatDate(dateString: string): string {
  const date = dayjs(dateString);

  if (!date.isValid()) {
    return 'Invalid Date';
  }

  return date.format('MMMM D, YYYY, HH:mm');
}
