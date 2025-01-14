import React, { ChangeEvent, useCallback, useEffect, useState } from 'react';
import {
  BaseModal,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '../../../../components/modals/BaseModal/BaseModal';
import { ICreateUpdateRecall } from '../../../../store/reducers/recall/types';
import { Autocomplete, Button } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { TextField } from '../../../../components/formControls/TextFieldStyled/TextField';
import { autocompleteRender } from '../../../../utils/autocompleteRenders';
import { RootState } from '../../../../store/rootReducer';
import { IMakeExtended, IModel } from '../../../../api/types';
import { IAssignedServiceRequest } from '../../../../store/reducers/serviceRequests/types';
import { loadMakesForPods } from '../../../../store/reducers/vehicleDetails/actions';
import { createRecall, updateRecall } from '../../../../store/reducers/recall/actions';
import { Textarea, useStyles } from './styles';
import { TAddRecallProps, TForm } from './types';
import { useException } from '../../../../hooks/useException/useException';
import { useSCs } from '../../../../hooks/useSCs/useSCs';
import { checkIsValid } from './utils';
import { initialForm, yearOptions } from './constants';
import Checkbox from '../../../../components/formControls/Checkbox/Checkbox';
import { CheckBoxOutlineBlank, CheckBoxOutlined } from '@mui/icons-material';
import { useAutocompleteStyles } from '../../../../hooks/styling/useAutocompleteStyles';

const AddRecallModal: React.FC<
  React.PropsWithChildren<React.PropsWithChildren<TAddRecallProps>>
> = ({ editingItem, open, onClose, setEditingItem }) => {
  const { makesModels } = useSelector((state: RootState) => state.vehicleDetails);
  const { allAssignedList } = useSelector((state: RootState) => state.serviceRequests);
  const [form, setForm] = useState<TForm>(initialForm);
  const [formIsChecked, setFormIsChecked] = useState<boolean>(false);

  const dispatch = useDispatch();
  const showError = useException();
  const { selectedSC } = useSCs();
  const { classes } = useStyles();
  const { classes: autocompleteClasses } = useAutocompleteStyles();

  useEffect(() => {
    if (open && selectedSC) {
      dispatch(loadMakesForPods(selectedSC.id));
    }
  }, [selectedSC, open]);

  useEffect(() => {
    if (open && editingItem) {
      const make = makesModels.find(el => el.id === editingItem.make?.id);
      const models =
        make?.models.filter(el => editingItem.models.find(item => item.id === el.id)) ?? [];
      const sr = allAssignedList.find(item => item.id === editingItem.serviceRequest?.id);
      setForm(() => ({
        recallCampaignNumber: editingItem.recallCampaignNumber ?? '',
        make: make ?? null,
        models: models,
        yearFrom: editingItem.yearFrom?.toString() ?? '',
        yearTo: editingItem.yearTo?.toString() ?? '',
        recallComponent: editingItem.recallComponent,
        recallSummary: editingItem.recallSummary,
        serviceRequest: sr ?? null,
        oemProgram: editingItem.oemProgram ?? '',
      }));
    }
  }, [open, editingItem, makesModels, allAssignedList]);

  const onCancel = () => {
    setForm(initialForm);
    setFormIsChecked(false);
    setEditingItem(null);
    onClose();
  };

  const onSave = () => {
    setFormIsChecked(true);
    const isValid = checkIsValid(form, showError);
    if (isValid && selectedSC) {
      const data: ICreateUpdateRecall = {
        recallCampaignNumber: form.recallCampaignNumber,
        makeId: form.make?.id ?? null,
        modelIds: form.models.map(el => el.id),
        yearFrom: form.yearFrom?.length ? +form.yearFrom : null,
        yearTo: form.yearTo?.length ? +form.yearTo : null,
        recallComponent: form.recallComponent,
        recallSummary: form.recallSummary,
        serviceRequestId: form.serviceRequest?.id ?? null,
        serviceCenterId: selectedSC.id,
      };
      if (form.oemProgram) data.oemProgram = form.oemProgram;
      if (editingItem) {
        dispatch(updateRecall(data, editingItem.id, showError, onCancel));
      } else {
        dispatch(createRecall(data, showError, onCancel));
      }
    }
  };

  const onFormChange: React.ChangeEventHandler<HTMLInputElement> = ({
    target: { name, value },
  }) => {
    setFormIsChecked(false);
    setForm(form => ({ ...form, [name]: value }));
  };

  const onYearChange =
    (name: 'yearFrom' | 'yearTo') => (e: ChangeEvent<{}>, value: string | null) => {
      setFormIsChecked(false);
      setForm(form => ({ ...form, [name]: value ?? '' }));
    };

  const onSummaryChange: React.ChangeEventHandler<HTMLTextAreaElement> = ({
    target: { value },
  }) => {
    setFormIsChecked(false);
    setForm(form => ({ ...form, recallSummary: value }));
  };

  const onMakeChange = (e: ChangeEvent<{}>, value: IMakeExtended | null) => {
    setFormIsChecked(false);
    setForm(prev => ({ ...prev, make: value, models: [] }));
  };

  const onModelChange = (e: ChangeEvent<{}>, value: IModel[]) => {
    setFormIsChecked(false);
    setForm(prev => ({ ...prev, models: value }));
  };

  const onSRChange = (e: ChangeEvent<{}>, value: IAssignedServiceRequest | null) => {
    setFormIsChecked(false);
    setForm(prev => ({ ...prev, serviceRequest: value }));
  };

  const renderModelOption = useCallback(
    (props: any, option: IModel) => {
      const checked = Boolean(form.models.find(el => el.id === option.id));
      return (
        <li style={{ display: 'flex', alignItems: 'center' }} {...props} key={option.id}>
          <Checkbox
            color="primary"
            icon={
              checked ? (
                <CheckBoxOutlined htmlColor="#3855FE" />
              ) : (
                <CheckBoxOutlineBlank htmlColor="#DADADA" />
              )
            }
            checked={checked}
          />
          {option.name}
        </li>
      );
    },
    [form]
  );

  return (
    <BaseModal open={open} onClose={onCancel} width={500}>
      <DialogTitle onClose={onCancel}>{editingItem ? 'Edit' : 'Add'} Recall</DialogTitle>
      <DialogContent>
        <TextField
          style={{ marginBottom: 10 }}
          fullWidth
          label="NHTSA Campaign"
          id="recallCampaignNumber"
          name="recallCampaignNumber"
          placeholder="Type NHTSA Campaign"
          error={formIsChecked && !form.recallCampaignNumber && !form.oemProgram}
          onChange={onFormChange}
          value={form.recallCampaignNumber}
        />
        <TextField
          style={{ marginBottom: 10 }}
          fullWidth
          label="OEM Program"
          id="oemProgram"
          name="oemProgram"
          placeholder="Type OEM Program"
          onChange={onFormChange}
          error={formIsChecked && !form.recallCampaignNumber && !form.oemProgram}
          value={form.oemProgram}
        />
        <Autocomplete
          style={{ marginBottom: 10 }}
          options={makesModels}
          value={form.make}
          isOptionEqualToValue={(o, v) => o.id === v.id}
          getOptionLabel={o => o.name}
          onChange={onMakeChange}
          renderInput={autocompleteRender({
            label: 'Make',
            error: formIsChecked && !form.make,
            placeholder: 'Select Make',
          })}
        />
        <Autocomplete
          style={{ marginBottom: 10 }}
          disabled={!form.make}
          options={form.make?.models ?? []}
          isOptionEqualToValue={(o, v) => o.id === v.id}
          getOptionLabel={o => o.name}
          value={form.models}
          onChange={onModelChange}
          renderOption={renderModelOption}
          multiple
          disableCloseOnSelect
          classes={autocompleteClasses}
          renderInput={autocompleteRender({
            label: 'Model',
            error: formIsChecked && !form.models,
            placeholder: 'Select Model',
          })}
        />
        <Autocomplete
          style={{ marginBottom: 10 }}
          options={yearOptions}
          isOptionEqualToValue={(option, value) => option === value}
          value={form?.yearFrom}
          onChange={onYearChange('yearFrom')}
          renderInput={autocompleteRender({
            label: 'Year From',
            placeholder: 'Select Year From',
            error: Boolean(form.yearFrom && form.yearTo && form.yearFrom > form.yearTo),
          })}
        />
        <Autocomplete
          style={{ marginBottom: 10 }}
          options={yearOptions}
          isOptionEqualToValue={(option, value) => option === value}
          value={form?.yearTo}
          onChange={onYearChange('yearTo')}
          renderInput={autocompleteRender({
            label: 'Year To',
            placeholder: 'Select Year To',
            error: Boolean(form.yearFrom && form.yearTo && form.yearFrom > form.yearTo),
          })}
        />
        <TextField
          fullWidth
          style={{ marginBottom: 10 }}
          label="Recall Component"
          id="recallComponent"
          name="recallComponent"
          placeholder="Type Recall Component"
          error={formIsChecked && !form.recallComponent}
          onChange={onFormChange}
          value={form.recallComponent}
        />
        <Textarea
          fullWidth
          multiline
          style={{ marginBottom: 10 }}
          error={formIsChecked && !form.recallSummary.length}
          placeholder="Type Recall Summary"
          label="Recall Summary"
          onChange={onSummaryChange}
          value={form.recallSummary}
          rows={3}
        />
        <Autocomplete
          style={{ marginBottom: 10 }}
          options={allAssignedList}
          isOptionEqualToValue={(o, v) => o.id === v.id}
          getOptionLabel={o => o.serviceRequest.code}
          getOptionKey={o => o.serviceRequest.code + o.id}
          value={form.serviceRequest}
          onChange={onSRChange}
          renderInput={autocompleteRender({
            label: 'Op Code Assignment',
            error: formIsChecked && !form.serviceRequest,
            placeholder: 'Select Op Code Assignment',
          })}
        />
      </DialogContent>
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
