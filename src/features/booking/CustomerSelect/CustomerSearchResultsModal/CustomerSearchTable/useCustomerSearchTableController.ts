import { useEffect, useMemo, useState } from 'react';
import type React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { IAddressData } from '../../../../../api/types';
import {
  changePageData,
  updateCustomer,
} from '../../../../../store/reducers/enhancedCustomerSearch/actions';
import {
  ICustomerForTable,
  ICustomerWithPhones,
} from '../../../../../store/reducers/enhancedCustomerSearch/types';
import { EServiceType } from '../../../../../store/reducers/appointmentFrameReducer/types';
import { RootState } from '../../../../../store/rootReducer';
import { useConfirm } from '../../../../../hooks/useConfirm/useConfirm';
import { useException } from '../../../../../hooks/useException/useException';
import { useModal } from '../../../../../hooks/useModal/useModal';
import { usePagination } from '../../../../../hooks/usePaginations/usePaginations';
import { initialColumnOffset } from '../constants';
import { TOffset, TSortColumn, TSortOrder } from '../types';
import { AppointmentSummaryI } from '../../../utils/types';
import {
  customerIdentityMatches,
  getIsEditRow,
  getOrderedColumns,
  getServiceType,
  getSortOrderDifference,
  getTransportationOptionId,
  sortByColumn,
} from './helpers';
import { TCustomerSearchTableProps } from './types';
import useCustomerSearchTableActions from './useCustomerSearchTableActions';

