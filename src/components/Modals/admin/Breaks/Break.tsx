import React, {useEffect, useState} from "react";
import {DialogProps, TViewMode} from "../../types";
import {BaseModal, DialogActions, DialogContent, DialogTitle} from "../../BaseModal";
import {Button} from "@material-ui/core";
import moment from "moment";
import {LoadingButton} from "../../../UI/Button";
import {Api} from "../../../../config/requests";
import {useException, useMessage, useSCs} from "../../../../utils/hooks";
import {IBreak, IBreakFrom} from "../../../../store/reducers/serviceCenters/types";
import {timeSpanString} from "../../../../config/constants";
import {MaterialUiPickersDate} from "@material-ui/pickers/typings/date";
import {TBreak} from "./types";
import {initialBreaks} from "./constants";
import {BreakForm} from "./BreakForm/BreakForm";

export const Break: React.FC<DialogProps&TViewMode> = ({viewMode, ...props}) => {
    const [saving, setSaving] = useState<boolean>(false);
    const [formIsChecked, setFormIsChecked] = useState<boolean>(false);
    const [form, setForm] = useState<TBreak[]>(initialBreaks);
    const [wd, setWD] = useState<number[]>([]);
    const {selectedSC} = useSCs();
    const showError = useException();
    const showMessage = useMessage();

    useEffect(() => {
        if (props.open && selectedSC) {
            Api.call<number[]>(
                Api.endpoints.ServiceCenters.WorkingDays,
                {urlParams: {id: selectedSC.id}}
            ).then(({data}) => {
                setWD(data);
            });
            Api.call<IBreak[]>(
                Api.endpoints.ServiceCenters.GetBreaks,
                {urlParams: {id: selectedSC.id}}
            ).then(({data}) => {
                setForm(initialBreaks.map(el => {
                    const fd = data.find(e => e.dayOfWeek === el.dayOfWeek);
                    if (fd) {
                        return {
                            ...fd,
                            checked: true,
                            from: moment(fd.from, timeSpanString),
                            to: moment(fd.to, timeSpanString)
                        }
                    }
                    return el;
                }))
            })
        }
    }, [props.open, setForm, selectedSC, setWD]);

    const handleCheck = (dayOfWeek: number, checked: boolean) => () => {
        setFormIsChecked(false);
        const idx = form.findIndex(d => d.dayOfWeek === dayOfWeek);
        form[idx] = {...form[idx], checked};
        setForm([...form]);
    }
    const handleChange = (dayOfWeek: number, v: "from" | "to") => (date: MaterialUiPickersDate) => {
        setFormIsChecked(false);
        const idx = form.findIndex(d => d.dayOfWeek === dayOfWeek);
        form[idx] = {...form[idx], [v]: date};
        setForm([...form]);
    }

    const checkIsValid = () => {
        const emptyFields = form.find(item => item.checked && (!item.from || !item.to))
        if (emptyFields) showError('"Breaks" must not be empty')
        return !emptyFields;
    }

    const handleSave = async () => {
        setFormIsChecked(true);
        if (checkIsValid()) {
            if (!selectedSC) {
                showError("Service center is not selected");
            } else {
                setSaving(true);
                const data: IBreakFrom = {breaks: form
                        .filter(el => {
                            return el.checked;
                        }).map(fe => {
                            return {
                                ...fe,
                                from: moment(fe.from).format(timeSpanString),
                                to: moment(fe.to).format(timeSpanString)
                            };
                        })};
                try {
                    await Api.call(
                        Api.endpoints.ServiceCenters.SetBreaks,
                        {urlParams: {id: selectedSC.id}, data}
                    ).then(res => {
                        if (res) showMessage("Breaks updated.");
                    })
                    props.onClose();
                } catch (e) {
                    showError(e);
                } finally {
                    setSaving(false);
                }
            }
        }
    }

    const onClose = () => {
        setFormIsChecked(false);
        props.onClose();
    }

    return <BaseModal {...props} width={780} onClose={onClose}>
        <DialogTitle onClose={onClose}>{viewMode ? "View" : "Edit"} Breaks</DialogTitle>
        <DialogContent>
            <BreakForm
                formIsChecked={formIsChecked}
                viewMode={viewMode}
                workDays={wd}
                onChange={handleChange}
                onCheck={handleCheck}
                form={form} />
        </DialogContent>
        <DialogActions>
            <Button onClick={onClose}>Close</Button>
            {!viewMode ? <LoadingButton
                loading={saving}
                variant="contained"
                color="primary"
                onClick={handleSave}>
                Save
            </LoadingButton> : null}
        </DialogActions>
    </BaseModal>;
}