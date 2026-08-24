import React, { SyntheticEvent, useCallback, useEffect, useMemo, useState } from 'react';
import {
  BaseModal,
  DialogActions,
  DialogTitle,
} from '../../../../components/modals/BaseModal/BaseModal';
import { Button } from '@mui/material';
import { setAssignedFilter } from '../../../../store/reducers/serviceRequests/actions';
import { useDispatch, useSelector } from 'react-redux';
import { IIconState } from '../../ServiceCategories/AddServiceCategoryModal/types';
import { DialogProps } from '../../../../components/modals/BaseModal/types';
import { IFirstScreenOption } from '../../../../store/reducers/serviceTypes/types';
import { TOption } from '../../../../types/types';
import { EServiceType } from '../../../../store/reducers/appointmentFrameReducer/types';
import {
  createFirstScreenOption,
  updateFirstScreenOption,
  updateFirstScreenOptionIcon,
} from '../../../../store/reducers/serviceTypes/actions';
import {
  ETransportationType,
  ITransportationOptionFull,
} from '../../../../store/reducers/transportationNeeds/types';
import { RootState } from '../../../../store/rootReducer';
import { loadTransportationOptions } from '../../../../store/reducers/transportationNeeds/actions';
import { useStyles } from './styles';
import { useException } from '../../../../hooks/useException/useException';
import { useSCs } from '../../../../hooks/useSCs/useSCs';
import { useMessage } from '../../../../hooks/useMessage/useMessage';
import { AddFirstScreenOptionModalForm } from './AddFirstScreenOptionModalForm';
import {
  buildFirstScreenOptionCreateData,
  buildFirstScreenOptionUpdateData,
  getInitialFormState,
  getServiceTypeOptions,
  resolveDefaultTransportationForEdit,
  shouldApplyPickupDeliveryDefault,
  shouldClearTransportationOnServiceTypeChange,
  shouldShowPickupDropOffWarning,
  validateFirstScreenOptionForm,
} from './helpers';

const initialFileState = { file: null, dataUrl: undefined };

type TAddFirstScreenOptionProps = DialogProps & {
  editingItem: IFirstScreenOption | null;
};

export const AddFirstScreenOptionModal: React.FC<
  React.PropsWithChildren<React.PropsWithChildren<TAddFirstScreenOptionProps>>
