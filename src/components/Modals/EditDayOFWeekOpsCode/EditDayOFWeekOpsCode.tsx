import React, {useEffect, useState} from 'react';
import {DialogTitle, BaseModal, DialogActions, DialogContent} from "../BaseModal";
import {DialogProps} from "../types";
import {SliderRange, TOpsCode} from "../../Optimizer/PricingSettings/VariableDemand/DayOfWeekOpsCode";
import {TextField} from "../../UI/TextField";
import {Button, Divider} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import {EDemandCategory, IRequestPricingSettings} from "../../../store/reducers/pricingSettings/types";
import {updateSRPricingSettings} from "../../../store/reducers/pricingSettings/actions";
import {useSCs} from "../../../utils/hooks";
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

const EditDayOfWeekOpsCode: React.FC<TEditDayOfWeekOpsCodeProps> = (props) => {
    const initialValues: TState = {
        low: undefined,
        high: undefined
    }
    const [values, setValues] = useState<TState>(initialValues);
    const {selectedSC} = useSCs();
    const dispatch = useDispatch();
    const classes = useStyles();

    useEffect(() => {
        if (props.editingItem) setValues({low: props.editingItem.low, high: props.editingItem.high});
    }, [props.editingItem])

    const onCancel = () => {
        if (props.editingItem) setValues({low: props.editingItem.low, high: props.editingItem.high});
        props.onClose()
    }

    const onSave = () => {
        if (selectedSC && props.editingItem) {
            const data: Partial<IRequestPricingSettings> = {
                serviceCenterId: selectedSC.id,
                values: [],
            }
            if (values.low && data.values) data.values.push({
                demandCategory: EDemandCategory.Low,
                    value: values.low,
            })
            if (values.high && data.values) data.values.push({
                demandCategory: EDemandCategory.High,
                    value: values.high,
            });
            dispatch(updateSRPricingSettings(props.editingItem.id, data))
            onCancel();
        }
    }

    const onInputChange = (type: "low" | "high") => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        e.persist();
        setValues(prev => ({...prev, [type]: e.target.value}))
    }
    return <BaseModal  {...props} width={340} onClose={onCancel}>
        <DialogTitle onClose={onCancel}>Edit Pricing Levels By Ops Code</DialogTitle>
        <DialogContent>
            <TextField type="number"
                       fullWidth
                       label="Low"
                       style={{ marginBottom: 20 }}
                       inputProps={{ min: SliderRange.Min, max: SliderRange.Max, step: 0.001}}
                       value={values.low}
                       onChange={onInputChange("low")}
            />
            <TextField type="number"
                       fullWidth
                       label="High"
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