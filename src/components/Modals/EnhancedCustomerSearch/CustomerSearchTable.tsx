import React, {useEffect, useState} from 'react';
import {makeStyles} from "@material-ui/core/styles";
import {ReactComponent as Create} from "../../../assets/img/create_appointment.svg";
import {ReactComponent as Update} from "../../../assets/img/editAppointment.svg";
import {ReactComponent as Edit} from "../../../assets/img/editIcon.svg";
import {ReactComponent as EditDisabled} from "../../../assets/img/editAppointmentDisabled.svg";
import {ReactComponent as Search} from "../../../assets/img/searchInfoIcon.svg";
import {
    Button,
    IconButton,
    styled,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Tooltip,
    withStyles
} from "@material-ui/core";
import {TextField} from "../../UI/TextField";
import {ICustomerWithVehicles, IRemappedCustomer} from "../../../store/reducers/customer/types";
import {useDispatch, useSelector} from "react-redux";
import {ICustomerLoadedData} from "../../../api/types";
import {setAddress, setVehicle, setWelcomeScreenView} from "../../../store/reducers/appointmentFrameReducer/actions";
import {setCustomerLoadedData} from "../../../store/reducers/appointment/actions";
import {TCallback} from "../../../types/types";
import {RootState} from "../../../store/rootReducer";

const useStyles = makeStyles({
    wrapper: {
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
    }
})

const mockData: ICustomerWithVehicles[] = [
    {
        id: "1",
        lastName: 'Johnson',
        firstName: 'Ana',
        cellPhone: '1234567890',
        homePhone: '2234567890',
        email: "alisa444444.86@gmail.com",
        state: "Illinois",
        city: 'Ohaio',
        address: "Fidel Castro str, 12/24",
        vehicles: [{
            id: 78,
            vin: '443456789044345Y',
            make: "Ford",
            model: "Focus",
            year: 2013,
            appointmentHashKeys: [],
        }]
    },
    {
        id:"2",
        lastName: 'Johnson',
        firstName: 'Ana',
        cellPhone: '1234567890',
        homePhone: '2234567890',
        state: "Illinois",
        email: "alisa444444.86@gmail.com",
        city: 'Ohaio',
        address: "Fidel Castro str, 12/24",
        vehicles: [{
            id: 45,
            vin: '123456789012345Y',
            make: "Ford",
            model: "Kuga",
            year: 2016,
            appointmentHashKeys: [],
        },
            {
                id: 8,
                vin: '12345678901236Y',
                make: "Ford",
                model: "Escape",
                year: 2013,
                appointmentHashKeys: [],
            }]
    }
]

const IconsBlock = styled('div')({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
})

