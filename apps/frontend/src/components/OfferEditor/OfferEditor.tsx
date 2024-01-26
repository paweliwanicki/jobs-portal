import classes from './OfferEditor.module.scss';
import Input from '../common/Input/Input';
import Button from '../common/Button/Button';
import ValidationIcon from '../common/ValidationIcon/ValidationIcon';
import { Editor } from '@tinymce/tinymce-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useOfferEditor } from '../../hooks/useOfferEditor';
import { useParams } from 'react-router-dom';
import { LoadingSpinner } from '../common/LoadingSpinner/LoadingSpinner';
import type { Option } from 'react-google-places-autocomplete/build/types';
import type { Editor as TinyMceEditor } from 'tinymce';
import { SingleValue } from 'react-select';
import { HttpMethod } from '../../enums/HttpMethods';
import { useApi } from '../../hooks/useApi';
import UploadCompanyLogoModal from '../UploadCompanyLogoModal/UploadCompanyLogoModal';
import { Company } from '../../types/Company';
import { Offer } from '../../types/Offer';
import { Contract } from '../../types/Contract';
import { useRouter } from '../../hooks/useRouter';
import { useDictionaries } from '../../providers/DictionaryProvider';
import { useTheme } from '../../providers/ThemeProvider';
import GoogleLocationSelect from '../common/GoogleLocationSelect/GoogleLocationSelect';
import CustomReactSelect from '../common/CustomReactSelect/CustomReactSelect';
import SvgIcon from '../common/SvgIcon/SvgIcon';
import InfoBox from '../common/InfoBox/InfoBox';
import { OFFERS_API_PATH } from '../../providers/OfferProvider';

