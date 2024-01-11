import React, {useEffect, useState} from "react";
import {DialogProps} from "../../../../components/modals/BaseModal/types";
import {BaseModal, DialogActions, DialogContent, DialogTitle} from "../../../../components/modals/BaseModal/BaseModal";
import {Button} from "@mui/material";
import {IHoliday} from "../../../../store/reducers/holidays/types";
import {THolidayForm} from "../types";
import {HolidayForm} from "../AddHolidayForm/AddHolidayForm";
import {LoadingButton} from "../../../../components/buttons/LoadingButton/LoadingButton";

import {useMessage} from "../../../../hooks/useMessage/useMessage";
import {useException} from "../../../../hooks/useException/useException";
import {useSCs} from "../../../../hooks/useSCs/useSCs";
import {Api} from "../../../../api/ApiEndpoints/ApiEndpoints";
import moment from "moment";

const initialForm: THolidayForm = {
    date: null,
    isRecurring: false,
    description: ""
}

export const AddHolidayModal: React.FC<DialogProps<IHoliday>> = ({onAction, payload, ...props}) => {
    const [form, setForm] = useState<THolidayForm>(initialForm);
    const [saving, setSaving] = useState<boolean>(false);
    const {selectedSC} = useSCs();
    const showError = useException();
    const showMessage = useMessage();

    useEffect(() => {
        if (props.open) {
            if (!payload) {
                setForm(initialForm);
            } else {
                setForm({...initialForm, ...payload});
            }
        }
    }, [props.open, payload]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.name === "description" && e.target.value?.length > 40) {
            showError('The Description can`t be longer than 40 characters')
        } else {
            setForm({...form, [e.target.name]: e.target.value});
        }
    }
    const handleDateChange = (date: moment.Moment) => {
        setForm({...form, date});
    }
    const handleCheck = (e: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
        setForm({...form, [e.target.name]: checked});
    }

    const handleSave = async () => {
        if (!selectedSC) {
            showError("Service center is not selected");
        } else {
            const data: IHoliday = {...payload, ...form, serviceCenterId: selectedSC.id};
            setSaving(true);
            try {
                if (payload) {
                    await Api.call(
                        Api.endpoints.Holidays.Update,
                        {data, urlParams: {id: data?.id}}
                    ).then(res => {
                        if (res) showMessage("Holiday updated");
                    })
                } else {
                    await Api.call(Api.endpoints.Holidays.Create, {data})
                        .then(res => {
                            if (res) showMessage("Holiday created");
                        })
                }
                if (onAction) {
                    onAction();
                }
                props.onClose();
            } catch (e) {
                showError(e);
            } finally {
                setSaving(false);
            }
        }
    }
    return <BaseModal {...props} width={600}>
        <DialogTitle onClose={props.onClose}>{payload ? "Edit" : "Add"} Holiday</DialogTitle>
        <DialogContent>
            <HolidayForm
                onChange={handleChange}
                form={form}
                onCheck={handleCheck}
                onDateChange={handleDateChange}
            />
        </DialogContent>
        <DialogActions>
            <Button onClick={props.onClose}>Cancel</Button>
            <LoadingButton
                loading={saving}
                onClick={handleSave}
                variant="contained"
                color="primary">
                Save
            </LoadingButton>
        </DialogActions>
    </BaseModal>
}