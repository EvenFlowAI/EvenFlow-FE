import React, {useEffect, useMemo, useState} from 'react';
import {makeStyles} from "@material-ui/core/styles";
import {ReactComponent as Create} from "../../../assets/img/create_appointment.svg";
import {ReactComponent as Update} from "../../../assets/img/Manage appointment.svg";
import {ReactComponent as Edit} from "../../../assets/img/editIcon.svg";
import {ReactComponent as EditDisabled} from "../../../assets/img/Manage appointment_dis.svg";
import {ReactComponent as Search} from "../../../assets/img/searchInfoIcon.svg";
import {ReactComponent as SearchDisabled} from "../../../assets/img/searchInfoIconDisabled.svg";
import {ReactComponent as CancelApp} from "../../../assets/img/Icon_16px_Cancel appointment.svg";
import {ReactComponent as CancelAppDisabled} from "../../../assets/img/Disabled-Cancel-appointment.svg";
import {
    Button,
    IconButton,
    styled,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TablePagination,
    TableRow,
    Tooltip,
    withStyles
} from "@material-ui/core";
import {TextField} from "../../UI/TextField";
import {useDispatch, useSelector} from "react-redux";
import {ICustomerLoadedData} from "../../../api/types";
import {
    clearAppointmentData,
    setAddress, setSideBarSteps,
    setUserType,
    setVehicle,
    setWelcomeScreenView
} from "../../../store/reducers/appointmentFrameReducer/actions";
import {getBlankVehicle, setCustomerLoadedData} from "../../../store/reducers/appointment/actions";
import {TArgCallback, TCallback} from "../../../types/types";
import {RootState} from "../../../store/rootReducer";
import {ICustomerWithPhones} from "../../../store/reducers/enhancedCustomerSearch/types";
import CustomerInputField from "./CustomerInputField";
import {changePageData, updateCustomer} from "../../../store/reducers/enhancedCustomerSearch/actions";
import {useException, useModal, usePagination} from "../../../utils/hooks";
import {Loading} from "../../UI/Loading";
import {useHistory} from "react-router-dom";
import {encodeSCID} from "../../../utils/utils";
import {EUserType} from "../../../store/reducers/appointmentFrameReducer/types";
import VehicleRepairHistory from "../VehicleRepairHistory/VehicleRepairHistory";
import CancelAppointmentConfirm from "../CancelAppoitntmentConfirm/CancelAppointmentConfirm";

const useStyles = makeStyles({
    wrapper: {
        border: '1px solid #DADADA',
        marginTop: 16,
    },
    emptyWrapper: {
        height: 500,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        border: '1px solid #DADADA',
        marginTop: 16,
    },
    headerCell: {
        fontSize: 12,
        fontWeight: 'bold',
        color: "#202021",
        textTransform: "uppercase",
        padding: '16px 8px',
    },
    bodyCell: {
        fontSize: 12,
        color: "#202021",
        padding: '12px 8px',
    },
    greyCell: {
        height: 24,
        width: "100%",
        backgroundColor: "#DADADA",
    },
    greyRow: {
        height: 24,
        width: "100%",
        backgroundColor: "#DADADA",
    },
    input: {
        padding: 0,
        backgroundColor: 'transparent',
        fontSize: 12,
    },
    pagination: {
        flexShrink: 0,
        width: "100%",
    },
})

const IconsBlock = styled('div')({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
})

export const CustomerInput = withStyles({
    root: {
        '& input': {
            padding: 4
        }
    }
})(TextField)

const HtmlTooltip = withStyles({
    tooltip: {
        fontSize: 12,
        color: '#202021',
        padding: 8,
        background: '#F7F8FB',
        boxShadow: "1px 1px 3px grey"
    },
    popper: {
        borderRadius: 0,
    }
})(Tooltip);

const columnNames = [
    "Last Name",
    "First Name",
    "Home",
    "Cell",
    "Other",
    "Email",
    "Address",
    "City",
    "State",
    "Year",
    "Make",
    "Model",
    "VIN"
]

type TCustomerSearchTableProps = {
    onClose: TCallback;
    loadData: TArgCallback<boolean>;
    isNewVehicleMode: boolean
}

