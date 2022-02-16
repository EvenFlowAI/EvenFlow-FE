import React, {useCallback, useEffect, useState} from 'react';
import {DialogTitle, BaseModal, DialogActions, DialogContent} from "../BaseModal";
import {DialogProps} from "../types";
import {SliderRange, TOpsCode} from "../../Optimizer/PricingSettings/VariableDemand/DayOfWeekOpsCode";
import {TextField} from "../../UI/TextField";
import {Button, Divider} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import {EDemandCategory, IRequestPricingSettings} from "../../../store/reducers/pricingSettings/types";
import {updateSRPricingSettings} from "../../../store/reducers/pricingSettings/actions";
import {useException, useSCs} from "../../../utils/hooks";
import {useDispatch} from "react-redux";

type TEditDayOfWeekOpsCodeProps = DialogProps & {
    editingItem: TOpsCode | null;
};

type TState = {
    low: number | undefined;
    high: number | undefined;
}

const useStyles = makeStyles(() => ({
    wrapper: {
        display: 'flex',
        justifyContent: 'flex-end',
        paddingTop: 14,
    },
    buttonsWrapper: {
        display: 'flex',
        justifyContent: "space-between",
        alignItems: 'center',
    },
    cancelButton: {
        color: '#9FA2B4',
        marginRight: 20,
        border: 'none',
        outline: 'none',
    },
    saveButton: {
        background: '#7898FF',
        color: 'white',
        border: '1px solid #7898FF',
        outline: 'none',
        '&:hover': {
            color: '#7898FF'
        }
    },
}))

const EditDayOfWeekOpsCode: React.FC<TEditDayOfWeekOpsCodeProps> = ({editingItem, ...props}) => {
    const initialValues: TState = {
        low: undefined,
        high: undefined
    }
    const [values, setValues] = useState<TState>(initialValues);
    const {selectedSC} = useSCs();
    const dispatch = useDispatch();
    const showError = useException();
    const classes = useStyles();

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
        <DialogTitle onClose={onCancel}>Edit Day Of Week Ops Code</DialogTitle>
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