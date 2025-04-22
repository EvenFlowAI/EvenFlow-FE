import React, { useEffect, useRef, useState } from 'react';
import { ActionButtons } from '../../../ActionButtons/ActionButtons';
import { StepWrapper } from '../../../../../components/styled/StepWrapper';
import { TextField } from '../../../../../components/styled/EndUserInputs';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../../store/rootReducer';
import {
  checkCarIsValid,
  clearAppointmentSteps,
  setAdditionalServicesChosen,
  setCommentsForCategories,
} from '../../../../../store/reducers/appointmentFrameReducer/actions';
import { TArgCallback, TScreen } from '../../../../../types/types';
import {
  selectAppointment,
  selectServiceValetAppointment,
} from '../../../../../store/reducers/appointment/actions';
import AskAddService from '../../../../../components/modals/booking/AskAddService/AskAddService';
import { useTranslation } from 'react-i18next';
import AddCommentPrompt from './AddCommentPrompt/AddCommentPrompt';
import { checkPodChanged } from '../../../../../store/reducers/appointments/actions';
import { useModal } from '../../../../../hooks/useModal/useModal';
import { useException } from '../../../../../hooks/useException/useException';
import { mergeArrayById } from '../../../../../utils/utils';
import styled from '@mui/material/styles/styled';

const MAX_COUNT_WORDS_CAPACITY = 250;

export const RemainingCharactersWrapper = styled('div')(() => ({
  color: '#202021',
  fontFamily: 'Proxima Nova',
  fontSize: '14px',
  fontStyle: 'normal',
  fontWeight: 400,
  alignSelf: 'flex-start',
}));

type TProps = {
  handleSetScreen: TArgCallback<TScreen>;
  nextDisabled?: boolean;
  nextLabel?: string;
  loading?: boolean;
  onAddServices: () => void;
  isManagingFlow?: boolean;
};

export const AppointmentComment: React.FC<TProps> = ({
  isManagingFlow,
  handleSetScreen,
  onAddServices,
}) => {
  const { subService, service, serviceCategories } = useSelector(
    (state: RootState) => state.appointmentFrame
  );
  const { scProfile } = useSelector((state: RootState) => state.appointment);
  const dispatch = useDispatch();
  const { isOpen, onClose, onOpen } = useModal();
  const { isOpen: isErrorOpen, onClose: onErrorClose, onOpen: onErrorOpen } = useModal();
  const { t } = useTranslation();
  const showError = useException();
  const ref = useRef<HTMLDivElement | null>(null);
  const [comment, setComment] = useState('');

  useEffect(() => {
    if (ref) ref.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [ref]);

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = ({ target: { value } }) => {
    if (value.length <= MAX_COUNT_WORDS_CAPACITY) {
      if (/\s{2,}$/.test(value)) {
        return;
      }
      setComment(value);
    }
  };

  const handleYes = () => {
    dispatch(
      setCommentsForCategories({
        id: (subService?.id ? subService?.id : service?.id) ?? 0,
        comment,
      })
    );
    onClose();
    dispatch(setAdditionalServicesChosen(true));
    onAddServices();
  };

  const handleNo = () => {
    dispatch(
      setCommentsForCategories({
        id: (subService?.id ? subService?.id : service?.id) ?? 0,
        comment,
      })
    );
    onClose();
    handleSetScreen('maintenanceDetails');
  };

  const onCarIsValid = () => scProfile && dispatch(checkPodChanged(scProfile.id, showError));

  const onCarIsInvalid = () => handleSetScreen('maintenanceDetails');

  const onSubmit = () => {
    const isCommentRequired = subService
      ? subService?.isCommentRequired
      : service?.isCommentRequired;
    if (!comment?.trim().length) {
      if (isCommentRequired) {
        return onErrorOpen();
      } else {
        dispatch(
          setCommentsForCategories({
            id: (subService?.id ? subService?.id : service?.id) ?? 0,
            comment,
          })
        );
      }
    }
    if (isManagingFlow) {
      dispatch(
        setCommentsForCategories({
          id: (subService?.id ? subService?.id : service?.id) ?? 0,
          comment,
        })
      );
      dispatch(checkCarIsValid(onCarIsValid, onCarIsInvalid));
    } else {
      onOpen();
    }
  };

  const clearData = () => {
    dispatch(selectAppointment(null));
    dispatch(selectServiceValetAppointment(null));
    dispatch(clearAppointmentSteps('serviceNeeds'));
  };

  const handleBack = () => {
    clearData();
    handleSetScreen('serviceNeeds');
  };

  useEffect(() => {
    const mergedArray = mergeArrayById(serviceCategories);

    setComment(
      mergedArray.find(el => el.id === (subService?.id ? subService?.id : service?.id))?.comment ??
        ''
    );
  }, [serviceCategories, service?.id, subService?.id]);

  return (
    <StepWrapper>
      <TextField
        fullWidth
        multiline
        onChange={handleChange}
        value={comment}
        rows={4}
        variant="standard"
        InputProps={{ disableUnderline: true }}
        required={scProfile?.isCommentRequired}
        placeholder={t('Enter comments')}
      />
      <RemainingCharactersWrapper>
        {comment?.length ?? 0} / {MAX_COUNT_WORDS_CAPACITY} characters
      </RemainingCharactersWrapper>
      <ActionButtons onBack={handleBack} onNext={onSubmit} nextLabel={t('Next')} />
      <AskAddService onSave={handleYes} onClose={handleNo} open={isOpen} />
      <AddCommentPrompt open={isErrorOpen} onClose={onErrorClose} />
    </StepWrapper>
  );
};
