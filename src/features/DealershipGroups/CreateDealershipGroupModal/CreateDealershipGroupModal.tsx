import React, {useEffect, useState} from "react";
import {
    BaseModal,
    DialogContent,
    DialogTitle,
    DialogActions
} from "../../../components/BaseModal/BaseModal";
import {DialogProps} from "../../../components/BaseModal/types";
import {
    Divider, Button
} from "@material-ui/core";
import {
    IContactPersonForm,
    IDealershipForm,
    IDealershipGroupForm
} from "../../../store/reducers/dealershipGroups/types";
import {create} from "../../../store/reducers/dealershipGroups/actions";
import {useDispatch, useSelector} from "react-redux";
import {useException, useMessage, useValidation} from "../../../utils/hooks";
import {RootState} from "../../../store/rootReducer";
import {LoadingButton} from "../../../components/UI/Button";
import {validatePhoneNumber} from "../../../utils/utils";
import {FormElements} from "./FormElements/FormElements";
import {initialCPState, initialStateDealershipState, requiredFields, elementsGroup1, elementsGroup2} from "./constants";
import {DialogContentTitle} from "../DialogContentTitle/DialogContentTitle";
import {AvatarWrapper} from "../../../components/AvatarWrapper/AvatarWrapper";

export const CreateDealershipGroupModal: React.FC<DialogProps> = props => {
    const [dealership, setDealership] = useState<IDealershipForm>({...initialStateDealershipState});
    const [contactPerson, setCP] = useState<IContactPersonForm>({...initialCPState});
    const dispatch = useDispatch();
    const saving = useSelector((state: RootState) => state.dealershipGroups.saving);
    const setException = useException();
    const showMessage = useMessage();
    const validate = useValidation(
        requiredFields, {...dealership, ...contactPerson}
    );

    useEffect(() => {
        setDealership({...initialStateDealershipState});
        setCP({...initialCPState});
    }, [props.open]);

    const handleChange = (v: "dealership" | "cp") => ({target: {value, name}}: React.ChangeEvent<HTMLInputElement>) => {
        if (name === "phoneNumber") {
            value = validatePhoneNumber(value);
        }
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
            showMessage("Dealership Created");
            props.onClose();
        } catch (e) {
            setException(e);
        }

    }

    return <BaseModal {...props} onClose={props.onClose}>
        <DialogTitle onClose={props.onClose}>Add Dealership Group</DialogTitle>
        <DialogContent>
            <AvatarWrapper />

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