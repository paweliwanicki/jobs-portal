import {
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { HttpMethod } from '../enums/HttpMethods';
import { useApi } from '../hooks/useApi';
import { Company } from '../types/Company';
import { Option } from 'react-google-places-autocomplete/build/types';
import { Contract } from '../types/Contract';
import { DictionaryContext } from '../contexts/dictionaryContext';
import { useSnackBar } from './SnackBarProvider';
import { OFFERS_API_PATH } from './OfferProvider';

export const DICT_API_PATH = '/api/dict';

type DictionaryProviderProps = {
  children: ReactNode;
};

type SelectOptionsData = Company[] | Contract[];

const generateSelectOptions = (
  data: SelectOptionsData,
  valueKey = 'id',
  labelKey = 'name'
) => {
  return data.map((obj: any) => {
    return {
      value: obj[valueKey],
      label: obj[labelKey],
    };
  });
};

export const uploadCompanyLogo = async (file: Blob, companyId: number) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('companyId', companyId.toString());
  const response = await fetch(`${OFFERS_API_PATH}/uploadCompanyLogo`, {
    method: HttpMethod.POST,
    body: formData,
  });
  return response;
};

const DictionaryProvider = ({ children }: DictionaryProviderProps) => {
  const { fetch, isFetching } = useApi();

  const { handleShowSnackBar } = useSnackBar();

  const [companies, setCompanies] = useState<Company[]>([]);
  const [companySelectOptions, setCompanySelectOptions] = useState<Option[]>(
    []
  );

  const [contracts, setContracts] = useState<Contract[]>([]);
  const [contractSelectOptions, setContractSelectOptions] = useState<Option[]>(
    []
  );

  const getCompanies = useCallback(async () => {
    const [allCompanies, response] = await fetch<Company[]>(HttpMethod.GET, {
      path: `${DICT_API_PATH}/company/`,
    });

    if (response.statusCode === 200) {
      setCompanies(allCompanies);
      setCompanySelectOptions(generateSelectOptions(allCompanies));
    }
  }, []);

  const addUpdateCompany = useCallback(async (company: Company) => {
    const [newCompany, response] = await fetch<Company>(HttpMethod.POST, {
      path: `${DICT_API_PATH}/company/`,
      payload: JSON.stringify(company),
    });
    if (response.statusCode === 201) {
      console.log(response)
      await getCompanies();
      handleShowSnackBar('Saved successfully!', 'success');
    } else {
      handleShowSnackBar('An error occurred. Update failed!', 'error');
    }
    return newCompany;
  }, []);

  const deleteCompany = useCallback(async (id: number) => {
    const [, response] = await fetch<Company>(HttpMethod.DELETE, {
      path: `${DICT_API_PATH}/company/${id}`,
    });
    if (response.statusCode === 200) {
      await getCompanies();
      handleShowSnackBar('Deleted successfully!', 'success');
      return true;
    } else {
      handleShowSnackBar('An error occurred. The deletion failed!', 'error');
    }
    return false;
  }, []);

  const getContracts = useCallback(async () => {
    const [allContracts, response] = await fetch<Contract[]>(HttpMethod.GET, {
      path: `${DICT_API_PATH}/contract/`,
    });
    if (response.statusCode === 200) {
      setContracts(allContracts);
      setContractSelectOptions(generateSelectOptions(allContracts));
    }
  }, []);

  const addUpdateContract = useCallback(async (contract: Contract) => {
    const [newContract, response] = await fetch<Contract>(HttpMethod.POST, {
      path: `${DICT_API_PATH}/contract/`,
      payload: JSON.stringify(contract),
    });
    if (response.statusCode === 201) {
      await getContracts();
      handleShowSnackBar('Saved successfully!', 'success');
    } else {
      handleShowSnackBar('An error occurred. Update failed!', 'error');
    }
    return newContract;
  }, []);

  const deleteContract = useCallback(async (id: number) => {
    const [, response] = await fetch<Contract>(HttpMethod.DELETE, {
      path: `${DICT_API_PATH}/contract/${id}`,
    });
    if (response.statusCode === 200) {
      await getContracts();
      handleShowSnackBar('Deleted successfully!', 'success');
      return true;
    } else {
      handleShowSnackBar('An error occurred. The deletion failed!', 'error');
    }
    return false;
  }, []);

  useEffect(() => {
    getCompanies();
    getContracts();
  }, []);

  const value = useMemo(
    () => ({
      companies,
      companySelectOptions,
      contracts,
      contractSelectOptions,
      isFetching,
      addUpdateCompany,
      addUpdateContract,
      deleteCompany,
      deleteContract,
    }),
    [
      companies,
      companySelectOptions,
      contracts,
      contractSelectOptions,
      isFetching,
      addUpdateCompany,
      addUpdateContract,
      deleteCompany,
      deleteContract,
    ]
  );

  return (
    <DictionaryContext.Provider value={value}>
      {children}
    </DictionaryContext.Provider>
  );
};

export default DictionaryProvider;

export const useDictionaries = () => useContext(DictionaryContext);