const OfferEditor = () => {
  let { id } = useParams<{ id: string | undefined }>();
  const { fetch } = useApi();
  const { theme } = useTheme();

  const { history } = useRouter();
  const editorRef = useRef<TinyMceEditor>();
  const {
    companySelectOptions,
    contractSelectOptions,
    addUpdateCompany,
    addUpdateContract,
  } = useDictionaries();

  const {
    errors,
    isValidated,
    isFetching,
    responseError,
    responseMessage,
    clearValidationAndError,
    addOffer,
    updateOffer,
    validateOfferEditor,
  } = useOfferEditor();

  const {
    titleError,
    contractError,
    locationError,
    descriptionError,
    companyError,
  } = errors;

  const {
    titleIsValidated,
    companyIsValidated,
    contractIsValidated,
    locationIsValidated,
    descriptionIsValidated,
  } = isValidated;

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [company, setCompany] = useState<Option | null>();
  const [location, setLocation] = useState<Option | null>();
  const [contract, setContract] = useState<Option | null>();
  const [editorElementKey, setEditorElementKey] = useState<number>(0);
  const [initialEditorValue, setInitialEditorValue] = useState<string>('');

  const [showNewCompanyModal, setShowNewCompanyModal] =
    useState<boolean>(false);

  const handleTitleOnChange = useCallback(
    (title: string) => {
      titleIsValidated && clearValidationAndError('TITLE');
      setTitle(title);
    },
    [titleIsValidated, clearValidationAndError]
  );

  const handleCompanyOnChange = useCallback(
    (company: any) => {
      companyIsValidated && clearValidationAndError('COMPANY');
      setCompany(company);
    },
    [companyIsValidated, clearValidationAndError]
  );

  const handleLocationOnChange = useCallback(
    (location: SingleValue<Option>) => {
      locationIsValidated && clearValidationAndError('LOCATION');
      setLocation(location);
    },
    [locationIsValidated, clearValidationAndError]
  );

  const handleContractOnChange = useCallback(
    (contract: any) => {
      contractIsValidated && clearValidationAndError('CONTRACT');
      setContract(contract);
    },
    [contractIsValidated, clearValidationAndError]
  );

  const handleDescriptionOnChange = useCallback(
    (description: string) => {
      descriptionIsValidated && clearValidationAndError('DESCRIPTION');
      setDescription(description);
    },
    [descriptionIsValidated, clearValidationAndError]
  );

  const handleOnInitTinyMCE = useCallback(
    (_event: unknown, editor: TinyMceEditor) => {
      setIsLoading(false);
      return (editorRef.current = editor);
    },
    []
  );

  const handleChangeTinyMCEStyles = useCallback(() => {
    setInitialEditorValue(description);
    setEditorElementKey((key) => key + 1); // force tinymce rerender after theme is changed (editor was not changing styles)
  }, [description]);

  const handleSaveOffer = useCallback(
    async (e: React.SyntheticEvent) => {
      e.preventDefault();
      const isValid = validateOfferEditor(
        title,
        company?.value ?? '',
        location?.label ?? '',
        contract?.value ?? '',
        description
      );

      if (isValid) {
        const offer: Offer = {
          title,
          id: parseInt(id ?? ''),
          location: location?.label ?? '',
          company: company?.value,
          contract: contract?.value,
          archived: false,
          description,
        };

        return id ? await updateOffer(offer) : await addOffer(offer);
      }
    },
    [
      description,
      company,
      location,
      contract,
      title,
      responseMessage,
      responseError,
    ]
  );

  const handleSetOffer = useCallback(async (offer: Offer) => {
    const { title, company, contract, location, description } = offer;
    setTitle(title);
    setCompany({
      label: company?.name ?? '',
      value: company?.id ?? '',
    });
    setContract({
      label: contract?.name ?? '',
      value: contract?.id ?? '',
    });
    setLocation({ label: location, value: location });
    setInitialEditorValue(description);
    setDescription(description);
  }, []);

  const fetchOffer = useCallback(async (id: string) => {
    const [fetchedOffer] = await fetch<Offer>(HttpMethod.GET, {
      path: `${OFFERS_API_PATH}/${id}`,
    });
    if (fetchedOffer.id) {
      handleSetOffer(fetchedOffer);
    }
  }, []);

  const handleCreateNewCompany = useCallback(async (name: string) => {
    const newCompany: Company = {
      name,
    };
    const company = await addUpdateCompany(newCompany);
    if (company?.id) {
      setCompany({
        label: company.name,
        value: company.id,
      });
      handleShowNewCompanyLogoModal();
    }
  }, []);

  const handleCreateNewContract = useCallback(async (name: string) => {
    const newContract: Contract = {
      name,
    };
    const contract = await addUpdateContract(newContract);
    if (contract?.id) {
      setContract({
        label: contract.name,
        value: contract.id,
      });
    }
  }, []);

  const handleShowNewCompanyLogoModal = useCallback(() => {
    setShowNewCompanyModal((isShowing) => !isShowing);
  }, []);

  useEffect(() => {
    handleChangeTinyMCEStyles();
  }, [theme]);

  useEffect(() => {
    id && fetchOffer(id);
  }, []);

  return (
    <div className={classes.offerEditorContainer}>
      <h2>Offer Editor</h2>
      <InfoBox variant="info">
        Here you can add or edit your current job offers. <br />
        The offer description allows you to create advanced templates using
        HTML. In the form all fields are required!
      </InfoBox>
      {(isLoading || isFetching) && (
        <LoadingSpinner message={isLoading ? 'Form loading' : ''} />
      )}
      <form onSubmit={handleSaveOffer}>
        <div className={classes.inputsBox}>
          <Input
            id="title"
            icon={<SvgIcon id="icon-search" color="#5964e0" />}
            onChange={handleTitleOnChange}
            label={
              <span>
                Title<span className={classes.required}>*</span>
              </span>
            }
            size="medium"
            classNames={classes.inputBox}
            placeholder="Title / position"
            errorText={titleError}
            hasError={!!titleError}
            isValidated={isValidated.titleIsValidated}
            value={title}
          />
          <label
            htmlFor="react-select-location-autocomplete-input"
            className={classes.locationLabel}
          >
            {locationIsValidated && (
              <ValidationIcon
                id="location-select"
                hasError={!!locationError}
                errorText={locationError}
                classNames={classes.validationIcon}
              />
            )}
            <p>
              Location<span className={classes.required}>*</span>
            </p>
            <GoogleLocationSelect
              value={location}
              id="location-select"
              classNames={`${classes.locationSelect} ${
                locationIsValidated &&
                (locationError ? classes.error : classes.valid)
              }`}
              onChange={handleLocationOnChange}
              instanceId="location-autocomplete"
            />
          </label>
          <label
            htmlFor="react-select-contract-input"
            className={classes.contractLabel}
          >
            {contractIsValidated && (
              <ValidationIcon
                id="wortkime-select"
                hasError={!!contractError}
                errorText={contractError}
                classNames={classes.validationIcon}
              />
            )}
            <p>
              Contract<span className={classes.required}>*</span>
            </p>
            <CustomReactSelect
              id="contract-select"
              instanceId="contract"
              icon={<SvgIcon id="icon-contract" color="#5964e0" />}
              options={contractSelectOptions}
              classNames={`${classes.contractSelect} ${
                contractIsValidated &&
                (contractError ? classes.error : classes.valid)
              }`}
              placeholder="Contract"
              onChange={handleContractOnChange}
              onCreateOption={handleCreateNewContract}
              value={contract}
              isClearable={true}
            />
          </label>
          <label
            htmlFor="react-select-company-input"
            className={classes.companyLabel}
          >
            <p>
              Company<span className={classes.required}>*</span>
            </p>
            {companyIsValidated && (
              <ValidationIcon
                id="company-select"
                hasError={!!companyError}
                errorText={companyError}
                classNames={classes.validationIcon}
              />
            )}
            <CustomReactSelect
              id="company-select"
              instanceId="company"
              icon={<SvgIcon id="icon-company" color="#5964e0" />}
              onChange={handleCompanyOnChange}
              onCreateOption={handleCreateNewCompany}
              placeholder="Company"
              options={companySelectOptions}
              classNames={`${classes.companySelect} ${
                companyIsValidated &&
                (companyError ? classes.error : classes.valid)
              }`}
              value={company}
              isClearable={true}
              isDisabled={!!id}
            />
          </label>
        </div>

        <label htmlFor="offer-description" className={classes.tinymceLabel}>
          Description<span className={classes.required}>*</span>
          <div
            className={`${classes.tinymceEditorBox} ${
              descriptionIsValidated &&
              (errors.descriptionError ? classes.error : classes.valid)
            }`}
          >
            {descriptionIsValidated && (
              <ValidationIcon
                id="wortkime-select"
                hasError={!!descriptionError}
                errorText={descriptionError}
                classNames={classes.validationIcon}
              />
            )}
            {/* @ts-ignore*/}
            <Editor
              key={`editor-${editorElementKey}`}
              id="offer-description"
              apiKey={import.meta.env.VITE_TINYMCE_EDITOR_API_KEY}
              // @ts-ignore
              onInit={handleOnInitTinyMCE}
              value={description}
              initialValue={initialEditorValue}
              onEditorChange={handleDescriptionOnChange}
              init={{
                height: 500,
                menubar: true,
                plugins:
                  'preview code searchreplace autolink directionality visualblocks visualchars fullscreen image link media  codesample table charmap pagebreak nonbreaking anchor insertdatetime advlist lists',
                toolbar:
                  'formatselect | bold italic underline strikethrough | forecolor backcolor blockquote | link image media | alignleft aligncenter alignright alignjustify | numlist bullist outdent indent | removeformat | code',
                image_advtab: true,
                skin: theme === 'dark' ? 'oxide-dark' : 'oxide',
                content_css: theme === 'dark' ? 'dark' : '',
              }}
            />
          </div>
        </label>
        <div className={classes.actionsBox}>
          <Button variant="secondary" onClick={history.back}>
            Cancel
          </Button>
          <Button variant="primary" disabled={isFetching} type="submit">
            Save
          </Button>
        </div>
      </form>
      <UploadCompanyLogoModal
        isShowing={showNewCompanyModal}
        company={company ?? undefined}
        onShow={handleShowNewCompanyLogoModal}
      />
    </div>
  );
};

export default OfferEditor;
