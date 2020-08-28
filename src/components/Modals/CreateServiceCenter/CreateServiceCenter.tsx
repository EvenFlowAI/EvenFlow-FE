import React, {useCallback, useEffect, useMemo, useState} from "react";
import {AvatarContainer, BaseModal, DialogActions, DialogContent, DialogTitle} from "../BaseModal";
import {DialogProps} from "../types";
import {states} from "../../../config/constants";
import {Button} from "@material-ui/core";
import {ModalForm, TFormItem, TSelectChange} from "../ModalForm";
import {useDispatch, useSelector} from "react-redux";
import {IServiceCenterForm} from "../../../store/reducers/serviceCenters/types";
import {useException, useMessage} from "../../../utils/hooks";
import {createSC, updateSC} from "../../../store/reducers/serviceCenters/actions";
import {LoadingButton} from "../../UI/Button";
import {RootState} from "../../../store/rootReducer";


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



export const CreateServiceCenter: React.FC<DialogProps<IServiceCenterForm>> = ({payload, ...props}) => {
    const initialState: TSCFormState = useMemo(() => {
        return {
            scName: payload?.name || initialFormState.scName,
            scEmail: payload?.serviceCenterEmail || initialFormState.scEmail,
            scPhoneNumber: payload?.phoneNumber || initialFormState.scPhoneNumber,
            cpEmail: payload?.contactPersonalEmail || initialFormState.cpEmail,
            city: payload?.address?.city || initialFormState.city,
            zipCode: payload?.address?.zipCode || initialFormState.zipCode,
            street: payload?.address?.street || initialFormState.street,
            state: payload?.address?.state || initialFormState.state
        }
    }, [payload]);

    const saving = useSelector((state: RootState) => state.serviceCenters.saving);

    const [formState, setFormState] = useState<TSCFormState>(initialState);
    const [avatar, setAvatar] = useState<File | null>( null);

    const isEdit = Boolean(payload?.id);

    useEffect(() => {
        setFormState(initialState);
    }, [props.open, initialState]);

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
            if (payload?.id) {
                await dispatch(updateSC(data, payload.id, avatar));
            } else {
                await dispatch(createSC(data, avatar));
            }
            showMessage(`${data.name} successfully ${isEdit ? "updated" : "created"}`);
            setFormState(initialFormState);
            props.onClose();
        } catch (e) {
            showError(e);
        }
    }

    return <BaseModal {...props}>
        <DialogTitle onClose={props.onClose}>{isEdit ? "Update" : "Add"} service center</DialogTitle>
        <DialogContent>
            <AvatarContainer dataUrl={payload?.avatarPath} onChange={(f: File) => setAvatar(f)} />
            <ModalForm
                items={formItems}
                values={formState}
                onChange={handleChange}
                onSelectChange={handleSelectChange}
            />
        </DialogContent>
        <DialogActions>
            <Button onClick={props.onClose}>Cancel</Button>
            <LoadingButton
                color="primary"
                loading={saving}
                variant="contained"
                onClick={handleCreate}
                type="submit">Save</LoadingButton>
        </DialogActions>
    </BaseModal>;
}