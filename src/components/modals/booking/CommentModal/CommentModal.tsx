import React, { useEffect, useState } from 'react';
import { BaseModal, DialogContent, DialogTitle } from '../../BaseModal/BaseModal';
import { DialogProps } from '../../BaseModal/types';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { TextFieldWhite } from '../../../styled/EndUserInputs';
import { useException } from '../../../../hooks/useException/useException';
import { BfButtonsWrapper } from '../../../styled/BfButtonsWrapper';
import { LoadingButton } from '../../../buttons/LoadingButton/LoadingButton';
import { ISR } from '../../../../store/reducers/appointment/types';
import { selectSRComment } from '../../../../store/reducers/appointment/actions';
import { CharactersWrapper } from './styles';
import { setCommentsForCategories } from '../../../../store/reducers/appointmentFrameReducer/actions';
import { RootState } from '../../../../store/rootReducer';
import { SystemIntegrationType } from '../../../../store/reducers/serviceCenters/types';
const MAX_COUNT_WORDS_CAPACITY = 250;

const filterAscii = (value: string): string =>
  value
    .split('')
    .filter(character => character.charCodeAt(0) <= 127)
    .join('');

const CommentModal: React.FC<
  DialogProps & { selectedRequest: ISR | null; currentComment: string }
> = ({ open, onClose, selectedRequest, currentComment }) => {
  const [text, setText] = useState<string>('');
  const [selectedRequestState, setSelectedRequestState] = useState(selectedRequest);
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { scProfile } = useSelector((state: RootState) => state.appointment);
  const isFortellisIntegration =
    (scProfile as { integration?: number } | undefined)?.integration ===
    SystemIntegrationType.Fortellis;
  const showError = useException();

  useEffect(() => {
    setText(currentComment);
  }, [currentComment, open]);

  useEffect(() => {
    if (selectedRequest?.description?.length) {
      setSelectedRequestState(selectedRequest);
    }
  }, [selectedRequest]);

  const onCancel = () => {
    onClose();
  };

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = ({ target: { value } }) => {
    // ASCII-only validation must apply only for Fortellis integration.
    const nextValue = isFortellisIntegration ? filterAscii(value) : value;

    if (nextValue.length > MAX_COUNT_WORDS_CAPACITY) {
      return;
    }
    if (/\s{2,}$/.test(nextValue)) {
      return;
    }
    setText(nextValue);
  };

  const onSave = () => {
    if (
      !text.length &&
      selectedRequest?.code === 'specialCategory' &&
      selectedRequest?.isCommentRequired
    ) {
      showError(t('Appointment Comment must not be empty'));
    } else if (selectedRequest?.code === 'specialCategory') {
      onClose();
      dispatch(setCommentsForCategories({ id: selectedRequest?.id ?? 0, comment: text }));
    } else if (selectedRequest?.id) {
      onClose();
      dispatch(selectSRComment({ comments: { [selectedRequest.id]: text } }));
    }
  };

  return (
    <BaseModal open={open} onClose={onCancel} width={700}>
      <DialogTitle onClose={onCancel} style={{ fontSize: 24 }}>
        {selectedRequestState?.description} Comment
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
          loading={false}
          onClick={onCancel}
          variant="outlined"
          color="primary"
          sx={{
            width: '100%',
            '@media (min-width: 900px)': {
              width: '144px',
            },
          }}
        >
          {t('Cancel')}
        </LoadingButton>
        <LoadingButton
          loading={false}
          onClick={onSave}
          color="primary"
          variant="contained"
          sx={{
            width: '100%',
            '@media (min-width: 900px)': {
              width: '144px',
            },
          }}
        >
          {t('Save')}
        </LoadingButton>
      </BfButtonsWrapper>
    </BaseModal>
  );
};

export default CommentModal;
