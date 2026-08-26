import {
  Dispatch,
  SetStateAction,
  SyntheticEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IPackageById, IPackageOptionDetailed } from '../../../../api/types';
import { RootState } from '../../../../store/rootReducer';
import {
  loadPackageById,
  removePackageById,
  updatePackageOptions,
  updateSegmentsTitles,
} from '../../../../store/reducers/packages/actions';
import { EPackagePricingType } from '../../../../store/reducers/appointmentFrameReducer/types';
import { TRequestRow } from '../types';
import { IDetailsData } from './types';
import { checkIsValid, getOptionsTableData } from './utils';
import { useModal } from '../../../../hooks/useModal/useModal';
import { useConfirm } from '../../../../hooks/useConfirm/useConfirm';
import { useException } from '../../../../hooks/useException/useException';
import { useSCs } from '../../../../hooks/useSCs/useSCs';
import {
  buildComplimentaryRows,
  buildOptionsRows,
  buildUpsellRows,
  normalizePackageOptions,
  trimSegmentTitles,
  updatePackageOption,
} from './packageAccordion.helpers';
import { usePackageOptionToggles } from './usePackageOptionToggles';

type TProps = {
  id?: number;
  expanded?: boolean;
  onExpandIconClick?: (event: SyntheticEvent | boolean) => void;
  onOpenEdit: () => void;
  setIsEditing: Dispatch<SetStateAction<boolean>>;
};

