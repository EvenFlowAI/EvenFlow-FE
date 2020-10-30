import React, {useEffect, useState} from 'react';
import {DialogProps} from "../../Modals/types";
import {BaseModal, DialogActions, DialogContent, DialogTitle} from "../../Modals/BaseModal";
import {Button} from "@material-ui/core";
import {LoadingButton} from "../../UI/Button";
import {useException, useMessage, useSCs, useSelectedPod} from "../../../utils/hooks";
import {SC_UNDEFINED} from "../../../config/constants";
import {useDispatch} from "react-redux";
import {IOptimizationSettingsCreateForm, IOptimizationSettingsItem} from "../../../store/reducers/slotScoring/types";
import {TextField} from "../../UI/TextField";
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles({
    row: {
        display: "flex",
        flexFlow: "row nowrap",
        alignItems: "flex-end",
        marginBottom: 12,
        "&:last-child": {
            marginBottom: 0
        }
    },
    inputContainer: {
        flexBasis: 0,
        flexGrow: 1
    },
    divider: {
        textTransform: "uppercase",
        padding: 12,
        fontWeight: "bold",
        fontSize: 12
    }
})

type TForm = IOptimizationSettingsItem[];
const initialForm: TForm = [
    {from: 0, to: 0},
    {from: 0, to: 0},
    {from: 0, to: 0}
]

export const EditDemandSegments:React.FC<DialogProps> = ({onAction, payload, ...props}) => {
    const [form, setForm] = useState<TForm>(initialForm);
    const [isSaving, setSaving] = useState<boolean>(false);
    const {selectedSC} = useSCs();
    const {selectedPod} = useSelectedPod();
    const showMessage = useMessage();
    const showError = useException();
    const dispatch = useDispatch();

    useEffect(() => {
        if (props.open) {
            setForm(initialForm);
        }
    }, [props.open]);

    const handleChange = (name: keyof IOptimizationSettingsItem, idx: number) =>
        ({target: {value}}: React.ChangeEvent<HTMLInputElement>) => {
        const f = [...form];
        const row: IOptimizationSettingsItem = {...form[idx]};
        row[name] = Number(value);
        f[idx] = row;
        setForm(f);
    }

    const handleSave = async() => {
        if (!selectedSC) {
            showError(SC_UNDEFINED);
        } else {
            setSaving(true);
            try {
                const data: IOptimizationSettingsCreateForm = {
                    serviceCenterId: selectedSC.id,
                    podId: selectedPod?.id,
                    items: [...form]
                };
                // await dispatch(setDemandSegmentGroups(data));
                setSaving(false);
                showMessage("Saved");
                props.onClose();
            } catch (e) {
                setSaving(false);
                showError(e);
            }
        }
    }

    const classes = useStyles();
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