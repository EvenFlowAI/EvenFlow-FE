import React, { SyntheticEvent, useEffect, useState } from 'react';
import {
  BaseModal,
  DialogActions,
  DialogTitle,
} from '../../../../components/modals/BaseModal/BaseModal';
import { Button } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../store/rootReducer';
import { IMakeExtended, IModel } from '../../../../api/types';
import { IAssignedServiceRequest } from '../../../../store/reducers/serviceRequests/types';
import { loadMakesGlobally } from '../../../../store/reducers/vehicleDetails/actions';
import { createRecall, updateRecall } from '../../../../store/reducers/recall/actions';
import { useStyles } from './styles';
import { TAddRecallProps, TForm } from './types';
import { useException } from '../../../../hooks/useException/useException';
import { useSCs } from '../../../../hooks/useSCs/useSCs';
import { checkIsValid } from './utils';
import { initialForm } from './constants';
import { AddRecallFormContent } from './AddRecallFormContent';
import { buildRecallPayload, mapRecallToForm } from './helpers';

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

    if (!selectedSC || !checkIsValid(form, showError)) {
      return;
    }

    const data = buildRecallPayload(form, selectedSC.id);

    if (editingItem) {
      dispatch(updateRecall(data, editingItem.id, showError, onCancel));
      return;
    }

    dispatch(createRecall(data, showError, onCancel));
  };

  const onFormChange: React.ChangeEventHandler<HTMLInputElement> = ({
    target: { name, value },
  }) => {
    setFormIsChecked(false);
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const onYearChange =
    (name: 'yearFrom' | 'yearTo') => (e: SyntheticEvent, value: string | null) => {
      setFormIsChecked(false);
      setForm(prev => ({ ...prev, [name]: value ?? '' }));
    };

  const onSummaryChange: React.ChangeEventHandler<HTMLTextAreaElement> = ({
    target: { value },
  }) => {
    setFormIsChecked(false);
    setForm(prev => ({ ...prev, recallSummary: value }));
  };

  const onMakeChange = (e: SyntheticEvent, value: IMakeExtended | null) => {
    setFormIsChecked(false);
    setForm(prev => ({ ...prev, make: value, models: [] }));
  };

  const onModelChange = (e: SyntheticEvent, value: IModel[]) => {
    setFormIsChecked(false);
    setForm(prev => ({ ...prev, models: value }));
  };

  const onSRChange = (e: SyntheticEvent, value: IAssignedServiceRequest | null) => {
    setFormIsChecked(false);
    setForm(prev => ({ ...prev, serviceRequest: value }));
  };

  return (
    <BaseModal open={open} onClose={onCancel} width={500}>
      <DialogTitle onClose={onCancel}>{editingItem ? 'Edit' : 'Add'} Recall</DialogTitle>
      <AddRecallFormContent
        form={form}
        formIsChecked={formIsChecked}
        makes={makes}
        allAssignedList={allAssignedList}
        onFormChange={onFormChange}
        onSummaryChange={onSummaryChange}
        onMakeChange={onMakeChange}
        onModelChange={onModelChange}
        onSRChange={onSRChange}
        onYearChange={onYearChange}
      />
      <DialogActions>
        <div className={classes.actionsWrapper}>
          <div className={classes.buttonsWrapper}>
            <Button onClick={onCancel} variant="text" className={classes.cancelButton} color="info">
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

export default AddRecallModal;
