import React, { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { ConfirmModal } from '@/components/features';
import { useModalContext } from '@/contexts/ModalContext';

import { fetchDeleteParty, fetchPatchPartyStatus } from '@/apis/party';

type ModalType =
  | 'partyDelete'
  | 'partyDeleteBlocked'
  | 'partyEnd'
  | 'partyEndBlocked'
  | 'exitPartyEdit';

type GetPartyEditModalOptions = {
  onHardReload?: boolean;
  onAfterSubmit?: () => void;
  onAfterCancel?: () => void;
  partyId?: string | number; // 생성 페이지에서는 없을 수 있음
  editRecruitPath?:
    | string
    | ((id: string) => string);
};

type Spec = {
  style?: React.CSSProperties;
  modalTitle: string;
  modalContents: React.ReactNode;
  cancelBtnTxt?: string;
  submitBtnTxt: string;
  submitAction?: () => void;
  cancelAction?: () => void;
};

export function usePartyEditModal(options?: GetPartyEditModalOptions) {
  const router = useRouter();
  const { openModal, closeModal } = useModalContext();

  const {
    onHardReload = false,
    onAfterSubmit,
    onAfterCancel,
    partyId,
    editRecruitPath,
  } = options || {};

  const partyIdStr = useMemo(
    () => (partyId !== undefined && partyId !== null ? String(partyId) : undefined),
    [partyId]
  );

  const resolvedRecruitPath = useMemo(() => {
    if (typeof editRecruitPath === 'function') {
      if (!partyIdStr) return undefined;
      return editRecruitPath(partyIdStr);
    }
    if (typeof editRecruitPath === 'string') {
      return editRecruitPath;
    }

    return partyIdStr
      ? `/party/setting/recruit/${partyIdStr}`
      : undefined;
  }, [editRecruitPath, partyIdStr]);

const makeHandlers = useMemo(
  () => ({
    submit: (next?: () => void, opts?: { skipHardReload?: boolean }) => {
      closeModal();
      next?.();  

      if (onHardReload && !opts?.skipHardReload) window.location.reload(); // ← 이동 있는 경우 건너뛸 수 있게
      onAfterSubmit?.();
    },
    cancel: (next?: () => void) => {
      closeModal();
      next?.();
      onAfterCancel?.();
    },
    goHome: () => router.push('/'),
    goEditRecruit: () => {
      if (!resolvedRecruitPath) return router.push('/');
      router.push(resolvedRecruitPath);
    },
  }),
  [router, resolvedRecruitPath, onHardReload, onAfterSubmit, onAfterCancel, closeModal]
);

  const SPEC: Record<ModalType, Spec> = useMemo(
    () => ({
      partyDelete: {
        modalTitle: '파티 삭제',
        modalContents: (
          <>
            한 번 삭제한 파티는 복구할 수 없어요.<br />
            정말로 이 파티를 삭제하시나요?
          </>
        ),
        cancelBtnTxt: '닫기',
        submitBtnTxt: '삭제하기',
        submitAction: async () => {
          await fetchDeleteParty(Number(partyId))
          makeHandlers.submit(makeHandlers.goHome, { skipHardReload: true })
        },
        cancelAction: () => makeHandlers.cancel(),
      },
      partyDeleteBlocked: {
        modalTitle: '파티 삭제 불가',
        modalContents: <>파티원이 있으면 파티를 삭제할 수 없어요.</>,
        submitBtnTxt: '확인',
        submitAction: () => makeHandlers.cancel(),
      },
      partyEnd: {
        modalTitle: '파티 종료',
        modalContents: (
          <>
            정말로 파티를 종료하시겠습니까?<br />
            종료된 파티는 [내 파티]에서 확인할 수 있어요.
          </>
        ),
        cancelBtnTxt: '닫기',
        submitBtnTxt: '종료하기',
        submitAction: async () => {
          await fetchPatchPartyStatus(Number(partyId), { status: 'CLOSED' });
          closeModal();
          makeHandlers.goHome();
        },
        cancelAction: () => makeHandlers.cancel(),
      },
      partyEndBlocked: {
        modalTitle: '파티 종료 불가',
        modalContents: (
          <>
            모집공고가 있으면 파티를 종료할 수 없어요.<br />
            모집글을 먼저 삭제해주세요.
          </>
        ),
        cancelBtnTxt: '닫기',
        submitBtnTxt: '모집편집',
        submitAction: () => makeHandlers.submit(makeHandlers.goEditRecruit, { skipHardReload: true }),
        cancelAction: () => makeHandlers.cancel(),
      },
      exitPartyEdit: {
        modalTitle: '나가기',
        modalContents: (
          <>
            입력한 내용들이 모두 초기화됩니다.<br />
            나가시겠습니까?
          </>
        ),
        cancelBtnTxt: '취소',
        submitBtnTxt: '나가기',
        submitAction: () => router.back(),
        cancelAction: () => makeHandlers.cancel(),
      
      }
    }),
    [makeHandlers]
  );

  const openPartyEditModal = (type: ModalType) => {
    const spec = SPEC[type];
    if (!spec) return;

    openModal({
      children: (
        <ConfirmModal
          modalTitle={spec.modalTitle}
          modalContents={spec.modalContents}
          cancelBtnTxt={spec.cancelBtnTxt}
          submitBtnTxt={spec.submitBtnTxt}
        />
      ),
      onCancel: spec.cancelAction,
      onSubmit: spec.submitAction,
    });
  };

  return { openPartyEditModal };
}
