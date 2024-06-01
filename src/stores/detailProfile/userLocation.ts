import { create } from 'zustand';

/** 세부 프로핑 - location */
interface Location {
  id: number;
  province: string;
  city: string;
}

interface SelectLocationState {
  selectedProvince: string;
  selectedCities: Location[];
  selectedCitiesById: { id: number }[];
  locationCompletion: boolean;

  setSelectedProvince: (province: string) => void;
  setSelectedCities: (city: Location) => void;
  removeSelectedCity: (cityId: number) => void;
  removeSelectedCitiesByProvince: (province: string) => void;
  setLocationCompletion: (completed: boolean) => void;
}

export const useSelectLocationStore = create<SelectLocationState>(set => ({
  selectedProvince: '서울',
  selectedCities: [],
  selectedCitiesById: [],

  locationCompletion: false,

  setSelectedProvince: province => set({ selectedProvince: province }),

  setSelectedCities: city =>
    set(state => {
      const updatedCities = state.selectedCities.some(item => item.province === city.province && item.city === '전체')
        ? state.selectedCities.filter(item => !(item.province === city.province && item.city === '전체')).concat([city])
        : state.selectedCities.concat([city]);

      const updatedCitiesById = updatedCities.map(item => ({ id: item.id }));

      return { selectedCities: updatedCities, selectedCitiesById: updatedCitiesById };
    }),

  removeSelectedCity: cityId =>
    set(state => {
      const updatedCities = state.selectedCities.filter(item => item.id !== cityId);
      const updatedCitiesById = updatedCities.map(item => ({ id: item.id }));

      return { selectedCities: updatedCities, selectedCitiesById: updatedCitiesById };
    }),

  removeSelectedCitiesByProvince: province =>
    set(state => {
      const updatedCities = state.selectedCities.filter(item => item.province !== province);
      const updatedCitiesById = updatedCities.map(item => ({ id: item.id }));

      return { selectedCities: updatedCities, selectedCitiesById: updatedCitiesById };
    }),

  setLocationCompletion: (completed: boolean) => set({ locationCompletion: completed }),
}));