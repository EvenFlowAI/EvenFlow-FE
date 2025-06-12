import React from 'react';
import { Autocomplete, Button, InputAdornment, TableBody, TableHead } from '@mui/material';
import { setLocalTab } from '../../../store/reducers/adminPanel/actions';
import { ReactComponent as Arrow } from '../../../assets/img/arrow-left.svg';
import { useStyles } from './styles';
import { useDispatch } from 'react-redux';
import { autocompleteRender } from '../../../utils/autocompleteRenders';
import { TextField } from '../../../components/formControls/TextFieldStyled/TextField';
import { TableRow } from '../../../components/styled/TableRow';
import { TableCell, TableCellLeft } from '../../../components/styled/TableCell';
import { SaveEditBlock } from '../../../components/buttons/SaveEditBlock/SaveEditBlock';
import dayjs from 'dayjs';
import {
  UnplannedTableCell,
  UnplannedTableCellLeft,
} from '../UnplannedDemand/UnplannedDemandSlots/styles';
import { EDay } from '../../../store/reducers/demandSegments/types';
import { STextField } from '../AncillaryPriceByDistance/styles';
import { DemandTable } from '../../../components/styled/DemandTable';

type TStringOption = {
  value: string;
  name: string;
};

const ProbabilityApproach = () => {
  const dispatch = useDispatch();
  const { classes } = useStyles();

  const [assignedServiceBook, setAssignedServiceBook] = React.useState<TStringOption | null>(null);
  const [predictedAppointmentSlots, setPredictedAppointmentSlots] = React.useState<number>(0);
  const [predictedHours, setPredictedHours] = React.useState<number>(0.0);
  const [thresholdValue, setThresholdValue] = React.useState<string>('');

  const handleClickOnBack = () => {
    dispatch(setLocalTab('0'));
  };

  const data = [
    {
      segment: 'test 1',
      makes: 'Volvo',
      models: 'XC60',
      engineType: 'Gas',
      probabilityCurve: true,
    },
    {
      segment: 'test 2',
      makes: 'Dacia',
      models: 'Logan',
      engineType: 'Gas',
      probabilityCurve: false,
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', marginBottom: '30px' }}>
        <Button variant="text" className={classes.backWrapper} onClick={handleClickOnBack}>
          <Arrow />
          <span>Back to Demand Prediction Table</span>
        </Button>

        <p className={classes.title}>Express Service Book</p>
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          width: '100%',
          marginBottom: '20px',
        }}
      >
        <div className={classes.inputWrapper}>
          <Autocomplete
            disabled={false}
            options={[
              {
                value: '1',
                name: '1',
              },
              {
                value: '2',
                name: '2',
              },
            ]}
            style={{ width: '230px' }}
            isOptionEqualToValue={(o, v) => o.value === v.value}
            getOptionLabel={i => i.name}
            value={assignedServiceBook}
            onChange={(e, value) => setAssignedServiceBook(value)}
            renderInput={autocompleteRender({
              label: 'Assigned Service Book:',
              placeholder: 'Assigned Service Book',
            })}
          />
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              width: '124px',
            }}
          >
            <TextField
              id="thresholdValue"
              labelFitContent={true}
              endAdornment={<InputAdornment position="start">%</InputAdornment>}
              value={thresholdValue}
              onChange={e => setThresholdValue(e.target.value)}
              name="thresholdValue"
              label="Threshold Value:"
            />
          </div>
          <div style={{ width: '196px' }}>
            <TextField
              id="predictedAppointmentSlots"
              labelFitContent={true}
              name="predictedAppointmentSlots"
              label="Predicted Appointment Slots:"
              type="number"
              inputProps={{ min: 0 }}
              onChange={e => setPredictedAppointmentSlots(+e.target.value)}
              value={predictedAppointmentSlots}
            />
          </div>
          <div style={{ width: '124px' }}>
            <TextField
              disabled={true}
              id="predictedHours"
              labelFitContent={true}
              value={predictedHours}
              type="number"
              inputProps={{ step: 0.1, min: 0 }}
              onChange={e => setPredictedHours(+e.target.value)}
              name="predictedHours"
              label="Predicted Hours:"
            />
          </div>
        </div>
        <Button
          style={{
            height: '41px',
            width: '145px',
          }}
          color="primary"
          variant="contained"
          onClick={() => {
            console.log('test click');
          }}
        >
          Add segment
        </Button>
      </div>
      <div>
        <DemandTable>
          <TableHead>
            <TableRow>
              <TableCellLeft>Segment</TableCellLeft>
              <TableCellLeft>Makes</TableCellLeft>
              <TableCellLeft>Models</TableCellLeft>
              <TableCellLeft>Engine Type</TableCellLeft>
              <TableCellLeft>Probability Curve</TableCellLeft>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((el, idx) => {
              return (
                <TableRow key={idx}>
                  <UnplannedTableCellLeft>{el.segment}</UnplannedTableCellLeft>
                  <UnplannedTableCellLeft>{el.makes}</UnplannedTableCellLeft>
                  <UnplannedTableCellLeft>{el.models}</UnplannedTableCellLeft>
                  <UnplannedTableCellLeft>{el.engineType}</UnplannedTableCellLeft>
                  <UnplannedTableCellLeft>
                    {el.probabilityCurve ? 'Uploaded' : 'Missing'}
                  </UnplannedTableCellLeft>
                </TableRow>
              );
            })}
          </TableBody>
        </DemandTable>
      </div>
    </div>
  );
};

export default ProbabilityApproach;
