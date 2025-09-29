'use client';
import { useEffect, useRef } from 'react';

import { ConfirmModal } from '@/components/features';
import { useModalContext } from '@/contexts/ModalContext';

export function useNavigationBlocker(shouldBlock: boolean, partyId?: string) {
  const { openModal, closeModal } = useModalContext();
  const isBlockedRef = useRef(false);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!shouldBlock) return;
      e.preventDefault();
      e.returnValue = '';
    };

    const handlePopState = () => {
      if (!shouldBlock || isBlockedRef.current) return;

      isBlockedRef.current = true;

      openModal({
        children: (
          <ConfirmModal
            modalTitle="나가기"
            modalContents={
              <>
                입력한 내용들이 모두 초기화됩니다.
                <br />
                나가시겠습니까?
              </>
            }
            cancelBtnTxt="취소"
            submitBtnTxt="나가기"
          />
        ),
        onCancel: () => {
          isBlockedRef.current = false;
          closeModal();
          history.pushState(null, '', window.location.href); // 원래 페이지로 다시 push
        },
        onSubmit: () => {
          isBlockedRef.current = false;
          closeModal();
          if (partyId) {
            window.location.href = `/party/${partyId}`;
          } else {
            window.location.href = '/';
          }
        },
      });

      // 현재 상태로 다시 push해서 뒤로가기를 막음
      // history.pushState(null, '', window.location.href);
    };

    if (shouldBlock) {
      window.addEventListener('beforeunload', handleBeforeUnload);
      window.addEventListener('popstate', handlePopState);
      history.pushState(null, '', window.location.href);
    }

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handlePopState);
    };
  }, [shouldBlock, openModal, closeModal]);
}
