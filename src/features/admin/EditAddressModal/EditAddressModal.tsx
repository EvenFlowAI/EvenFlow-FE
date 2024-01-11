import React, {useEffect, useState} from "react";
import {DialogProps, TViewMode} from "../../../components/modals/BaseModal/types";
import {BaseModal, DialogActions, DialogContent, DialogTitle} from "../../../components/modals/BaseModal/BaseModal";
import {Button} from "@mui/material";
import {IAddress} from "../../../store/reducers/dealershipGroups/types";
import {TSelectChange} from "../../../types/types";
import {IServiceCenterExtended} from "../../../store/reducers/serviceCenters/types";
import {EditForm} from "./EditForm/EditForm";
import {LoadingButton} from "../../../components/buttons/LoadingButton/LoadingButton";

import {useMessage} from "../../../hooks/useMessage/useMessage";
import {useException} from "../../../hooks/useException/useException";
import {useSCs} from "../../../hooks/useSCs/useSCs";
import {Api} from "../../../api/ApiEndpoints/ApiEndpoints";

const initialAddress: IAddress = {
    street: "",
    city: "",
    state: "",
    zipCode: ""
}

export const EditAddressModal: React.FC<DialogProps&TViewMode> = ({viewMode, ...props}) => {
    const [form, setForm] = useState<IAddress>(initialAddress);
    const [saving, setSave] = useState<boolean>(false);
    const showError = useException();
    const showMessage = useMessage();

    const {selectedSC} = useSCs();
    useEffect(() => {
        if (selectedSC) {
            Api.call<IServiceCenterExtended>(
                Api.endpoints.ServiceCenters.Retrieve,
                {urlParams: {id: selectedSC.id}}
            ).then(r => {
                setForm(r.data.address);
            })
        }
    }, [selectedSC, setForm]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({...form, [e.target.name]: e.target.value});
    }
    const handleSelectState: TSelectChange = (e, val) => {
        setForm({...form, state: val || ''});
    }
    const handleSave = async () => {
        if (!selectedSC) {
            showError("Service center is not specified");
        } else {
            setSave(true);
            try {
                await Api.call(
                    Api.endpoints.ServiceCenters.UpdateAddress,
                    {data: form, urlParams: {id: selectedSC.id}}
                    )
                showMessage("Address updated");
                setSave(false);
                props.onClose();
            } catch (e) {
                setSave(false)
                showError(e);
            }
        }
    }

    return <BaseModal {...props} maxWidth="sm">
        <DialogTitle onClose={props.onClose}>
            {viewMode ? "View" : "Edit"} Address
        </DialogTitle>
        <DialogContent>
            <EditForm viewMode={viewMode} onChange={handleChange} onSelect={handleSelectState} form={form} />
        </DialogContent>
        <DialogActions>
            <Button onClick={props.onClose}>Close</Button>
            {!viewMode ? <LoadingButton
                loading={saving}
                variant="contained"
                color="primary"
                onClick={handleSave}>
                Save
            </LoadingButton> : null}
        </DialogActions>
    </BaseModal>
}