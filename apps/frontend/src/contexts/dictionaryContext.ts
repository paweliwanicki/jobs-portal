import { createContext } from "react";
import { Company } from "../types/Company";
import { Option } from "react-google-places-autocomplete/build/types";
import { Contract } from "../types/Contract";

type DictionaryContextType = {
  isFetching: boolean;
  companies: Company[];
  companySelectOptions: Option[];
  contracts: Contract[];
  contractSelectOptions: Option[];
  addUpdateCompany: (contract: Company) => Promise<Company> | undefined;
  addUpdateContract: (contract: Contract) => Promise<Contract> | undefined;
  deleteContract: (id: number) => Promise<boolean> | undefined;
  deleteCompany: (id: number) => Promise<boolean> | undefined;
};

export const DictionaryContext = createContext<DictionaryContextType>({
  isFetching: false,
  companies: [],
  companySelectOptions: [],
  contracts: [],
  contractSelectOptions: [],
  addUpdateCompany: () => undefined,
  addUpdateContract: () => undefined,
  deleteContract: () => undefined,
  deleteCompany: () => undefined,
});
