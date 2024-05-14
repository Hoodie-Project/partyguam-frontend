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
  removeSelectedCitiesByProvince: (province: string) => void;
}

export const useSelectLocationStore = create<SelectLocationState>(set => ({
  selectedProvince: '서울',
  selectedCities: [],

  setSelectedProvince: province => set({ selectedProvince: province }),

  setSelectedCities: city =>
    set(state => ({
      selectedCities: state.selectedCities.some(item => item.province === city.province && item.city === '전체')
        ? state.selectedCities.filter(item => !(item.province === city.province && item.city === '전체')).concat([city])
        : state.selectedCities.concat([city]),
    })),

  removeSelectedCity: cityId =>
    set(state => ({
      selectedCities: state.selectedCities.filter(item => item.id !== cityId),
    })),

  removeSelectedCitiesByProvince: province =>
    set(state => ({
      selectedCities: state.selectedCities.filter(item => item.province !== province),
    })),
}));