> = ({ editingItem, ...props }) => {
  const { options } = useSelector((state: RootState) => state.transportation);
  const [fileState, setFileState] = useState<IIconState>(initialFileState);
  const [firstScreenOptionName, setFirstScreenOptionName] = useState<string>('');
  const [externalLink, setExternalLink] = useState<string>('');
  const [formIsChecked, setFormIsChecked] = useState<boolean>(false);
  const [orderIndex, setOrderIndex] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [note, setNote] = useState<string>('');
  const [selectedServiceType, setSelectedServiceType] = useState<TOption | null>({
    value: '0',
    name: 'Visit Center',
  });
  const [defaultTransportation, setDefaultTransportation] =
    useState<ITransportationOptionFull | null>(null);
  const [taglineText, setTaglineText] = useState<string>('');
  const [taglineColor, setTaglineColor] = useState<string>('');

  const { selectedSC } = useSCs();
  const dispatch = useDispatch();
  const showError = useException();
  const showMessage = useMessage();
  const { classes } = useStyles();
  const serviceTypeOptions = useMemo(() => getServiceTypeOptions(), []);

  const enabledTransportationOptions = useMemo(() => options.filter(op => op.state), [options]);
  const pickUpDeliveryOption = useMemo(
    () =>
      enabledTransportationOptions.find(
        option => option.type === ETransportationType.PickUpDelivery
      ) ?? null,
    [enabledTransportationOptions]
  );
  const isPickUpDropOffType = selectedServiceType?.value === EServiceType.PickUpDropOff.toString();
  const isTransportationDisabled = useMemo(
    () =>
      !enabledTransportationOptions.length ||
      selectedServiceType?.value === EServiceType.MobileService.toString(),
    [selectedServiceType, EServiceType, enabledTransportationOptions]
  );

  useEffect(() => {
    if (selectedSC) dispatch(loadTransportationOptions(selectedSC.id));
  }, [selectedSC]);

  useEffect(() => {
    if (props.open && editingItem) {
      setFirstScreenOptionName(editingItem.name);
      const nextState = getInitialFormState(editingItem);
      setOrderIndex(nextState.orderIndex);
      setDescription(nextState.description);
      setNote(nextState.note);
      setExternalLink(nextState.externalLink);
      setTaglineText(nextState.taglineText);
      setTaglineColor(nextState.taglineColor);

      const transportation = resolveDefaultTransportationForEdit(editingItem, options);
      if (transportation) setDefaultTransportation(transportation);

      if (editingItem.type >= 0) {
        const serviceTypeOption = serviceTypeOptions.find(
          item => item.value.toString() === editingItem.type.toString()
        );
        if (serviceTypeOption) setSelectedServiceType(serviceTypeOption);
      }
    }
  }, [props.open, editingItem, options, serviceTypeOptions]);

  useEffect(() => {
    if (!props.open || editingItem || !isPickUpDropOffType || defaultTransportation) {
      return;
    }

    if (pickUpDeliveryOption) {
      setDefaultTransportation(pickUpDeliveryOption);
    }
  }, [props.open, editingItem, isPickUpDropOffType, defaultTransportation, pickUpDeliveryOption]);

  const onCancel = useCallback(() => {
    setFormIsChecked(false);
    setFirstScreenOptionName('');
    dispatch(setAssignedFilter({ searchTerm: '' }));
    setFileState(initialFileState);
    setOrderIndex('');
    setDescription('');
    setExternalLink('');
    setNote('');
    setSelectedServiceType(null);
    setDefaultTransportation(null);
    setTaglineColor('');
    setTaglineText('');
    props.onClose();
  }, [dispatch, props]);

  const onDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDescription(e.target.value);
  };
  const onNoteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNote(e.target.value);
  };

  const onSuccessCreate = useCallback(
    (
      serviceTypeId: number,
      serviceType: string,
      defaultTransportationType?: ETransportationType
    ) => {
      if (shouldShowPickupDropOffWarning(serviceType, defaultTransportationType)) {
        showMessage(
          '“Time of Day” transportation constraint does not apply to Service Valet slots',
          'warning'
        );
      }
      if (fileState.file && selectedSC) {
        dispatch(
          updateFirstScreenOptionIcon(serviceTypeId, selectedSC.id, fileState.file, showError)
        );
      }
      onCancel();
    },
    [dispatch, fileState, onCancel, selectedSC, showError, showMessage]
  );

  const onNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>): void => {
    setFormIsChecked(false);
    setFirstScreenOptionName(e.target.value);
  }, []);

  const onLinkChange = useCallback((e: React.ChangeEvent<HTMLInputElement>): void => {
    setFormIsChecked(false);
    setExternalLink(e.target.value);
  }, []);

  const onOrderIndexChange = useCallback((e: SyntheticEvent, value: string): void => {
    setFormIsChecked(false);
    setOrderIndex(value);
  }, []);

  const onTransportationChange = useCallback(
    (e: SyntheticEvent, value: ITransportationOptionFull | null): void => {
      setFormIsChecked(false);
      setDefaultTransportation(value);
    },
    []
  );

  const onSave = () => {
    const isValid = validateFirstScreenOptionForm({
      selectedServiceType,
      orderIndex,
      isPickUpDropOffType,
      defaultTransportation,
      showError,
    });

    if (!isValid || !selectedSC) {
      return;
    }

    const data = buildFirstScreenOptionUpdateData({
      firstScreenOptionName,
      description,
      note,
      selectedServiceType,
      orderIndex,
      taglineText,
      taglineColor,
      externalLink,
      defaultTransportation,
    });

    if (editingItem) {
      dispatch(
        updateFirstScreenOption(
          editingItem.id,
          selectedSC.id,
          data,
          onSuccessCreate,
          showError,
          defaultTransportation?.type
        )
      );
      return;
    }

    const newData = buildFirstScreenOptionCreateData(data, selectedSC.id);
    dispatch(
      createFirstScreenOption(
        newData,
        selectedSC.id,
        onSuccessCreate,
        showError,
        defaultTransportation?.type
      )
    );
  };

  const onServiceTypeChange = useCallback(
    (_e: SyntheticEvent, value: TOption | null) => {
      setFormIsChecked(false);
      setSelectedServiceType(value);

      if (shouldClearTransportationOnServiceTypeChange(value, defaultTransportation)) {
        setDefaultTransportation(null);
      }

      if (shouldApplyPickupDeliveryDefault(value, defaultTransportation, editingItem)) {
        setDefaultTransportation(pickUpDeliveryOption);
      }
    },
    [defaultTransportation, editingItem, pickUpDeliveryOption]
  );

  const onTaglineTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormIsChecked(false);
    if (e.target.value.length > 30) {
      showError('Tagline Text must not include more than 30 symbols');
    } else {
      setTaglineText(e.target.value);
    }
  };

  const onTaglineColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormIsChecked(false);
    if (e.target.value.match(/^[a-zA-Z0-9]*$/)) {
      setTaglineColor(e.target.value.trim());
    } else {
      showError('Tagline Font Color Hex must consist letters and digits only');
    }
  };

  return (
    <BaseModal {...props} width={1128} onClose={onCancel}>
      <DialogTitle onClose={onCancel}>
        {editingItem ? 'Edit' : 'Add'} First Screen Option
      </DialogTitle>
      <AddFirstScreenOptionModalForm
        classNames={{
          inputsWrapper: classes.inputsWrapper,
          twoInputsWrapper: classes.twoInputsWrapper,
        }}
        editingIconPath={editingItem?.iconPath}
        fileState={fileState}
        setFileState={setFileState}
        formIsChecked={formIsChecked}
        firstScreenOptionName={firstScreenOptionName}
        selectedServiceType={selectedServiceType}
        orderIndex={orderIndex}
        enabledTransportationOptions={enabledTransportationOptions}
        defaultTransportation={defaultTransportation}
        isPickUpDropOffType={isPickUpDropOffType}
        isTransportationDisabled={isTransportationDisabled}
        externalLink={externalLink}
        description={description}
        note={note}
        taglineText={taglineText}
        taglineColor={taglineColor}
        serviceTypeOptions={serviceTypeOptions}
        onNameChange={onNameChange}
        onServiceTypeChange={onServiceTypeChange}
        onOrderIndexChange={onOrderIndexChange}
        onTransportationChange={onTransportationChange}
        onLinkChange={onLinkChange}
        onDescriptionChange={onDescriptionChange}
        onNoteChange={onNoteChange}
        onTaglineTextChange={onTaglineTextChange}
        onTaglineColorChange={onTaglineColorChange}
      />
      <DialogActions>
        <Button onClick={onCancel} className={classes.cancelButton}>
          Cancel
        </Button>
        <Button onClick={onSave} color="primary" variant="contained">
          Save
        </Button>
      </DialogActions>
    </BaseModal>
  );
};
