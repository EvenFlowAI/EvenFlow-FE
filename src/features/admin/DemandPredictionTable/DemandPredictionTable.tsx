import React, { useEffect } from 'react';
import { DenseTableWithPadding } from '../../../components/styled/DemandTable';
import {
  Radio,
  Switch,
  TableBody,
  TableHead,
  TableRow,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  RadioBtn,
  RadioGroupStyled,
  StyledTableCell,
  SubCellGrey,
  SubCellWhite,
  SwitchWrapperGrey,
  SwitchWrapperWhite,
} from './styles';
import {
  EDemandPredictionType,
  ERequestDemandMethod,
} from '../../../store/reducers/demandManagement/types';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store/rootReducer';
import { useSCs } from '../../../hooks/useSCs/useSCs';
import {
  loadDemandManagementSettings,
  updateDemandManagementSettings,
} from '../../../store/reducers/demandManagement/actions';
import { DemandPredictedCell } from './DemandPredictedCell/DemandPredictedCell';
import { Loading } from '../../../components/wrappers/Loading/Loading';
import { loadPodsShort } from '../../../store/reducers/pods/actions';

const DemandPredictionTable = ({
  handleTabChange,
}: {
  handleTabChange: (e: React.ChangeEvent<{}> | null, tab: string) => void;
}) => {
  const { isLoading, settings } = useSelector((state: RootState) => state.demandManagement);
  const { selectedSC } = useSCs();
  const dispatch = useDispatch();
  const theme = useTheme();
  const isTablet = useMediaQuery(theme.breakpoints.down('xl'));

  useEffect(() => {
    if (selectedSC) {
      dispatch(loadDemandManagementSettings(selectedSC.id));
      dispatch(loadPodsShort(selectedSC.id));
    }
  }, [selectedSC]);

  const handleSwitch =
    (id: number | undefined, type: EDemandPredictionType, requestType: 'request' | 'prediction') =>
    async (e: any, value: boolean) => {
      const itemToUpdate = id
        ? settings.find(el => el.podId === id)
        : settings.find(el => !el.podId);
      if (itemToUpdate) {
        const settingToUpdate = itemToUpdate.demandTypeSettings.find(el => el.type === type);
        if (settingToUpdate) {
          const updated = {
            ...itemToUpdate,
            demandTypeSettings: itemToUpdate.demandTypeSettings
              .filter(el => el.type !== type)
              .concat({
                ...settingToUpdate,
                isRequestStatusOn:
                  requestType === 'request' ? value : settingToUpdate.isRequestStatusOn,
                isPredictedStatusOn:
                  requestType === 'prediction' ? value : settingToUpdate.isPredictedStatusOn,
              }),
          };
          dispatch(updateDemandManagementSettings(updated));
        }
      }
    };

  const handleChangeRequestDemandMethod =
    (id: number | undefined) => (e: React.ChangeEvent<HTMLInputElement>) => {
      if (selectedSC) {
        const itemToUpdate = id
          ? settings.find(el => el.podId === id)
          : settings.find(el => !el.podId);
        if (itemToUpdate) {
          const updated = {
            ...itemToUpdate,
            requestDemandMethod: +e.target.value as ERequestDemandMethod,
          };
          dispatch(updateDemandManagementSettings(updated));
        }
      }
    };
  return isLoading ? (
    <Loading />
  ) : (
    <DenseTableWithPadding>
      <TableHead>
        <TableRow>
          <StyledTableCell
            key="serviceBook"
            style={{ textTransform: 'capitalize' }}
            width={isTablet ? 142 : 205}
          >
            Service Book
          </StyledTableCell>
          <StyledTableCell key="Request" style={{ textTransform: 'capitalize' }}>
            Request
            <br />
            Demand Method
          </StyledTableCell>
          <StyledTableCell key="Predicted" style={{ textTransform: 'capitalize' }}>
            Predicted
            <br />
            Demand Method
          </StyledTableCell>
          <StyledTableCell key="type" style={{ textTransform: 'capitalize' }}>
            Demand Type
          </StyledTableCell>
          <StyledTableCell key="RequestStatus" style={{ textTransform: 'capitalize' }}>
            Request Demand Status
          </StyledTableCell>
          <StyledTableCell key="PredictedStatus" style={{ textTransform: 'capitalize' }}>
            Predicted Demand Status
          </StyledTableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {settings.map(item => {
          return (
            <TableRow key={item.podId ?? item.serviceBookName}>
              <StyledTableCell key={item.podId ?? item.serviceBookName}>
                {item.serviceBookName}
              </StyledTableCell>
              <StyledTableCell
                key="requestDemandMethod"
                align="left"
                width={isTablet ? 190 : 'unset'}
              >
                <RadioGroupStyled
                  value={item.requestDemandMethod}
                  onChange={handleChangeRequestDemandMethod(item.podId)}
                  aria-labelledby="demo-controlled-radio-buttons-group"
                  name="controlled-radio-buttons-group"
                >
                  <RadioBtn
                    value={ERequestDemandMethod.AppointmentSlots}
                    control={<Radio color="primary" size="small" />}
                    label="Appointment Slots"
                  />
                  <RadioBtn
                    value={ERequestDemandMethod.ScheduledHours}
                    control={<Radio color="primary" size="small" />}
                    label="Scheduled Hours"
                  />
                </RadioGroupStyled>
              </StyledTableCell>

              <DemandPredictedCell item={item} handleTabChange={handleTabChange} />

              <StyledTableCell key="evenflowAppontments" style={{ padding: 0 }} width={124}>
                <SubCellWhite
                  key="evenflowAppontments"
                  style={{ borderBottom: '1px solid #DADADA' }}
                >
                  EvenFlow
                </SubCellWhite>
                <SubCellGrey
                  key="ExEvenflowAppontments"
                  style={{ borderBottom: '1px solid #DADADA', whiteSpace: 'nowrap' }}
                >
                  Ex EvenFlow
                </SubCellGrey>
                <SubCellWhite key="ROs">Open ROs</SubCellWhite>
              </StyledTableCell>
              <StyledTableCell
                key="requestDemandStatus"
                style={{ padding: 0 }}
                width={isTablet ? 109 : 146}
              >
                <SwitchWrapperWhite
                  key="evenflowAppontments"
                  style={{ borderBottom: '1px solid #DADADA' }}
                >
                  <Switch
                    disabled
                    onChange={handleSwitch(
                      item.podId,
                      EDemandPredictionType.EvenFlowAppointments,
                      'request'
                    )}
                    checked={Boolean(
                      item.demandTypeSettings.find(
                        el => el.type === EDemandPredictionType.EvenFlowAppointments
                      )?.isRequestStatusOn
                    )}
                    color="primary"
                  />
                </SwitchWrapperWhite>
                <SwitchWrapperGrey
                  key="ExEvenflowAppontments"
                  style={{ borderBottom: '1px solid #DADADA' }}
                >
                  <Switch
                    onChange={handleSwitch(
                      item.podId,
                      EDemandPredictionType.ExEvenFlowAppointments,
                      'request'
                    )}
                    checked={Boolean(
                      item.demandTypeSettings.find(
                        el => el.type === EDemandPredictionType.ExEvenFlowAppointments
                      )?.isRequestStatusOn
                    )}
                    color="primary"
                  />
                </SwitchWrapperGrey>
                <SwitchWrapperWhite key="ROs">
                  <Switch
                    onChange={handleSwitch(item.podId, EDemandPredictionType.OpenROs, 'request')}
                    checked={Boolean(
                      item.demandTypeSettings.find(el => el.type === EDemandPredictionType.OpenROs)
                        ?.isRequestStatusOn
                    )}
                    color="primary"
                  />
                </SwitchWrapperWhite>
              </StyledTableCell>
              <StyledTableCell
                key="predictionDemandStatus"
                style={{ padding: 0 }}
                width={isTablet ? 109 : 146}
              >
                <SwitchWrapperWhite
                  key="evenflowAppontments"
                  style={{ borderBottom: '1px solid #DADADA' }}
                >
                  <Switch
                    onChange={handleSwitch(
                      item.podId,
                      EDemandPredictionType.EvenFlowAppointments,
                      'prediction'
                    )}
                    checked={Boolean(
                      item.demandTypeSettings.find(
                        el => el.type === EDemandPredictionType.EvenFlowAppointments
                      )?.isPredictedStatusOn
                    )}
                    color="primary"
                  />
                </SwitchWrapperWhite>
                <SwitchWrapperGrey
                  key="ExEvenflowAppontments"
                  style={{ borderBottom: '1px solid #DADADA' }}
                >
                  <Switch
                    onChange={handleSwitch(
                      item.podId,
                      EDemandPredictionType.ExEvenFlowAppointments,
                      'prediction'
                    )}
                    checked={Boolean(
                      item.demandTypeSettings.find(
                        el => el.type === EDemandPredictionType.ExEvenFlowAppointments
                      )?.isPredictedStatusOn
                    )}
                    color="primary"
                  />
                </SwitchWrapperGrey>
                <SwitchWrapperWhite key="ROs">
                  <Switch
                    disabled
                    onChange={handleSwitch(item.podId, EDemandPredictionType.OpenROs, 'prediction')}
                    checked={Boolean(
                      item.demandTypeSettings.find(el => el.type === EDemandPredictionType.OpenROs)
                        ?.isPredictedStatusOn
                    )}
                    color="primary"
                  />
                </SwitchWrapperWhite>
              </StyledTableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </DenseTableWithPadding>
  );
};

export default DemandPredictionTable;
