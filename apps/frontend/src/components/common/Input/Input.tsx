import classes from './Input.module.scss';
import { ReactNode, useCallback, ChangeEvent, MutableRefObject } from 'react';
import { KeyboardEvent } from 'react';
import ValidationIcon from '../ValidationIcon/ValidationIcon';

type InputTypes = 'text' | 'number' | 'password' | 'email';
type InputSize = 'small' | 'medium' | 'large';

export type InputProps = {
  id: string;
  label?: ReactNode;
  type?: InputTypes;
  isValidated?: boolean;
  hasError?: boolean;
  autocomplete?: boolean;
  icon?: ReactNode;
  value?: string;
  errorText?: string;
  validText?: string;
  placeholder?: string;
  size?: InputSize;
  autoComplete?: string;
  children?: ReactNode;
  classNames?: string;
  inputRef?: MutableRefObject<HTMLInputElement | null>;
  onChange: (val: string) => void;
  onBlur?: (val: string) => void;
  onKeyDown?: (event: KeyboardEvent<HTMLInputElement>) => void;
};

const Input = ({
  id,
  label,
  isValidated,
  hasError,
  icon,
  value,
  errorText,
  validText,
  placeholder,
  autoComplete,
  children,
  inputRef,
  classNames = '',
  size = 'medium',
  type = 'text',
  onChange,
  onKeyDown,
}: InputProps) => {
  let validClassName = '';
  let inputBoxClassNames = `${classNames} ${classes.inputBox} ${classes[size]}`;

  const showValidationInfo =
    (errorText !== '' || validText !== '') && isValidated;
  if (showValidationInfo) {
    validClassName = !hasError ? classes.valid : classes.error;
    inputBoxClassNames = `${inputBoxClassNames} ${validClassName}`;
  }

  const handleInputOnChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      onChange(e.target.value);
    },
    [onChange]
  );

  return (
    <label className={classes.inputLabel} htmlFor={id}>
      {label && <div className={classes.labelText}>{label}</div>}
      <div className={inputBoxClassNames}>
        {icon && <span className={classes.icon}>{icon}</span>}
        <input
          id={id}
          type={type}
          name={id}
          value={value}
          onChange={handleInputOnChange}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          className={`${icon ? classes.withIcon : ''}`}
          autoComplete={autoComplete}
          ref={inputRef}
        />

        <div
          className={`${classes.iconsBox} 
          ${classes[type] ?? ''}`}
        >
          {children}
          {showValidationInfo && (
            <ValidationIcon
              id={id}
              hasError={hasError}
              errorText={errorText}
              validText={validText}
            />
          )}
        </div>
      </div>
    </label>
  );
};

export default Input;
