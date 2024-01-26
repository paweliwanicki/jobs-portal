import { createContext } from 'react';
import {
  OffersFiltersSearchParams,
  OffersFiltersState,
  OffersFiltersValues,
} from '../providers/FiltersProvider';
import { PaginationValues } from '../hooks/usePagination';

export type FiltersValuesType = OffersFiltersValues & PaginationValues;

type FiltersContextType = {
  getFiltersValues: () => OffersFiltersValues;
  getFiltersStates: () => OffersFiltersState;
  getFiltersSearchParams: () => OffersFiltersSearchParams;
  handleSetTitle: (title: string) => void;
  handleSetLocation: (location: any) => void;
  handleSetCompany: (company: any) => void;
  handleSetContract: (contract: any) => void;
  clearFilters: () => void;
};

export const FiltersContext = createContext<FiltersContextType>({
  getFiltersValues: () => ({
    location: undefined,
  }),
  getFiltersStates: () => ({
    location: null,
    company: null,
    contract: null,
  }),
  getFiltersSearchParams: () => ({
    title: undefined,
    location: undefined,
    company: undefined,
    contract: undefined,
  }),
  handleSetTitle: () => undefined,
  handleSetLocation: () => undefined,
  handleSetCompany: () => undefined,
  handleSetContract: () => undefined,
  clearFilters: () => undefined,
});
