import React, {useCallback, useMemo, useState} from "react";
import {AvatarContainer, BaseModal, DialogActions, DialogContent, DialogTitle} from "../BaseModal";
import {DialogProps} from "../types";
import {States} from "../../../config/constants";
import {Autocomplete} from "@material-ui/lab";
import {TextField, TextInputProps} from "../../UI/TextField";
import {Button, Divider, Grid} from "@material-ui/core";

type TFormItem<DataType> = {
    label?: string;
    id: string;
    name?: string;
    value: (d: DataType) => string;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    inputType?: "email" | "password";
    variant?: "input" | "textarea" | "select"
    inputProps?: TextInputProps;
    selectOptions?: any
}
type TProps<D> = {
    items: TFormItem<D>[]
    values: D
}

const ModalForm = <Item extends {}>(props: TProps<Item>): JSX.Element => {
    return <form>
        <Grid container spacing={2}>
            {props.items.map(item => {
                return <Grid item xs={6}>
                    {!item.variant || item.variant === 'input'
                    ? <TextField
                        label={item.label}
                        key={item.id}
                        name={item.name || item.id}
                        value={item.value(props.values)}
                        onChange={item.onChange}
                        fullWidth
                        {...item.inputProps}
                    />
                    : null}
                </Grid>;
            })}
        </Grid>
    </form>;
}


const states = Object.values(States);


type TSCFormState = {
    scName: string;
    scEmail: string;
    scPhoneNumber: string;
    scContactEmail: string;
    address: string;
    state: string;
    zipCode: string;
}
const initialFormState: TSCFormState = {
    scName: "",
    scEmail: "",
    scPhoneNumber: "",
    scContactEmail: "",
    address: "",
    state: "",
    zipCode: "",
}
const getFormItems = (onChange: React.ChangeEventHandler): TFormItem<TSCFormState>[] => [
    {id: "scName", label: "Service center name", value: v => v.scName, onChange},
    {id: "scEmail", label: "Service center email", value: v => v.scEmail, onChange},
    {id: "scPhoneNumber", label: "Service center phone number", value: v => v.scPhoneNumber, onChange},
    {id: "scContactEmail", label: "Contact person email", value: v => v.scContactEmail, onChange},
];



export const CreateServiceCenter: React.FC<DialogProps> = props => {
    const [formState, setFormState] = useState<TSCFormState>(initialFormState);

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setFormState({...formState, [e.target.name]: e.target.value});
    }, [formState]);
    const formItems = useMemo(() => getFormItems(handleChange), [handleChange]);

    return <BaseModal {...props} onClose={props.onClose}>
        <DialogTitle onClose={props.onClose}>Add service center</DialogTitle>
        <DialogContent>
            <AvatarContainer />
            <ModalForm items={formItems} values={formState} />
        </DialogContent>
        <DialogActions>
            <Button>Cancel</Button>
            <Button color="primary" variant="contained" type="submit">Create</Button>
        </DialogActions>
    </BaseModal>;
}