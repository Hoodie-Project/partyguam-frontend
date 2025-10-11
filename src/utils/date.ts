export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
};

export interface IReturnFormatRelativeTime {
  label: string;
  color: string;
}

export function formatRelativeTime(dateString: string): IReturnFormatRelativeTime {
  const now: Date = new Date();
  const targetDate: Date = new Date(dateString);

  const diffInMs: number = now.getTime() - targetDate.getTime();
  const diffInMinutes: number = Math.floor(diffInMs / 60000);

  if (diffInMinutes <= 10) return { label: '방금전', color: '#DC0000' };
  if (diffInMinutes < 60) return { label: '1시간 전', color: '#DC0000' };
  if (diffInMinutes < 120) return { label: '2시간 전', color: '#DC0000' };
  if (diffInMinutes < 180) return { label: '3시간 전', color: '#DC0000' };

  // 날짜 비교를 위한 형식화된 년, 월, 일 값
  const targetYear: number = targetDate.getFullYear();
  const targetMonth: number = targetDate.getMonth() + 1;
  const targetDay: number = targetDate.getDate();

  const currentYear: number = now.getFullYear();
  const currentMonth: number = now.getMonth() + 1;
  const currentDay: number = now.getDate();

  // 같은 날일 경우
  if (targetYear === currentYear && targetMonth === currentMonth && targetDay === currentDay) {
    return { label: '오늘', color: '#767676' };
  }

  // 하루 전일 경우
  const yesterday: Date = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const yesterdayYear: number = yesterday.getFullYear();
  const yesterdayMonth: number = yesterday.getMonth() + 1;
  const yesterdayDay: number = yesterday.getDate();

  if (targetYear === yesterdayYear && targetMonth === yesterdayMonth && targetDay === yesterdayDay) {
    return { label: '1일 전', color: '#767676' };
  }

  // 그 외의 경우 날짜 포맷
  const formatNumber = (num: number) => String(num).padStart(2, '0');
  return { label: `${targetYear}.${formatNumber(targetMonth)}.${formatNumber(targetDay)}`, color: '#767676' };
}

export function calculateAge(birthDateString: string): number {
  const birthDate = new Date(birthDateString); // 문자열을 Date 객체로 변환
  const today = new Date(); // 현재 날짜

  let age = today.getFullYear() - birthDate.getFullYear(); // 일단 연도로 계산

  // 생일이 지나지 않았다면 나이를 1 줄임
  const hasBirthdayPassed =
    today.getMonth() > birthDate.getMonth() ||
    (today.getMonth() === birthDate.getMonth() && today.getDate() >= birthDate.getDate());

  if (!hasBirthdayPassed) {
    age -= 1;
  }

  return age;
}
