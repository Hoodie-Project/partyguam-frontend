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
  removeSelectedCity: (city: string) => void;
}

export const useSelectLocationStore = create<SelectLocationState>(set => ({
  selectedProvince: '서울',
  selectedCities: [],

  setSelectedProvince: province => set({ selectedProvince: province }),
  setSelectedCities: city =>
    set(state => ({
      selectedCities: [...state.selectedCities, city],
    })),

  removeSelectedCity: cityName =>
    set(state => ({
      selectedCities: state.selectedCities.filter(city => city.city !== cityName),
    })),
}));
