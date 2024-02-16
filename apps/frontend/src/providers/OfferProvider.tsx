import { ReactNode, useCallback, useContext, useMemo, useState } from 'react';
import { OfferContext } from '../contexts/offerContext';
import { HttpMethod } from '../enums/HttpMethods';
import { Offer } from '../types/Offer';
import { RequestOptions, useApi } from '../hooks/useApi';
import { useSnackBar } from './SnackBarProvider';
import { FiltersValuesType } from '../contexts/filtersContext';

export const OFFERS_API_PATH = '/api/offers';

type OfferProviderProps = {
  children: ReactNode;
};

const OfferProvider = ({ children }: OfferProviderProps) => {
  const { fetch, isFetching } = useApi();
  const { handleShowSnackBar } = useSnackBar();

  const [selectedOffer, setSelectedOffer] = useState<Offer>();
  const [offers, setOffers] = useState<Offer[]>([]);
  const [countOffers, setCountOffers] = useState<number>(0);
  const [countMyOffers, setCountMyOffers] = useState<number>(0);
  const [countMyArchivedOffers, setCountMyArchivedOffers] = useState<number>(0);

  const fetchOffers = useCallback(
    async (filters?: FiltersValuesType) => {
      const requestOptions: RequestOptions = {
        path: `${OFFERS_API_PATH}/all`,
      };
      if (filters) {
        requestOptions.payload = JSON.stringify(filters);
      }
      const [fetchedOffers, response] = await fetch<[Offer[], number]>(
        HttpMethod.POST,
        requestOptions
      );

      if (response.statusCode === 201) {
        const [_offers, count] = fetchedOffers;
        setCountOffers(count);
        setOffers(_offers);
      }
    },
    [offers, fetch]
  );

  const fetchOffer = useCallback(
    async (id: number) => {
      const [fetchedOffer, response] = await fetch<Offer>(HttpMethod.GET, {
        path: `${OFFERS_API_PATH}/${id}`,
      });

      if (response.statusCode === 200) {
        setSelectedOffer(fetchedOffer);
      }
    },
    [selectedOffer, fetch]
  );

  const removeOffer = useCallback(
    async (id: number) => {
      const [, response] = await fetch<Offer>(HttpMethod.DELETE, {
        path: `${OFFERS_API_PATH}/${id}`,
      });

      if (response.statusCode === 200) {
        fetchOffers();
        handleShowSnackBar('Offer removed successfully', 'success');
      } else {
        handleShowSnackBar(
          'There was an error when deleting the offer',
          'error'
        );
      }
    },
    [fetchOffers, selectedOffer]
  );

  const fetchArchivedOffers = useCallback(
    async (filters?: FiltersValuesType) => {
      const requestOptions: RequestOptions = {
        path: `${OFFERS_API_PATH}/archive`,
      };
      if (filters) {
        requestOptions.payload = JSON.stringify(filters);
      }
      const [fetchedOffers, response] = await fetch<[Offer[], number]>(
        HttpMethod.POST,
        requestOptions
      );

      if (response.statusCode === 201) {
        const [_offers, count] = fetchedOffers;
        setCountOffers(count);
        setOffers(_offers);
      }
    },
    [offers, fetch]
  );

  const fetchMyOffers = useCallback(
    async (filters?: FiltersValuesType) => {
      const requestOptions: RequestOptions = {
        path: `${OFFERS_API_PATH}/my`,
      };
      if (filters) {
        requestOptions.payload = JSON.stringify(filters);
      }
      const [fetchedOffers, response] = await fetch<[Offer[], number]>(
        HttpMethod.POST,
        requestOptions
      );

      if (response.statusCode === 201) {
        const [_offers, count] = fetchedOffers;
        setCountMyOffers(count);
        setCountOffers(count);
        setOffers(_offers);
      }
    },
    [offers, fetch]
  );

  const fetchMyArchivedOffers = useCallback(
    async (filters?: FiltersValuesType) => {
      const requestOptions: RequestOptions = {
        path: `${OFFERS_API_PATH}/myArchive`,
      };
      if (filters) {
        requestOptions.payload = JSON.stringify(filters);
      }
      const [fetchedOffers, response] = await fetch<[Offer[], number]>(
        HttpMethod.POST,
        requestOptions
      );

      if (response.statusCode === 201) {
        const [_offers, count] = fetchedOffers;
        setCountMyArchivedOffers(count);
        setCountOffers(count);
        setOffers(_offers);
      }
    },
    [offers, fetch]
  );

  const archiveOffer = useCallback(
    async (id: number) => {
      const [, archived] = await fetch<Offer>(HttpMethod.POST, {
        path: `${OFFERS_API_PATH}/archive/${id}`,
      });

      if (archived) {
        fetchMyOffers();
        handleShowSnackBar('Offer archived successfully', 'success');
      } else {
        handleShowSnackBar(
          'There was an error when archiving the offer',
          'error'
        );
      }
    },
    [fetchMyOffers, handleShowSnackBar]
  );

  const contextValue = useMemo(
    () => ({
      selectedOffer,
      offers,
      countOffers,
      countMyOffers,
      countMyArchivedOffers,
      isFetching,
      fetchOffer,
      fetchOffers,
      fetchMyOffers,
      fetchArchivedOffers,
      fetchMyArchivedOffers,
      removeOffer,
      archiveOffer,
    }),
    [
      selectedOffer,
      offers,
      countOffers,
      countMyOffers,
      countMyArchivedOffers,
      isFetching,
      fetchOffer,
      fetchOffers,
      fetchMyOffers,
      fetchArchivedOffers,
      fetchMyArchivedOffers,
      removeOffer,
      archiveOffer,
    ]
  );

  return (
    <OfferContext.Provider value={contextValue}>
      {children}
    </OfferContext.Provider>
  );
};

export default OfferProvider;

export const useOffer = () => useContext(OfferContext);
