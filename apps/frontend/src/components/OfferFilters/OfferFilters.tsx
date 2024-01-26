import { FormEvent, useCallback, useState, useEffect } from 'react';
import Button from '../common/Button/Button';
import Input from '../common/Input/Input';
import classes from './OfferFilters.module.scss';
import SvgIcon from '../common/SvgIcon/SvgIcon';
import CustomReactSelect from '../common/CustomReactSelect/CustomReactSelect';
import { useDictionaries } from '../../providers/DictionaryProvider';
import GoogleLocationSelect from '../common/GoogleLocationSelect/GoogleLocationSelect';
import { useCollapse } from 'react-collapsed';
import { useFilters } from '../../providers/FiltersProvider';
import { useTheme } from '../../providers/ThemeProvider';
import { FiltersValuesType } from '../../contexts/filtersContext';
import { useOffer } from '../../providers/OfferProvider';
import { useSearchParams } from 'react-router-dom';

type OfferFiltersProps = {
  activePage: number;
  itemsPerPage: number;
  onSubmit: (filters: FiltersValuesType) => void;
  onClear: (filters: FiltersValuesType) => void;
};

const OfferFilters = ({
  activePage,
  itemsPerPage,
  onSubmit,
  onClear,
}: OfferFiltersProps) => {
  const { theme } = useTheme();
  const [searchParams, setSearchParams] = useSearchParams();
  const { countOffers } = useOffer();
  const { companySelectOptions, contractSelectOptions } = useDictionaries();

  const filters = searchParams.get('filters');
  const [isExpanded, setExpanded] = useState<boolean>(() => !!filters);
  const { getCollapseProps, getToggleProps } = useCollapse({ isExpanded });

  const {
    handleSetTitle,
    handleSetLocation,
    handleSetCompany,
    handleSetContract,
    getFiltersStates,
    getFiltersValues,
    getFiltersSearchParams,
    clearFilters,
  } = useFilters();

  const { title, location, company, contract } = getFiltersStates();

  const handleFilterFormOnSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const filtersValues = getFiltersValues();
      const filtersSearchParams = getFiltersSearchParams();
      const pagination = {
        activePage: 1,
        itemsPerPage,
      };

      setSearchParams({
        filters: JSON.stringify({ ...filtersSearchParams, ...pagination }),
      });
      onSubmit({ ...filtersValues, ...pagination });
    },
    [activePage, itemsPerPage, getFiltersValues, onSubmit]
  );

  const handleTitleOnChange = useCallback(
    (title: string) => {
      handleSetTitle(title);
    },
    [title]
  );

  const handleSetFiltersExpanded = useCallback(() => {
    setExpanded((isExpanded) => !isExpanded);
  }, []);

  const handleClearFilters = useCallback(() => {
    clearFilters();
    const pagination = {
      activePage: 1,
      itemsPerPage,
    };
    setSearchParams((params) => {
      params.delete('filters');
      return params;
    });
    onClear && onClear({ ...pagination });
  }, [itemsPerPage, activePage, onClear]);

  const initFiltersValues = useCallback(() => {
    const filters = searchParams.get('filters');
    if (!filters) {
      handleClearFilters();
      return;
    }

    const { title, location, company, contract } = JSON.parse(filters);
    const companyOption = companySelectOptions.find(
      (option) => option.value === company
    );
    const contractOption = contractSelectOptions.find(
      (option) => option.value === contract
    );

    title && handleSetTitle(title);
    location && handleSetLocation(location);
    company && handleSetCompany(companyOption);
    contract && handleSetContract(contractOption);
  }, [
    handleSetTitle,
    handleSetLocation,
    handleSetCompany,
    handleSetContract,
    handleClearFilters,
    companySelectOptions,
    contractSelectOptions,
  ]);

  useEffect(() => {
    initFiltersValues();
  }, [companySelectOptions, contractSelectOptions]);

  const showingCounter = !countOffers
    ? '0'
    : `${activePage - 1 === 0 ? 1 : activePage - 1 * itemsPerPage} - ${
        activePage * itemsPerPage >= countOffers
          ? countOffers
          : activePage * itemsPerPage
      }`;

  return (
    <div className={classes.offerFilters}>
      <form onSubmit={handleFilterFormOnSubmit} {...getCollapseProps()}>
        <div className={classes.filtersBox}>
          <Input
            id="title"
            onChange={handleTitleOnChange}
            classNames={classes.inputFilterBox}
            size="medium"
            placeholder="Filter by title..."
            icon={<SvgIcon id="icon-search" />}
            value={title}
          />

          <GoogleLocationSelect
            id="location-filter"
            instanceId="location"
            onChange={handleSetLocation}
            value={location}
          />

          <CustomReactSelect
            icon={<SvgIcon id="icon-company" color="#5964e0" />}
            id="company-filter"
            instanceId="company"
            onChange={handleSetCompany}
            placeholder="company..."
            options={companySelectOptions}
            value={company}
            isClearable
          />

          <CustomReactSelect
            icon={<SvgIcon id="icon-contract" color="#5964e0" />}
            id="contract-filter"
            instanceId="contract"
            onChange={handleSetContract}
            placeholder="contract..."
            options={contractSelectOptions}
            value={contract}
            isClearable
          />
        </div>

        <div className={classes.filtersControls}>
          <div className={classes.recordsCounter}>
            <p>
              <span>Total: </span>
              {countOffers}
            </p>
            <p>
              <span>Showing: </span>
              {showingCounter}
            </p>
            <p>
              <span>Page: </span>
              {activePage}
            </p>
            <p>
              <span>Items per page: </span>
              {itemsPerPage}
            </p>
          </div>
          <div className={classes.buttonsBox}>
            <Button
              variant="secondary"
              type="button"
              onClick={handleClearFilters}
            >
              Clear
            </Button>
            <Button variant="primary" type="submit">
              Search
            </Button>
          </div>
        </div>
      </form>
      <button
        className={classes.btnExpandFilters}
        {...getToggleProps({
          onClick: handleSetFiltersExpanded,
        })}
      >
        {isExpanded ? 'Hide fllters' : 'Show filters'}
        <SvgIcon
          id={isExpanded ? 'arrow-drop-up' : 'arrow-drop-down'}
          color={theme === 'dark' ? 'white' : '#121721'}
        />
      </button>
    </div>
  );
};

export default OfferFilters;
