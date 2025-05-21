import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ReactComponent as Create } from '../../../../../assets/img/create_appointment.svg';
import { ReactComponent as Update } from '../../../../../assets/img/Manage appointment.svg';
import { ReactComponent as Edit } from '../../../../../assets/img/editIcon.svg';
import { ReactComponent as EditDisabled } from '../../../../../assets/img/Manage appointment_dis.svg';
import { ReactComponent as Search } from '../../../../../assets/img/repair_history.svg';
import { ReactComponent as SearchDisabled } from '../../../../../assets/img/searchInfoIconDisabled.svg';
import { ReactComponent as CancelApp } from '../../../../../assets/img/cancel_appointment.svg';
import { ReactComponent as CancelAppDisabled } from '../../../../../assets/img/Disabled-Cancel-appointment.svg';
import {
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { IAddressData, ICustomerLoadedData } from '../../../../../api/types';
import {
  clearAppointmentData,
  setAddress,
  setServiceOptionChanged,
  setServiceTypeOption,
  setSideBarSteps,
  setUserType,
  setVehicle,
  setWelcomeScreenView,
  setZipCode,
} from '../../../../../store/reducers/appointmentFrameReducer/actions';
import {
  getBlankVehicle,
  setCustomerLoadedData,
} from '../../../../../store/reducers/appointment/actions';
import { TArgCallback, TCallback } from '../../../../../types/types';
import { RootState } from '../../../../../store/rootReducer';
import { ICustomerWithPhones } from '../../../../../store/reducers/enhancedCustomerSearch/types';
import { CustomerInputField } from '../InputFields/CustomerInputField';
import { AddressInputField } from '../InputFields/AddressInputField';
import {
  changePageData,
  updateCustomer,
} from '../../../../../store/reducers/enhancedCustomerSearch/actions';
import { Loading } from '../../../../../components/wrappers/Loading/Loading';
import { useHistory } from 'react-router-dom';
import { encodeSCID } from '../../../../../utils/utils';
import {
  EServiceType,
  EUserType,
} from '../../../../../store/reducers/appointmentFrameReducer/types';
import VehicleRepairHistory from '../../../../../components/modals/common/VehicleRepairHistory/VehicleRepairHistory';
import CancelAppointmentModal from '../../CancelAppoitntmentModal/CancelAppointmentModal';
import { TColumn, TOffset, TSortColumn, TSortOrder } from '../types';
import { initialColumnOffset } from '../constants';
import { HtmlTooltip, IconsBlock, useStyles } from './styles';
import { useModal } from '../../../../../hooks/useModal/useModal';
import { usePagination } from '../../../../../hooks/usePaginations/usePaginations';
import { useException } from '../../../../../hooks/useException/useException';
import { useConfirm } from '../../../../../hooks/useConfirm/useConfirm';
import { useTranslation } from 'react-i18next';

type TCustomerSearchTableProps = {
  onClose: TCallback;
  loadData: TArgCallback<boolean>;
  isNewVehicleMode: boolean;
  redirect: TCallback;
  selectedColumns: TColumn[];
};

const CustomerSearchTable: React.FC<
  React.PropsWithChildren<React.PropsWithChildren<TCustomerSearchTableProps>>
> = ({ selectedColumns, onClose, loadData, isNewVehicleMode, redirect }) => {
  const { customers, isLoading, paging, pageData } = useSelector(
    (state: RootState) => state.customers
  );
  const { scProfile } = useSelector((state: RootState) => state.appointment);
  const { firstScreenOptions } = useSelector((state: RootState) => state.serviceTypes);

  const [data, setData] = useState<ICustomerWithPhones[]>([]);
  const [sorting, setSorting] = useState<TSortOrder>({ isAscending: true, order: null });
  const [isEdit, setEdit] = useState<boolean>(false);
  const [editingElement, setEditingElement] = useState<ICustomerWithPhones | null>(null);
  const [offset, setOffset] = useState<TOffset>(initialColumnOffset);
  const [formIsChecked, setFormChecked] = useState<boolean>(false);

  const { changeRowsPerPage, changePage } = usePagination(
    (s: RootState) => s.customers.pageData,
    changePageData
  );
  const { onOpen: onOpenHistory, onClose: onCloseHistory, isOpen: isOpenHistory } = useModal();
  const { onOpen: onOpenConfirm, onClose: onCloseConfirm, isOpen: isOpenConfirm } = useModal();
  const { classes } = useStyles();
  const dispatch = useDispatch();
  const showError = useException();
  const history = useHistory();
  const { t } = useTranslation();
  const { askConfirm } = useConfirm();

  const [currentFirstItemIndex, currentLastItemIndex] = useMemo(() => {
    return [pageData.pageIndex * pageData.pageSize, (pageData.pageIndex + 1) * pageData.pageSize];
  }, [pageData]);

  useEffect(() => {
    // Fixed widths for the first three columns
    const iconColumnWidth = 124;
    const lastNameWidth = 150;
    const firstNameWidth = 150;

    setOffset(() => ({
      secondColumn: iconColumnWidth,
      thirdColumn: iconColumnWidth + lastNameWidth,
    }));
  }, []); // Remove dependencies since we want fixed widths

  useEffect(() => {
    const orderedData = customers.map((el, i) => ({ ...el, sortOrder: i }));
    setData(orderedData);
  }, [customers]);

  const setCustomerData = async (item: ICustomerWithPhones, isUpdating: boolean) => {
    const phoneNumber = item.cellPhone ?? item.homePhone ?? item.otherPhone;
    const phoneNumbers = phoneNumber ? [phoneNumber] : [];
    const customerData = customers.find(
      el => el.vehicleId === item.vehicleId && el.customerId === item.customerId
    );
    if (customerData?.homePhone) phoneNumbers.push(customerData.homePhone);
    const vehicle = {
      vin: item.vin,
      make: item.make,
      model: item.model,
      year: item.year,
      appointmentHashKeys: item.appointmentHashKey ? [item.appointmentHashKey] : [],
      mileage: item?.mileage ?? null,
      dmsId: item.vehicleDmsId,
      hasRepairOrders: Boolean(item.hasOrders),
      engineTypeId: item.engineTypeId ?? null,
      id: item.vehicleId,
    };
    const data: ICustomerLoadedData = {
      emails: item?.email ? [item.email] : [],
      firstName: item?.firstName ?? '',
      lastName: item?.lastName ?? '',
      id: item.customerId?.toString() ?? null,
      companyName: item?.companyName ?? '',
      phoneNumbers,
      vehicles: [vehicle],
      fromSearchByName: true,
      isUpdating,
    };
    const addressData: IAddressData | null =
      isUpdating && customerData?.appointmentAddress
        ? customerData?.appointmentAddress
        : (customerData?.address ?? null);
    data.address = addressData;
    if (addressData?.fullAddress) await dispatch(setAddress(addressData.fullAddress));
    if (addressData?.zipCode) await dispatch(setZipCode(addressData.zipCode.slice(0, 5)));
    await dispatch(setCustomerLoadedData(data));
    await setUserType(EUserType.Existing);
    await dispatch(setVehicle(vehicle));
  };

  const onRedirect = async () => {
    await onClose();
    redirect();
  };

  const onCreateNewForCar = async (item: ICustomerWithPhones) => {
    setFormChecked(false);
    await dispatch(clearAppointmentData());
    dispatch(setServiceOptionChanged(false));
    await dispatch(setSideBarSteps([]));
    await setCustomerData(item, false);
    await dispatch(setUserType(EUserType.Existing));
    if (firstScreenOptions?.length) {
      if (firstScreenOptions.length > 1) {
        await dispatch(setWelcomeScreenView('serviceSelect'));
        await onClose();
      } else {
        if (firstScreenOptions[0].type === EServiceType.VisitCenter) {
          await dispatch(setServiceTypeOption(firstScreenOptions[0]));
          console.log('test');
          await onRedirect();
        } else {
          await dispatch(setWelcomeScreenView('serviceSelect'));
          await onClose();
        }
      }
    } else {
      await onRedirect();
    }
  };

  const onUpdateAppForCar = (item: ICustomerWithPhones) => {
    setFormChecked(false);
    if (scProfile) {
      dispatch(setUserType(EUserType.Existing));
      const id = encodeSCID(scProfile.id);
      setCustomerData(item, true).then(() => {
        history.push(`/f/appointment-manage/${id}`);
        onClose();
      });
    }
  };

  const onViewRepairHistory = async (item: ICustomerWithPhones) => {
    setFormChecked(false);
    await setEditingElement(item);
    await onOpenHistory();
  };

  const onEditData = async (item: ICustomerWithPhones) => {
    setFormChecked(false);
    await setEditingElement(item);
    await setEdit(true);
  };

  const onCancelAppointment = async (item: ICustomerWithPhones) => {
    setFormChecked(false);
    if (item.appointmentHashKey) {
      await setEditingElement(item);
      await onOpenConfirm();
    }
  };

  const onAddressChange =
    (fieldName: keyof IAddressData) => (e: React.ChangeEvent<HTMLInputElement>) => {
      e.persist();
      setFormChecked(false);
      if (editingElement) {
        setEditingElement(prevState => {
          if (prevState) {
            return {
              ...prevState,
              address: prevState.address
                ? { ...prevState.address, [fieldName]: e.target.value }
                : { [fieldName]: e.target.value },
            };
          } else return prevState;
        });
      }
    };

  const onFieldChange =
    (fieldName: keyof ICustomerWithPhones) => (e: React.ChangeEvent<HTMLInputElement>) => {
      e.persist();
      setFormChecked(false);
      setEditingElement(prevState => {
        return prevState ? { ...prevState, [fieldName]: e.target.value } : prevState;
      });
    };

  const sortCustomers = (a: ICustomerWithPhones, b: ICustomerWithPhones) =>
    a.sortOrder && b.sortOrder ? a.sortOrder - b.sortOrder : 0;

  const onSuccess = () => {
    setEditingElement(null);
    setEdit(false);
  };
  const checkPhonesChanged = (): boolean => {
    const currentCustomer = customers.find(customer => {
      return (
        editingElement?.vehicleId === customer.vehicleId &&
        editingElement?.customerId === customer.customerId
      );
    });
    if (!currentCustomer) return false;
    return (
      currentCustomer?.otherPhone !== editingElement?.otherPhone ||
      currentCustomer?.workPhone !== editingElement?.workPhone ||
      currentCustomer?.homePhone !== editingElement?.homePhone ||
      currentCustomer?.cellPhone !== editingElement?.cellPhone
    );
  };

  const onCancelEditing = () => {
    setFormChecked(false);
    setData(customers.slice().sort(sortCustomers));
    setEdit(false);
  };

  const checkInfoIsValid = () => {
    let isValid = true;
    if (editingElement?.address?.zipCode && editingElement.address.zipCode.length > 10) {
      isValid = false;
      showError('The "Zip Code" must not be longer than 10 numbers');
    }
    return isValid;
  };

  const onSaveInfo = async () => {
    setFormChecked(true);
    if (checkInfoIsValid()) {
      if (editingElement) {
        if (checkPhonesChanged()) {
          askConfirm({
            isRemove: false,
            title: t('Please confirm the changes you made to the Customer Profile'),
            onConfirm: () =>
              dispatch(updateCustomer(editingElement, onSuccess, err => showError(err))),
            onCancel: onCancelEditing,
            isBooking: true,
          });
        } else {
          dispatch(updateCustomer(editingElement, onSuccess, err => showError(err)));
        }
      }
    }
  };

  const handleChangePage = async (
    e: React.MouseEvent<Element, MouseEvent> | null,
    pageNumber: number
  ) => {
    setFormChecked(false);
    await changePage(e, pageNumber);
  };
  const handleChangeRows = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormChecked(false);
    await changeRowsPerPage(e);
  };

  const onSelectCustomerForNewVehicle = (customer: ICustomerWithPhones) => async () => {
    setFormChecked(false);
    const phoneNumber = customer.cellPhone || customer.homePhone || '';
    const data: ICustomerLoadedData = {
      emails: customer?.email ? [customer.email] : [],
      firstName: customer?.firstName ?? '',
      lastName: customer?.lastName ?? '',
      companyName: customer?.companyName ?? '',
      id: customer.customerId?.toString() ?? null,
      phoneNumbers: phoneNumber ? [phoneNumber] : [],
      vehicles: [],
      fromSearchByName: true,
    };
    if (customer?.address) data.address = customer.address;
    if (customer?.address?.fullAddress) await dispatch(setAddress(customer.address.fullAddress));
    if (customer?.address?.zipCode)
      await dispatch(setZipCode(customer.address.zipCode.slice(0, 5)));
    await dispatch(setCustomerLoadedData(data));
    await setUserType(EUserType.Existing);
    await dispatch(setVehicle(getBlankVehicle()));
    onClose();
    if (firstScreenOptions?.length) {
      if (firstScreenOptions.length > 1) {
        await dispatch(setWelcomeScreenView('serviceSelect'));
      } else {
        if (firstScreenOptions[0].type === EServiceType.VisitCenter) {
          await dispatch(setServiceTypeOption(firstScreenOptions[0]));
          redirect();
        } else {
          await dispatch(setWelcomeScreenView('serviceSelect'));
        }
      }
    } else {
      redirect();
    }
  };

  const onSort = (order: TSortColumn) => {
    setData(prev =>
      [...prev].sort((a, b) => {
        if (!a[order] && b[order]) return sorting.isAscending ? 1 : -1;
        if (!b[order] && a[order]) return sorting.isAscending ? -1 : 1;
        if (!a[order] && !b[order]) {
          return sorting.isAscending ? 1 : -1;
        } else {
          return sorting.isAscending
            ? b[order].toString().localeCompare(a[order].toString())
            : a[order].toString().localeCompare(b[order].toString());
        }
      })
    );
    setSorting(prev => ({ isAscending: !prev.isAscending, order }));
  };

  const getIsEdit = (customer: ICustomerWithPhones) => {
    return (
      isEdit &&
      editingElement?.vehicleId === customer.vehicleId &&
      editingElement?.customerId === customer.customerId
    );
  };

  // This function will be added to reorder the columns
  const getOrderedColumns = (cols: TColumn[]) => {
    // First we extract the specific columns we need to reorder
    const lastName = cols.find(col => col.name === 'Last Name');
    const firstName = cols.find(col => col.name === 'First Name');
    const make = cols.find(col => col.name === 'Make');
    const model = cols.find(col => col.name === 'Model');
    const vin = cols.find(col => col.name === 'VIN');
    const year = cols.find(col => col.name === 'Year');

    // Then filter out these columns from the original array
    const otherColumns = cols.filter(
      col =>
        col.name !== 'Last Name' &&
        col.name !== 'First Name' &&
        col.name !== 'Make' &&
        col.name !== 'Model' &&
        col.name !== 'VIN' &&
        col.name !== 'Year'
    );

    // Now construct the new array in the desired order
    const orderedColumns = [];

    if (lastName) orderedColumns.push(lastName);
    if (firstName) orderedColumns.push(firstName);
    if (make) orderedColumns.push(make);
    if (model) orderedColumns.push(model);
    if (vin) orderedColumns.push(vin);
    if (year) orderedColumns.push(year);

    // Add the rest of the columns
    return [...orderedColumns, ...otherColumns];
  };

  // Use the ordered columns
  const orderedColumns = useMemo(() => getOrderedColumns(selectedColumns), [selectedColumns]);

  const FIXED_COLUMNS_WIDTH = 424; // icons(124) + lastName(150) + firstName(150)
  const MIN_TABLE_WIDTH = 1550;

  return isLoading ? (
    <div className={classes.emptyWrapper}>
      <Loading />
    </div>
  ) : (
    <div className={classes.tableWrapper}>
      <div className={classes.tableContainer}>
        <div className={classes.tableContent}>
          <Table
            className={classes.wrapper}
            style={{
              tableLayout: 'fixed',
              width: Math.max(
                MIN_TABLE_WIDTH,
                FIXED_COLUMNS_WIDTH +
                  (selectedColumns.length > 2 ? (selectedColumns.length - 2) * 150 : 0)
              ),
            }}
          >
            <TableHead>
              <TableRow>
                <TableCell className={classes.stickyTHeadCell} key="emptyCell" width={124} />
                {orderedColumns.map(({ name, order }, index) => {
                  const isLastName = name === 'Last Name';
                  const isFirstName = name === 'First Name';
                  return (
                    <TableCell
                      key={name}
                      className={
                        isLastName || isFirstName ? classes.stickyTHeadCell : classes.headerCell
                      }
                      style={{
                        left: isLastName
                          ? offset.secondColumn
                          : isFirstName
                            ? offset.thirdColumn
                            : 'unset',
                      }}
                      width={
                        // Fixed widths for sticky columns within the map
                        isLastName || isFirstName
                          ? 150
                          : // Special widths for other columns
                            name === 'Year'
                            ? 60
                            : name === 'Address'
                              ? 225
                              : name === 'State' || name === 'ZIP' // Add State and ZIP check
                                ? 70
                                : // Default width for other common columns (adjust range if needed)
                                  index > 0 && index < 7
                                  ? 150
                                  : // Fallback width
                                    'auto'
                      }
                    >
                      {order ? (
                        <TableSortLabel
                          direction={sorting.isAscending ? 'desc' : 'asc'}
                          onClick={() => onSort(order)}
                          active={order === sorting.order}
                        >
                          {name}
                        </TableSortLabel>
                      ) : (
                        name
                      )}
                    </TableCell>
                  );
                })}
              </TableRow>
            </TableHead>
            <TableBody>
              {data.slice(currentFirstItemIndex, currentLastItemIndex).map((customer, index) => (
                <TableRow key={customer.vin + index}>
                  <TableCell key="icon" className={classes.stickyLeftCell} width={124}>
                    {isNewVehicleMode ? (
                      <IconsBlock>
                        <Button
                          onClick={onSelectCustomerForNewVehicle(customer)}
                          color="primary"
                          variant="text"
                          size="small"
                        >
                          SELECT
                        </Button>
                      </IconsBlock>
                    ) : getIsEdit(customer) ? (
                      <IconsBlock>
                        <Button
                          style={{ fontSize: 11, minWidth: 46 }}
                          onClick={onCancelEditing}
                          color="secondary"
                          variant="text"
                          size="small"
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={onSaveInfo}
                          style={{ fontSize: 11, minWidth: 46 }}
                          color="primary"
                          variant="text"
                          size="small"
                        >
                          Save
                        </Button>
                      </IconsBlock>
                    ) : (
                      <IconsBlock>
                        <HtmlTooltip title="Create Appointment">
                          <IconButton
                            disabled={!Boolean(customer.vehicleId)}
                            onClick={() => onCreateNewForCar(customer)}
                            size="small"
                            style={{ padding: '9px 3px' }}
                          >
                            <Create />
                          </IconButton>
                        </HtmlTooltip>
                        <HtmlTooltip title="Update Appointment">
                          <div>
                            <IconButton
                              disabled={!Boolean(customer.appointmentHashKey)}
                              onClick={() => onUpdateAppForCar(customer)}
                              size="small"
                              style={{ padding: '9px 3px' }}
                            >
                              {Boolean(customer.appointmentHashKey) ? <Update /> : <EditDisabled />}
                            </IconButton>
                          </div>
                        </HtmlTooltip>
                        <HtmlTooltip title="Cancel appointment">
                          <div>
                            <IconButton
                              disabled={!Boolean(customer.appointmentHashKey)}
                              onClick={() => onCancelAppointment(customer)}
                              size="small"
                              style={{ padding: '9px 3px' }}
                            >
                              {Boolean(customer.appointmentHashKey) ? (
                                <CancelApp />
                              ) : (
                                <CancelAppDisabled />
                              )}
                            </IconButton>
                          </div>
                        </HtmlTooltip>
                        <HtmlTooltip title="Repair history">
                          <div>
                            <IconButton
                              disabled={!Boolean(customer.hasOrders)}
                              onClick={() => onViewRepairHistory(customer)}
                              size="small"
                              style={{ padding: '9px 3px' }}
                            >
                              {Boolean(customer.hasOrders) ? <Search /> : <SearchDisabled />}
                            </IconButton>
                          </div>
                        </HtmlTooltip>
                        <HtmlTooltip title="Edit customer Information">
                          <div>
                            <IconButton
                              disabled={false}
                              onClick={() => onEditData(customer)}
                              size="small"
                              style={{ padding: '9px 3px' }}
                            >
                              <Edit />
                            </IconButton>
                          </div>
                        </HtmlTooltip>
                      </IconsBlock>
                    )}
                  </TableCell>
                  {orderedColumns.find(el => el.name === 'Last Name') ? (
                    <TableCell
                      key="last"
                      className={classes.stickyLeftCell}
                      width={150}
                      style={{
                        left: offset.secondColumn,
                        padding: getIsEdit(customer) ? '12px 0px' : '12px 8px',
                      }}
                    >
                      <CustomerInputField
                        editingElement={editingElement}
                        customer={customer}
                        fieldName="lastName"
                        isEdit={isEdit}
                        onFieldChange={onFieldChange}
                      />
                    </TableCell>
                  ) : null}
                  {orderedColumns.find(el => el.name === 'First Name') ? (
                    <TableCell
                      key="first"
                      className={classes.stickyLeftCell}
                      width={150}
                      style={{
                        left: offset.thirdColumn,
                        padding: getIsEdit(customer) ? '12px 0px' : '12px 8px',
                      }}
                    >
                      <CustomerInputField
                        editingElement={editingElement}
                        customer={customer}
                        fieldName="firstName"
                        isEdit={isEdit}
                        onFieldChange={onFieldChange}
                      />
                    </TableCell>
                  ) : null}
                  {orderedColumns.find(el => el.name === 'Make') ? (
                    <TableCell key="make" className={classes.bodyCell}>
                      {customer.make ?? ''}
                    </TableCell>
                  ) : null}
                  {orderedColumns.find(el => el.name === 'Model') ? (
                    <TableCell key="model" className={classes.bodyCell}>
                      {customer.model ?? ''}
                    </TableCell>
                  ) : null}
                  {orderedColumns.find(el => el.name === 'VIN') ? (
                    <TableCell key="vin" className={classes.bodyCell}>
                      {customer.vin ?? ''}
                    </TableCell>
                  ) : null}
                  {orderedColumns.find(el => el.name === 'Year') ? (
                    <TableCell key="year" className={classes.bodyCell} width={60}>
                      {customer.year ?? ''}
                    </TableCell>
                  ) : null}
                  {orderedColumns.find(el => el.name === 'Company Name') ? (
                    <TableCell
                      key="companyName"
                      className={classes.bodyCell}
                      width={150}
                      style={{ padding: getIsEdit(customer) ? '12px 0px' : '12px 8px' }}
                    >
                      <CustomerInputField
                        editingElement={editingElement}
                        customer={customer}
                        fieldName="companyName"
                        isEdit={isEdit}
                        onFieldChange={onFieldChange}
                      />
                    </TableCell>
                  ) : null}
                  {orderedColumns.find(el => el.name === 'Home') ? (
                    <TableCell
                      key="home"
                      className={classes.bodyCell}
                      width={150}
                      style={{ padding: getIsEdit(customer) ? '12px 0px' : '12px 8px' }}
                    >
                      <CustomerInputField
                        editingElement={editingElement}
                        customer={customer}
                        fieldName="homePhone"
                        isEdit={isEdit}
                        onFieldChange={onFieldChange}
                      />
                    </TableCell>
                  ) : null}
                  {orderedColumns.find(el => el.name === 'Cell') ? (
                    <TableCell
                      key="cell"
                      className={classes.bodyCell}
                      width={150}
                      style={{ padding: getIsEdit(customer) ? '12px 0px' : '12px 8px' }}
                    >
                      <CustomerInputField
                        editingElement={editingElement}
                        customer={customer}
                        fieldName="cellPhone"
                        isEdit={isEdit}
                        onFieldChange={onFieldChange}
                      />
                    </TableCell>
                  ) : null}
                  {orderedColumns.find(el => el.name === 'Other') ? (
                    <TableCell
                      key="otherPhone"
                      className={classes.bodyCell}
                      width={150}
                      style={{ padding: getIsEdit(customer) ? '12px 0px' : '12px 8px' }}
                    >
                      <CustomerInputField
                        editingElement={editingElement}
                        customer={customer}
                        fieldName="otherPhone"
                        isEdit={isEdit}
                        onFieldChange={onFieldChange}
                      />
                    </TableCell>
                  ) : null}
                  {orderedColumns.find(el => el.name === 'Email') ? (
                    <TableCell
                      key="email"
                      className={classes.bodyCell}
                      width={150}
                      style={{ padding: getIsEdit(customer) ? '12px 0px' : '12px 8px' }}
                    >
                      <CustomerInputField
                        editingElement={editingElement}
                        customer={customer}
                        fieldName="email"
                        isEdit={isEdit}
                        onFieldChange={onFieldChange}
                      />
                    </TableCell>
                  ) : null}
                  {orderedColumns.find(el => el.name === 'Address') ? (
                    <TableCell
                      key="address"
                      className={classes.bodyCell}
                      width={225}
                      style={{ padding: getIsEdit(customer) ? '12px 0px' : '12px 8px' }}
                    >
                      <AddressInputField
                        editingElement={editingElement}
                        customer={customer}
                        fieldName="address"
                        isEdit={isEdit}
                        onFieldChange={onAddressChange}
                      />
                    </TableCell>
                  ) : null}
                  {orderedColumns.find(el => el.name === 'City') ? (
                    <TableCell
                      key="city"
                      className={classes.bodyCell}
                      width={120}
                      style={{ padding: getIsEdit(customer) ? '12px 0px' : '12px 8px' }}
                    >
                      <AddressInputField
                        editingElement={editingElement}
                        customer={customer}
                        fieldName="city"
                        isEdit={isEdit}
                        onFieldChange={onAddressChange}
                      />
                    </TableCell>
                  ) : null}
                  {orderedColumns.find(el => el.name === 'State') ? (
                    <TableCell
                      key="state"
                      className={classes.bodyCell}
                      width={70}
                      style={{ padding: getIsEdit(customer) ? '12px 0px' : '12px 8px' }}
                    >
                      <AddressInputField
                        editingElement={editingElement}
                        customer={customer}
                        fieldName="state"
                        isEdit={isEdit}
                        onFieldChange={onAddressChange}
                      />
                    </TableCell>
                  ) : null}
                  {orderedColumns.find(el => el.name === 'ZIP') ? (
                    <TableCell
                      key="zip"
                      className={classes.bodyCell}
                      width={70}
                      style={{ padding: getIsEdit(customer) ? '12px 0px' : '12px 8px' }}
                    >
                      <AddressInputField
                        editingElement={editingElement}
                        customer={customer}
                        fieldName="zipCode"
                        isEdit={isEdit}
                        onFieldChange={onAddressChange}
                      />
                    </TableCell>
                  ) : null}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {editingElement ? (
        <VehicleRepairHistory
          customerId={editingElement.customerId}
          open={isOpenHistory}
          onClose={onCloseHistory}
          vehicleId={editingElement.vehicleId}
        />
      ) : null}
      {editingElement?.appointmentHashKey ? (
        <CancelAppointmentModal
          open={isOpenConfirm}
          onClose={onCloseConfirm}
          loadData={loadData}
          hashKey={editingElement.appointmentHashKey}
        />
      ) : null}
      {paging?.numberOfRecords > 10 ? (
        <TablePagination
          className={classes.pagination}
          component="div"
          count={paging.numberOfRecords}
          page={pageData.pageIndex}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRows}
          rowsPerPage={pageData.pageSize}
        />
      ) : null}
    </div>
  );
};

export default CustomerSearchTable;
