import { create } from 'zustand';

interface Location {
  id: number;
  province: string;
  city: string;
}

interface SelectLocationState {
  selectedProvince: string;
  selectedCities: Location[];
  setSelectedProvince: (province: string) => void;
  setSelectedCities: (city: Location) => void;
  removeSelectedCity: (cityId: number) => void;
}

export const useSelectLocationStore = create<SelectLocationState>(set => ({
  selectedProvince: '서울',
  selectedCities: [],

  setSelectedProvince: province => set({ selectedProvince: province }),
  setSelectedCities: city =>
    set(state => ({
      selectedCities: [...state.selectedCities, city],
    })),

  removeSelectedCity: cityId =>
    set(state => ({
      selectedCities: state.selectedCities.filter(item => item.id !== cityId),
    })),
}));
