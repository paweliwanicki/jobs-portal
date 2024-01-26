import classes from './OfferCard.module.scss';
import SvgIcon from '../common/SvgIcon/SvgIcon';
import { Link } from 'react-router-dom';
import { Company } from '../../types/Company';
import { useUser } from '../../providers/UserProvider';
import ContextMenu, {
  ContextMenuOption,
} from '../common/ContextMenu/ContextMenu';
import { useCallback } from 'react';
import { useOffer } from '../../providers/OfferProvider';
import { Contract } from '../../types/Contract';
import { Tooltip } from 'react-tooltip';
import { useTheme } from '../../providers/ThemeProvider';

export type OfferCardProps = {
  id?: number;
  title: string;
  company: Company;
  contract: Contract;
  location: string;
  createdAt: number;
  archived: boolean;
  showMenu?: boolean;
};

const now = Math.floor(new Date().getTime() / 1000);

export const getOfferAddedTime = (createdAt: number) => {
  const hoursDiff = Math.abs(now - createdAt) / 3600;
  let suffix = 'h';
  let diff = Math.floor(hoursDiff);

  if (!diff) {
    return 'Recent';
  }

  if (hoursDiff >= 24) {
    diff = Math.floor(hoursDiff / 24);
    suffix = 'd';
  }

  return `${diff}${suffix} ago`;
};

const OfferCard = ({
  id,
  title,
  company,
  location,
  contract,
  createdAt,
  archived,
  showMenu = false,
}: OfferCardProps) => {
  const { theme } = useTheme();
  const { removeOffer, archiveOffer } = useOffer();
  const { user } = useUser();

  const offerCreationTime = getOfferAddedTime(createdAt);
  const showNewBadge = !archived && offerCreationTime === 'Recent';

  const handleRemoveOffer = useCallback(
    (id?: number) => {
      id && removeOffer(id);
    },
    [removeOffer]
  );

  const handleArchiveOffer = useCallback(
    (id?: number) => {
      id && archiveOffer(id);
    },
    [archiveOffer]
  );

  const CONTEXT_MENU_OPTIONS: ContextMenuOption[] = [
    {
      label: <Link to={`/offer/edit/${id}`}>Edit</Link>,
    },
    {
      label: 'Archive',
      action: useCallback(() => handleArchiveOffer(id), []),
    },
    {
      label: 'Remove',
      action: useCallback(() => handleRemoveOffer(id), []),
    },
  ];

  return (
    <div className={classes.offerCard}>
      {user && showMenu && (
        <div className={classes.cardActionsBox}>
          <ContextMenu
            options={CONTEXT_MENU_OPTIONS}
            id={`offer-${id}-context-menu`}
          />
        </div>
      )}

      {showNewBadge && <div className={classes.newBadge}>New!</div>}
      {archived && (
        <>
          <SvgIcon
            classNames={classes.offerArchivedIcon}
            id="icon-archive"
            elementId={`icon-archive-offer-${id}`}
            width={24}
            height={24}
            viewBox="0 0 32 32"
            color={theme === 'dark' ? '#f4f6f8' : '#222f3e'}
          />
          <Tooltip
            anchorSelect={`#icon-archive-offer-${id}`}
            place="bottom"
            content="Offer archived"
            className={classes.offerArchivedTooltip}
          />
        </>
      )}
      <Link to={`/offer/${id}`}>
        <img
          src={`/uploads/${
            company?.logoFileName
              ? company?.logoFileName
              : 'company_default_logo.jpeg'
          }`}
          alt="company"
          className={classes.companyLogo}
        />

        <div className={classes.content}>
          <p>
            <span>{offerCreationTime}</span>
            <SvgIcon id="icon-dot" width={4} height={4} />
            <span>{contract?.name}</span>
          </p>
          <div>
            <h3>{title}</h3>
          </div>
          <p>{company?.name}</p>
          <div className={classes.locationBox}>
            <p className={classes.location}>{location}</p>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default OfferCard;
