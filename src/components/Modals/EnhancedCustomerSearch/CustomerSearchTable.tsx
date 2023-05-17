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
import {useDispatch, useSelector} from "react-redux";
import {ICustomerLoadedData} from "../../../api/types";
import {setAddress, setVehicle, setWelcomeScreenView} from "../../../store/reducers/appointmentFrameReducer/actions";
import {setCustomerLoadedData} from "../../../store/reducers/appointment/actions";
import {TCallback} from "../../../types/types";
import {RootState} from "../../../store/rootReducer";
import {ICustomerByName} from "../../../store/reducers/enhancedCustomerSearch/types";
import CustomerInputField from "./CustomerInputField";

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
    "Email",
    "Address",
    "City",
    "State",
    "Year",
    "Make",
    "Model",
    "VIN"
]

const initialForm: ICustomerByName = {
    vin: '',
    year: 2020,
    model: '',
    make: '',
    vehicleId: 0,
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    customerId: 0,
    homePhone: '',
    cellPhone: '',
    appointmentHashKeys: [],
    email: ''
}

const CustomerSearchTable: React.FC<{onClose: TCallback}> = ({onClose}) => {
    const {customers} = useSelector((state: RootState) => state.customers);
    const [data, setData] = useState<ICustomerByName[]>([]);
    const [isEdit, setEdit] = useState<boolean>(false);
    const [editingElement, setEditingElement] = useState<ICustomerByName|null>(null);
    const [form, setForm] = useState<ICustomerByName>(initialForm)
    const classes = useStyles();
    const dispatch = useDispatch();

    useEffect(() => {
        setData(customers);
    }, [customers])

    const setCustomerData = async (item: ICustomerByName) => {
        const phoneNumbers = [item.cellPhone];
        const customerData = customers.find(el => el.vehicleId === item.vehicleId);
        if (customerData?.homePhone) phoneNumbers.push(customerData.homePhone);
        const vehicle = {
            vin: item.vin,
            make: item.make,
            model: item.model,
            year: item.year,
            appointmentHashKeys: [],
            mileage: null
        }
        const data: ICustomerLoadedData = {
            emails: item?.email ? [item.email] : [],
            firstName: item?.firstName ?? "",
            lastName: item?.lastName ?? "",
            id: item.customerId.toString(),
            phoneNumbers,
            vehicles: [vehicle],
        }
        if (customerData?.city) data.city = customerData.city;
        if (customerData?.address) await dispatch(setAddress(customerData.address));
        await dispatch(setCustomerLoadedData(data));
        await dispatch(setVehicle(vehicle));
    }

    const onCreateNewForCar = (item: ICustomerByName) => {
        setCustomerData(item).then(() => {
            dispatch(setWelcomeScreenView("serviceSelect"));
            onClose()
        })
        setEditingElement(item);
        setForm(item);
    }

    const onUpdateAppForCar = (item: ICustomerByName) => {
        setEditingElement(item)
        setForm(item);
    }

    const onViewRepairHistory = (item: ICustomerByName) => {
        setEditingElement(item);
        setForm(item);
    }

    const onEditData = async (item: ICustomerByName) => {
        await setEditingElement(item);
        await setForm(item);
        await setEdit(true);
    }

    const onFieldChange = (fieldName: keyof ICustomerByName) => (e: React.ChangeEvent<HTMLInputElement>) => {
        e.persist()
        setEditingElement(prevState => {
            return prevState ? {...prevState, [fieldName]: e.target.value} : prevState;
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
                    (<TableRow key={customer.vin + index}>
                        <TableCell key="icon" className={classes.bodyCell}>
                            { isEdit && editingElement?.vehicleId === customer.vehicleId
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
                                    {customer.appointmentHashKeys?.length
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
                            <CustomerInputField
                                editingElement={form}
                                customer={customer}
                                fieldName="lastName"
                                isEdit={isEdit}
                                onFieldChange={onFieldChange}/>
                        </TableCell>
                        <TableCell key="first" className={classes.bodyCell}>
                            <CustomerInputField
                                editingElement={form}
                                customer={customer}
                                fieldName="firstName"
                                isEdit={isEdit}
                                onFieldChange={onFieldChange}/>
                        </TableCell>
                        <TableCell key="home" className={classes.bodyCell}>{customer.homePhone ?? ""}</TableCell>
                        <TableCell key="cell" className={classes.bodyCell}>{customer.cellPhone ?? ""}</TableCell>
                        <TableCell key="email" className={classes.bodyCell}>
                            <CustomerInputField
                                editingElement={form}
                                customer={customer}
                                fieldName="email"
                                isEdit={isEdit}
                                onFieldChange={onFieldChange}/>
                        </TableCell>
                        <TableCell key="address" className={classes.bodyCell}>
                            <CustomerInputField
                                editingElement={form}
                                customer={customer}
                                fieldName="address"
                                isEdit={isEdit}
                                onFieldChange={onFieldChange}/>
                        </TableCell>
                        <TableCell key="city" className={classes.bodyCell}>
                            <CustomerInputField
                                editingElement={form}
                                customer={customer}
                                fieldName="city"
                                isEdit={isEdit}
                                onFieldChange={onFieldChange}/>
                        </TableCell>
                        <TableCell key="state" className={classes.bodyCell}>
                            <CustomerInputField
                                editingElement={form}
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
    );
};

export default CustomerSearchTable;