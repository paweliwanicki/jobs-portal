import { ReactNode, useCallback, useContext, useMemo, useState } from 'react';
import { FiltersContext } from '../contexts/filtersContext';

export type OffersFiltersState = {
  title?: string;
  location: any | null;
  company: any | null;
  contract: any | null;
};

export type OffersFiltersSearchParams = {
  title?: string;
  location?: string;
  company?: number;
  contract?: number;
};

export type OffersFiltersValues = {
  title?: string;
  location?: string;
  company?: {
    id: number;
  };
  contract?: { id: number };
};

type FiltersProviderProps = {
  children: ReactNode;
};

const FiltersProvider = ({ children }: FiltersProviderProps) => {
  const [title, setTitle] = useState<string>('');
  const [location, setLocation] = useState<any | null>();
  const [company, setCompany] = useState<any | null>();
  const [contract, setContract] = useState<any | null>();

  const handleSetTitle = useCallback((title: string) => {
    setTitle(title);
  }, []);

  const handleSetLocation = useCallback((location: string) => {
    setLocation(location);
  }, []);

  const handleSetCompany = useCallback((company: any) => {
    setCompany(company);
  }, []);

  const handleSetContract = useCallback((contract: any) => {
    setContract(contract);
  }, []);

  const clearFilters = useCallback(() => {
    setTitle('');
    setLocation(null);
    setCompany(null);
    setContract(null);
  }, []);

  const getFiltersValues = useCallback(() => {
    const values: OffersFiltersValues = {
      title: title === '' ? undefined : title,
      location: location?.value.description,
    };
    if (company) {
      values.company = { id: company?.value };
    }

    if (contract) {
      values.contract = { id: contract?.value };
    }

    return values;
  }, [title, location, company, contract]);

  const getFiltersSearchParams = useCallback(() => {
    const values: OffersFiltersSearchParams = {
      title,
      location: location?.value.description,
      company: company?.value,
      contract: contract?.value,
    };
    return values;
  }, [title, location, company, contract]);

  const getFiltersStates = useCallback(() => {
    return {
      title,
      location,
      company,
      contract,
    };
  }, [title, location, company, contract]);

  const value = useMemo(
    () => ({
      getFiltersValues,
      getFiltersStates,
      getFiltersSearchParams,
      handleSetTitle,
      handleSetLocation,
      handleSetCompany,
      handleSetContract,
      clearFilters,
    }),
    [
      getFiltersValues,
      getFiltersStates,
      getFiltersSearchParams,
      handleSetTitle,
      handleSetLocation,
      handleSetCompany,
      handleSetContract,
      clearFilters,
    ]
  );

  return (
    <FiltersContext.Provider value={value}>{children}</FiltersContext.Provider>
  );
};

export default FiltersProvider;

export const useFilters = () => useContext(FiltersContext);
