import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

export function formatFullDate(isoString: string): string {
  return dayjs.utc(isoString).format('ddd, MMMM D, YYYY');
}

export function formatTime(isoString: string): string {
  return dayjs.utc(isoString).format('h:mm A');
}