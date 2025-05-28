import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { useInfiniteQuery } from '@tanstack/react-query';

import { fetchGetNotifications, fetchPatchNotificationsCheck } from '@/apis/notifications';

export function useNotificationModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'party' | 'recruit'>('all');

  const { ref, inView } = useInView();

  const { data, fetchNextPage, hasNextPage, isLoading, refetch } = useInfiniteQuery({
    queryKey: ['notifications', filter],
    initialPageParam: 0,
    queryFn: async ({ pageParam = undefined }) => {
      return await fetchGetNotifications({
        limit: 10,
        ...(pageParam !== 0 && { cursor: pageParam }),
        type: filter,
      });
    },
    getNextPageParam: lastPage => {
      return lastPage.nextCursor ?? undefined;
    },
    enabled: isOpen,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  const open = async () => {
    setIsOpen(true);
    await fetchPatchNotificationsCheck();
    refetch();
  };

  const close = () => {
    setIsOpen(false);
  };

  return {
    isNotificationModalOpen: isOpen,
    handleOpenNotificationModal: open,
    handleCloseNotificationModal: close,
    notificationFilter: filter,
    setNotificationFilter: setFilter,
    notificationData: data?.pages.flatMap(page => page?.notifications) ?? [],
    fetchMoreRef: ref,
    isLoading,
  };
}
