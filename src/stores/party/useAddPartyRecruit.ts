import { create } from 'zustand';

export interface PartyRecruit {
  positionId: number; // 직군 ID
  content: string; // 모집 소개 글
  maxParticipants: string; // 모집 인원 (문자열 형태)
  직군: string; // 직군 (메인 포지션)
  직무: string; // 직무 (서브 포지션)
}

interface EditPartyRecruit {
  editPartyRecruitForm: PartyRecruit;
  setEditPartyRecruitForm: (partyRecruitForm: PartyRecruit) => void;
  setResetEditPartyRecruitForm: () => void; // 리셋 함수
}

export const useEditPartyRecruitForm = create<EditPartyRecruit>(set => ({
  editPartyRecruitForm: {
    positionId: 0,
    content: '',
    maxParticipants: '',
    직군: '',
    직무: '',
  },
  setEditPartyRecruitForm: partyRecruitForm => set({ editPartyRecruitForm: partyRecruitForm }),

  setResetEditPartyRecruitForm: () =>
    set({
      editPartyRecruitForm: {
        positionId: 0,
        content: '',
        maxParticipants: '',
        직군: '',
        직무: '',
      },
    }),
}));
