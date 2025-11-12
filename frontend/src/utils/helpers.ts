import dayjs from 'dayjs';

export const formatDate = (date: Date | string): string => {
  return dayjs(date).format('MMM DD, YYYY');
};

export const formatDateTime = (date: Date | string): string => {
  return dayjs(date).format('MMM DD, YYYY hh:mm A');
};

export const getTimeAgo = (date: Date | string): string => {
  const now = dayjs();
  const then = dayjs(date);
  const diffMinutes = now.diff(then, 'minute');
  const diffHours = now.diff(then, 'hour');
  const diffDays = now.diff(then, 'day');

  if (diffMinutes < 1) return 'Just now';
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return formatDate(date);
};

export const calculateDuration = (startDate: Date, endDate: Date, leaveType: string): number => {
  if (leaveType === 'half-day') return 0.5;
  const start = dayjs(startDate);
  const end = dayjs(endDate);
  return end.diff(start, 'day') + 1;
};

export const getStatusColor = (status: string): string => {
  const colors: Record<string, string> = {
    pending: '#FFA726',
    approved: '#66BB6A',
    rejected: '#EF5350',
  };
  return colors[status] || '#999';
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};
