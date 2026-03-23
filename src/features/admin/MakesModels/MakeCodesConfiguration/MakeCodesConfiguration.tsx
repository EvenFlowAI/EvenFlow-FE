import React from 'react';
import { DialogProps } from '../../../../components/modals/BaseModal/types';
import {
  BaseModal,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '../../../../components/modals/BaseModal/BaseModal';
import { Autocomplete, Button, TableBody, TableHead } from '@mui/material';
import { IData } from '../../../../components/DragAndDrop/types';
import { TableRow } from '../../../../components/styled/TableRow';
import { TableCell } from '../../../../components/styled/TableCell';
import { MakeCodeTable } from '../../../../components/styled/MakeCodeTable';
import { useStyles } from '../AddMakeModelModal/styles';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../store/rootReducer';
import { autocompleteRender } from '../../../../utils/autocompleteRenders';

type TMakeCodesConfiguration = DialogProps & {
  configuredMakes: IData[];
  onSaveMakes: () => void;
  setConfiguredMakes: React.Dispatch<React.SetStateAction<IData[]>>;
};

export const MakeCodesConfiguration: React.FC<
  React.PropsWithChildren<React.PropsWithChildren<TMakeCodesConfiguration>>
> = ({ onClose, configuredMakes, setConfiguredMakes, onSaveMakes, ...props }) => {
  const { classes } = useStyles();
  const { makeCodes } = useSelector((state: RootState) => state.vehicleDetails);

  const handleUpdateCode = (prevEl: IData, value: string) => {
    setConfiguredMakes(prev => prev.map(el => (el.id === prevEl.id ? { ...el, code: value } : el)));
  };

  function capitalizeName(name?: string): string {
    if (!name) return '';
    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
  }

  return (
    <BaseModal {...props} width={860} onClose={onClose}>
      <DialogTitle onClose={onClose}>
        <span>CDK Make Codes Configuration</span>
      </DialogTitle>
      <DialogContent style={{ marginBottom: '12px' }}>
        <p
          style={{
            textTransform: 'uppercase',
            fontSize: '12px',
            fontWeight: 'bold',
            marginBottom: '10px',
          }}
        >
          Configured Makes
        </p>
        <MakeCodeTable>
          <TableHead>
            <TableRow>
              <TableCell width="80%" align="left">
                Make
              </TableCell>
              <TableCell width="20%" align="left">
                Make Code
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {configuredMakes.map(el => (
              <TableRow key={el.id}>
                {' '}
                <TableCell align="left">{capitalizeName(el.text)}</TableCell>
                <TableCell>
                  <Autocomplete
                    options={makeCodes?.map(el => el.makeCode) ?? []}
                    style={{ width: '190px' }}
                    getOptionLabel={i => i}
                    value={el.code}
                    isOptionEqualToValue={(o, s) => o === s}
                    onChange={(e, newValue) => handleUpdateCode(el, newValue || '')}
                    renderInput={autocompleteRender({
                      label: '',
                      placeholder: 'Code',
                    })}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </MakeCodeTable>
      </DialogContent>
      <DialogActions>
        <div className={classes.buttonsWrapper}>
          <Button onClick={onClose} className={classes.cancelButton}>
            Back
          </Button>
          <Button onClick={onSaveMakes} className={classes.saveButton}>
            Save
          </Button>
        </div>
      </DialogActions>
    </BaseModal>
  );
};

export default MakeCodesConfiguration;
