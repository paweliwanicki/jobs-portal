import { useCallback, useEffect, useState } from 'react';
import classes from './Pagination.module.scss';
import SvgIcon from '../SvgIcon/SvgIcon';
import CustomReactSelect from '../CustomReactSelect/CustomReactSelect';
import { SingleValue } from 'react-select';
import { Option } from 'react-google-places-autocomplete/build/types';
import { useFilters } from '../../../providers/FiltersProvider';
import { FiltersValuesType } from '../../../contexts/filtersContext';
import { useOffer } from '../../../providers/OfferProvider';
import { useTheme } from '../../../providers/ThemeProvider';

export const ITEMS_PER_PAGE_OPTIONS = [
  { label: '12', value: 12 },
  { label: '24', value: 24 },
  { label: '48', value: 48 },
  { label: '96', value: 96 },
] as const;

type PaginationProps = {
  activePage: number;
  totalPages: number;
  itemsPerPage: number;
  onSubmit: (filters: FiltersValuesType) => void;
  onSetPage: (page: number) => void;
  onSetItemsPerPage: (itemsPerPage: number) => void;
};

const Pagination = ({
  activePage,
  totalPages,
  itemsPerPage,
  onSubmit,
  onSetPage,
  onSetItemsPerPage,
}: PaginationProps) => {
  const { theme } = useTheme();
  const { getFiltersValues } = useFilters();
  const { offers } = useOffer();

  const [selectedItemsPerPage, setSelectedItemsPerPage] = useState<
    SingleValue<Option>
  >(ITEMS_PER_PAGE_OPTIONS[0]);

  const handleChangePage = useCallback(
    (page: number) => {
      onSetPage(page);
    },
    [onSetPage]
  );

  const handleChangeItemsPerPage = useCallback(
    (option: any) => {
      setSelectedItemsPerPage(option);
      onSetItemsPerPage(option?.value);
    },
    [onSetItemsPerPage]
  );

  const renderPagesList = useCallback(() => {
    const separator = '...';

    let allPages: number[] = [...Array(totalPages).keys()].map((i) => i + 1);
    let pages: number[] = [...allPages];

    if (totalPages > 6) {
      const indexOfActivePage = allPages.indexOf(activePage);
      if (activePage >= totalPages - 5) {
        pages = allPages.slice(-6);
      } else {
        const firstThreePages = allPages.slice(
          indexOfActivePage,
          indexOfActivePage + 3
        );
        const lastThreePages = allPages.slice(-3);
        pages = [...firstThreePages, 0, ...lastThreePages];
      }
    }

    const pagesList = pages.map((pageNumber: number) => {
      if (!pageNumber) {
        return separator;
      }
      return (
        <button
          key={`page-${pageNumber}`}
          onClick={() => handleChangePage(pageNumber)}
          className={activePage === pageNumber ? classes.active : ''}
        >
          {pageNumber}
        </button>
      );
    });
    return pagesList;
  }, [activePage, totalPages]);

  useEffect(() => {
    if (offers.length) {
      const filtersValues = getFiltersValues();
      const pagination = {
        activePage,
        itemsPerPage,
      };
      onSubmit({ ...filtersValues, ...pagination });
    }
  }, [activePage, itemsPerPage]);

  return totalPages ? (
    <div className={classes.pagination}>
      <div className={classes.perPageSelectBox}>
        <CustomReactSelect
          value={selectedItemsPerPage}
          id="items-per-page-select"
          instanceId="items-per-page"
          size="small"
          options={ITEMS_PER_PAGE_OPTIONS}
          onChange={handleChangeItemsPerPage}
          isClearable={false}
          isSearchable={false}
        />
        Items per page
      </div>
      <div className={classes.pagesList}>
        <SvgIcon
          id={
            theme === 'dark'
              ? 'double-left-arrow-dark'
              : 'double-left-arrow-light'
          }
          width={22}
          height={22}
          viewBox="0 0 24 24"
          onClick={() => handleChangePage(1)}
          classNames={totalPages === 1 ? classes.disabled : ''}
        />
        <SvgIcon
          id={theme === 'dark' ? 'left-arrow-dark' : 'left-arrow-light'}
          width={16}
          height={16}
          viewBox="0 0 20 20"
          onClick={() => handleChangePage(activePage - 1)}
          classNames={totalPages === 1 ? classes.disabled : ''}
        />
        {renderPagesList()}
        <SvgIcon
          id={theme === 'dark' ? 'right-arrow-dark' : 'right-arrow-light'}
          width={16}
          height={16}
          viewBox="0 0 20 20"
          onClick={() => handleChangePage(activePage + 1)}
          classNames={totalPages === 1 ? classes.disabled : ''}
        />
        <SvgIcon
          id={
            theme === 'dark'
              ? 'double-right-arrow-dark'
              : 'double-right-arrow-light'
          }
          width={22}
          height={22}
          viewBox="0 0 24 24"
          onClick={() => handleChangePage(totalPages)}
          classNames={totalPages === 1 ? classes.disabled : ''}
        />
      </div>
    </div>
  ) : null;
};

export default Pagination;
