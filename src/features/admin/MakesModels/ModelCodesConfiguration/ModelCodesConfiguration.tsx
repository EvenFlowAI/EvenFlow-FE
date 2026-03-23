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
import { TextField } from '../../../../components/formControls/TextFieldStyled/TextField';

type TModelCodesConfiguration = DialogProps & {
  configuredModels: IData[];
  onSaveModels: () => void;
  setConfiguredModels: React.Dispatch<React.SetStateAction<IData[]>>;
};
export const ModelCodesConfiguration: React.FC<
  React.PropsWithChildren<React.PropsWithChildren<TModelCodesConfiguration>>
> = ({ onClose, configuredModels, setConfiguredModels, onSaveModels, ...props }) => {
  const { classes } = useStyles();
  const { makeModelCodes } = useSelector((state: RootState) => state.vehicleDetails);

  const handleUpdateCode = (prevEl: IData, value: string) => {
    setConfiguredModels(prev =>
      prev.map(el => (el.id === prevEl.id ? { ...el, code: value } : el))
    );
  };

  const getDesc = (code: string) => {
    const found = makeModelCodes.find(m => m.modelCode === code);
    return found ? `${found.makeName} ${found.modelName}` : '';
  };

  const getIsActive = (code?: string | undefined) => {
    if (!code) return true;
    const found = makeModelCodes.find(m => m.modelCode === code);
    return found ? found.isActive : false;
  };

  return (
    <BaseModal {...props} width={860} onClose={onClose}>
      <DialogTitle onClose={onClose}>
        <span>CDK Model Codes Configuration</span>
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
          Configured Models
        </p>
        <MakeCodeTable>
          <TableHead>
            <TableRow>
              <TableCell width="60%" align="left">
                Model
              </TableCell>
              <TableCell width="20%" align="left">
                Model Code
              </TableCell>
              <TableCell width="30%" align="left">
                Model Description
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {configuredModels.map(el => (
              <TableRow key={el.id}>
                <TableCell align="left">{el.text}</TableCell>
                <TableCell>
                  <Autocomplete
                    options={makeModelCodes?.map(el => el.modelCode) ?? []}
                    style={{
                      width: '190px',
                      border: getIsActive(el.code) ? 'none' : '1px solid red',
                    }}
                    getOptionLabel={i => i}
                    value={el.code}
                    isOptionEqualToValue={(o, s) => o === s}
                    onChange={(e, newValue) => handleUpdateCode(el, newValue || '')}
                    renderInput={autocompleteRender({
                      label: '',
                      placeholder: 'Model Code',
                    })}
                  />
                </TableCell>
                <TableCell>
                  {/*<Autocomplete*/}
                  {/*  disabled={true}*/}
                  {/*  options={[]}*/}
                  {/*  style={{ width: '250px' }}*/}
                  {/*  getOptionLabel={i => i}*/}
                  {/*  value={getDesc(el.code || '')}*/}
                  {/*  isOptionEqualToValue={(o, s) => o === s}*/}
                  {/*  onChange={() => {}}*/}
                  {/*  renderInput={autocompleteRender({*/}
                  {/*    label: '',*/}
                  {/*    placeholder: 'Model Description',*/}
                  {/*  })}*/}
                  {/*/>*/}
                  <TextField
                    id="description"
                    disabled
                    style={{ width: '250px' }}
                    value={getDesc(el.code || '')}
                    onChange={() => {}}
                    error={false}
                    placeholder="Model Description"
                    name="Description"
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
            Cancel
          </Button>
          <Button onClick={onSaveModels} className={classes.saveButton}>
            Save
          </Button>
        </div>
      </DialogActions>
    </BaseModal>
  );
};

export default ModelCodesConfiguration;
