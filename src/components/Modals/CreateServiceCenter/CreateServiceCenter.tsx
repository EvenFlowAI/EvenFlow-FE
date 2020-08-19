import React, {useCallback, useState} from "react";
import {AvatarContainer, BaseModal, DialogActions, DialogContent, DialogTitle} from "../BaseModal";
import {DialogProps} from "../types";
import {States} from "../../../config/constants";
import {Autocomplete, AutocompleteChangeDetails, AutocompleteChangeReason} from "@material-ui/lab";
import {TextField, TextInputProps} from "../../UI/TextField";
import {Button, Divider, Grid} from "@material-ui/core";
import {noop} from "../../../utils/utils";

type TInputChange = (e: React.ChangeEvent<HTMLInputElement>) => void;
type TSelectChange = (
    e: React.ChangeEvent<{}>,
    value: string | null,
    reason: AutocompleteChangeReason,
    details?: AutocompleteChangeDetails<string> | undefined
) => void;

type TFormItem<DataType> = {
    label?: string;
    id: string;
    name?: string;
    value: (d: DataType) => string;
    inputType?: "email" | "password";
    variant?: "input" | "textarea" | "select"
    inputProps?: TextInputProps;
    selectOptions?: any
}
type TProps<D> = {
    items: TFormItem<D>[][]
    values: D,
    onChange: TInputChange;
    onSelectChange: TSelectChange;
}

const ModalForm = <Item extends {}>(props: TProps<Item>): JSX.Element => {
    return <form>
        {props.items.map((itemGroup, idx) =>
            <div key={idx}>
                {idx ? <Divider /> : null}
                <Grid container spacing={2}>
                    {itemGroup.map(item =>
                        <Grid item xs={6} key={item.id}>
                            {!item.variant || item.variant === 'input'
                                ? <TextField
                                    label={item.label}
                                    name={item.name || item.id}
                                    value={item.value(props.values)}
                                    onChange={props.onChange}
                                    fullWidth
                                    {...item.inputProps}
                                />
                                : item.variant === 'select'
                                    ? <Autocomplete
                                        options={item.selectOptions || []}
                                        onChange={props.onSelectChange}
                                        value={item.value(props.values)}
                                        renderInput={params =>
                                            <div ref={params.InputProps.ref}>
                                                <TextField {...params.inputProps} label={item.label} />
                                            </div>
                                        }
                                    />
                                    : null}
                        </Grid>
                    )}
                </Grid>
            </div>
        )}
    </form>;
}


const states = Object.values(States);


type TSCFormState = {
    scName: string;
    scEmail: string;
    scPhoneNumber: string;
    cpEmail: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
}
const initialFormState: TSCFormState = {
    scName: "",
    scEmail: "",
    scPhoneNumber: "",
    cpEmail: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
}
const formItems: TFormItem<TSCFormState>[][] = [
    [
        {id: "scName", label: "Service center name", value: v => v.scName},
        {id: "scEmail", label: "Service center email", inputType: "email", value: v => v.scEmail},
        {id: "scPhoneNumber", label: "Service center phone number", value: v => v.scPhoneNumber},
        {id: "cpEmail", label: "Contact person email", inputType: "email", value: v => v.cpEmail}
    ],
    [
        {id: "street", label: "Street", value: v => v.street},
        {id: "city", label: "City", value: v => v.city},
        {id: "state", label: "State", variant: "select", value: v => v.state, selectOptions: states},
        {id: "zipCode", label: "Zip code", value: v => v.zipCode}
    ]
];



export const CreateServiceCenter: React.FC<DialogProps> = props => {
    const [formState, setFormState] = useState<TSCFormState>(initialFormState);

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setFormState({...formState, [e.target.name]: e.target.value});
    }, [formState]);
    const handleSelectChange: TSelectChange = useCallback((
        e, val, reason
    ) => {
        setFormState({...formState, state: val || ""});
    }, [formState]);

    const handleCreate = () => {
        console.log(formState);
    }

    return <BaseModal {...props} onClose={props.onClose}>
        <DialogTitle onClose={props.onClose}>Add service center</DialogTitle>
        <DialogContent>
            <AvatarContainer />
            <ModalForm
                items={formItems}
                values={formState}
                onChange={handleChange}
                onSelectChange={handleSelectChange}
            />
        </DialogContent>
        <DialogActions>
            <Button>Cancel</Button>
            <Button color="primary"
                    variant="contained"
                    onClick={handleCreate}
                    type="submit">Create</Button>
        </DialogActions>
    </BaseModal>;
}