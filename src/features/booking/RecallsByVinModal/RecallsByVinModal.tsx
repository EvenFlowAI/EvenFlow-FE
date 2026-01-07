import React, { useEffect, useState } from 'react';
import {
  BaseModal,
  DialogContent,
  DialogTitle,
} from '../../../components/modals/BaseModal/BaseModal';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store/rootReducer';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { loadRecallsByVin } from '../../../store/reducers/recall/actions';
import { decodeSCID } from '../../../utils/utils';
import { DialogProps } from '../../../components/modals/BaseModal/types';
import { Loading } from '../../../components/wrappers/Loading/Loading';
import { Button, useMediaQuery, useTheme } from '@mui/material';
import {
  checkCarIsValid,
  setAdditionalServicesChosen,
  setSelectedRecalls,
} from '../../../store/reducers/appointmentFrameReducer/actions';
import AskAddService from '../../../components/modals/booking/AskAddService/AskAddService';
import { checkPodChanged } from '../../../store/reducers/appointments/actions';
import { useStyles } from './styles';
import { IRecallByVin } from '../../../types/types';
import { useModal } from '../../../hooks/useModal/useModal';
import { useException } from '../../../hooks/useException/useException';
import { BfButtonsWrapper } from '../../../components/styled/BfButtonsWrapper';
import Recall from './Recall/Recall';

type TRecallsByVinProps = DialogProps & {
  handleNext: () => void;
  onDeclineRecalls: () => void;
  handleAddServices: () => void;
  isRecallsCategorySelected: boolean;
};

const RecallsByVinModal: React.FC<
  React.PropsWithChildren<React.PropsWithChildren<TRecallsByVinProps>>
> = ({
  open,
  onClose,
  handleNext,
  onDeclineRecalls,
  handleAddServices,
  isRecallsCategorySelected,
}) => {
  const { recallsByVin, isLoading } = useSelector((state: RootState) => state.recalls);
  const { selectedVehicle, isUsualFlowNeeded } = useSelector(
    (state: RootState) => state.appointmentFrame
  );
  const { customerLoadedData } = useSelector((state: RootState) => state.appointment);
  const [recalls, setRecalls] = useState<IRecallByVin[]>([]);
  const dispatch = useDispatch();
  const { id } = useParams<{ id: string }>();
  const showError = useException();
  const { t } = useTranslation();
  const { classes } = useStyles();
  const {
    isOpen: isAddServiceOpen,
    onClose: onAddServiceClose,
    onOpen: onAddServiceOpen,
  } = useModal();
  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    if (selectedVehicle) {
      const { make, model, year, vin } = selectedVehicle;
      if (vin?.length && open && make && model && year) {
        dispatch(loadRecallsByVin(decodeSCID(id), vin, make, model, year));
      }
    }
  }, [selectedVehicle, open]);

  useEffect(() => {
    if (open) setRecalls(recallsByVin.filter(el => el.isRemedyAvailable));
  }, [recallsByVin, open]);

  const onAddService = (item: IRecallByVin) => {
    const data = recalls.find(el =>
      item.campaignNumber
        ? el.campaignNumber === item.campaignNumber
        : item.oemProgram === el.oemProgram
    )
      ? recalls.filter(el =>
          item.campaignNumber
            ? el.campaignNumber !== item.campaignNumber
            : el.oemProgram !== item.oemProgram
        )
      : [...recalls, item];
    setRecalls(data);
  };

  const onDecline = () => {
    dispatch(setSelectedRecalls([]));
    setRecalls([]);
    onDeclineRecalls();
    onClose();
  };

  const handleYes = () => {
    dispatch(setAdditionalServicesChosen(true));
    onAddServiceClose();
    handleAddServices();
    onClose();
  };

  const handleNo = () => {
    onAddServiceClose();
    handleNext();
    onClose();
  };

  const onCarIsValid = () => dispatch(checkPodChanged(decodeSCID(id), showError));

  const onCarIsInvalid = () => {
    handleNext();
    onClose();
  };

  const handleSubmit = () => {
    dispatch(setSelectedRecalls(recalls));
    if (customerLoadedData?.isUpdating && !isUsualFlowNeeded) {
      dispatch(checkCarIsValid(onCarIsValid, onCarIsInvalid));
    } else {
      onAddServiceOpen();
    }
  };

  return (
    <BaseModal open={open} onClose={onClose} width={800}>
      <DialogTitle onClose={onClose} style={{ justifyContent: 'flex-start' }}></DialogTitle>
      {isLoading ? (
        <Loading />
      ) : (
        <DialogContent style={{ padding: isSm ? '10px 16px' : '10px 36px' }}>
          <div className={classes.mainTitle}>
            {recallsByVin.length} {t('Unrepaired')}{' '}
            {recallsByVin.length > 1 ? t('Recalls') : t('Recall')}
          </div>
          <div className={classes.vinData}>
            {t('associated with VIN')}: {selectedVehicle?.vin}
          </div>
          {recallsByVin.map((item, index) => {
            return (
              <Recall
                item={item}
                recalls={recalls}
                onAddService={onAddService}
                index={index}
                key={item.campaignNumber ?? item.oemProgram}
              />
            );
          })}
        </DialogContent>
      )}
      <BfButtonsWrapper style={{ padding: '10px 36px 25px' }}>
        <Button
          variant="outlined"
          onClick={onDecline}
          style={isSm ? { marginBottom: 0 } : {}}
          className={classes.button}
        >
          {t('Cancel')}
        </Button>
        <Button
          style={isSm ? { order: -1, marginBottom: 12 } : {}}
          variant="contained"
          onClick={handleSubmit}
          color="primary"
          disabled={!recalls.length && isRecallsCategorySelected}
          className={classes.button}
        >
          {t('Next')}
        </Button>
      </BfButtonsWrapper>
      <AskAddService onSave={handleYes} onClose={handleNo} open={isAddServiceOpen} />
    </BaseModal>
  );
};

export default RecallsByVinModal;
