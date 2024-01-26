import classes from './UploadCompanyLogoModal.module.scss';
import { useCallback, useState } from 'react';
import UploadFilesBox from '../common/UploadFilesBox/UploadFilesBox';
import Modal from '../common/Modal/Modal';
import Button from '../common/Button/Button';
import { Option } from 'react-google-places-autocomplete/build/types';
import { LoadingSpinner } from '../common/LoadingSpinner/LoadingSpinner';
import { uploadCompanyLogo } from '../../providers/DictionaryProvider';
import { useSnackBar } from '../../providers/SnackBarProvider';

type UploadCompanyLogoModalProps = {
  isShowing: boolean;
  company?: Option;
  onShow: () => void;
};

const UploadCompanyLogoModal = ({
  company,
  isShowing,
  onShow,
}: UploadCompanyLogoModalProps) => {
  const [companyLogo, setCompanyLogo] = useState<File>();
  const [isLoading, setIsLoading] = useState<boolean>();
  const { handleShowSnackBar } = useSnackBar();

  const handleShowNewCompanyModal = useCallback(() => {
    onShow();
  }, []);

  const handleCompanyLogoOnChange = useCallback(
    (file?: File) => {
      setCompanyLogo(file);
    },
    [companyLogo]
  );

  const handleUploadCompanyLogo = useCallback(async () => {
    if (company && companyLogo) {
      setIsLoading(true);
      const status = await uploadCompanyLogo(
        companyLogo,
        company.value
      ).finally(() => {
        setIsLoading(false);
      });

      console.log(status);
      handleShowSnackBar('Company has been added!', 'success');
    }
  }, [companyLogo]);

  return (
    <Modal
      isOpen={isShowing}
      onClose={handleShowNewCompanyModal}
      classNames={classes.uploadCompanyLogoModal}
    >
      <form className={classes.content}>
        {isLoading ? (
          <LoadingSpinner message="Uploading image" />
        ) : (
          <>
            <h2>A new company has been created</h2>
            <h3>
              Would you like to upload a logo for{' '}
              <strong>{company?.label}</strong>?
            </h3>
            <UploadFilesBox
              image={companyLogo ?? undefined}
              acceptTypes="image/png, image/gif, image/jpeg"
              onSelect={handleCompanyLogoOnChange}
              placeholder="Click here to upload Company logo"
              classNames={classes.uploadImageBox}
            />

            <div className={classes.buttonsBox}>
              <Button variant="secondary" onClick={handleShowNewCompanyModal}>
                Cancel
              </Button>
              <Button
                variant="primary"
                type="button"
                onClick={handleUploadCompanyLogo}
              >
                Save
              </Button>
            </div>
          </>
        )}
      </form>
    </Modal>
  );
};

export default UploadCompanyLogoModal;
