import { privateApi } from '@/apis';

export interface NotificationParams {
  limit: number;
  cursor?: number | null;
  type?: string; // party, recruit
}

// 알림 타입
export interface NotificationType {
  id: number;
  notificationType: {
    type: string; // 예: "party", "recruit"
    label: string; // 예: "파티활동", "지원소식"
  };
  title: string; // 예: "파티명"
  message: string; // 예: "새 알림"
  image: string;
  link: string;
  isRead: boolean; // 읽음 여부
  createdAt: string; // 예: "2024-06-07T12:17:57.248Z"
}

export interface NotificationResponse {
  notifications: NotificationType[];
  nextCursor: number | null; // 다음 페이지 없으면 null
}

export const fetchGetNotifications = async ({
  limit,
  cursor,
  type,
}: NotificationParams): Promise<NotificationResponse> => {
  try {
    const response = await privateApi.get('/notifications', {
      params: {
        limit,
        ...((cursor !== undefined || cursor !== 0) && { cursor }),
        ...(type !== 'all' && { type }),
      },
    });

    return response.data as NotificationResponse;
  } catch (error) {
    console.error('fetchGetNotifications error:', error);
    throw error;
  }
};

/**
 * PATCH /api/notifications/{notificationId}/read
 * 알림 읽음 처리 API
 */
export const fetchPatchReadNotification = async (notificationId: number): Promise<void> => {
  try {
    await privateApi.patch(`/notifications/${notificationId}/read`);
  } catch (error) {
    console.error('fetchPatchReadNotification error:', error);
    throw error;
  }
};

/**
 * 알림 하나 삭제
 * @param notificationId 알림의 ID
 */
export const fetchDeleteNotification = async (notificationId: number): Promise<void> => {
  try {
    await privateApi.delete(`/notifications/${notificationId}`);
  } catch (error) {
    console.error('fetchDeleteNotification error:', error);
    throw error;
  }
};

export interface GetNotificationsCheckResponse {
  hasUnchecked: boolean;
}

/**
 * 알림 체크 상태 확인
 */
export const fetchGetNotificationsCheck = async (): Promise<GetNotificationsCheckResponse> => {
  try {
    const res = await privateApi.get(`/notifications/check`);
    return res.data as GetNotificationsCheckResponse;
  } catch (err) {
    console.error('fetchGetNotificationsCheck error: ', err);
    throw err;
  }
};

/**
 * 사용자 알림 전체 체크 처리
 */
export const fetchPatchNotificationsCheck = async () => {
  try {
    const res = await privateApi.patch(`/notifications/check`);
    return res;
  } catch (err) {
    console.error('fetchGetNotificationsCheck error: ', err);
    throw err;
  }
};
