import React, { SyntheticEvent, useEffect, useState } from 'react';
import {
  BaseModal,
  DialogActions,
  DialogTitle,
} from '../../../../components/modals/BaseModal/BaseModal';
import { Button } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../store/rootReducer';
import { IAssignedServiceRequest } from '../../../../store/reducers/serviceRequests/types';
import { loadMakesGlobally } from '../../../../store/reducers/vehicleDetails/actions';
import { createRecall, updateRecall } from '../../../../store/reducers/recall/actions';
import { useEditRecallStyles, useStyles } from './styles';
import { TAddRecallProps, TForm } from './types';
import { useException } from '../../../../hooks/useException/useException';
import { useSCs } from '../../../../hooks/useSCs/useSCs';
import { checkIsEditValid, checkIsValid } from './utils';
import { initialForm } from './constants';
import { EditRecallContent } from './EditRecallContent';
import { buildEditRecallPayload, buildRecallPayload, mapRecallToForm } from './helpers';

const AddRecallModal: React.FC<React.PropsWithChildren<TAddRecallProps>> = ({
  editingItem,
  open,
  onClose,
  setEditingItem,
}) => {
  const { makes } = useSelector((state: RootState) => state.vehicleDetails);
  const { allAssignedList } = useSelector((state: RootState) => state.serviceRequests);
  const [form, setForm] = useState<TForm>(initialForm);
  const [formIsChecked, setFormIsChecked] = useState<boolean>(false);

  const dispatch = useDispatch();
  const showError = useException();
  const { selectedSC } = useSCs();
  const { classes } = useStyles();
  const { classes: editClasses } = useEditRecallStyles();

  useEffect(() => {
    if (open && selectedSC) {
      dispatch(loadMakesGlobally(selectedSC.id));
    }
  }, [dispatch, selectedSC, open]);

  useEffect(() => {
    if (open && editingItem) {
      setForm(mapRecallToForm(editingItem, makes, allAssignedList));
    }
  }, [open, editingItem, makes, allAssignedList]);

  const onCancel = () => {
    setForm(initialForm);
    setFormIsChecked(false);
    setEditingItem(null);
    onClose();
  };

  const onSave = () => {
    setFormIsChecked(true);

    if (!selectedSC) {
      return;
    }

    if (editingItem) {
      if (!checkIsEditValid(form, showError)) {
        return;
      }
      dispatch(
        updateRecall(
          buildEditRecallPayload(form, selectedSC.id),
          editingItem.id,
          showError,
          onCancel
        )
      );
      return;
    }

    if (!checkIsValid(form, showError)) {
      return;
    }
    dispatch(createRecall(buildRecallPayload(form, selectedSC.id), showError, onCancel));
  };

  const onFormChange: React.ChangeEventHandler<HTMLInputElement> = ({
    target: { name, value },
  }) => {
    setFormIsChecked(false);
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const onSRChange = (e: SyntheticEvent, value: IAssignedServiceRequest | null) => {
    setFormIsChecked(false);
    setForm(prev => ({ ...prev, serviceRequest: value }));
  };

  const renderActions = (cancelLabel: string) => (
    <DialogActions>
      <div className={classes.actionsWrapper}>
        <div className={classes.buttonsWrapper}>
          <Button onClick={onCancel} className={classes.cancelButton} color="info">
            {cancelLabel}
          </Button>
          <Button onClick={onSave} className={classes.saveButton}>
            Save
          </Button>
        </div>
      </div>
    </DialogActions>
  );

  if (editingItem) {
    return (
      <BaseModal open={open} onClose={onCancel} width={835}>
        <DialogTitle onClose={onCancel} style={{ padding: 0, marginTop: 0 }}>
          <span className={editClasses.title}>Edit Recall Component</span>
        </DialogTitle>
        <EditRecallContent
          recall={editingItem}
          form={form}
          formIsChecked={formIsChecked}
          allAssignedList={allAssignedList}
          onFormChange={onFormChange}
          onSRChange={onSRChange}
        />
        {renderActions('Close')}
      </BaseModal>
    );
  }

  return <></>;
};

export default AddRecallModal;
