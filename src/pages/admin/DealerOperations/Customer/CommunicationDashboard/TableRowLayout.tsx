import React from 'react';
import { TableRow } from '../../../../../components/styled/TableRow';
import { StyledTableCell } from '../../../../../features/admin/DemandPredictionTable/styles';
import { TextField } from '../../../../../components/formControls/TextFieldStyled/TextField';
import LabelLink from '../../../../../features/admin/DemandPredictionTable/LabelLink/LabelLink';
import { useDispatch, useSelector } from 'react-redux';
import {
  deleteCustomerEvent,
  setEventForTextConfiguration,
  setEventIdForRulesConfiguration,
  setTextMessage,
  setUpdatedEventsName,
  updateCustomerEvent,
} from '../../../../../store/reducers/dealerOperations/actions';
import { Switch } from '@mui/material';
import { RootState } from '../../../../../store/rootReducer';
import { DashboardItemI } from '../../../../../store/reducers/dealerOperations/types';
import { useSCs } from '../../../../../hooks/useSCs/useSCs';
import { ReactComponent as CheckIcon } from '../../../../../assets/img/checkboxSmall.svg';
import { ReactComponent as RedCross } from '../../../../../assets/img/redCross.svg';
import { ReactComponent as GreyCross } from '../../../../../assets/img/greyCross.svg';
import { useStyles } from './styles';

interface TableRowLayoutI {
  event: DashboardItemI;
  isEditEventName: boolean;
  onOpenTextConfigurationModal: () => void;
  setIsLoading: (isLoading: boolean) => void;
}

const TableRowLayout = ({
  event,
  isEditEventName,
  onOpenTextConfigurationModal,
  setIsLoading,
}: TableRowLayoutI) => {
  const dispatch = useDispatch();
  const { selectedSC } = useSCs();
  const { classes } = useStyles();

  const { textIntegrationSettings, updatedEventsName } = useSelector(
    (state: RootState) => state.dealerOperations
  );

  const handleClickTextConfiguration = (event: DashboardItemI) => {
    if (!selectedSC?.id) throw new Error('Selected SC is not defined');

    dispatch(setEventForTextConfiguration(event));
    dispatch(setTextMessage(event.communicationDetails?.textMessage ?? ''));
    onOpenTextConfigurationModal();
  };

  const textSwitchChange = (event: DashboardItemI) => {
    if (!selectedSC?.id) throw new Error('Selected SC is not defined');

    setIsLoading(true);
    const updatedEvent = { isTextEnabled: !event.isTextEnabled };
    dispatch(
      updateCustomerEvent(
        { serviceCenterId: selectedSC.id, eventId: event.id, updatedData: updatedEvent },
        () => {},
        () => setIsLoading(false)
      )
    );
  };

  const handleDeleteCustomerEvent = (id: number) => {
    if (!selectedSC?.id) throw new Error('Selected SC is not defined');

    setIsLoading(true);
    dispatch(
      deleteCustomerEvent({ serviceCenterId: selectedSC.id, id }, () => setIsLoading(false))
    );
  };

  const handleNameChange = (value: string) => {
    dispatch(
      setUpdatedEventsName(
        updatedEventsName.map(ev => {
          if (ev.id === event.id && value.length < 51) {
            return { ...ev, name: value };
          }
          return ev;
        })
      )
    );
  };

  const renderNameCell = () => (
    <StyledTableCell>
      {isEditEventName ? (
        <TextField
          fullWidth
          value={updatedEventsName.find(e => event.id === e.id)?.name}
          onChange={e => handleNameChange(e.target.value)}
        />
      ) : (
        event.name
      )}
    </StyledTableCell>
  );

  const renderRulesCell = () => {
    const configured = event.triggers.length && event.filterRules.length;
    return (
      <StyledTableCell>
        <LabelLink
          style={{
            textTransform: 'upperCase',
            fontWeight: '700',
          }}
          subText={configured ? 'Configured' : 'Not Configured'}
          color={configured ? '#7898FF' : '#C71062'}
          icon={configured ? <CheckIcon /> : <RedCross />}
          onClick={() => dispatch(setEventIdForRulesConfiguration(event.id))}
        />
      </StyledTableCell>
    );
  };

  const renderTextCell = () => {
    const isConfigured =
      event.communicationDetails?.textMessage && textIntegrationSettings?.fromPhoneNumber;
    const disabled = !isConfigured || !event.filterRules.length || !event.triggers.length;

    return (
      <StyledTableCell>
        <div className={classes.textRow}>
          <LabelLink
            subText={isConfigured ? 'Configured' : 'Not Configured'}
            color={isConfigured ? '#7898FF' : '#C71062'}
            icon={isConfigured ? <CheckIcon /> : <RedCross />}
            onClick={() => handleClickTextConfiguration(event)}
          />
          <Switch
            disabled={disabled}
            onClick={() => textSwitchChange(event)}
            checked={event.isTextEnabled}
            color="primary"
          />
        </div>
      </StyledTableCell>
    );
  };

  const renderDisabledCell = (subText: string) => (
    <StyledTableCell>
      <div className={classes.disabledCell}>
        {subText ? (
          <LabelLink subText={subText} color="#B8B9BF" icon={<GreyCross />} onClick={() => {}} />
        ) : (
          ''
        )}
        <Switch disabled checked={false} color="primary" />
      </div>
    </StyledTableCell>
  );

  const renderRemoveCell = () => (
    <StyledTableCell>
      <LabelLink
        style={{ textTransform: 'upperCase', fontWeight: '700' }}
        subText="Remove"
        color="#7898FF"
        onClick={() => handleDeleteCustomerEvent(event.id)}
      />
    </StyledTableCell>
  );

  return (
    <TableRow key={event.id}>
      {renderNameCell()}
      {renderRulesCell()}
      {renderDisabledCell('Not Configured')}
      {renderTextCell()}
      {renderDisabledCell('')}
      {renderRemoveCell()}
    </TableRow>
  );
};

export default TableRowLayout;
