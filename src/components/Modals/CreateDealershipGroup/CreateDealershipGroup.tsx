import React, {useEffect, useState} from "react";
import {
    BaseModal,
    DialogContent,
    DialogContentTitle,
    DialogTitle,
    DialogActions, AvatarContainer
} from "../BaseModal";
import {DialogProps} from "../types";
import {
    Divider, Button, Grid
} from "@material-ui/core";
import {TextField} from "../../UI/TextField";
import {
    IContactPersonForm,
    IDealershipForm,
    IDealershipGroupForm
} from "../../../store/reducers/dealershipGroups/types";
import {create} from "../../../store/reducers/dealershipGroups/actions";
import {useDispatch, useSelector} from "react-redux";
import {useException, useValidation} from "../../../utils/hooks";
import {ValidationKeyPairs} from "../../../types/types";
import {RootState} from "../../../store/rootReducer";
import {LoadingButton} from "../../UI/Button";
import {useSnackbar} from "notistack";


type KeyPair<U> = {
    name: keyof U,
    label: string;
}

type FormElementProps<U> = {
    elements: KeyPair<U>[];
    data: U,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const FormElements: <T>(p: FormElementProps<T>) => React.ReactElement<FormElementProps<T>>
    = props => {
    return <Grid container spacing={2}>
        {props.elements.map(element => {
            return <Grid item xs={6} key={element.name as string}>
                <TextField
                    fullWidth
                    label={element.label}
                    name={element.name as string}
                    id={element.name as string}
                    value={props.data[element.name]}
                    onChange={props.onChange}
                />
            </Grid>
        })}
    </Grid>
}

const elementsGroup1: KeyPair<IDealershipForm>[] = [
    {name: "name", label: "Dealership group name"},
    {name: "phoneNumber", label: "Phone"},
    {name: "mainAddress", label: "Address"},
];

const elementsGroup2: KeyPair<IContactPersonForm>[] = [
    {name: "fullName", label: "Contact person name"},
    {name: "phoneNumber", label: "Contact person phone"},
    {name: "email", label: "Contact person email"}
];

const requiredFields: ValidationKeyPairs<IDealershipForm & IContactPersonForm>[] = [
    {field: "phoneNumber", message: "Dealership Group name is required"},

];

const initialStateDealershipState: IDealershipForm = {
    name: "", mainAddress: "", phoneNumber: ""
};
const initialCPState: IContactPersonForm = {
    phoneNumber: "", fullName: "", email: ""
}


export const CreateDealershipGroup: React.FC<
    DialogProps> = props => {

    const [dealership, setDealership] = useState<IDealershipForm>({...initialStateDealershipState});
    const [contactPerson, setCP] = useState<IContactPersonForm>({...initialCPState});
    useEffect(() => {
        setDealership({...initialStateDealershipState});
        setCP({...initialCPState});
    }, [props.open])

    const dispatch = useDispatch();
    const saving = useSelector((state: RootState) => state.dealershipGroups.saving);
    const setException = useException();
    const {enqueueSnackbar} = useSnackbar();
    const validate = useValidation(
        requiredFields, {...dealership, ...contactPerson}
    );

    const handleChange = (v: "dealership" | "cp") => ({target: {value, name}}: React.ChangeEvent<HTMLInputElement>) => {
        if (v === "dealership") {
            setDealership({...dealership, [name]: value});
        } else {
            setCP({...contactPerson, [name]: value});
        }
    }

    const handleCreate = async () => {
        const errors = validate();
        if (errors.length) {
            return;
        }
        const data: IDealershipGroupForm = {contactPerson, dealership};
        try {
            await dispatch(create(data));
            enqueueSnackbar("Created", {variant: "success"});
            props.onClose();
        } catch (e) {
            setException(e);
        }

    }

    return <BaseModal {...props} onClose={props.onClose}>
        <DialogTitle onClose={props.onClose}>New dealership group</DialogTitle>
        <DialogContent>
            <AvatarContainer />

            <DialogContentTitle
                title="Dealership group info"
            />
            <FormElements<IDealershipForm>
                elements={elementsGroup1}
                data={dealership}
                onChange={handleChange("dealership")} />

            <Divider />

            <DialogContentTitle title="Contact personal info" />
            <FormElements<IContactPersonForm>
                elements={elementsGroup2}
                data={contactPerson}
                onChange={handleChange("cp")} />


        </DialogContent>
        <DialogActions>
            <Button onClick={props.onClose}>Cancel</Button>
            <LoadingButton
                onClick={handleCreate}
                loading={saving}
                color="primary"
                variant="contained">
                Create
            </LoadingButton>
        </DialogActions>
    </BaseModal>;
}