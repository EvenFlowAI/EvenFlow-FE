import React, { Dispatch, SetStateAction, useCallback, useMemo } from 'react';
import { Autocomplete, Switch } from '@mui/material';
import { EServiceType } from '../../../../store/reducers/appointmentFrameReducer/types';
import { TextField } from '../../../../components/formControls/TextFieldStyled/TextField';
import { categoryOptions, getOptionLabel, getPageOptions, updateCodesWithOrder } from './utils';
import { autocompleteRender } from '../../../../utils/autocompleteRenders';
import { FileInput } from '../../../../components/formControls/FileInput/FileInput';
import { SearchInput } from '../../../../components/formControls/SearchInput/SearchInput';
import { Label, useStyles } from './styles';
import { EServiceCategoryType, ICategory } from '../../../../store/reducers/categories/types';
import OpsCodesSelected from './OpsCodesSelected/OpsCodesSelected';
import { CategoryFormState, IIconState, TOption } from './types';
import {
  loadAllAssignedServiceRequests,
  setAssignedFilter,
} from '../../../../store/reducers/serviceRequests/actions';
import { useSCs } from '../../../../hooks/useSCs/useSCs';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../store/rootReducer';
import { IAssignedServiceRequest } from '../../../../store/reducers/serviceRequests/types';

interface SettingsFormProps {
  editingItem: ICategory | null;
  form: CategoryFormState;
  setForm: Dispatch<SetStateAction<CategoryFormState>>;
}

