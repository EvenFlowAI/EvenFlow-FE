import React, {useCallback, useEffect, useState} from 'react';
import {DialogTitle, BaseModal, DialogActions, DialogContent} from "../../../../components/modals/BaseModal/BaseModal";
import {DialogProps} from "../../../../components/modals/BaseModal/types";
import {SliderRange, TOpsCode} from "../types";
import {TextField} from "../../../../components/formControls/TextFieldStyled/TextField";
import {Button, Divider} from "@mui/material";
import {EDemandCategory, IRequestPricingSettings} from "../../../../store/reducers/pricingSettings/types";
import {updateSRPricingSettings} from "../../../../store/reducers/pricingSettings/actions";
import {useDispatch} from "react-redux";
import {useStyles} from "./styles";
import {useException} from "../../../../hooks/useException/useException";
import {useSCs} from "../../../../hooks/useSCs/useSCs";

type TEditDayOfWeekOpsCodeProps = DialogProps & {
    editingItem: TOpsCode | null;
};

type TState = {
    low: number | undefined;
    high: number | undefined;
}

const initialValues: TState = {
    low: undefined,
    high: undefined
}

const EditDayOfWeekOpsCode: React.FC<React.PropsWithChildren<React.PropsWithChildren<TEditDayOfWeekOpsCodeProps>>> = ({editingItem, ...props}) => {
    const [values, setValues] = useState<TState>(initialValues);
    const {selectedSC} = useSCs();
    const dispatch = useDispatch();
    const showError = useException();
    const { classes  } = useStyles();

    useEffect(() => {
        if (editingItem) setValues({low: editingItem.low, high: editingItem.high});
    }, [editingItem])

    const onCancel = useCallback(() => {
        if (editingItem) setValues({low: editingItem.low, high: editingItem.high});
        props.onClose()
    }, [editingItem, props.onClose])

    const onSave = useCallback(() => {
        if (selectedSC && editingItem) {
            const data: Partial<IRequestPricingSettings> = {
                serviceCenterId: selectedSC.id,
                values: [],
            }
            if (values.low && data.values) {
                if (values.low > 10 || values.low < -10) {
                    return showError('Value must not be more than 10 and less than -10')
                }
                if (!values.low.toString().match(/(^-?\d*\.?\d{1,6}?)$/)) {
                    return showError('Value must be a number with maximum 6 decimal digits')
                } else {
                    data.values.push({
                        demandCategory: EDemandCategory.Low,
                        value: values.low,
                    })
                }
            }
            if (values.high && data.values) {
                if (values.high > 10 || values.high < -10) {
                    return showError('Value must not be more than 10 and less than -10')
                }
                if (!values.high.toString().match(/(^-?\d*\.?\d{1,6}?)$/)) {
                    return showError('Value must be a number with maximum 6 decimal digits')
                } else {
                    data.values.push({
                        demandCategory: EDemandCategory.High,
                        value: values.high,
                    });
                }
            }
            try {
                dispatch(updateSRPricingSettings(editingItem.id, data))
            } catch (e) {
                showError(e)
            } finally {
                onCancel();
            }
        }
    }, [selectedSC, editingItem, onCancel, values, showError])

    const onInputChange = (type: "low" | "high") => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        e.persist();
        setValues(prev => ({...prev, [type]: e.target.value}))
    }
    return <BaseModal  {...props} width={340} onClose={onCancel}>
        <DialogTitle onClose={onCancel}>Edit Day of Week Op Code</DialogTitle>
        <DialogContent>
            <TextField type="number"
                       fullWidth
                       label="Low"
                       error={!!values.low && (values.low > 10 || values.low < -10)}
                       style={{ marginBottom: 20 }}
                       inputProps={{ min: SliderRange.Min, max: SliderRange.Max, step: 0.001}}
                       value={values.low}
                       onChange={onInputChange("low")}
            />
            <TextField type="number"
                       fullWidth
                       label="High"
                       error={!!values.high && (values.high > 10 || values.high < -10)}
                       style={{ marginBottom: 20 }}
                       inputProps={{ min: SliderRange.Min, max: SliderRange.Max, step: 0.001}}
                       value={values.high}
                       onChange={onInputChange("high")}
            />
        </DialogContent>
        <Divider style={{ margin: 0}}/>
        <DialogActions>
            <div className={classes.wrapper}>
                <div className={classes.buttonsWrapper}>
                    <Button
                        onClick={onCancel}
                        className={classes.cancelButton}>
                        Cancel
                    </Button>
                    <Button
                        onClick={onSave}
                        className={classes.saveButton}>
                        Save
                    </Button>
                </div>
            </div>
        </DialogActions>
    </BaseModal>
};

export default EditDayOfWeekOpsCode;