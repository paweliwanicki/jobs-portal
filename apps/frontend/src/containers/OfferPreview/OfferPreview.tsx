import { useEffect } from 'react';
import { ScrollRestoration, useParams } from 'react-router-dom';
import { getOfferAddedTime } from '../../components/OfferCard/OfferCard';
import { useOffer } from '../../providers/OfferProvider';
import { useTheme } from '../../providers/ThemeProvider';
import InfoBox from '../../components/common/InfoBox/InfoBox';
import classes from './OfferPreview.module.scss';
import Button from '../../components/common/Button/Button';
import SvgIcon from '../../components/common/SvgIcon/SvgIcon';
import ContentLoader from 'react-content-loader';

type OfferPreviewProps = {};

const OfferPreviewLoader = () => {
  const { theme } = useTheme();
  return (
    <ContentLoader
      speed={2}
      width={'100%'}
      height={1020}
      viewBox="0 0 100% 1020"
      backgroundColor={theme === 'dark' ? '#222f3e' : '#E0E0E0'}
      foregroundColor={theme === 'dark' ? '#19202d' : '#ecebeb'}
      preserveAspectRatio="slice"
      style={{ maxWidth: '730px' }}
    >
      <rect x="0" y="0" rx="6" ry="6" width="100%" height="140" />
      <rect x="0" y="175" rx="6" ry="6" width="100%" height="700" />
      <rect x="0" y="910" rx="6" ry="6" width="100%" height="110" />
    </ContentLoader>
  );
};

const OfferPreview = ({}: OfferPreviewProps) => {
  const { theme } = useTheme();
  const { id } = useParams();
  const { fetchOffer, selectedOffer, isFetching } = useOffer();
  const { company, createdAt, contract, location, title } = selectedOffer ?? {};

  useEffect(() => {
    if (id) {
      fetchOffer(parseInt(id));
    }
  }, [id]);

  const offerDetails = { __html: selectedOffer?.description ?? '' };

  return (
    <div className={classes.offerPreviewContainer}>
      <ScrollRestoration />
      {isFetching ? (
        <OfferPreviewLoader />
      ) : selectedOffer ? (
        <>
          <section className={classes.offerDetailsSection}>
            {selectedOffer.archived && (
              <InfoBox variant="info" classNames={classes.offerArchivedInfo}>
                <SvgIcon
                  id="icon-archive"
                  width={32}
                  height={32}
                  color="#6e8098"
                />
                Offer is archived!
              </InfoBox>
            )}
            <div className={classes.companyInfoBox}>
              <img
                src={`/uploads/${
                  company?.logoFileName
                    ? company?.logoFileName
                    : 'company_default_logo.jpeg'
                }`}
                alt="company"
              />
              <div className={classes.companyInfo}>
                <h3>{company?.name}</h3>
                <a
                  href={company?.website ?? 'www.defaultCompany.test.com'}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  {company?.website ?? 'www.defaultCompany.test.com'}
                </a>
              </div>
              <a
                href={company?.website}
                target="_blank"
                rel="noreferrer noopener"
              >
                <Button variant="link">Company Site</Button>
              </a>
            </div>

            <div className={classes.offerContent}>
              <div className={classes.offerInfoApplyBox}>
                <div className={classes.offerInfoBox}>
                  <p>
                    <span>{createdAt && getOfferAddedTime(createdAt)}</span>
                    <SvgIcon id="icon-dot" width={4} height={4} />
                    <span>{contract?.name}</span>
                  </p>
                  <div>
                    <h3>{title}</h3>
                  </div>
                  <div className={classes.locationBox}>
                    <p className={classes.location}>{location}</p>
                  </div>
                </div>
                <Button variant="primary">Apply Now</Button>
              </div>
              <section
                className={classes.offerDetails}
                dangerouslySetInnerHTML={offerDetails}
              ></section>
            </div>
            <div className={classes.offerFooter}>
              <div className={classes.footerContent}>
                <div>
                  <h3>{title}</h3>
                  <p>{company?.name}</p>
                </div>
                <Button variant="primary">Apply Now</Button>
              </div>
            </div>
          </section>
        </>
      ) : (
        <div className={classes.noOfferWarningBox}>
          <SvgIcon
            id="icon-error"
            color={theme === 'dark' ? '#FFF' : '#222f3e'}
            width={64}
            height={64}
          />
          <h3>Offer (id: {id}) not found!</h3>
        </div>
      )}
    </div>
  );
};

export default OfferPreview;
