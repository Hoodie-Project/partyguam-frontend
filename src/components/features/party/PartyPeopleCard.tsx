import { Square } from '@/components/_atoms';

type Props = {
  authority?: 'master' | 'deputy' | 'member'; //
  position?: {
    main: string;
    sub: string;
  };
  user?: {
    id: number;
    nickname: string;
    image: string;
  };
};

function PartyPeopleCard({ authority, position, user }: Props) {
  return (
    <Square
      width="100%"
      height="136px"
      shadowKey="shadow1"
      backgroundColor="white"
      radiusKey="base"
      borderColor="grey200"
    ></Square>
  );
}

export default PartyPeopleCard;
