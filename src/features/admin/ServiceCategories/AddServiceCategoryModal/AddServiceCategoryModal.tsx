import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  BaseModal,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '../../../../components/modals/BaseModal/BaseModal';
import { DialogProps } from '../../../../components/modals/BaseModal/types';
import {
  EServiceCategoryType,
  ICategory,
  TNewCategory,
} from '../../../../store/reducers/categories/types';
import { Button, Divider, FormControlLabel, Radio, RadioGroup } from '@mui/material';
import { TextField } from '../../../../components/formControls/TextFieldStyled/TextField';
import { useDispatch, useSelector } from 'react-redux';
import {
  loadAllAssignedServiceRequests,
  setAssignedFilter,
} from '../../../../store/reducers/serviceRequests/actions';
import { RootState } from '../../../../store/rootReducer';
import {
  createCategory,
  updateCategory,
  updateCategoryIcon,
} from '../../../../store/reducers/categories/actions';
import { OpsCodesTable } from './OpsCodesTable/OpsCodesTable';
import { loadBookingFlowConfig } from '../../../../store/reducers/bookingFlowConfig/actions';
import { EServiceType } from '../../../../store/reducers/appointmentFrameReducer/types';
import { OpsCodesOrderTable } from './OpsCodesOrderTable/OpsCodesOrderTable';
import { CategoryFormState, initialFormState } from './types';
import { useStyles } from './styles';
import {
  buildCategoryData,
  categoryOptions,
  findMissingNumbers,
  getPageOptions,
  validateCategoryType,
} from './utils';
import { visitCenterTabs } from '../constants';
import { useException } from '../../../../hooks/useException/useException';
import { useSCs } from '../../../../hooks/useSCs/useSCs';
import { useMessage } from '../../../../hooks/useMessage/useMessage';
import SettingsForm from './SettingsForm';

type TAddServiceCategoryProps = DialogProps & {
  editingItem: ICategory | null;
  tabValue: string;
};

const initialFileState = { file: null, dataUrl: undefined };

export const AddServiceCategoryModal: React.FC<
  React.PropsWithChildren<React.PropsWithChildren<TAddServiceCategoryProps>>