const useCustomerSearchTableController = ({
  onClose,
  loadData,
  isNewVehicleMode,
  redirect,
  selectedColumns,
}: TCustomerSearchTableProps) => {
  const dispatch = useDispatch();
  const showError = useException();
  const { askConfirm } = useConfirm();
  const { t } = useTranslation();

  const { customers, isLoading, paging, pageData } = useSelector(
    (state: RootState) => state.customers
  );
  const { scProfile } = useSelector((state: RootState) => state.appointment);
  const { firstScreenOptions } = useSelector((state: RootState) => state.serviceTypes);
  const { serviceTypeOption, transportation } = useSelector(
    (state: RootState) => state.appointmentFrame
  );
  const { config } = useSelector((state: RootState) => state.bookingFlowConfig);

  const [data, setData] = useState<ICustomerWithPhones[]>([]);
  const [sorting, setSorting] = useState<TSortOrder>({ isAscending: true, order: null });
  const [isEdit, setEdit] = useState<boolean>(false);
  const [editingElement, setEditingElement] = useState<ICustomerWithPhones | null>(null);
  const [offset, setOffset] = useState<TOffset>(initialColumnOffset);
  const [hashIdForSelectedAppointment, setHashIdForSelectedAppointment] = useState<string | null>(
    null
  );
  const [loadedAppointmentsByCar, setLoadedAppointmentsByCar] = useState<AppointmentSummaryI[]>([]);
  const [selectedAppointmentForCancelOrEdit, setSelectedAppointmentForCancelOrEdit] =
    useState<ICustomerWithPhones | null>(null);
  const [isEditAppointment, setIsEditAppointment] = useState<boolean>(false);

  const { changeRowsPerPage, changePage } = usePagination(
    (state: RootState) => state.customers.pageData,
    changePageData
  );

  const { onOpen: onOpenHistory, onClose: onCloseHistory, isOpen: isOpenHistory } = useModal();
  const { onOpen: onOpenConfirm, onClose: onCloseConfirm, isOpen: isOpenConfirm } = useModal();
  const {
    onOpen: onOpenAppointmentSelection,
    onClose: onCloseAppointmentSelection,
    isOpen: isOpenAppointmentSelection,
  } = useModal();

  const serviceType = useMemo(
    () => getServiceType(serviceTypeOption?.type ?? null, transportation?.type),
    [serviceTypeOption, transportation]
  );

  const transportationOptionId = useMemo(
    () =>
      getTransportationOptionId(
        serviceType,
        serviceTypeOption?.transportationOption?.id,
        transportation?.id
      ),
    [serviceType, serviceTypeOption, transportation]
  );

  const shouldCheckRecalls = useMemo(() => {
    const visitCenterConfig = config?.find(item => item.serviceType === EServiceType.VisitCenter);
    const mobileServiceConfig = config?.find(
      item => item.serviceType === EServiceType.MobileService
    );
    const pickUpDropOffConfig = config?.find(
      item => item.serviceType === EServiceType.PickUpDropOff
    );

    return Boolean(
      visitCenterConfig?.checkRecallsExisting ||
      pickUpDropOffConfig?.checkRecallsExisting ||
      mobileServiceConfig?.checkRecallsExisting
    );
  }, [config]);

  const orderedColumns = useMemo(() => getOrderedColumns(selectedColumns), [selectedColumns]);
  const [currentFirstItemIndex, currentLastItemIndex] = useMemo(
    () => [pageData.pageIndex * pageData.pageSize, (pageData.pageIndex + 1) * pageData.pageSize],
    [pageData]
  );

  useEffect(() => {
    setOffset({ secondColumn: 124, thirdColumn: 274 });
  }, []);

  useEffect(() => {
    setData(customers.map((customer, index) => ({ ...customer, sortOrder: index })));
  }, [customers]);

  const {
    onSelectCustomerForNewVehicle,
    onCreateNewForCar,
    onUpdateAppForCar,
    onCancelAppointment,
    handleUpdateAppointment,
  } = useCustomerSearchTableActions({
    customers,
    firstScreenOptions,
    shouldCheckRecalls,
    serviceTypeOptionId: serviceTypeOption?.id,
    transportationOptionId,
    scProfileId: scProfile?.id,
    onClose,
    redirect,
    setHashIdForSelectedAppointment,
    setEditingElement,
    setLoadedAppointmentsByCar,
    setSelectedAppointmentForCancelOrEdit,
    setIsEditAppointment,
    onOpenConfirm,
    onOpenAppointmentSelection,
  });

  const handleCancelAppointment = async (appointmentHashKey: string) => {
    if (!appointmentHashKey || !selectedAppointmentForCancelOrEdit) {
      return;
    }

    setHashIdForSelectedAppointment(appointmentHashKey);
    setEditingElement(selectedAppointmentForCancelOrEdit);
    onOpenConfirm();
  };

  const resetSelectedAppointmentData = () => {
    setHashIdForSelectedAppointment(null);
    setEditingElement(null);
    setSelectedAppointmentForCancelOrEdit(null);
    setLoadedAppointmentsByCar([]);
    onCloseAppointmentSelection();
  };

  const onAddressChange =
    (fieldName: keyof IAddressData) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setEditingElement(prev =>
        prev
          ? {
              ...prev,
              address: prev.address
                ? { ...prev.address, [fieldName]: e.target.value }
                : { [fieldName]: e.target.value },
            }
          : prev
      );
    };

  const onFieldChange =
    (fieldName: keyof ICustomerForTable) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setEditingElement(prev => (prev ? { ...prev, [fieldName]: e.target.value } : prev));
    };

  const onCancelEditing = () => {
    setData(customers.slice().sort(getSortOrderDifference));
    setEdit(false);
  };

  const onSaveSuccess = () => {
    setEditingElement(null);
    setEdit(false);
  };

  const checkPhonesChanged = (): boolean => {
    const currentCustomer = customers.find(customer =>
      customerIdentityMatches(editingElement, customer)
    );

    return Boolean(
      currentCustomer &&
      (currentCustomer.otherPhone !== editingElement?.otherPhone ||
        currentCustomer.workPhone !== editingElement?.workPhone ||
        currentCustomer.homePhone !== editingElement?.homePhone ||
        currentCustomer.cellPhone !== editingElement?.cellPhone)
    );
  };

  const onSaveInfo = async () => {
    if (editingElement?.address?.zipCode && editingElement.address.zipCode.length > 10) {
      showError('The "Zip Code" must not be longer than 10 numbers');
      return;
    }

    if (!editingElement) {
      return;
    }

    if (checkPhonesChanged()) {
      askConfirm({
        isRemove: false,
        title: t('Please confirm the changes you made to the Customer Profile'),
        onConfirm: () =>
          dispatch(updateCustomer(editingElement, onSaveSuccess, err => showError(err))),
        onCancel: onCancelEditing,
        isBooking: true,
      });
      return;
    }

    dispatch(updateCustomer(editingElement, onSaveSuccess, err => showError(err)));
  };

  const onSort = (order: TSortColumn) => {
    setData(prev =>
      [...prev].sort((first, second) => sortByColumn(first, second, order, sorting.isAscending))
    );
    setSorting(prev => ({ isAscending: !prev.isAscending, order }));
  };

  return {
    data,
    sorting,
    isEdit,
    editingElement,
    offset,
    orderedColumns,
    isLoading,
    pageData,
    paging,
    hashIdForSelectedAppointment,
    loadedAppointmentsByCar,
    selectedAppointmentForCancelOrEdit,
    isEditAppointment,
    isOpenHistory,
    isOpenConfirm,
    isOpenAppointmentSelection,
    currentFirstItemIndex,
    currentLastItemIndex,
    getIsEdit: (customer: ICustomerWithPhones) => getIsEditRow(isEdit, editingElement, customer),
    onEditData: async (customer: ICustomerWithPhones) => {
      setEditingElement(customer);
      setEdit(true);
    },
    onViewRepairHistory: async (customer: ICustomerWithPhones) => {
      setEditingElement(customer);
      onOpenHistory();
    },
    onCloseHistory,
    onCloseConfirm,
    onCloseAppointmentSelection,
    resetSelectedAppointmentData,
    handleCancelAppointment,
    handleUpdateAppointment,
    onSort,
    onSelectCustomerForNewVehicle,
    onCreateNewForCar,
    onUpdateAppForCar,
    onCancelAppointment,
    onCancelEditing,
    onSaveInfo,
    onFieldChange,
    onAddressChange,
    handleChangePage: (e: React.MouseEvent<Element, MouseEvent> | null, pageNumber: number) => {
      changePage(e, pageNumber);
    },
    handleChangeRows: (e: React.ChangeEvent<HTMLInputElement>) => {
      changeRowsPerPage(e);
    },
    loadData,
    isNewVehicleMode,
    selectedColumns,
    pagingNumberOfRecords: paging?.numberOfRecords,
  };
};

export default useCustomerSearchTableController;