const SettingsForm = ({ editingItem, form, setForm }: SettingsFormProps) => {
  const { classes } = useStyles();
  const { selectedSC } = useSCs();
  const dispatch = useDispatch();
  const { config } = useSelector((state: RootState) => state.bookingFlowConfig);
  const { categories } = useSelector((state: RootState) => state.categories);
  const { allAssignedList, assignedFilter } = useSelector(
    (state: RootState) => state.serviceRequests
  );

  const onNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>): void => {
    setForm(prev => ({ ...prev, categoryName: e.target.value, formIsChecked: false }));
  }, []);

  const onDefinedPageChange = useCallback(
    (e: React.SyntheticEvent, value: TOption | null): void => {
      setForm(prev => ({ ...prev, definedPage: value, formIsChecked: false }));
    },
    []
  );

  const handleSearch = useCallback(() => {
    if (selectedSC) {
      dispatch(loadAllAssignedServiceRequests(selectedSC.id));
    }
  }, [dispatch, selectedSC]);

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      dispatch(setAssignedFilter({ searchTerm: e.target.value }));
    },
    [dispatch]
  );

  const getCategoryOptions = () => {
    let options: TOption[] = categoryOptions;
    if (!visitCenterConfig?.valueService) {
      options = categoryOptions.filter(o => o.value !== EServiceCategoryType.ValueService);
    }
    if (form.definedPage?.value === 1) {
      options = categoryOptions.filter(
        o =>
          o.value !== EServiceCategoryType.MaintenancePackage &&
          o.value !== EServiceCategoryType.LinkToPage2
      );
    }
    return options;
  };

  const visitCenterConfig = useMemo(() => {
    const currentServiceType =
      form.selectedServiceType === EServiceType.VisitCenter
        ? EServiceType.VisitCenter
        : EServiceType.MobileService;
    return config.find(item => item.serviceType === currentServiceType);
  }, [config, form.selectedServiceType]);

  const onCategoryTypeChange = useCallback(
    (e: React.SyntheticEvent, value: TOption | null): void => {
      setForm(prev => ({
        ...prev,
        formIsChecked: false,
        categoryType: value,
        selectedCodes: [],
        selectedCodesWithOrder: [],
        wrongOrderIndexes: [],
      }));
    },
    []
  );

  const onOrderIndexChange = useCallback((e: React.SyntheticEvent, value: string): void => {
    setForm(prev => ({
      ...prev,
      orderIndex: value,
      formIsChecked: false,
    }));
  }, []);

  const handleSwitch = (e: React.SyntheticEvent, value: boolean) => {
    setForm(prev => ({ ...prev, isCommentRequired: value }));
  };

  const categoryHasCodesOrder = useMemo(
    () =>
      form.categoryType?.value === EServiceCategoryType.IndividualServices ||
      form.categoryType?.value === EServiceCategoryType.Diagnose,
    [form.categoryType]
  );

  const filteredIndCodes = useMemo(
    () => allAssignedList.filter(el => form.selectedCodesWithOrder.find(item => item.id === el.id)),
    [allAssignedList, form.selectedCodesWithOrder]
  );

  const onDelete = (serviceRequest: IAssignedServiceRequest) => {
    if (categoryHasCodesOrder) {
      setForm(prev => ({
        ...prev,
        selectedCodesWithOrder: updateCodesWithOrder(prev.selectedCodesWithOrder, serviceRequest),
      }));
    } else {
      setForm(prev => ({
        ...prev,
        selectedCodes: prev.selectedCodes.filter(el => el.id !== serviceRequest.id),
      }));
    }
  };

  return (
    <>
      <div className={classes.inputsWrapper}>
        <div>
          <TextField
            fullWidth
            label="Service Category Name"
            placeholder="Type Service Category Name"
            error={!form.categoryName && form.formIsChecked}
            onChange={onNameChange}
            value={form.categoryName}
          />
        </div>
        <Autocomplete
          options={getPageOptions(form.selectedServiceType)}
          isOptionEqualToValue={option => option.value === form.definedPage?.value}
          getOptionLabel={option => option.name}
          value={form.definedPage}
          onChange={onDefinedPageChange}
          renderInput={autocompleteRender({
            label: 'Define Page',
            placeholder: 'Select a page',
          })}
        />
        <FileInput
          setState={(action: SetStateAction<IIconState>) => {
            setForm(prev => ({
              ...prev,
              fileState: typeof action === 'function' ? action(prev.fileState) : action,
            }));
          }}
          label={`${form.fileState.file || editingItem?.iconPath ? 'Update' : 'Upload'} Service Category Icon`}
        />
        <div className={classes.inputWrapper}>
          <label className={classes.label}>Add Op Codes</label>
          <SearchInput
            onSearch={handleSearch}
            onChange={handleSearchChange}
            value={assignedFilter.searchTerm}
          />
        </div>
        <Autocomplete
          options={getCategoryOptions()}
          isOptionEqualToValue={option => option.value === form.categoryType?.value}
          getOptionLabel={getOptionLabel}
          value={form.categoryType}
          onChange={onCategoryTypeChange}
          renderInput={autocompleteRender({
            label: 'Link for Booking Flow',
            placeholder: 'Select Link To Screen On Booking Flow',
            error: !form.categoryType && form.formIsChecked,
          })}
        />
        <Autocomplete
          disableClearable
          options={categories.map((el, index) => `${index + 1}`).concat(`${categories.length + 1}`)}
          value={form.orderIndex}
          isOptionEqualToValue={(o, v) => o === v}
          onChange={onOrderIndexChange}
          renderInput={autocompleteRender({
            label: 'Order Index for Booking Flow',
            placeholder: 'Select Order Index',
            error: !form.orderIndex && form.formIsChecked,
          })}
        />
        <Label
          control={
            <Switch
              disabled={
                !form.categoryType ||
                form.categoryType?.value !== EServiceCategoryType.GeneralCategory
              }
              onChange={handleSwitch}
              checked={form.isCommentRequired}
              color="primary"
            />
          }
          label="Comment Field Is Required"
          labelPlacement="start"
        />
        <OpsCodesSelected
          selectedCodes={categoryHasCodesOrder ? filteredIndCodes : form.selectedCodes}
          onDelete={onDelete}
        />
      </div>
    </>
  );
};

export default SettingsForm;
