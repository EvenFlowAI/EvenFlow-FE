import React, { useEffect, useState } from 'react';
import { BaseModal, DialogContent, DialogTitle } from '../../BaseModal/BaseModal';
import { DialogProps } from '../../BaseModal/types';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { TextFieldWhite } from '../../../styled/EndUserInputs';
import { useException } from '../../../../hooks/useException/useException';
import { BfButtonsWrapper } from '../../../styled/BfButtonsWrapper';
import { LoadingButton } from '../../../buttons/LoadingButton/LoadingButton';
import { ISR } from '../../../../store/reducers/appointment/types';
import { selectSRComment } from '../../../../store/reducers/appointment/actions';
import { setFrameDescription } from '../../../../store/reducers/appointmentFrameReducer/actions';
import { CharactersWrapper } from './styles';
const MAX_COUNT_WORDS_CAPACITY = 250;
const CommentModal: React.FC<
  DialogProps & { selectedRequest: ISR | null; currentComment: string }
> = ({ open, onClose, selectedRequest, currentComment }) => {
  const [text, setText] = useState<string>('');
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const showError = useException();

  useEffect(() => {
    setText(currentComment);
  }, [currentComment]);

  const onCancel = () => {
    setText(currentComment);
    onClose();
  };

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = ({ target: { value } }) => {
    if (value.length > 250) {
      return;
    }
    setText(value);
  };

  const onSave = () => {
    if (!text.length) {
      showError(t('Appointment Comment must not be empty'));
    } else if (selectedRequest?.code === 'specialCategory') {
      dispatch(setFrameDescription(text));
      onClose();
    } else if (selectedRequest?.id) {
      dispatch(selectSRComment({ comments: { [selectedRequest.id]: text } }));
      onClose();
    }
  };

  return (
    <BaseModal open={open} onClose={onCancel} width={700}>
      <DialogTitle onClose={onCancel} style={{ fontSize: 24 }}>
        {selectedRequest?.description} Comment
      </DialogTitle>
      <DialogContent>
        <TextFieldWhite
          fullWidth
          multiline
          onChange={handleChange}
          value={text}
          rows={7}
          variant="standard"
          InputProps={{ disableUnderline: true }}
          placeholder={'Your comment'}
        />
        <CharactersWrapper>
          {text?.length ?? 0} / {MAX_COUNT_WORDS_CAPACITY} characters
        </CharactersWrapper>
      </DialogContent>

      <BfButtonsWrapper>
        <LoadingButton
          style={{ width: '144px' }}
          loading={false}
          onClick={onCancel}
          variant="outlined"
          color="primary"
        >
          {t('Cancel')}
        </LoadingButton>
        <LoadingButton
          style={{ width: '144px' }}
          loading={false}
          onClick={onSave}
          color="primary"
          variant="contained"
        >
          {t('Save')}
        </LoadingButton>
      </BfButtonsWrapper>
    </BaseModal>
  );
};

export default CommentModal;
