import React, {useCallback, useState} from "react";
import {AvatarContainer, BaseModal, DialogActions, DialogContent, DialogTitle} from "../BaseModal";
import {DialogProps} from "../types";
import {States} from "../../../config/constants";
import {Button} from "@material-ui/core";
import {ModalForm, TFormItem, TSelectChange} from "../ModalForm";
import {useDispatch} from "react-redux";
import {IServiceCenterForm} from "../../../store/reducers/serviceCenters/types";
import {useException, useMessage} from "../../../utils/hooks";
import {createSC} from "../../../store/reducers/serviceCenters/actions";


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
    const dispatch = useDispatch();
    const showError = useException();
    const showMessage = useMessage();

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setFormState({...formState, [e.target.name]: e.target.value});
    }, [formState]);
    const handleSelectChange: TSelectChange = useCallback((
        e, val, reason
    ) => {
        setFormState({...formState, state: val || ""});
    }, [formState]);

    const handleCreate = async () => {
        const data: IServiceCenterForm = {
            name: formState.scName,
            serviceCenterEmail: formState.scEmail,
            contactPersonalEmail: formState.cpEmail,
            phoneNumber: formState.scPhoneNumber,
            address: {
                street: formState.street,
                city: formState.city,
                state: formState.state,
                zipCode: formState.zipCode
            }
        }
        try {
            await dispatch(createSC(data));
            showMessage(`${data.name} successfully created`);
            setFormState({...initialFormState});
        } catch (e) {
            showError(e);
        }
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