const Input = withStyles({
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
    "Email",
    "Address",
    "City",
    "State",
    "Year",
    "Make",
    "Model",
    "VIN"
]

const CustomerSearchTable: React.FC<{onClose: TCallback}> = ({onClose}) => {
    const {customers} = useSelector((state: RootState) => state.customers);
    const [data, setData] = useState<IRemappedCustomer[]>([]);
    const [isEdit, setEdit] = useState<boolean>(false);
    const [editingElement, setEditingElement] = useState<IRemappedCustomer|null>(null)
    const classes = useStyles();
    const dispatch = useDispatch();

    useEffect(() => {
        const remappedData: IRemappedCustomer[] = [];
        customers.forEach(customer => {
            customer.vehicles.forEach(vehicle => {
                const data = {...customer, vehicle, uniqueId: customer.id.toString() + vehicle.id.toString()}
                delete data.vehicles;
                remappedData.push(data)
            })
        })
        setData(remappedData);
    }, [customers])

    const setCustomerData = async (item: IRemappedCustomer) => {
        const phoneNumbers = [item.cellPhone];
        const customerData = customers.find(el => el.id === item.id);
        if (customerData?.homePhone) phoneNumbers.push(customerData.homePhone);
        const vehicles = customerData?.vehicles ? customerData?.vehicles.map(el => ({...el, mileage: null})) : [];
        const data: ICustomerLoadedData = {
            emails: customerData?.email ? [customerData.email] : [],
            firstName: customerData?.firstName ?? "",
            lastName: customerData?.lastName ?? "",
            id: customerData?.id ?? item.id,
            phoneNumbers,
            vehicles,
        }
        if (customerData?.city) data.city = customerData.city;
        if (customerData?.address) await dispatch(setAddress(customerData.address));
        await dispatch(setCustomerLoadedData(data));
        await dispatch(setVehicle({...item.vehicle, mileage: null}));
    }

    const onCreateNewForCar = (item: IRemappedCustomer) => {
        setCustomerData(item).then(() => {
            dispatch(setWelcomeScreenView("serviceSelect"));
            onClose()
        })
        setEditingElement(item)
    }

    const onUpdateAppForCar = (item: IRemappedCustomer) => {
        setEditingElement(item)
    }

    const onViewRepairHistory = (item: IRemappedCustomer) => {
        setEditingElement(item);
    }

    const onEditData = async (item: IRemappedCustomer) => {
        await setEditingElement(item);
        await setEdit(true);
    }

    const onFieldChange = (fieldName: keyof IRemappedCustomer) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setEditingElement(prev => {
            if (prev) return {...prev, [fieldName]: e.target.value};
            return prev;
        });
    }

    const onSaveInfo = () => {

    }

    return (
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
                    (<TableRow key={customer.vehicle.vin + index}>
                        <TableCell key="icon" className={classes.bodyCell}>
                            { isEdit && editingElement?.uniqueId === customer.uniqueId
                                ? <IconsBlock>
                                    <Button
                                        onClick={onSaveInfo}
                                        color="primary"
                                        variant="text"
                                        size="small">
                                        SAVE
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
                                    {customer.vehicle.appointmentHashKeys?.length
                                        ? <HtmlTooltip title="Edit Appointment">
                                            <IconButton
                                                style={{padding: 4}}
                                                onClick={() => onUpdateAppForCar(customer)}>
                                                <Update/>
                                            </IconButton>
                                        </HtmlTooltip>
                                        : <IconButton style={{padding: 4}} disabled><EditDisabled/></IconButton>
                                    }
                                    <HtmlTooltip title="View Repair History">
                                        <IconButton
                                            style={{padding: 4}}
                                            onClick={() => onViewRepairHistory(customer)}>
                                            <Search/>
                                        </IconButton>
                                    </HtmlTooltip>
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
                            {isEdit && editingElement?.uniqueId === customer.uniqueId
                                ? <Input
                                    value={editingElement.lastName}
                                    onChange={onFieldChange("lastName")}/>
                                : customer.lastName }
                        </TableCell>
                        <TableCell key="first" className={classes.bodyCell}>{
                            isEdit && editingElement?.uniqueId === customer.uniqueId
                            ? <Input
                                value={editingElement.firstName}
                                onChange={onFieldChange("firstName")}/>
                            : customer.firstName}</TableCell>
                        <TableCell key="home" className={classes.bodyCell}>{customer.homePhone ?? ""}</TableCell>
                        <TableCell key="cell" className={classes.bodyCell}>{customer.cellPhone ?? ""}</TableCell>
                        <TableCell key="email" className={classes.bodyCell}>{
                            isEdit && editingElement?.uniqueId === customer.uniqueId
                                ? <Input
                                    value={editingElement.email}
                                    onChange={onFieldChange("email")}/>
                                : customer.email ?? ""}
                        </TableCell>
                        <TableCell key="address" className={classes.bodyCell}>{
                            isEdit && editingElement?.uniqueId === customer.uniqueId
                                ? <Input
                                    value={editingElement.address}
                                    onChange={onFieldChange("address")}/>
                                : customer.address ?? ""}
                        </TableCell>
                        <TableCell key="city" className={classes.bodyCell}>{
                            isEdit && editingElement?.uniqueId === customer.uniqueId
                                ? <Input
                                    value={editingElement.city}
                                    onChange={onFieldChange("city")}/>
                                : customer.city ?? ""}</TableCell>
                        <TableCell key="state" className={classes.bodyCell}>{
                            isEdit && editingElement?.uniqueId === customer.uniqueId
                                ? <Input
                                    value={editingElement.state}
                                    onChange={onFieldChange("state")}/>
                                : customer.state ?? ""}</TableCell>
                        <TableCell key="year" className={classes.bodyCell}>{customer.vehicle?.year ?? ""}</TableCell>
                        <TableCell key="make" className={classes.bodyCell}>{customer.vehicle?.make ?? ""}</TableCell>
                        <TableCell key="model" className={classes.bodyCell}>{customer.vehicle?.model ?? ""}</TableCell>
                        <TableCell key="vin" className={classes.bodyCell}>{customer.vehicle?.vin ?? ""}</TableCell>
                    </TableRow>))}
            </TableBody>
        </Table>
    );
};

export default CustomerSearchTable;