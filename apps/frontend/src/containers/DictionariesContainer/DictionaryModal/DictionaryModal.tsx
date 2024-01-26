import {
  useCallback,
  useMemo,
  useState,
  useEffect,
  KeyboardEvent,
} from 'react';
import classes from './DictionaryModal.module.scss';
import 'react-tabs/style/react-tabs.css';
import Modal from '../../../components/common/Modal/Modal';
import Input from '../../../components/common/Input/Input';
import Button from '../../../components/common/Button/Button';
import {
  DictionaryActions,
  DictionaryTable,
  DictionaryType,
} from '../DictionariesContainer';
import { useMotionAnimate } from 'motion-hooks';
import { LoadingSpinner } from '../../../components/common/LoadingSpinner/LoadingSpinner';

type DictionaryModal = {
  action: DictionaryActions;
  isShowing: boolean;
  isFetching?: boolean;
  selectedItem?: DictionaryType;
  selectedTable?: DictionaryTable;
  onDelete?: () => void;
  onEdit?: (name: string) => void;
  onClose?: () => void;
};

export const DictionariesModal = ({
  action,
  selectedItem,
  selectedTable,
  isShowing,
  isFetching,
  onDelete,
  onEdit,
  onClose,
}: DictionaryModal) => {
  const [editModalValue, setEditModalValue] = useState<string>(
    selectedItem?.name ?? ''
  );

  const { play: closeAnimation } = useMotionAnimate(
    `.${classes.dictionaryModal}`,
    { top: '150%' },
    {
      duration: 0.5,
      easing: 'linear',
    }
  );

  const handleSetEditModalValue = useCallback(
    (value: string) => {
      setEditModalValue(value);
    },
    [selectedItem, editModalValue]
  );

  const handleSaveDeleteModal = useCallback(() => {
    onDelete && onDelete();
    closeAnimation().then(() => {
      onClose && onClose();
    });
  }, [selectedItem]);

  const handleSaveEditModal = useCallback(() => {
    onEdit && onEdit(editModalValue);
    closeAnimation().then(() => {
      onClose && onClose();
    });
  }, [selectedItem, editModalValue]);

  const handleCloseModal = useCallback(() => {
    setEditModalValue('');
    closeAnimation().then(() => {
      onClose && onClose();
    });
  }, [editModalValue, isShowing, onClose]);

  useEffect(() => {
    setEditModalValue(selectedItem?.name ?? '');
  }, [selectedItem, isShowing]);

  const deleteModalContent = useMemo(
    () => (
      <>
        <h4>
          Do you really want to delete definition of
          <strong> {selectedItem?.name}</strong>?
        </h4>
        <div className={classes.modalBtnBox}>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSaveDeleteModal}>
            Delete
          </Button>
        </div>
      </>
    ),
    [selectedItem]
  );

  const handleEnterKey = ({ key }: KeyboardEvent<HTMLInputElement>) => {
    if (key === 'Enter') {
      handleSaveEditModal();
    }
  };

  const editModalContent = useMemo(
    () => (
      <>
        <Input
          type="text"
          size="small"
          id="name"
          label={
            <span>
              Name<span className={classes.required}>*</span>
            </span>
          }
          // errorText={usernameError}
          // hasError={!!usernameError}
          onChange={handleSetEditModalValue}
          placeholder="Name"
          // isValidated={usernameIsValidated}
          autoComplete="off"
          value={editModalValue}
          onKeyDown={handleEnterKey}
        />

        <div className={classes.modalBtnBox}>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSaveEditModal}>
            Save
          </Button>
        </div>
      </>
    ),
    [editModalValue, selectedItem]
  );

  return (
    <Modal
      isOpen={isShowing}
      onClose={handleCloseModal}
      classNames={classes.dictionaryModal}
      title={`${action} ${selectedTable}`}
    >
      {isFetching && <LoadingSpinner message="Please wait" />}
      {
        action === 'edit' ? editModalContent : deleteModalContent
        //change that to get fn
      }
    </Modal>
  );
};
