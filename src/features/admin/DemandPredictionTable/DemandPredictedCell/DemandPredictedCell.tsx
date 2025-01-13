import React from 'react';
import {
  EPredictedDemandMethod,
  IDemandPrediction,
} from '../../../../store/reducers/demandManagement/types';
import { BigLabelRadioBtn, RadioGroupStyled, StyledTableCell } from '../styles';
import { Radio, useMediaQuery, useTheme } from '@mui/material';
import LabelLink from '../LabelLink/LabelLink';
import { ReactComponent as CheckIcon } from '../../../../assets/img/checkboxSmall.svg';
import { ReactComponent as RedCross } from '../../../../assets/img/redCross.svg';
import { useDispatch, useSelector } from 'react-redux';
import { useSCs } from '../../../../hooks/useSCs/useSCs';
import { RootState } from '../../../../store/rootReducer';
import { updateDemandManagementSettings } from '../../../../store/reducers/demandManagement/actions';
import { LinksWrapper } from './styles';
import { setAllocationTab } from '../../../../store/reducers/adminPanel/actions';
import { useHistory } from 'react-router-dom';
import { Routes } from '../../../../routes/constants';
import { setSelectedPod } from '../../../../store/reducers/pods/actions';

export const DemandPredictedCell: React.FC<{ item: IDemandPrediction }> = ({ item }) => {
  const { settings } = useSelector((state: RootState) => state.demandManagement);
  const { shortPodsList } = useSelector((state: RootState) => state.pods);
  const dispatch = useDispatch();
  const { selectedSC } = useSCs();
  const history = useHistory();
  const theme = useTheme();
  const isTablet = useMediaQuery(theme.breakpoints.down('xl'));

  const predictedMethod = item.predictedDemandMethodSettings?.find(
    el => el.method === EPredictedDemandMethod.Predicted
  );
  const probabilityMethod = item.predictedDemandMethodSettings?.find(
    el => el.method === EPredictedDemandMethod.Probability
  );

  const onPredictedClick = () => {
    const pod = shortPodsList.find(el => el.id === item.podId);
    dispatch(setSelectedPod(pod ?? null));
    dispatch(setAllocationTab('1'));
    history.push(Routes.CapacityManagement.AppointmentAllocation);
  };

  const onProbabilityClick = () => {};

  const handleChangePredictedDemandMethod =
    (id: number | undefined) => (e: React.ChangeEvent<HTMLInputElement>) => {
      if (selectedSC) {
        const itemToUpdate = id
          ? settings.find(el => el.podId === id)
          : settings.find(el => !el.podId);
        if (itemToUpdate) {
          const updated = {
            ...itemToUpdate,
            predictedDemandMethod: +e.target.value as EPredictedDemandMethod,
          };
          dispatch(updateDemandManagementSettings(updated));
        }
      }
    };

  return (
    <StyledTableCell key="predictedDemandMethod" align="left" width={isTablet ? 280 : 300}>
      <span style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: isTablet ? 16 : 24 }}>
        <RadioGroupStyled
          value={item.predictedDemandMethod}
          onChange={handleChangePredictedDemandMethod(item.podId)}
          aria-labelledby="demo-controlled-radio-buttons-group"
          name="controlled-radio-buttons-group"
        >
          <BigLabelRadioBtn
            value={EPredictedDemandMethod.Predicted}
            control={<Radio color="primary" size="small" />}
            label="Predicted"
          />
          <BigLabelRadioBtn
            value={EPredictedDemandMethod.Probability}
            control={<Radio color="primary" size="small" />}
            label="Probability"
          />
        </RadioGroupStyled>
        <LinksWrapper>
          <LabelLink
            subText={predictedMethod?.isConfigured ? 'Configured' : 'Not Configured'}
            icon={predictedMethod?.isConfigured ? <CheckIcon /> : <RedCross />}
            color={predictedMethod?.isConfigured ? '#7898FF' : '#C71062'}
            onClick={onPredictedClick}
          />
          <LabelLink
            subText={probabilityMethod?.isConfigured ? 'Configured' : 'Not Configured'}
            color={probabilityMethod?.isConfigured ? '#7898FF' : '#C71062'}
            icon={probabilityMethod?.isConfigured ? <CheckIcon /> : <RedCross />}
            onClick={onProbabilityClick}
          />
        </LinksWrapper>
      </span>
    </StyledTableCell>
  );
};
