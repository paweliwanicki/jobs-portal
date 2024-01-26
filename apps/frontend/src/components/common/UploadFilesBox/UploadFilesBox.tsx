import { ReactNode } from 'react';
import FileInput from '../FileInput/FileInput';
import classes from './UploadFilesBox.module.scss';

type UploadFilesBoxProps = {
  acceptTypes: string;
  image?: File;
  label?: ReactNode;
  placeholder?: string;
  classNames?: string;
  onSelect: () => void;
};

const UploadFilesBox = ({
  image,
  acceptTypes,
  placeholder,
  label = '',
  classNames = '',
  onSelect,
}: UploadFilesBoxProps) => {
  return (
    <div className={`${classes.uploadFilesBox} ${classNames}`}>
      <img
        src={image ? URL.createObjectURL(image) : undefined}
        className={classes.filePreview}
      />
      <FileInput
        label={label}
        setSelectedFile={onSelect}
        acceptTypes={acceptTypes}
        placeholder={placeholder}
      />
    </div>
  );
};

export default UploadFilesBox;
