import React from 'react';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';

import { Chip } from '@/components/atoms';
import { Location } from '@/components/organisms';
import { useSelectLocationStore } from '@/store/user';

export default function SelectLocation() {
  const { selectedCities, removeSelectedCity } = useSelectLocationStore();
  return (
    <div>
      <Location />
      {selectedCities.map(item => (
        <Chip
          key={item.id}
          chipType="outlined"
          chipColor="primaryGreen"
          label={`${item.province} ${item.city}`}
          closeButton={
            <CloseRoundedIcon
              style={{ marginLeft: '4px' }}
              onClick={e => {
                e.preventDefault();
                removeSelectedCity(item.id);
              }}
            />
          }
        />
      ))}
    </div>
  );
}
