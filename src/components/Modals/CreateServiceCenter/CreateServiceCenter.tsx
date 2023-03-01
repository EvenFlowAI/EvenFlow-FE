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
import {API} from "../../../api/api";
import {checkEmail, validatePhoneNumber} from "../../../utils/utils";

type TSCFormState = {
    scName: string;
    scEmail: string;
    scPhoneNumber: string;
    cpEmail: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    timeZoneId: string;
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
    timeZoneId: ""
}

export const CreateServiceCenter:
    React.FC<DialogProps<IServiceCenterForm>&{readOnly?: boolean}> =
    ({payload, readOnly, ...props}) => {
        const saving = useSelector((state: RootState) => state.serviceCenters.saving);

        const initialState: TSCFormState = useMemo(() => ({
            scName: payload?.name || initialFormState.scName,
            scEmail: payload?.serviceCenterEmail || initialFormState.scEmail,
            scPhoneNumber: payload?.phoneNumber || initialFormState.scPhoneNumber,
            cpEmail: payload?.contactPersonalEmail || initialFormState.cpEmail,
            city: payload?.address?.city || initialFormState.city,
            zipCode: payload?.address?.zipCode || initialFormState.zipCode,
            street: payload?.address?.street || initialFormState.street,
            state: payload?.address?.state || initialFormState.state,
            timeZoneId: payload?.timeZoneId || initialFormState.timeZoneId
        }), [payload]);
        const [timeZones, setTimeZones] = useState<string[]>([]);
        const [formState, setFormState] = useState<TSCFormState>(initialState);
        const [avatar, setAvatar] = useState<File | null>( null);
        const [formIsChecked, setFormIsChecked] = useState<boolean>(false);

        const formItems: TFormItem<TSCFormState>[][] = useMemo(() => [
            [
                {id: "scName", label: "Service center name", value: v => v.scName, required: true},
                {id: "scEmail", label: "Service center email", inputType: "email", value: v => v.scEmail, required: true},
                {id: "scPhoneNumber", label: "Service center phone number",  inputType: "number", value: v => v.scPhoneNumber, required: true},
                {id: "cpEmail", label: "Contact person email", inputType: "email", value: v => v.cpEmail, required: true}
            ],
            [
                {id: "street", label: "Street", value: v => v.street},
                {id: "city", label: "City", value: v => v.city, required: true},
                {id: "state", label: "State", variant: "select", value: v => v.state, selectOptions: states, sm: 6, required: true},
                {id: "zipCode", label: "Zip code", value: v => v.zipCode, sm: 3, required: true},
                {id: "timeZoneId", label: "Time zone", value: v => v.timeZoneId, sm: 3, variant: "select", selectOptions: timeZones, required: true}
            ]
        ], [timeZones]);

        const dispatch = useDispatch();
        const showError = useException();
        const showMessage = useMessage();
        const isEdit = Boolean(payload?.id);

        useEffect(() => {
            if (props.open) {
                setFormState(initialState);
            }
        }, [props.open, initialState]);

        useEffect(() => {
            if (props.open) {
                API.configs.get().then(r => {
                    setTimeZones(r.data.timeZones);
                })
                    .catch(() => setTimeZones([]));
            }
        }, [props.open]);

        const handleChange = useCallback(({target: {name, value}}: React.ChangeEvent<HTMLInputElement>) => {
            setFormIsChecked(false);
            if (name === "scPhoneNumber") {
                value = validatePhoneNumber(value);
            }
            setFormState({...formState, [name]: value});
        }, [formState]);

        const handleSelectChange: (name: string) => TSelectChange = useCallback((name: string) => (
            e, val
        ) => {
            setFormIsChecked(false)
            setFormState({...formState, [name]: val || ""});
        }, [formState]);

        const validateData = (): boolean => {
            let err: string[] = [];
            if (!formState.scEmail.length) {
                err = [...err, '"Service Center Email" must not be empty'];
            } else {
                if (!checkEmail(formState.scEmail)) err = [...err, '"Service Center Email" is not valid']
            }
            if (!formState.cpEmail.length) {
                err = [...err, '"Contact Person Email" must not be empty'];
            } else {
                if (!checkEmail(formState.cpEmail)) err = [...err, '"Contact Person Email" is not valid'];
            }
            if (!formState.zipCode.length) err = [...err, '"Zip Code" must not be empty'];
            if (!formState.timeZoneId) err = [...err, '"Time Zone" must not be empty']
            if (!formState.scPhoneNumber.length) {
                err = [...err, '"Service Center Phone Number" must not be empty'];
            } else {
                if (formState.scPhoneNumber.length < 11) err = [...err, '"Service Center Phone Number" is not valid'];
            }
            if (!formState.state.length) err = [...err, '"State" must not be empty'];
            if (!formState.city.length) err = [...err, '"City" must not be empty'];
            if (!formState.scName) err = [...err, '"Service Center Name" must not be empty'];

            err.map(err => showError(err))
            return !Boolean(err.length)
        }

        const handleCreate = async () => {
            setFormIsChecked(true);
            const isValid = validateData();
            if (isValid) {
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
                    },
                    timeZoneId: formState.timeZoneId
                }
                try {
                    if (payload?.id) {
                        await dispatch(updateSC(data, payload.id, avatar));
                    } else {
                        await dispatch(createSC(data, avatar));
                    }
                    showMessage(`Service Center ${isEdit ? "updated" : "created"}`);
                    setFormState(initialFormState);
                    setFormIsChecked(false);
                    props.onClose();
                } catch (e) {
                    showError(e);
                }
            }
        }

        const onClose = () => {
            props.onClose();
            setFormIsChecked(false);
        }

        return <BaseModal {...props} onClose={onClose}>
            <DialogTitle onClose={onClose}>
                {readOnly
                    ? "View" : isEdit
                        ? "Update" : "Add"} Service Center
            </DialogTitle>
            <DialogContent>
                <AvatarContainer disabled={readOnly} dataUrl={payload?.avatarPath} onChange={(f: File) => setAvatar(f)} />
                <ModalForm
                    formIsChecked={formIsChecked}
                    readOnly={readOnly}
                    items={formItems}
                    values={formState}
                    onChange={handleChange}
                    onSelectChange={handleSelectChange}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Close</Button>
                {!readOnly ? <LoadingButton
                    color="primary"
                    loading={saving}
                    variant="contained"
                    onClick={handleCreate}
                    type="submit">Save</LoadingButton> : null}
            </DialogActions>
        </BaseModal>;
    }