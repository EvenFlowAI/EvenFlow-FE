import React, {useState} from "react";
import {
    BaseModal,
    DialogContent,
    DialogContentTitle,
    DialogTitle,
    DialogActions
} from "../BaseModal";
import {DialogProps} from "../types";
import {
    Divider, Button, Grid
} from "@material-ui/core";
import {TextField} from "../../UI/TextField";
import {useSnackbar} from "notistack";
import {IDealershipForm} from "../../../store/reducers/dealershipGroups/types";
import {create} from "../../../store/reducers/dealershipGroups/actions";
import {useDispatch} from "react-redux";
import {useValidation} from "../../../utils/hooks";
import {ValidationKeyPairs} from "../../../types/types";

type KeyPair = {
    name: keyof IDealershipForm,
    label: string;
}

type FormElementProps = {
    elements: KeyPair[];
    data: IDealershipForm,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}
const FormElements: React.FC<FormElementProps> = props => {
    return <Grid container spacing={2}>
        {props.elements.map(element => {
            return <Grid item xs={6} key={element.name}>
                <TextField
                    fullWidth
                    label={element.label}
                    name={element.name}
                    id={element.name}
                    value={props.data[element.name]}
                    onChange={props.onChange}
                />
            </Grid>
        })}
    </Grid>
}

const elementsGroup1: KeyPair[] = [
    {name: "name", label: "Dealership group name"},
    {name: "email", label: "Dealership email"},
    {name: "phone", label: "Phone"},
    {name: "mainAddress", label: "Address"},
];

const elementsGroup2: KeyPair[] = [
    {name: "contactPersonName", label: "Contact person name"},
    {name: "contactPersonPhone", label: "Contact person phone"},
    {name: "contactPersonEmail", label: "Contact person email"}
];

const requiredFields: ValidationKeyPairs<IDealershipForm>[] = [
    {field: "name", message: "Dealership Group name is required"},
    {field: "email", message: "Dealership Email is required"},
    {field: "mainAddress", message: "Dealership Main Address is required"}
];


export const CreateDealershipGroup: React.FC<
    DialogProps> = props => {

    const [data, setData] = useState<IDealershipForm>({
        name: "",
        mainAddress: "",
        phone: "",
        email: "",
        contactPersonEmail: "",
        contactPersonName: "",
        contactPersonPhone: ""
    });

    const handleChange = ({target: {value, name}}: React.ChangeEvent<HTMLInputElement>) => {
        setData({...data, [name]: value});
    }

    const dispatch = useDispatch();
    const {enqueueSnackbar} = useSnackbar();
    const validate = useValidation<IDealershipForm>(
        requiredFields, data
    );

    const handleCreate = async () => {
        const errors = validate();
        if (errors.length) {
            return;
        }
        await dispatch(create(data));
        enqueueSnackbar("Created", {variant: "success"});
        props.onClose();
    }

    return <BaseModal {...props} onClose={props.onClose}>
        <DialogTitle onClose={props.onClose}>New dealership group</DialogTitle>
        <DialogContent>
            <DialogContentTitle
                title="Dealership group info"
            />
            <FormElements
                elements={elementsGroup1}
                data={data}
                onChange={handleChange} />

            <Divider />

            <DialogContentTitle title="Contact personal info" />
            <FormElements
                elements={elementsGroup2}
                data={data}
                onChange={handleChange} />


        </DialogContent>
        <DialogActions>
            <Button onClick={props.onClose}>Cancel</Button>
            <Button
                onClick={handleCreate}
                color="primary"
                variant="contained">
                Create
            </Button>
        </DialogActions>
    </BaseModal>;
}