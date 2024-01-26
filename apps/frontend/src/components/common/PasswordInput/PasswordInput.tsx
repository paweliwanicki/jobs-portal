import Input, { InputProps } from '../Input/Input';
import { useCallback, useState } from 'react';
import SvgIcon from '../SvgIcon/SvgIcon';
import { Tooltip } from 'react-tooltip';
import classes from './PasswordInput.module.scss';

type InputType = 'text' | 'password';

const PasswordInput = (props: InputProps) => {
  const [inputType, setInputType] = useState<InputType>('password');

  const handleShowPassword = useCallback(() => {
    setInputType('text');
  }, []);
  const handleHidePassword = useCallback(() => {
    setInputType('password');
  }, []);

  return (
    <Input
      type={inputType}
      label={
        props.label ? (
          props.label
        ) : (
          <>
            <SvgIcon
              id="icon-info"
              elementId={`password-info-icon-${props.id}`}
              width={18}
              height={18}
              classNames={classes.passwordHelpIcon}
            />
            <Tooltip
              anchorSelect={`#password-info-icon-${props.id}`}
              place="bottom-start"
              variant="info"
              content="Password should contain at least one uppercase and lowercase letter, one number, one special character, and a total length of at least 8 characters."
              className={classes.passwordHelpTooltip}
            />
            <span>
              Password<span className={classes.required}>*</span>
            </span>
          </>
        )
      }
      {...props}
    >
      <SvgIcon
        id={inputType === 'text' ? 'icon-eye' : 'icon-eye-crossed'}
        elementId={`show-password-icon-${props.id}`}
        width={24}
        height={24}
        onMouseDown={handleShowPassword}
        onMouseUp={handleHidePassword}
      />
      <Tooltip
        anchorSelect={`#show-password-icon-${props.id}`}
        place="bottom-end"
        content="Show password"
        className={classes.showPasswordTooltip}
      />
    </Input>
  );
};

export default PasswordInput;
