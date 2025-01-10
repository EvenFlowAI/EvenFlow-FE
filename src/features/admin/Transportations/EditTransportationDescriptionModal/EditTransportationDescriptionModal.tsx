import React, {
  useEffect,
  useState,
  useCallback,
  HTMLAttributes,
  useMemo,
  ChangeEvent,
} from 'react';
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
import Checkbox from '../../../../components/formControls/Checkbox/Checkbox';
import { CheckBoxOutlineBlank, CheckBoxOutlined } from '@mui/icons-material';
import { useAutocompleteStyles } from '../../../../hooks/styling/useAutocompleteStyles';
import { autocompleteRender } from '../../../../utils/autocompleteRenders';
import { TOption } from '../types';
import { RootState } from '../../../../store/rootReducer';
import { useSelector } from 'react-redux';

const initialFileState = { file: null, dataUrl: undefined };

export const EditTransportationDescriptionModal: React.FC<
  React.PropsWithChildren<
    React.PropsWithChildren<DialogProps & { editingElement: ITransportationOptionFull | null }>
  >
> = ({ editingElement, ...props }) => {
  const { allAssignedList } = useSelector((state: RootState) => state.serviceRequests);
  const [description, setDescription] = useState<string>('');
  const [formIsChecked, setFormIsChecked] = useState<boolean>(false);
  const [orderIndex, setOrderIndex] = useState<string>('');
  const [serviceRequests, setServiceRequests] = useState<TOption[]>([]);
  const [fileState, setFileState] = useState<IIconState>(initialFileState);
  const { classes } = useStyles();
  const { selectedSC } = useSCs();
  const dispatch = useDispatch();
  const showError = useException();
  const showMessage = useMessage();
  const { classes: autocompleteClasses } = useAutocompleteStyles();

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
    setServiceRequests([]);
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
              serviceRequestId: serviceRequests[0].value ?? undefined,
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

  const onRequestCheckboxChange = useCallback((event: React.SyntheticEvent, value: TOption) => {
    setFormIsChecked(false);
    console.log('here');
  }, []);

  const renderRequestOption = useCallback(
    (props: HTMLAttributes<HTMLLIElement>, option: TOption) => {
      const checked = !!serviceRequests.find(item => item.value === option.value);
      return (
        <li style={{ display: 'flex', alignItems: 'center' }} {...props} key={option.name}>
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
            onChange={e => onRequestCheckboxChange(e, option)}
          />
          {option.name}
        </li>
      );
    },
    [serviceRequests, onRequestCheckboxChange]
  );

  useEffect(() => {
    if (editingElement && props.open) {
      const { rules } = editingElement;
      if (rules) {
        if (rules.isAllServiceRequestsIncluded) {
          setServiceRequests(
            allAssignedList.map((item: any) => ({
              name: item.serviceRequest.code,
              value: item.id,
            }))
          );
        } else {
          setServiceRequests(
            rules.serviceRequests.map(item => ({
              value: item.id,
              name: item.code,
            }))
          );
        }
      }
    }
  }, [editingElement, props.open, allAssignedList]);

  const requestsOptions = useMemo(() => {
    const options = allAssignedList.map(item => ({
      name: item.serviceRequest.code,
      value: item.id,
    }));
    return options;
  }, [allAssignedList]);

  const onRequestChange = useCallback(
    (event: React.SyntheticEvent, value: TOption[], reason: string) => {
      setFormIsChecked(false);
      setServiceRequests([value[value.length - 1]]);
    },
    [allAssignedList]
  );

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
            multiple
            style={{ marginBottom: 20 }}
            classes={autocompleteClasses}
            options={requestsOptions}
            disableCloseOnSelect
            disableClearable
            getOptionLabel={option => option.name}
            isOptionEqualToValue={(o, v) => o.value === v.value}
            renderOption={renderRequestOption}
            value={serviceRequests}
            onChange={onRequestChange}
            renderInput={autocompleteRender({
              label: 'Op Codes',
              error: !serviceRequests.length && formIsChecked,
              placeholder: 'Select Op Codes',
            })}
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
