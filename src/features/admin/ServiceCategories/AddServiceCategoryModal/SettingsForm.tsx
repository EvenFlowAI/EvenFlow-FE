import React, { Dispatch, SetStateAction, useCallback, useMemo } from 'react';
import { Autocomplete, Switch } from '@mui/material';
import { EServiceType } from '../../../../store/reducers/appointmentFrameReducer/types';
import { TextField } from '../../../../components/formControls/TextFieldStyled/TextField';
import { categoryOptions, getOptionLabel, getPageOptions } from './utils';
import { autocompleteRender } from '../../../../utils/autocompleteRenders';
import { FileInput } from '../../../../components/formControls/FileInput/FileInput';
import { Label, useStyles } from './styles';
import { EServiceCategoryType, ICategory } from '../../../../store/reducers/categories/types';
import { CategoryFormState, IIconState, TOption } from './types';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../store/rootReducer';

interface SettingsFormProps {
  editingItem: ICategory | null;
  form: CategoryFormState;
  setForm: Dispatch<SetStateAction<CategoryFormState>>;
}

interface IServiceTypeOption {
  label: string;
  value: EServiceType;
}

const SettingsForm = ({ editingItem, form, setForm }: SettingsFormProps) => {
  const { classes } = useStyles();
  const { config } = useSelector((state: RootState) => state.bookingFlowConfig);
  const { categories } = useSelector((state: RootState) => state.categories);

  const serviceTypeOptions: IServiceTypeOption[] = useMemo(
    () => [
      { label: 'Visit Center', value: EServiceType.VisitCenter },
      { label: 'Mobile Service', value: EServiceType.MobileService },
    ],
    []
  );

  const onNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>): void => {
    setForm(prev => ({ ...prev, categoryName: e.target.value, formIsChecked: false }));
  }, []);

  const onDescriptionChange = useCallback((e: React.ChangeEvent<HTMLInputElement>): void => {
    setForm(prev => ({ ...prev, description: e.target.value, formIsChecked: false }));
  }, []);

  const onDefinedPageChange = useCallback(
    (e: React.SyntheticEvent, value: TOption | null): void => {
      setForm(prev => ({ ...prev, definedPage: value, formIsChecked: false }));
    },
    []
  );

  const handleTypeChange = (e: React.SyntheticEvent, value: IServiceTypeOption | null): void => {
    setForm(prev => ({
      ...prev,
      selectedServiceType: value?.value ?? prev.selectedServiceType,
      formIsChecked: false,
    }));
  };

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

  return (
    <>
      <div className={classes.inputsWrapper}>
        <div style={{ display: 'flex', gap: '24px', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <TextField
              style={{ width: '272px' }}
              label="Service Category Name"
              placeholder="Type Service Category Name"
              error={!form.categoryName && form.formIsChecked}
              onChange={onNameChange}
              value={form.categoryName}
            />
          </div>
          <div>
            <TextField
              style={{ width: '401px' }}
              label="Description"
              placeholder="Enter Description"
              onChange={onDescriptionChange}
              value={form.description}
            />
          </div>
          <Autocomplete
            options={serviceTypeOptions}
            isOptionEqualToValue={(option, value) => option.value === value.value}
            getOptionLabel={option => option.label}
            style={{ width: '151px' }}
            value={
              serviceTypeOptions.find(option => option.value === form.selectedServiceType) ?? null
            }
            onChange={handleTypeChange}
            renderInput={autocompleteRender({
              label: 'Booking Flow',
              placeholder: 'Select a Booking Flow',
            })}
          />
        </div>
        <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
          <Autocomplete
            style={{ width: '276px' }}
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
          <Autocomplete
            style={{ width: '276px' }}
            options={getCategoryOptions()}
            isOptionEqualToValue={option => option.value === form.categoryType?.value}
            getOptionLabel={getOptionLabel}
            value={form.categoryType}
            onChange={onCategoryTypeChange}
            renderInput={autocompleteRender({
              label: 'Category Type',
              placeholder: 'Select Category Type',
              error: !form.categoryType && form.formIsChecked,
            })}
          />
          <Autocomplete
            disableClearable
            options={categories
              .map((el, index) => `${index + 1}`)
              .concat(`${categories.length + 1}`)}
            value={form.orderIndex}
            style={{ width: '101px' }}
            isOptionEqualToValue={(o, v) => o === v}
            onChange={onOrderIndexChange}
            renderInput={autocompleteRender({
              label: 'Order',
              placeholder: 'Order',
              error: !form.orderIndex && form.formIsChecked,
            })}
          />
          <div style={{ width: '151px', paddingTop: '21px' }}>
            <FileInput
              setState={(action: SetStateAction<IIconState>) => {
                setForm(prev => ({
                  ...prev,
                  fileState: typeof action === 'function' ? action(prev.fileState) : action,
                }));
              }}
              label={`${form.fileState.file || editingItem?.iconPath ? 'Update' : 'Upload'} Icon`}
            />
          </div>
        </div>
      </div>
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
    </>
  );
};

export default SettingsForm;
