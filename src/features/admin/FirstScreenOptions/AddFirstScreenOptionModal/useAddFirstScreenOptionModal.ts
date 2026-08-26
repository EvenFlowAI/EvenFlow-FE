import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setAssignedFilter } from '../../../../store/reducers/serviceRequests/actions';
import { IIconState } from '../../ServiceCategories/AddServiceCategoryModal/types';
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
import { useException } from '../../../../hooks/useException/useException';
import { useMessage } from '../../../../hooks/useMessage/useMessage';
import { useSCs } from '../../../../hooks/useSCs/useSCs';
import {
  buildFirstScreenOptionCreateData,
  buildFirstScreenOptionUpdateData,
  getInitialFormState,
  getServiceTypeOptions,
  resolveDefaultTransportationForEdit,
  shouldShowPickupDropOffWarning,
  validateFirstScreenOptionForm,
} from './helpers';
import { useAddFirstScreenOptionModalHandlers } from './useAddFirstScreenOptionModalHandlers';

type TUseAddFirstScreenOptionModalProps = {
  editingItem: IFirstScreenOption | null;
  open: boolean;
  onClose: () => void;
};

const initialFileState: IIconState = { file: null, dataUrl: undefined };

export const useAddFirstScreenOptionModal = ({
  editingItem,
  open,
  onClose,
}: TUseAddFirstScreenOptionModalProps) => {
  const { options } = useSelector((state: RootState) => state.transportation);
  const [fileState, setFileState] = useState<IIconState>(initialFileState);
  const [firstScreenOptionName, setFirstScreenOptionName] = useState('');
  const [externalLink, setExternalLink] = useState('');
  const [formIsChecked, setFormIsChecked] = useState(false);
  const [orderIndex, setOrderIndex] = useState('');
  const [description, setDescription] = useState('');
  const [note, setNote] = useState('');
  const [selectedServiceType, setSelectedServiceType] = useState<TOption | null>({
    value: '0',
    name: 'Visit Center',
  });
  const [defaultTransportation, setDefaultTransportation] =
    useState<ITransportationOptionFull | null>(null);
  const [taglineText, setTaglineText] = useState('');
  const [taglineColor, setTaglineColor] = useState('');

  const dispatch = useDispatch();
  const showError = useException();
  const showMessage = useMessage();
  const { selectedSC } = useSCs();
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
    [enabledTransportationOptions, selectedServiceType]
  );

  useEffect(() => {
    if (selectedSC) {
      dispatch(loadTransportationOptions(selectedSC.id));
    }
  }, [dispatch, selectedSC]);

  useEffect(() => {
    if (!open || !editingItem) {
      return;
    }

    setFirstScreenOptionName(editingItem.name);
    const nextState = getInitialFormState(editingItem);
    setOrderIndex(nextState.orderIndex);
    setDescription(nextState.description);
    setNote(nextState.note);
    setExternalLink(nextState.externalLink);
    setTaglineText(nextState.taglineText);
    setTaglineColor(nextState.taglineColor);

    const transportation = resolveDefaultTransportationForEdit(editingItem, options);
    if (transportation) {
      setDefaultTransportation(transportation);
    }

    if (editingItem.type >= 0) {
      const serviceTypeOption = serviceTypeOptions.find(
        item => item.value.toString() === editingItem.type.toString()
      );
      if (serviceTypeOption) {
        setSelectedServiceType(serviceTypeOption);
      }
    }
  }, [editingItem, open, options, serviceTypeOptions]);

  useEffect(() => {
    if (!open || editingItem || !isPickUpDropOffType || defaultTransportation) {
      return;
    }

    if (pickUpDeliveryOption) {
      setDefaultTransportation(pickUpDeliveryOption);
    }
  }, [defaultTransportation, editingItem, isPickUpDropOffType, open, pickUpDeliveryOption]);

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
    onClose();
  }, [dispatch, onClose]);

  const {
    onNameChange,
    onLinkChange,
    onOrderIndexChange,
    onTransportationChange,
    onServiceTypeChange,
    onTaglineTextChange,
    onTaglineColorChange,
    onDescriptionChange,
    onNoteChange,
  } = useAddFirstScreenOptionModalHandlers({
    setFormIsChecked,
    setFirstScreenOptionName,
    setExternalLink,
    setOrderIndex,
    setDefaultTransportation,
    setSelectedServiceType,
    setDescription,
    setNote,
    setTaglineText,
    setTaglineColor,
    defaultTransportation,
    editingItem,
    pickUpDeliveryOption,
    showError,
  });

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

    dispatch(
      createFirstScreenOption(
        buildFirstScreenOptionCreateData(data, selectedSC.id),
        selectedSC.id,
        onSuccessCreate,
        showError,
        defaultTransportation?.type
      )
    );
  };

  return {
    onCancel,
    onSave,
    formProps: {
      editingIconPath: editingItem?.iconPath,
      fileState,
      setFileState,
      formIsChecked,
      firstScreenOptionName,
      selectedServiceType,
      orderIndex,
      enabledTransportationOptions,
      defaultTransportation,
      isPickUpDropOffType,
      isTransportationDisabled,
      externalLink,
      description,
      note,
      taglineText,
      taglineColor,
      serviceTypeOptions,
      onNameChange,
      onServiceTypeChange,
      onOrderIndexChange,
      onTransportationChange,
      onLinkChange,
      onDescriptionChange,
      onNoteChange,
      onTaglineTextChange,
      onTaglineColorChange,
    },
  };
};
