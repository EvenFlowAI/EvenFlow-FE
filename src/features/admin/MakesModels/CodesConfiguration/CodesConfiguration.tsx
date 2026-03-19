import React from 'react';
import { DialogProps } from '../../../../components/modals/BaseModal/types';
import {
  BaseModal,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '../../../../components/modals/BaseModal/BaseModal';
import { Button, TableBody, TableHead } from '@mui/material';
import { IData } from '../../../../components/DragAndDrop/types';
import { TableRow } from '../../../../components/styled/TableRow';
import { TableCell } from '../../../../components/styled/TableCell';
import { MakeCodeTable } from '../../../../components/styled/MakeCodeTable';
import { useStyles } from '../AddMakeModelModal/styles';

type TCodesConfiguration = DialogProps & {
  isEditing?: boolean;
  configuredMakes: IData[];
  configuredModels: IData[];
  onCloseModal: () => void;
  onSaveMakes: () => void;
  onSaveModels: () => void;
};

export const CodesConfiguration: React.FC<
  React.PropsWithChildren<React.PropsWithChildren<TCodesConfiguration>>
> = ({
  isEditing,
  onClose,
  configuredMakes,
  configuredModels,
  onCloseModal,
  onSaveModels,
  onSaveMakes,
  ...props
}) => {
  const { classes } = useStyles();

  return (
    <BaseModal {...props} width={860} onClose={onClose}>
      <DialogTitle onClose={onClose}>
        {isEditing ? (
          <span>CDK Model Codes Configuration</span>
        ) : (
          <span>CDK Make Codes Configuration</span>
        )}
      </DialogTitle>
      <DialogContent style={{ marginBottom: '20px' }}>
        <MakeCodeTable>
          <TableHead>
            <TableRow>
              <TableCell width="65%" align="left">
                Make
              </TableCell>
              <TableCell width="35%" align="left">
                Make Code
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {configuredMakes.map(el => (
              <TableRow>
                <TableCell align="left">{el.text}</TableCell>
                <TableCell>'test'</TableCell>
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
          <Button
            onClick={() => (isEditing ? onSaveModels() : onSaveMakes())}
            className={classes.saveButton}
          >
            Save
          </Button>
        </div>
      </DialogActions>
    </BaseModal>
  );
};

export default CodesConfiguration;
