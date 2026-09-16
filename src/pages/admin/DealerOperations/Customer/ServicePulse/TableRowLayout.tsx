import { useStyles } from './styles';
import { TableRow } from '../../../../../components/styled/TableRow';
import { IPlayWithServiceBook } from './ServicePulse';
import React from 'react';
import { StyledTableCell } from '../../../../../features/admin/DemandPredictionTable/styles';
import LabelLink from '../../../../../features/admin/DemandPredictionTable/LabelLink/LabelLink';
import { ReactComponent as CheckIcon } from '../../../../../assets/img/checkboxSmallGreen.svg';
import { ReactComponent as RedCross } from '../../../../../assets/img/redCross.svg';
import { Switch } from '@mui/material';
import { TextField } from '../../../../../components/formControls/TextFieldStyled/TextField';
import { setUpdatedPlaysName } from '../../../../../store/reducers/dealerOperations/actions';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../../store/rootReducer';

interface ITableRowLayoutProps {
  play: IPlayWithServiceBook;
  showServiceBookName?: boolean;
  className?: string;
  isEdit: boolean;
}

const TableRowLayout = ({
  play,
  showServiceBookName = true,
  className,
  isEdit,
}: ITableRowLayoutProps) => {
  const { classes } = useStyles();
  const { updatedPlaysName } = useSelector((state: RootState) => state.dealerOperations);
  const dispatch = useDispatch();

  const renderServiceBookName = () => {
    return <StyledTableCell>{showServiceBookName ? play.serviceBookName : ''}</StyledTableCell>;
  };

  const handleNameChange = (value: string) => {
    dispatch(
      setUpdatedPlaysName(
        updatedPlaysName.map(ev => {
          if (ev.id === play.id && value.length < 51) {
            return { ...ev, name: value };
          }
          return ev;
        })
      )
    );
  };

  const renderPlayName = () => {
    if (isEdit) {
      return (
        <StyledTableCell>
          <TextField
            className={classes.eventInput}
            fullWidth
            value={updatedPlaysName.find(ev => ev.id === play.id)?.name || play.name}
            onChange={e => handleNameChange(e.target.value)}
          />
        </StyledTableCell>
      );
    }

    return <StyledTableCell>{play.name}</StyledTableCell>;
  };

  const handleClickTextConfiguration = () => {};

  const renderPlayConfigured = () => {
    const isConfigured =
      play.play.services.length > 0 || play.play.advisor !== null || play.play.transportation;
    return (
      <StyledTableCell>
        <div className={classes.textRow}>
          <LabelLink
            subText={isConfigured ? 'Configured' : 'Not Configured'}
            color={isConfigured ? '#5FA077' : '#C71062'}
            icon={isConfigured ? <CheckIcon /> : <RedCross />}
            onClick={() => handleClickTextConfiguration()}
          />
        </div>
      </StyledTableCell>
    );
  };

  const renderPlayAudience = () => {
    const isConfigured = play.triggers.length > 0 && play.filterRules.length > 0;
    return (
      <StyledTableCell>
        <div className={classes.textRow}>
          <LabelLink
            subText={isConfigured ? 'Configured' : 'Not Configured'}
            color={isConfigured ? '#5FA077' : '#C71062'}
            icon={isConfigured ? <CheckIcon /> : <RedCross />}
            onClick={() => handleClickTextConfiguration()}
          />
        </div>
      </StyledTableCell>
    );
  };

  const renderPlayText = () => {
    const isConfigured = play.communicationDetails.textMessage.length > 0;
    return (
      <StyledTableCell>
        <div className={classes.textRow}>
          <LabelLink
            subText={isConfigured ? 'Configured' : 'Not Configured'}
            color={isConfigured ? '#5FA077' : '#C71062'}
            icon={isConfigured ? <CheckIcon /> : <RedCross />}
            onClick={() => handleClickTextConfiguration()}
          />
        </div>
      </StyledTableCell>
    );
  };

  const renderPlayActive = () => {
    return (
      <StyledTableCell>
        <div className={classes.textRow}>
          <Switch onClick={() => {}} checked={play.active} color="primary" />
          <p>{play.activeText}</p>
        </div>
      </StyledTableCell>
    );
  };

  const renderRemoveCell = () => (
    <StyledTableCell>
      <div className={classes.removeBlock}>
        <LabelLink
          style={{ textTransform: 'uppercase', fontWeight: '700' }}
          subText="Remove"
          color="#7898FF"
          onClick={() => {}}
        />
      </div>
    </StyledTableCell>
  );

  return (
    <TableRow key={play.id} className={className}>
      {renderServiceBookName()}
      {renderPlayName()}
      {renderPlayConfigured()}
      {renderPlayAudience()}
      {renderPlayText()}
      {renderPlayActive()}
      {renderRemoveCell()}
    </TableRow>
  );
};

export default TableRowLayout;