const CustomerSearchTable: React.FC<TCustomerSearchTableProps> = ({onClose, loadData, isNewVehicleMode}) => {
    const {customers, isLoading, paging, pageData, customerSearchData} = useSelector((state: RootState) => state.customers);
    const {scProfile} = useSelector((state: RootState) => state.appointment);
    const [data, setData] = useState<ICustomerWithPhones[]>([]);
    const [isEdit, setEdit] = useState<boolean>(false);
    const [editingElement, setEditingElement] = useState<ICustomerWithPhones|null>(null);
    const {changeRowsPerPage, changePage} = usePagination((s: RootState) => s.customers.pageData, changePageData);
    const {onOpen: onOpenHistory, onClose: onCloseHistory, isOpen: isOpenHistory} = useModal();
    const {onOpen: onOpenConfirm, onClose: onCloseConfirm, isOpen: isOpenConfirm} = useModal();
    const classes = useStyles();
    const dispatch = useDispatch();
    const showError = useException();
    const history = useHistory();
    const isSearchByName = useMemo(() => Boolean(customerSearchData.firstName.length || customerSearchData.lastName.length), [customerSearchData])

    useEffect(() => {
        setData(customers);
    }, [customers])

    const setCustomerData = async (item: ICustomerWithPhones, isUpdating: boolean) => {
        const phoneNumbers = item.cellPhone ? [item.cellPhone] : [];
        const customerData = customers.find(el => el.vehicleId === item.vehicleId && el.customerId === item.customerId);
        if (customerData?.homePhone) phoneNumbers.push(customerData.homePhone);
        const vehicle = {
            vin: item.vin,
            make: item.make,
            model: item.model,
            year: item.year,
            appointmentHashKeys: item.appointmentHashKey ? [item.appointmentHashKey] : [],
            mileage: item.mileage ?? null,
        }
        const data: ICustomerLoadedData = {
            emails: item?.email ? [item.email] : [],
            firstName: item?.firstName ?? "",
            lastName: item?.lastName ?? "",
            id: item.customerInternalId?.toString() ?? null,
            phoneNumbers,
            vehicles: [vehicle],
            fromSearchByName: true,
            isUpdating,
        }
        if (customerData?.city) data.city = customerData.city;
        if (customerData?.address) await dispatch(setAddress(customerData.address));
        await dispatch(setCustomerLoadedData(data));
        await setUserType(EUserType.Existing);
        await dispatch(setVehicle(vehicle));
    }

    const onCreateNewForCar = async (item: ICustomerWithPhones) => {
        await dispatch(clearAppointmentData());
        await dispatch(setSideBarSteps([]));
        await setCustomerData(item, false);
        await dispatch(setUserType(EUserType.Existing));
        await dispatch(setWelcomeScreenView("serviceSelect"));
        await onClose()
    }

    const onUpdateAppForCar = (item: ICustomerWithPhones) => {
        if (scProfile) {
            dispatch(setUserType(EUserType.Existing));
            const id = encodeSCID(scProfile.id)
            setCustomerData(item, true).then(() => {
                history.push(`/f/appointment/${id}`)
                onClose()
            })
        }
    }

    const onViewRepairHistory = async (item: ICustomerWithPhones) => {
        await setEditingElement(item);
        await onOpenHistory();
    }

    const onEditData = async (item: ICustomerWithPhones) => {
        await setEditingElement(item);
        await setEdit(true);
    }

    const onCancelAppointment = async (item: ICustomerWithPhones) => {
        if (item.appointmentHashKey) {
            await setEditingElement(item);
            await onOpenConfirm()
        }
    }

    const onFieldChange = (fieldName: keyof ICustomerWithPhones) => (e: React.ChangeEvent<HTMLInputElement>) => {
        e.persist()
        setEditingElement(prevState => {
            return prevState ? {...prevState, [fieldName]: e.target.value} : prevState;
        });
    }

    const onSuccess = () => {
        setEditingElement(null);
        setEdit(false);
        loadData(isSearchByName);
    }

    const onSaveInfo = async () => {
        if (editingElement) {
            dispatch(updateCustomer(editingElement, onSuccess, (err) => showError(err)));
        }
    }

    const onCancelEditing = () => {
        setData(customers);
        setEdit(false)
    }

    const handleChangePage = async (e: React.MouseEvent<Element, MouseEvent> | null, pageNumber: number) => {
        await changePage(e, pageNumber);
        await loadData(isSearchByName);
    }
    const handleChangeRows = async (e: React.ChangeEvent<HTMLInputElement>) => {
        await changeRowsPerPage(e);
        await loadData(isSearchByName);
    }

    const onSelectCustomerForNewVehicle = (customer: ICustomerWithPhones) => async () => {
        const phoneNumber = customer.cellPhone || customer.homePhone || '';
        const data: ICustomerLoadedData = {
            emails: customer?.email ? [customer.email] : [],
            firstName: customer?.firstName ?? "",
            lastName: customer?.lastName ?? "",
            id: customer.customerInternalId?.toString() ?? null,
            phoneNumbers: phoneNumber ? [phoneNumber] : [],
            vehicles: [],
            fromSearchByName: true,
        }
        if (customer?.city) data.city = customer.city;
        if (customer?.address) await dispatch(setAddress(customer.address));
        await dispatch(setCustomerLoadedData(data));
        await setUserType(EUserType.Existing);
        await dispatch(setVehicle(getBlankVehicle()))
        onClose()
        dispatch(setWelcomeScreenView("serviceSelect"))
    }

    return isLoading
        ? <div className={classes.emptyWrapper}><Loading/></div>
        : <>
            <Table className={classes.wrapper}>
            <TableHead>
                <TableRow>
                    <TableCell/>
                    {columnNames.map(name => <TableCell key={name} className={classes.headerCell}>{name}</TableCell>)}
                </TableRow>
            </TableHead>
            <TableBody>
                <TableRow className={classes.greyRow}/>
                {data.map((customer, index) =>
                    (<TableRow key={customer.vin + index}>
                        <TableCell key="icon" className={classes.bodyCell}>
                            { isNewVehicleMode
                                ? <IconsBlock>
                                    <Button
                                        onClick={onSelectCustomerForNewVehicle(customer)}
                                        color="primary"
                                        variant="text"
                                        size="small">
                                        SELECT
                                    </Button>
                                </IconsBlock>
                                : isEdit && editingElement?.vehicleId === customer.vehicleId && editingElement?.customerId === customer.customerId
                                ? <IconsBlock>
                                        <Button
                                            style={{fontSize: 11, minWidth: 46}}
                                            onClick={onCancelEditing}
                                            color="secondary"
                                            variant="text"
                                            size="small">
                                            Cancel
                                        </Button>
                                    <Button
                                        onClick={onSaveInfo}
                                        style={{fontSize: 11, minWidth: 46}}
                                        color="primary"
                                        variant="text"
                                        size="small">
                                        Save
                                    </Button>
                                </IconsBlock>
                                : <IconsBlock>
                                    <HtmlTooltip title="Create Appointment">
                                        <IconButton
                                            style={{padding: 4}}
                                            onClick={() => onCreateNewForCar(customer)}>
                                            <Create/>
                                        </IconButton>
                                    </HtmlTooltip>
                                    {customer.appointmentHashKey?.length
                                        ? <HtmlTooltip title="Edit Appointment">
                                            <IconButton
                                                style={{padding: 4}}
                                                onClick={() => onUpdateAppForCar(customer)}>
                                                <Update/>
                                            </IconButton>
                                        </HtmlTooltip>
                                        : <IconButton style={{padding: 4}} disabled><EditDisabled/></IconButton>
                                    }
                                    {customer.appointmentHashKey?.length
                                        ? <HtmlTooltip title="Cancel Appointment">
                                            <IconButton
                                                style={{padding: 4}}
                                                onClick={() => onCancelAppointment(customer)}>
                                                <CancelApp/>
                                            </IconButton>
                                        </HtmlTooltip>
                                        : <IconButton style={{padding: 4}} disabled><CancelAppDisabled/></IconButton>
                                    }
                                    {customer.hasOrders
                                        ? <HtmlTooltip title="View Repair History">
                                            <IconButton
                                                style={{padding: 4}}
                                                onClick={() => onViewRepairHistory(customer)}>
                                                <Search/>
                                            </IconButton>
                                        </HtmlTooltip>
                                        : <IconButton
                                            style={{padding: 4}}
                                            disabled>
                                            <SearchDisabled/>
                                        </IconButton>}
                                    <HtmlTooltip title="Edit Customer Information">
                                        <IconButton
                                            style={{padding: 4}}
                                            onClick={() => onEditData(customer)}>
                                            <Edit/>
                                        </IconButton>
                                    </HtmlTooltip>
                                </IconsBlock>}
                        </TableCell>
                        <TableCell key="last" className={classes.bodyCell}>
                            <CustomerInputField
                                editingElement={editingElement}
                                customer={customer}
                                fieldName="lastName"
                                isEdit={isEdit}
                                onFieldChange={onFieldChange}/>
                        </TableCell>
                        <TableCell key="first" className={classes.bodyCell}>
                            <CustomerInputField
                                editingElement={editingElement}
                                customer={customer}
                                fieldName="firstName"
                                isEdit={isEdit}
                                onFieldChange={onFieldChange}/>
                        </TableCell>
                        <TableCell key="home" className={classes.bodyCell} width={150}>
                            <CustomerInputField
                                editingElement={editingElement}
                                customer={customer}
                                fieldName="homePhone"
                                isEdit={isEdit}
                                onFieldChange={onFieldChange}/>
                        </TableCell>
                        <TableCell key="cell" className={classes.bodyCell} width={150}>
                            <CustomerInputField
                                editingElement={editingElement}
                                customer={customer}
                                fieldName="cellPhone"
                                isEdit={isEdit}
                                onFieldChange={onFieldChange}/>
                        </TableCell>
                        <TableCell key="otherPhone" className={classes.bodyCell} width={150}>
                            <CustomerInputField
                                editingElement={editingElement}
                                customer={customer}
                                fieldName="otherPhone"
                                isEdit={isEdit}
                                onFieldChange={onFieldChange}/>
                        </TableCell>
                        <TableCell key="email" className={classes.bodyCell} width={150}>
                            <CustomerInputField
                                editingElement={editingElement}
                                customer={customer}
                                fieldName="email"
                                isEdit={isEdit}
                                onFieldChange={onFieldChange}/>
                        </TableCell>
                        <TableCell key="address" className={classes.bodyCell}>
                            <CustomerInputField
                                editingElement={editingElement}
                                customer={customer}
                                fieldName="address"
                                isEdit={isEdit}
                                onFieldChange={onFieldChange}/>
                        </TableCell>
                        <TableCell key="city" className={classes.bodyCell}>
                            <CustomerInputField
                                editingElement={editingElement}
                                customer={customer}
                                fieldName="city"
                                isEdit={isEdit}
                                onFieldChange={onFieldChange}/>
                        </TableCell>
                        <TableCell key="state" className={classes.bodyCell}>
                            <CustomerInputField
                                editingElement={editingElement}
                                customer={customer}
                                fieldName="state"
                                isEdit={isEdit}
                                onFieldChange={onFieldChange}/>
                        </TableCell>
                        <TableCell key="year" className={classes.bodyCell}>{customer.year ?? ""}</TableCell>
                        <TableCell key="make" className={classes.bodyCell}>{customer.make ?? ""}</TableCell>
                        <TableCell key="model" className={classes.bodyCell}>{customer.model ?? ""}</TableCell>
                        <TableCell key="vin" className={classes.bodyCell}>{customer.vin ?? ""}</TableCell>
                    </TableRow>))}
            </TableBody>
        </Table>
            {paging?.numberOfRecords > 10 ? <TablePagination
                className={classes.pagination}
                // classes={{select: classes.select}}
                component="div"
                count={paging.numberOfRecords}
                page={pageData.pageIndex}
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRows}
                rowsPerPage={pageData.pageSize}/>
               : null }
            {editingElement ? <VehicleRepairHistory open={isOpenHistory} onClose={onCloseHistory} vehicleDmsId={editingElement.vehicleDmsId}/> : null}
            {editingElement?.appointmentHashKey
                ? <CancelAppointmentConfirm
                    open={isOpenConfirm}
                    onClose={onCloseConfirm}
                    loadData={loadData}
                    hashKey={editingElement.appointmentHashKey}/>
                : null}
        </>
};

export default CustomerSearchTable;