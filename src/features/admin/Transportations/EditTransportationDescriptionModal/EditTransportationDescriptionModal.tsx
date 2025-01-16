import React, { useEffect, useState } from 'react';
import {
  BaseModal,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '../../../../components/modals/BaseModal/BaseModal';
import { DialogProps } from '../../../../components/modals/BaseModal/types';
import { ITransportationOptionFull } from '../../../../store/reducers/transportationNeeds/types';
import { TextField } from '../../../../components/formControls/TextFieldStyled/TextField';
import { Button } from '@mui/material';
import { useDispatch } from 'react-redux';
import {
  updateTransportationDescription,
  updateTransportationIcon,
} from '../../../../store/reducers/transportationNeeds/actions';
import { useStyles } from './styles';
import { useException } from '../../../../hooks/useException/useException';
import { FileInput } from '../../../../components/formControls/FileInput/FileInput';
import { IIconState } from '../../ServiceCategories/AddServiceCategoryModal/types';
import { useSCs } from '../../../../hooks/useSCs/useSCs';
import { useMessage } from '../../../../hooks/useMessage/useMessage';
import { Autocomplete } from '@mui/material';
import { autocompleteRender } from '../../../../utils/autocompleteRenders';
import { RootState } from '../../../../store/rootReducer';
import { useSelector } from 'react-redux';
import { IAssignedServiceRequest } from '../../../../store/reducers/serviceRequests/types';

const initialFileState = { file: null, dataUrl: undefined };

export const EditTransportationDescriptionModal: React.FC<
  React.PropsWithChildren<
    React.PropsWithChildren<DialogProps & { editingElement: ITransportationOptionFull | null }>
  >
> = ({ editingElement, ...props }) => {
  const { allAssignedList } = useSelector((state: RootState) => state.serviceRequests);
  const currentSelectedCode = allAssignedList.find(
    i => i.serviceRequest.code === editingElement?.opCode
  );
  const [description, setDescription] = useState<string>('');
  const [formIsChecked, setFormIsChecked] = useState<boolean>(false);
  const [orderIndex, setOrderIndex] = useState<string>('');
  const [selectedCode, setSelectedCode] = useState<IAssignedServiceRequest>();
  const [fileState, setFileState] = useState<IIconState>(initialFileState);
  const { classes } = useStyles();
  const { selectedSC } = useSCs();
  const dispatch = useDispatch();
  const showError = useException();
  const showMessage = useMessage();

  useEffect(() => {
    if (editingElement && props.open) {
      editingElement.description && setDescription(editingElement.description);
      editingElement.orderIndex && setOrderIndex(editingElement.orderIndex.toString());
    }
  }, [editingElement, props.open]);

  const onCancel = () => {
    setFormIsChecked(false);
    setDescription('');
    setOrderIndex('');
    setFileState(initialFileState);
    setSelectedCode(undefined);
    props.onClose();
  };

  const onDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setFormIsChecked(false);
    setDescription(e.target.value);
  };

  const onOrderChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setFormIsChecked(false);
    setOrderIndex(e.target.value);
  };

  const onIconSaved = () => {
    showMessage('Icon is saved');
  };

  const onDataSaved = () => {
    showMessage('Transportation Option Description and Order Index are saved');
    onCancel();
  };

  const saveIcon = () => {
    if (editingElement && selectedSC && fileState?.file) {
      dispatch(
        updateTransportationIcon(
          editingElement.id,
          selectedSC.id,
          fileState.file,
          showError,
          onIconSaved
        )
      );
    }
  };

  const saveData = () => {
    if (editingElement) {
      if (description.trim().length && +orderIndex > 0) {
        dispatch(
          updateTransportationDescription(
            editingElement.id,
            {
              ...editingElement,
              description: description.trim(),
              orderIndex: +orderIndex,
              serviceRequestId: selectedCode?.id ?? undefined,
            },
            onDataSaved,
            showError
          )
        );
      } else {
        if (+orderIndex <= 0) {
          showError('"Booking Flow Order Index" must be more than 0');
        } else {
          showError('"Description" must not be empty');
        }
      }
    }
  };

  const onSave = () => {
    setFormIsChecked(true);
    saveData();
    saveIcon();
  };

  const onOpsCodeChange = (e: React.ChangeEvent<{}>, option: IAssignedServiceRequest | null) => {
    if (!option) {
      setSelectedCode(undefined);
    } else {
      setSelectedCode(option);
    }
  };

  return (
    <BaseModal {...props} width={600} onClose={onCancel}>
      <DialogTitle onClose={onCancel}>Manage Option</DialogTitle>
      <DialogContent>
        <div className={classes.upperRowWrapper}>
          <div>
            <TextField
              fullWidth
              type="number"
              label="Booking Flow Order Index"
              placeholder="Type Booking Flow Order Index"
              error={formIsChecked && +orderIndex <= 0}
              onChange={onOrderChange}
              value={orderIndex}
            />
          </div>
          <FileInput
            type="outlined"
            setState={setFileState}
            label={`${
              fileState.file || editingElement?.iconPath ? 'Update' : 'Upload'
            } Transportation Icon`}
          />
        </div>
        <div className={classes.bottomRowWrapper}>
          <div>
            <TextField
              fullWidth
              label="Description"
              placeholder="Type Description"
              error={formIsChecked && !description.length}
              onChange={onDescriptionChange}
              value={description}
            />
          </div>
          <Autocomplete
            disabled={editingElement?.description === 'Pick up and delivery'}
            value={selectedCode ?? currentSelectedCode}
            onChange={onOpsCodeChange}
            getOptionLabel={o => o.serviceRequest.code}
            isOptionEqualToValue={(option, value) =>
              option.serviceRequest.id === value.serviceRequest.id
            }
            renderInput={autocompleteRender({
              label: 'OP Code',
              placeholder:
                editingElement?.description === 'Pick up and delivery'
                  ? 'See Service Valet page'
                  : 'Select Op Code',
            })}
            options={allAssignedList}
          />
        </div>
      </DialogContent>
      <DialogActions>
        <div className={classes.actionsWrapper}>
          <div className={classes.buttonsWrapper}>
            <Button onClick={onCancel} className={classes.cancelButton}>
              Cancel
            </Button>
            <Button onClick={onSave} className={classes.saveButton}>
              Save
            </Button>
          </div>
        </div>
      </DialogActions>
    </BaseModal>
  );
};
