import React, {useEffect, useState} from 'react';
import {DialogProps} from "../../../components/Modals/types";
import {BaseModal, DialogActions, DialogContent, DialogTitle} from "../../../components/Modals/BaseModal";
import {Button} from "@material-ui/core";
import {LoadingButton} from "../../../components/UI/Button";
import {useException, useMessage, useSCs, useSelectedPod} from "../../../utils/hooks";
import {SC_UNDEFINED} from "../../../config/constants";
import {useDispatch} from "react-redux";
import {
    IOptimizationSetting,
    IOptimizationSettingsCreateForm,
    IOptimizationSettingsItem
} from "../../../store/reducers/slotScoring/types";
import {TextField} from "../../../components/UI/TextField";
import {setOptimizationSettings} from "../../../store/reducers/slotScoring/actions";
import {useStyles} from "./styles";

type TForm = IOptimizationSettingsItem[];

const initialForm: TForm = [
    {from: 1, to: 1},
    {from: 2, to: 2},
    {from: 3, to: 3}
]

export const EditDemandSegmentsModal:React.FC<DialogProps<IOptimizationSetting[]>> = ({onAction, payload, ...props}) => {
    const [form, setForm] = useState<TForm>(initialForm);
    const [isSaving, setSaving] = useState<boolean>(false);
    const {selectedSC} = useSCs();
    const {selectedPod} = useSelectedPod();
    const showMessage = useMessage();
    const showError = useException();
    const dispatch = useDispatch();
    const classes = useStyles();

    useEffect(() => {
        if (props.open) {
            if (payload?.length) {
                setForm(payload.map(({from, to, id}) => ({from, to, id})));
            } else {
                setForm(initialForm);
            }
        }
    }, [props.open, payload]);

    const handleChange = (name: keyof IOptimizationSettingsItem, idx: number) =>
        ({target: {value}}: React.ChangeEvent<HTMLInputElement>) => {
        const f = [...form];
        const row: IOptimizationSettingsItem = {...form[idx]};
        row[name] = Number(value);
        f[idx] = row;
        setForm(f);
    }

    const checkIsValid = (): boolean => {
        const notValidItem = form.find(item => item.from > item.to)
        if (notValidItem) showError('"From" must be less than or equal to "To"')
        return !Boolean(notValidItem);
    }

    const handleSave = async() => {
        if (!selectedSC) {
            showError(SC_UNDEFINED);
        } else {
            if (checkIsValid()) {
                setSaving(true);
                try {
                    const data: IOptimizationSettingsCreateForm = {
                        serviceCenterId: selectedSC.id,
                        podId: selectedPod?.id,
                        items: [...form],
                    };
                    await dispatch(setOptimizationSettings(data));

                    setSaving(false);
                    showMessage("Saved");
                    props.onClose();
                } catch (e) {
                    setSaving(false);
                    showError(e);
                }
            }
        }
    }

    return <BaseModal {...props} width={500}>
        <DialogTitle onClose={props.onClose}>Edit Demand Segment</DialogTitle>
        <DialogContent>
            {form.map((formRow, idx) => {
                return <div className={classes.row} key={idx}>
                    <span className={classes.divider}>From</span>
                    <span className={classes.inputContainer}>
                        <TextField
                            fullWidth
                            label="Segment Start"
                            type="number"
                            name="some-undefined-value-2"
                            inputProps={{min: 1}}
                            onChange={handleChange("from", idx)}
                            value={formRow.from}
                        />
                    </span>
                    <span className={classes.divider}>To</span>
                    <span className={classes.inputContainer}>
                        <TextField
                            fullWidth
                            label="Segment End"
                            type="number"
                            name="some-undefined-value"
                            inputProps={{min: 1}}
                            onChange={handleChange("to", idx)}
                            value={formRow.to}
                        />
                    </span>
                </div>
            })}
        </DialogContent>
        <DialogActions>
            <Button onClick={props.onClose}>
                Cancel
            </Button>
            <LoadingButton loading={isSaving} onClick={handleSave}>
                Save
            </LoadingButton>
        </DialogActions>
    </BaseModal>
};