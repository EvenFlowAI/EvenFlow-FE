import React, { Dispatch, SetStateAction } from 'react';
import { ButtonsWrapper, Definition, Wrapper } from './styles';
import { ReactComponent as Checked } from '../../../../assets/img/checkmark.svg';
import { ReactComponent as Unchecked } from '../../../../assets/img/radiobutton_unchecked.svg';
import { Button } from '@mui/material';
import { useModal } from '../../../../hooks/useModal/useModal';
import { ServiceBookModal } from '../../ServiceBookModal/ServiceBookModal';
import { TCallback } from '../../../../types/types';

type TProps = {
  isEdit: boolean;
  setEdit: Dispatch<SetStateAction<boolean>>;
  onSave: TCallback;
  onCancel: TCallback;
  isActive: boolean;
};

const ButtonsRow: React.FC<TProps> = ({ isEdit, setEdit, onSave, onCancel, isActive }) => {
  const { isOpen, onClose, onOpen } = useModal();
  return (
    <Wrapper>
      <Definition>
        <div className="title">Service Book Definition:</div>
        <Checked className="checkmark" />
        <div className="checkmarkLabel">Included</div>
        <Unchecked className="checkmark" />
        <div className="checkmarkLabel">Not Included</div>
      </Definition>
      <ButtonsWrapper>
        {isEdit ? (
          <>
            <Button variant="text" onClick={onCancel} color="secondary" style={{ marginRight: 0 }}>
              Cancel
            </Button>
            <Button variant="text" onClick={onSave} style={{ marginRight: 40 }}>
              Save
            </Button>
          </>
        ) : (
          <Button variant="text" onClick={() => setEdit(true)}>
            Edit Order
          </Button>
        )}
        <Button variant="contained" onClick={onOpen}>
          Create Service Book
        </Button>
      </ButtonsWrapper>
      <ServiceBookModal
        open={isOpen}
        onClose={onClose}
        editingItemId={undefined}
        isActive={isActive}
      />
    </Wrapper>
  );
};

export default ButtonsRow;
