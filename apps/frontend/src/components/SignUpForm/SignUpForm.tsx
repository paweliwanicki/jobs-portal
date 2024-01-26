import {
  ChangeEvent,
  ReactNode,
  useCallback,
  useState,
  useEffect,
  FormEvent,
} from 'react';
import Input from '../common/Input/Input';
import classes from './SignUpForm.module.scss';
import Button from '../common/Button/Button';
import { Tooltip } from 'react-tooltip';
import Checkbox from '../common/Checkbox/Checkbox';
import Modal from '../common/Modal/Modal';
import SvgIcon from '../common/SvgIcon/SvgIcon';
import { useSignForm } from '../../hooks/useSignForm';
import { useMotionAnimate } from 'motion-hooks';
import PasswordInput from '../common/PasswordInput/PasswordInput';

// move terms and privacy to db, fetch them on demand and useMemo
const TERMS_CONDITION: ReactNode = (
  <>
    <h3>Terms and Conditions</h3>
    <p>Score one for you for reading the terms and conditions &#128077; </p>
  </>
);

const PRIVACY_STATEMENT: ReactNode = (
  <>
    <h3>Privacy Statement</h3>
    <p>
      All usernames and passwords are stored and used only for app demo
      purposes. &#128373;
    </p>
  </>
);

type SignUpFormProps = {
  onSubmit: (
    username: string,
    password: string,
    confirmPassword: string
  ) => void;
};

const SignUpForm = ({ onSubmit }: SignUpFormProps) => {
  const { play } = useMotionAnimate(
    `.${classes.signUpForm}`,
    { opacity: 1 },
    {
      duration: 0.5,
      easing: 'linear',
    }
  );

  const { validateSignUpForm, clearValidationAndError, errors, isValidated } =
    useSignForm();

  const {
    usernameError,
    passwordError,
    confirmPasswordError,
    termsCheckError,
  } = errors;
  const {
    usernameIsValidated,
    passwordIsValidated,
    confirmPasswordIsValidated,
  } = isValidated;

  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [termsChecked, setTermsChecked] = useState<boolean>(false);

  const [showModal, setShowModal] = useState<boolean>(false);
  const [modalContent, setModalContent] = useState<ReactNode>();

  const handleUsernameOnChange = useCallback(
    (username: string) => {
      usernameIsValidated && clearValidationAndError('USERNAME');
      setUsername(username);
    },
    [usernameIsValidated, clearValidationAndError]
  );

  const handlePasswordOnChange = useCallback(
    (password: string) => {
      passwordIsValidated && clearValidationAndError('PASSWORD');
      setPassword(password);
    },
    [passwordIsValidated, clearValidationAndError]
  );

  const handleConfirmPasswordOnChange = useCallback(
    (confirmPassword: string) => {
      confirmPasswordIsValidated && clearValidationAndError('CONFIRM_PASSWORD');
      setConfirmPassword(confirmPassword);
    },
    [confirmPasswordIsValidated, clearValidationAndError]
  );

  const handleOnCheckboxChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      termsCheckError && clearValidationAndError('TERMS');
      setTermsChecked(e.target.checked);
    },
    [termsCheckError, clearValidationAndError]
  );

  const handleFormOnSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const isValid = validateSignUpForm(
        username,
        password,
        confirmPassword,
        termsChecked
      );

      if (!isValid) {
        return;
      }

      onSubmit(username, password, confirmPassword);
    },
    [
      username,
      password,
      confirmPassword,
      termsChecked,
      validateSignUpForm,
      onSubmit,
    ]
  );

  const showTermsAndConditions = useCallback(() => {
    setModalContent(TERMS_CONDITION);
    setShowModal(true);
  }, []);

  const showPrivacyStatement = useCallback(() => {
    setModalContent(PRIVACY_STATEMENT);
    setShowModal(true);
  }, []);

  const closeModal = useCallback(() => {
    setModalContent(undefined);
    setShowModal(false);
  }, []);

  useEffect(() => {
    void play();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={classes.signUpForm}>
      <h2>Sign up</h2>
      <h4>
        Don't have an account yet? Create a new account and enjoy browsing the
        many fake jobs &#128526;
      </h4>
      <form noValidate onSubmit={handleFormOnSubmit}>
        <Input
          type="text"
          id="username"
          label={
            <>
              <SvgIcon id="icon-info" elementId="username-info-icon" />
              <span>
                Username<span className={classes.required}>*</span>
              </span>
              <Tooltip
                anchorSelect="#username-info-icon"
                place="bottom-start"
                variant="info"
                content="Username must be alphanumeric, so it requires at least one letter and at least one number.  The total length should be between 6 and 12 characters."
              />
            </>
          }
          errorText={usernameError}
          hasError={!!usernameError}
          onChange={handleUsernameOnChange}
          placeholder="Your new username"
          isValidated={usernameIsValidated}
          autoComplete="on"
        />

        <PasswordInput
          id="password"
          errorText={passwordError}
          hasError={!!passwordError}
          onChange={handlePasswordOnChange}
          placeholder="Your password"
          isValidated={passwordIsValidated}
        />

        <PasswordInput
          id="confirm-password"
          errorText={confirmPasswordError}
          hasError={!!confirmPasswordError}
          onChange={handleConfirmPasswordOnChange}
          placeholder="Confirm your password"
          isValidated={confirmPasswordIsValidated}
          label={
            <>
              <SvgIcon id="icon-info" elementId="confirm-password-info-icon" />
              <span>
                Confirm password<span className={classes.required}>*</span>
              </span>
              <Tooltip
                anchorSelect="#confirm-password-info-icon"
                place="bottom-start"
                variant="info"
                content="Password and confirmation password must be equal"
              />
            </>
          }
        />

        <div className={classes.termsBox}>
          <Checkbox
            onChange={handleOnCheckboxChange}
            isChecked={termsChecked}
            hasError={!!termsCheckError}
            id="checkbox-terms"
            size="medium"
            errorText="You must agree conditions and terms!"
            errorTooltip
          />
          <p>
            I agree to the
            <span onClick={showTermsAndConditions}> Terms and Conditions </span>
            and
            <span onClick={showPrivacyStatement}> Privacy Statement</span>
            <span className={classes.required}>*</span>
          </p>
        </div>

        <Button type="submit" variant="secondary">
          Sign up
        </Button>
      </form>
      <Modal isOpen={showModal} onClose={closeModal}>
        {modalContent}
      </Modal>
    </div>
  );
};

export default SignUpForm;