> = ({ editingItem, tabValue, ...props }) => {
  const { allAssignedList } = useSelector((state: RootState) => state.serviceRequests);
  const { page, filter } = useSelector((state: RootState) => state.categories);
  const { config } = useSelector((state: RootState) => state.bookingFlowConfig);
  const [form, setForm] = useState<CategoryFormState>(initialFormState);
  const tabServiceType = visitCenterTabs.includes(tabValue)
    ? EServiceType.VisitCenter
    : EServiceType.MobileService;

  const { selectedSC } = useSCs();
  const dispatch = useDispatch();
  const showError = useException();
  const showMessage = useMessage();
  const { classes } = useStyles();

  const disabledOpsCodes = useMemo(
    () =>
      form.categoryType?.value === EServiceCategoryType.MaintenancePackage ||
      form.categoryType?.value === EServiceCategoryType.LinkToPage2 ||
      form.categoryType?.value === EServiceCategoryType.ValueService ||
      form.categoryType?.value === EServiceCategoryType.OpenRecalls,
    [form.categoryType]
  );

  const visitCenterConfig = useMemo(() => {
    const currentServiceType =
      form.selectedServiceType === EServiceType.VisitCenter
        ? EServiceType.VisitCenter
        : EServiceType.MobileService;
    return config.find(item => item.serviceType === currentServiceType);
  }, [config, form.selectedServiceType]);

  const categoryHasCodesOrder = useMemo(
    () =>
      form.categoryType?.value === EServiceCategoryType.IndividualServices ||
      form.categoryType?.value === EServiceCategoryType.Diagnose,
    [form.categoryType]
  );

  useEffect(() => {
    setForm(prev => ({ ...prev, selectedServiceType: filter }));
  }, [filter]);

  useEffect(() => {
    if (props.open && selectedSC) dispatch(loadAllAssignedServiceRequests(selectedSC.id));
    const currentPageOption = getPageOptions(form.selectedServiceType).find(
      item => item.value === page
    );
    if (currentPageOption) setForm(prev => ({ ...prev, definedPage: currentPageOption }));
  }, [selectedSC, page, getPageOptions, props.open, form.selectedServiceType]);

  useEffect(() => {
    if (editingItem && allAssignedList && props.open) {
      setForm(prev => ({ ...prev, categoryName: editingItem.name }));

      const page = getPageOptions(form.selectedServiceType).find(
        option => option.value === +editingItem.page
      );
      if (page) setForm(prev => ({ ...prev, definedPage: page }));

      if (
        editingItem.type === EServiceCategoryType.IndividualServices ||
        editingItem.type === EServiceCategoryType.Diagnose
      ) {
        const requests = editingItem.serviceRequests.map(({ id, orderIndex }) => ({
          id,
          orderIndex: orderIndex === undefined ? '0' : orderIndex.toString(),
        }));
        setForm(prev => ({ ...prev, selectedCodesWithOrder: requests }));
      } else {
        setForm(prev => ({
          ...prev,
          selectedCodes: allAssignedList.filter(item =>
            editingItem.serviceRequests.find(el => el.id === item.id)
          ),
        }));
      }

      const currentType = categoryOptions.find(item => item.value === +editingItem.type);
      if (currentType) setForm(prev => ({ ...prev, categoryType: currentType }));

      if (editingItem.orderIndex)
        setForm(prev => ({ ...prev, orderIndex: editingItem?.orderIndex?.toString() || '' }));
      if (editingItem.description)
        setForm(prev => ({ ...prev, description: editingItem.description || '' }));
      if (editingItem.isCommentRequired)
        setForm(prev => ({ ...prev, isCommentRequired: editingItem.isCommentRequired || false }));
    }
  }, [editingItem, allAssignedList, categoryOptions, props.open, form.selectedServiceType]);

  useEffect(() => {
    if (selectedSC) {
      dispatch(loadBookingFlowConfig(selectedSC.id));
    }
  }, [dispatch, selectedSC]);

  const onCancel = useCallback(() => {
    setForm(prev => ({
      ...prev,
      formIsChecked: false,
      categoryName: '',
      fileState: initialFileState,
      selectedCodes: [],
      selectedCodesWithOrder: [],
      categoryType: null,
      orderIndex: '',
      description: '',
      isCommentRequired: false,
      selectedServiceType: filter,
      wrongOrderIndexes: [],
    }));

    dispatch(setAssignedFilter({ searchTerm: '' }));
    props.onClose();
  }, []);

  const onDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, description: e.target.value }));
  };

  const onSuccessCreate = useCallback(
    (categoryId: number) => {
      if (form.fileState.file)
        dispatch(
          updateCategoryIcon(categoryId, form.fileState.file, tabServiceType, onError, onCancel)
        );
    },
    [form.fileState, tabServiceType]
  );

  const onError = (err: string) => {
    if (categoryHasCodesOrder) {
      const orderIndexes = form.selectedCodesWithOrder.map(item => +item.orderIndex);
      const { wrongNumbers } = findMissingNumbers(orderIndexes);
      setForm(prev => ({ ...prev, wrongOrderIndexes: wrongNumbers }));
    }
    showError(err);
  };

  const onSuccessfulUpdate = () => showMessage('Category updated');

  const onSuccessfulCreate = () => {
    showMessage('Category created');
    onCancel();
  };

  const onSave = useCallback(() => {
    if (!selectedSC) return;

    setForm(prev => ({ ...prev, formIsChecked: true }));

    if (!validateCategoryType(form, visitCenterConfig, showError)) return;

    const data = buildCategoryData(form, categoryHasCodesOrder, setForm, showError);
    if (!data) return;

    if (editingItem) {
      if (form.fileState.file) {
        dispatch(updateCategory(editingItem.id, data, tabServiceType, onError, onSuccessfulUpdate));
        dispatch(
          updateCategoryIcon(editingItem.id, form.fileState.file, tabServiceType, onError, onCancel)
        );
      } else {
        dispatch(
          updateCategory(editingItem.id, data, tabServiceType, onError, () => {
            onCancel();
            onSuccessfulUpdate();
          })
        );
      }
    } else {
      const newData: TNewCategory = { ...data, serviceCenterId: selectedSC.id };
      dispatch(
        createCategory(newData, onSuccessCreate, tabServiceType, onError, onSuccessfulCreate)
      );
    }
  }, [selectedSC, form, categoryHasCodesOrder, editingItem, visitCenterConfig, tabServiceType]);

  const handleTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({
      ...prev,
      selectedServiceType:
        e.target.value === '0' ? EServiceType.VisitCenter : EServiceType.MobileService,
    }));
  };

  return (
    <BaseModal {...props} width={1128} onClose={onCancel}>
      <DialogTitle onClose={onCancel}>{editingItem ? 'Edit' : 'Add'} Service Category</DialogTitle>
      <DialogContent>
        <RadioGroup
          row
          aria-label="countType"
          name="countType"
          value={form.selectedServiceType}
          onChange={handleTypeChange}
          className={classes.radioGroup}
        >
          <FormControlLabel
            value={EServiceType.VisitCenter}
            control={<Radio color="primary" />}
            label="VISIT CENTER"
            labelPlacement="end"
          />
          <FormControlLabel
            value={EServiceType.MobileService}
            control={<Radio color="primary" />}
            label="MOBILE SERVICE"
            labelPlacement="end"
          />
        </RadioGroup>
        <SettingsForm editingItem={editingItem} form={form} setForm={setForm} />
        <TextField
          fullWidth
          value={form.description}
          label="Service Category Description"
          placeholder="Enter Description"
          onChange={onDescriptionChange}
        />
        <Divider />
        {categoryHasCodesOrder ? (
          <OpsCodesOrderTable form={form} setForm={setForm} disabled={disabledOpsCodes} />
        ) : (
          <OpsCodesTable form={form} setForm={setForm} disabled={disabledOpsCodes} />
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} color="info">
          Cancel
        </Button>
        <Button onClick={onSave} color="primary" variant="contained">
          Save
        </Button>
      </DialogActions>
    </BaseModal>
  );
};
