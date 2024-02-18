import { useCallback, useEffect, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import classes from './OfferList.module.scss';
import Button from '../../components/common/Button/Button';
import SvgIcon from '../../components/common/SvgIcon/SvgIcon';
import OfferCard from '../../components/OfferCard/OfferCard';
import { LoadingSpinner } from '../../components/common/LoadingSpinner/LoadingSpinner';
import OfferFilters from '../../components/OfferFilters/OfferFilters';
import Pagination from '../../components/common/Pagination/Pagination';
import { useUser } from '../../providers/UserProvider';
import { useOffer } from '../../providers/OfferProvider';
import { usePagination } from '../../hooks/usePagination';
import { FiltersValuesType } from '../../contexts/filtersContext';
import { Offer } from '../../types/Offer';
import { useTheme } from '../../providers/ThemeProvider';

type OfferListView = 'MAIN' | 'ARCHIVE' | 'MY' | 'MY_ARCHIVE';

type OfferListProps = {
  view?: OfferListView;
  classNames?: string;
  showMenus?: boolean;
};

const OfferList = ({
  view = 'MAIN',
  classNames = '',
  showMenus = false,
}: OfferListProps) => {
  const [searchParams] = useSearchParams();
  const { theme } = useTheme();
  const { user } = useUser();
  const {
    fetchOffers,
    fetchMyOffers,
    fetchArchivedOffers,
    fetchMyArchivedOffers,
    countOffers,
    offers,
    isFetching,
  } = useOffer();

  const {
    activePage,
    totalPages,
    itemsPerPage,
    handleSetPage,
    handleSetItemsPerPage,
  } = usePagination({
    totalItems: countOffers,
  });

  const fetchOffersByView: Record<
    OfferListView,
    (filters?: FiltersValuesType) => void
  > = useMemo(() => {
    return {
      MAIN: fetchOffers,
      MY: fetchMyOffers,
      ARCHIVE: fetchArchivedOffers,
      MY_ARCHIVE: fetchMyArchivedOffers,
    };
  }, [fetchOffers, fetchMyOffers, fetchArchivedOffers, fetchMyArchivedOffers]);

  const handleFilterList = useCallback(
    (filters: FiltersValuesType) => {
      handleSetPage(filters?.activePage);
      fetchOffersByView[view]?.(filters);
    },
    [view, fetchOffersByView]
  );

  const handleClearFilterList = useCallback(
    (filters: FiltersValuesType) => {
      fetchOffersByView[view]?.(filters);
    },
    [view, fetchOffersByView, handleSetPage]
  );

  const handlefetchOffersListOnInit = useCallback(() => {
    const filtersParams = searchParams.get('filters');
    if (!filtersParams) {
      fetchOffersByView[view]?.();
      return;
    }

    if (filtersParams) {
      const { title, company, contract, location, activePage, itemsPerPage } =
        JSON.parse(filtersParams);

      const filters: FiltersValuesType = {
        title: title === '' ? undefined : title,
        location,
        activePage,
        itemsPerPage,
      };

      if (company) {
        filters.company = { id: company };
      }

      if (contract) {
        filters.contract = { id: contract };
      }

      fetchOffersByView[view]?.(filters);
    }
  }, [fetchOffersByView]);

  useEffect(() => {
    handlefetchOffersListOnInit();
  }, []);

  const navigationBox = useMemo(() => {
    return (
      view === 'MY' &&
      showMenus &&
      user && (
        <div className={classes.navigationBox}>
          <Link to="/offer/edit">
            <Button variant="primary">Add offer</Button>
          </Link>
        </div>
      )
    );
  }, [user]);

  return (
    <div className={`${classes.offerList}`}>
      <OfferFilters
        onSubmit={handleFilterList}
        onClear={handleClearFilterList}
        activePage={activePage}
        itemsPerPage={itemsPerPage}
      />
      {isFetching ? (
        <LoadingSpinner message="Fetching offer list" />
      ) : (
        <>
          {navigationBox}
          <div
            className={`${classes.list} ${classNames} ${
              !offers.length ? classes.empty : ''
            }
        ${showMenus ? classes.showMenus : ''}
        `}
          >
            {offers.length ? (
              offers.map(
                ({
                  id,
                  company,
                  title,
                  location,
                  contract,
                  createdAt,
                  archived,
                }: Offer) => (
                  <OfferCard
                    key={`offer-${id}`}
                    id={id}
                    title={title}
                    company={company}
                    location={location}
                    contract={contract}
                    createdAt={createdAt ?? 0}
                    archived={archived}
                    showMenu={showMenus}
                  />
                )
              )
            ) : (
              <div className={classes.noOffersWarningBox}>
                <SvgIcon
                  id="icon-error"
                  color={theme === 'dark' ? 'white' : '#19202d'}
                  width={64}
                  height={64}
                />
                <h3>No jobs offers has been found!</h3>
              </div>
            )}
          </div>
          <Pagination
            onSubmit={handleFilterList}
            onSetPage={handleSetPage}
            onSetItemsPerPage={handleSetItemsPerPage}
            activePage={activePage}
            totalPages={totalPages}
            itemsPerPage={itemsPerPage}
          />
        </>
      )}
    </div>
  );
};

export default OfferList;
