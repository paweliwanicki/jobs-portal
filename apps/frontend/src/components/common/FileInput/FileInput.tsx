import { ChangeEvent, ReactNode, useCallback, useState } from 'react';
import classes from './FileInput.module.scss';
import SvgIcon from '../SvgIcon/SvgIcon';
import { useTheme } from '../../../providers/ThemeProvider';

type FileInputProps = {
  id?: string;
  label?: ReactNode;
  acceptTypes: string;
  placeholder?: string;
  setSelectedFile?: (file?: File) => void;
};

const FileInput = ({
  id,
  label,
  acceptTypes,
  placeholder,
  setSelectedFile,
}: FileInputProps) => {
  const { theme } = useTheme();
  const [file, setFile] = useState<File>();

  const handleFileChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files) {
        setFile(files[0]);
        setSelectedFile && setSelectedFile(files[0]);
      }
    },
    [file]
  );

  const clearSelectedFile = useCallback(() => {
    setFile(undefined);
    setSelectedFile && setSelectedFile(undefined);
  }, [file]);

  return (
    <div className={classes.fileInputBox}>
      <label className={classes.inputLabel} htmlFor={id}>
        <div className={classes.labelText}>{label}</div>
        <div className={classes.inputBox}>
          <p>{placeholder ? placeholder : 'Click to upload file'}</p>
          <input
            type="file"
            onChange={handleFileChange}
            accept={acceptTypes}
            name="file"
          />
          {file && (
            <div className={classes.fileInfoBox}>
              <span>{file.name}</span>
              {/* {file.name} */}
              <SvgIcon
                id={`icon-close${theme !== 'dark' ? '-dark' : ''}`}
                width={26}
                height={26}
                onClick={clearSelectedFile}
              />
            </div>
          )}
        </div>
      </label>
    </div>
  );
};

export default FileInput;
