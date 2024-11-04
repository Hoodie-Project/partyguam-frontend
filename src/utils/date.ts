export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
};

export function formatRelativeTime(dateString: string): string {
  const now: Date = new Date();
  const targetDate: Date = new Date(dateString);

  const diffInMs: number = now.getTime() - targetDate.getTime();
  const diffInMinutes: number = Math.floor(diffInMs / 60000);

  if (diffInMinutes <= 10) return '방금전';
  if (diffInMinutes < 60) return '1시간 전';
  if (diffInMinutes < 120) return '2시간 전';
  if (diffInMinutes < 180) return '3시간 전';

  // 날짜 비교를 위한 형식화된 년, 월, 일 값
  const targetYear: number = targetDate.getFullYear();
  const targetMonth: number = targetDate.getMonth() + 1;
  const targetDay: number = targetDate.getDate();

  const currentYear: number = now.getFullYear();
  const currentMonth: number = now.getMonth() + 1;
  const currentDay: number = now.getDate();

  // 같은 날일 경우
  if (targetYear === currentYear && targetMonth === currentMonth && targetDay === currentDay) {
    return '오늘';
  }

  // 하루 전일 경우
  const yesterday: Date = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const yesterdayYear: number = yesterday.getFullYear();
  const yesterdayMonth: number = yesterday.getMonth() + 1;
  const yesterdayDay: number = yesterday.getDate();

  if (targetYear === yesterdayYear && targetMonth === yesterdayMonth && targetDay === yesterdayDay) {
    return '1일 전';
  }

  // 그 외의 경우 날짜 포맷
  const formatNumber = (num: number) => String(num).padStart(2, '0');
  return `${targetYear}.${formatNumber(targetMonth)}.${formatNumber(targetDay)}`;
}