export const usePackageAccordionState = ({
  id,
  expanded,
  onExpandIconClick,
  onOpenEdit,
  setIsEditing,
}: TProps) => {
  const { isPackageLoading, currentPackage } = useSelector((state: RootState) => state.packages);
  const [isEdit, setIsEdit] = useState(false);
  const [packageData, setPackageData] = useState<IPackageById | null>(null);
  const [optionsData, setOptionsData] = useState<TRequestRow[]>([]);
  const [detailsData, setDetailsData] = useState<IDetailsData | null>(null);
  const [complimentaryData, setComplimentaryData] = useState<TRequestRow[]>([]);
  const [upsellData, setUpsellData] = useState<TRequestRow[]>([]);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [isUpsellNameEdit, setUpsellNameEdit] = useState(false);
  const [isComplimentaryNameEdit, setComplimentaryNameEdit] = useState(false);
  const [editingOption, setEditingOption] = useState<IPackageOptionDetailed | null>(null);

  const {
    isOpen: isAssignOpsCodeOpen,
    onOpen: onAssignOpsCodeOpen,
    onClose: onAssignOpsCodeClose,
  } = useModal();
  const {
    isOpen: isRequestToDMSOpen,
    onOpen: onRequestToDMSOpen,
    onClose: onRequestToDMSClose,
  } = useModal();
  const {
    isOpen: isDescriptionOpen,
    onOpen: onDescriptionOpen,
    onClose: onDescriptionClose,
  } = useModal();
  const { isOpen: isOrderOpen, onOpen: onOrderOpen, onClose: onOrderClose } = useModal();
  const { askConfirm } = useConfirm();
  const { selectedSC } = useSCs();
  const anchorRef = useRef<HTMLButtonElement | null>(null);
  const dispatch = useDispatch();
  const showError = useException();

  useEffect(() => {
    if (id && expanded) {
      dispatch(loadPackageById(id));
    }
  }, [dispatch, expanded, id]);

  useEffect(() => {
    if (currentPackage) {
      setPackageData(currentPackage);
    }
  }, [currentPackage]);

  const getOptionsData = useCallback((nextPackageData: IPackageById) => {
    setOptionsData(buildOptionsRows(nextPackageData));
    setDetailsData(getOptionsTableData(nextPackageData));
    setComplimentaryData(buildComplimentaryRows(nextPackageData));
    setUpsellData(buildUpsellRows(nextPackageData));
  }, []);

  useEffect(() => {
    if (packageData?.options) {
      getOptionsData(packageData);
    }
  }, [getOptionsData, packageData]);

  const { onComplimentaryClick, onCheckboxClick, onUpsellClick, onInputChange } =
    usePackageOptionToggles({
      setPackageData,
      showError,
    });

  const onMoreIconClick = () => {
    if (expanded && anchorRef.current && packageData) {
      setAnchorEl(anchorRef.current);
    }
  };

  const handleCloseMenu = () => setAnchorEl(null);

  const handleEdit = () => {
    setIsEditing(true);
    onOpenEdit();
    setAnchorEl(null);
  };

  const handleRemove = () => {
    setAnchorEl(null);
    if (!packageData || !selectedSC) {
      return;
    }

    try {
      dispatch(removePackageById(packageData.id, selectedSC.id));
      if (onExpandIconClick) {
        onExpandIconClick(false);
      }
    } catch (error) {
      showError(error);
    }
  };

  const askRemove = () => {
    askConfirm({
      isRemove: true,
      title: `Please confirm you want to remove Maintenance Package ${packageData?.name}`,
      onConfirm: handleRemove,
    });
  };

  const handleCancel = useCallback(() => {
    if (!currentPackage) {
      return;
    }

    setPackageData(currentPackage);
    getOptionsData(currentPackage);
    setIsEdit(false);
    setEditingOption(null);
    setComplimentaryNameEdit(false);
    setUpsellNameEdit(false);
  }, [currentPackage, getOptionsData]);

  const sendRequest = useCallback(
    (data: IPackageById) => {
      const revisedData = normalizePackageOptions(data.options);
      try {
        const upsellPriceText = packageData?.priceTitles?.find(
          item => item.type === EPackagePricingType.PriceWithFee
        )?.title;
        const priceText = packageData?.priceTitles?.find(
          item => item.type === EPackagePricingType.BasePrice
        )?.title;
        const hasUpsells = data.options.some(option => option.intervalUpsells.length);

        if (hasUpsells && (!upsellPriceText || !priceText)) {
          showError('Please save the Price Texts first');
        } else {
          dispatch(updatePackageOptions(data.id, revisedData, showError));
          if (data.segmentTitles.length) {
            dispatch(
              updateSegmentsTitles(data.id, trimSegmentTitles(data.segmentTitles), showError)
            );
          }
        }
      } catch (error) {
        showError(error);
      } finally {
        setIsEdit(false);
        setEditingOption(null);
        setComplimentaryNameEdit(false);
        setUpsellNameEdit(false);
      }
    },
    [dispatch, packageData, showError]
  );

  const handleSave = useCallback(() => {
    const [isValid, messages] = checkIsValid(packageData);
    if (!isValid) {
      messages.forEach(message => showError(message));
      return;
    }

    if (packageData) {
      onRequestToDMSOpen();
    }
  }, [onRequestToDMSOpen, packageData, showError]);

  const handleExpand = (e: SyntheticEvent) => {
    if (onExpandIconClick) {
      onExpandIconClick(e);
    }
    handleCancel();
  };

  const onOptionNameChange = useCallback((option: IPackageOptionDetailed, name: string) => {
    setPackageData(prev => {
      if (!prev) return prev;
      return updatePackageOption(prev, option.type, current => ({ ...current, name }));
    });
  }, []);

  const onRequestToDmsSave = (data: IPackageById) => {
    sendRequest(data);
    onRequestToDMSClose();
  };

  return {
    isPackageLoading,
    currentPackage,
    packageData,
    setPackageData,
    optionsData,
    detailsData,
    complimentaryData,
    upsellData,
    isEdit,
    setIsEdit,
    isUpsellNameEdit,
    setUpsellNameEdit,
    isComplimentaryNameEdit,
    setComplimentaryNameEdit,
    editingOption,
    setEditingOption,
    anchorEl,
    anchorRef,
    isAssignOpsCodeOpen,
    onAssignOpsCodeOpen,
    onAssignOpsCodeClose,
    isRequestToDMSOpen,
    onRequestToDMSClose,
    isDescriptionOpen,
    onDescriptionOpen,
    onDescriptionClose,
    isOrderOpen,
    onOrderOpen,
    onOrderClose,
    onMoreIconClick,
    handleCloseMenu,
    handleEdit,
    askRemove,
    handleExpand,
    onOptionNameChange,
    onCheckboxClick,
    onUpsellClick,
    onComplimentaryClick,
    onInputChange,
    handleCancel,
    handleSave,
    onRequestToDmsSave,
  };
};
