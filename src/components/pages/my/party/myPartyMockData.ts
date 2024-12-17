import type { FetchGetUsersMePartiesResponse } from '@/apis/detailProfile';

export const MyPartyMockData: FetchGetUsersMePartiesResponse = {
  total: 5,
  partyUsers: [
    {
      id: 1,
      createdAt: '2024-06-07T12:17:57.248Z',
      position: {
        main: '기획',
        sub: 'UI/UX 기획자',
      },
      party: {
        id: 1,
        title: '파티구함',
        image: '/uploads/party1.jpg',
        status: 'active',
        partyType: {
          type: '포트폴리오',
        },
      },
    },
    {
      id: 2,
      createdAt: '2024-05-20T14:05:12.345Z',
      position: {
        main: '디자이너',
        sub: 'UX/UI',
      },
      party: {
        id: 2,
        title: 'TEMU 디자인(UXUI)',
        image: '/uploads/party2.jpg',
        status: 'active',
        partyType: {
          type: '해커톤',
        },
      },
    },
    {
      id: 3,
      createdAt: '2024-04-12T10:45:00.123Z',
      position: {
        main: '디자이너',
        sub: 'UX/UI',
      },
      party: {
        id: 3,
        title: '모여봐요 동물의숲 도감 어플',
        image: '/uploads/party3.jpg',
        status: 'archived',
        partyType: {
          type: '포트폴리오',
        },
      },
    },
    {
      id: 4,
      createdAt: '2024-03-28T09:30:15.000Z',
      position: {
        main: '개발자',
        sub: '프론트엔드',
      },
      party: {
        id: 4,
        title: '편하게 쓰는 음성인식 일기',
        image: '/uploads/party4.jpg',
        status: 'archived',
        partyType: {
          type: '해커톤',
        },
      },
    },
    {
      id: 5,
      createdAt: '2024-02-15T11:45:30.789Z',
      position: {
        main: '마케터',
        sub: '퍼포먼스마케터',
      },
      party: {
        id: 5,
        title: '[서울/온라인] 장소별 루트 짜주는 데이트 어플 제작',
        image: '/uploads/party5.jpg',
        status: 'active',
        partyType: {
          type: '포트폴리오',
        },
      },
    },
  ],
};
