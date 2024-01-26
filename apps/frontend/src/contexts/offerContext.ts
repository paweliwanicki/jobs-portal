import { createContext } from 'react';
import { Offer } from '../types/Offer';
import { FiltersValuesType } from './filtersContext';

type OfferContextType = {
  selectedOffer?: Offer;
  countOffers: number;
  offers: Offer[];
  countMyOffers: number;
  countMyArchivedOffers: number;
  fetchOffer: (id: number) => void;
  fetchOffers: (filters?: FiltersValuesType) => void;
  fetchMyOffers: (filters?: FiltersValuesType) => void;
  fetchArchivedOffers: (filters?: FiltersValuesType) => void;
  fetchMyArchivedOffers: (filters?: FiltersValuesType) => void;
  removeOffer: (id: number) => void;
  archiveOffer: (id: number) => void;
};

export const OfferContext = createContext<OfferContextType>({
  selectedOffer: undefined,
  countOffers: 0,
  offers: [],
  countMyOffers: 0,
  countMyArchivedOffers: 0,
  fetchOffer: () => undefined,
  fetchOffers: () => undefined,
  removeOffer: () => undefined,
  archiveOffer: () => undefined,
  fetchMyOffers: () => undefined,
  fetchArchivedOffers: () => undefined,
  fetchMyArchivedOffers: () => undefined,
});
