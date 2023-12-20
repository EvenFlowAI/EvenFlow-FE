import React, {useEffect, useState} from "react";
import {DialogProps, TViewMode} from "../../../BaseModal/types";
import {BaseModal, DialogActions, DialogContent, DialogTitle} from "../../../BaseModal/BaseModal";
import {Button} from "@material-ui/core";
import moment from "moment";
import {useException, useMessage, useSCs} from "../../../../utils/hooks";
import {Api} from "../../../../config/requests";
import {IHOODataForm} from "../../../../store/reducers/serviceCenters/types";
import {LoadingButton} from "../../../UI/Button";
import {MaterialUiPickersDate} from "@material-ui/pickers/typings/date";
import {timeSpanString} from "../../../../config/constants";
import {THOOForm} from "./types";
import {initialForm} from "./constants";
import {HourOfOperationForm} from "./HourOfOperationForm/HourOfOperationForm";

export const HourOfOperations: React.FC<DialogProps&TViewMode> = ({viewMode, ...props}) => {
    const {selectedSC} = useSCs();
    const [form, setForm] = useState<THOOForm[]>(initialForm);
    const [saving, setSaving] = useState<boolean>(false);
    const [formIsChecked, setFormIsChecked] = useState<boolean>(false);
    const showError = useException();
    const showMessage = useMessage();
    useEffect(() => {
        if (selectedSC) {
            Api.call<IHOODataForm[]>(Api.endpoints.ServiceCenters.GetHOO, {urlParams: {id: selectedSC.id}}).then(r => {
                setForm(initialForm.map(ie => {
                    const element = r.data.find(e => e.dayOfWeek === ie.dayOfWeek);
                    if (element) {
                        return {
                            dayOfWeek: element.dayOfWeek,
                            checked: true,
                            from: moment(element.from, timeSpanString),
                            to: moment(element.to, timeSpanString)
                        };
                    }
                    return ie;
                }))
            });
        }
    }, [selectedSC, setForm, props.open]);

    const handleChange = (day: number, t: "from" | "to") => (date: MaterialUiPickersDate) => {
        setFormIsChecked(false);
        const idx = form.findIndex(v => v.dayOfWeek === day);
        form[idx] = {...form[idx], [t]: date};
        setForm([...form]);
    }
    const handleApplyToAll = (): void => {
        setFormIsChecked(false);
        const el = form[0];
        setForm(form.map((_, idx) => ({...el, dayOfWeek: idx})));
    }
    const handleCheck = (day: number) => (e: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
        setFormIsChecked(false);
        const idx = form.findIndex(v => v.dayOfWeek === day);
        form[idx] = {...form[idx], checked};
        setForm([...form]);
    }

    const isValid = () => {
        const emptyFields = form.find(item => item.checked && (!item.from || !item.to))
        if (emptyFields) showError('"Hours of Operation" must not be empty')
        return !emptyFields;
    }
    const handleUpdate = async () => {
        setFormIsChecked(true);
        if (isValid()) {
            if (!selectedSC) {
                showError("Service center is not selected");
            } else {
                setSaving(true);
                const fd: IHOODataForm[] = form.filter(e => e.checked).map(e => ({
                    ...e, from: moment(e.from).format(timeSpanString), to: moment(e.to).format(timeSpanString)
                })) as IHOODataForm[];
                try {
                    await Api.call(Api.endpoints.ServiceCenters.SetHOO, {data: {hoursOfOperations: fd}, urlParams: {id: selectedSC.id}});
                    setSaving(false);
                    showMessage("Hours of Operation updated");
                    showMessage("The Unplanned Demand Settings for edited days were reset", "warning");
                    props.onClose();
                } catch (e) {
                    showError(e);
                    setSaving(false);
                }
            }
        }
    }

    const onClose = () => {
        props.onClose();
        setFormIsChecked(false);
    }

    return <BaseModal {...props} maxWidth="sm" onClose={onClose}>
        <DialogTitle onClose={onClose}>{viewMode ? "View" : "Edit"} Hours of Operation</DialogTitle>
        <DialogContent>
            <HourOfOperationForm
                formIsChecked={formIsChecked}
                viewMode={viewMode}
                onApply={handleApplyToAll}
                onCheck={handleCheck}
                form={form}
                onChange={handleChange}
            />
        </DialogContent>
        <DialogActions>
            <Button onClick={onClose}>Close</Button>
            {!viewMode ? <LoadingButton
                variant="contained"
                color="primary"
                loading={saving}
                onClick={handleUpdate}>
                Save
            </LoadingButton> : null}
        </DialogActions>
    </BaseModal>
}