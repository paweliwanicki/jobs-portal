import SvgIcon from '../SvgIcon/SvgIcon';
import classes from './ValidationIcon.module.scss';
import { Tooltip } from 'react-tooltip';
import { useMotionAnimate } from 'motion-hooks';
import { useEffect } from 'react';

type ValidationIconProps = {
  id: string;
  hasError?: boolean;
  errorText?: string;
  validText?: string;
  classNames?: string;
};

const ValidationIcon = ({
  id,
  hasError,
  errorText,
  validText,
  classNames = '',
}: ValidationIconProps) => {
  const showValidationInfo = errorText !== '' || validText !== '';

  const validationIconAnimation = useMotionAnimate(
    `.${classes.validationIcon}`,
    { opacity: 1 },
    {
      duration: 0.5,
      easing: 'linear',
    }
  );

  useEffect(() => {
    if (showValidationInfo) {
      void validationIconAnimation.play();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={`${classes.validationIconBox} ${classNames}`}>
      <SvgIcon
        classNames={classes.validationIcon}
        id={hasError ? 'icon-error' : 'icon-valid'}
        elementId={`validation-icon-${id}`}
        color="#bb0909"
        hoverColor="#bb0909"
        width={24}
        height={24}
      />

      <Tooltip
        anchorSelect={`#validation-icon-${id}`}
        place="bottom-end"
        variant={hasError ? 'error' : 'success'}
        content={hasError ? errorText : validText}
        className={classes.tooltipError}
      />
    </div>
  );
};

export default ValidationIcon;
