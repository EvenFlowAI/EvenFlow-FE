import React, {useState} from 'react';
import {TextField} from "../../UI/TextField";
import {BaseModal, DialogActions, DialogContent, DialogTitle} from "../BaseModal";
import {DialogProps} from "../types";
import {Button} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import {TDistanceRange} from "../../../store/reducers/serviceValet/types";

const useStyles = makeStyles(() => ({
    label: {
        fontWeight: 'bold',
        textTransform: 'uppercase',
        fontSize: 12,
        marginBottom: 10,
        color: 'black',
    },
    buttonsWrapper: {
        display: 'flex',
        justifyContent: "space-between",
        alignItems: 'center',
    },
    wrapper: {
        display: 'flex',
        justifyContent: 'flex-end',
        paddingTop: 14,
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

const AddDistanceRange: React.FC<DialogProps & {onAddRange: (data: TDistanceRange) => void}> = (props) => {
    const [rangeMin, setRangeMin] = useState<number|null>(null);
    const [rangeMax, setRangeMax] = useState<number|null>(null);
    const [costPerMile, setCostPerMile] = useState<number|null>(null);
    const [formIsChecked, setFormChecked] = useState<boolean>(false);
    const classes = useStyles();

    const onCancel = () => {
        setRangeMin(null);
        setRangeMax(null);
        setCostPerMile(null);
        setFormChecked(false);
        props.onClose()
    }

    const onSave = () => {
        setFormChecked(true);
        if (rangeMin && rangeMax && costPerMile) {
            props.onAddRange({
                rangeMin,
                rangeMax,
                costPerMile,
            })
            onCancel();
        }
    }

    const onRangeMinChange = ({target: {value}}: React.ChangeEvent<HTMLInputElement>) => {
        setFormChecked(false);
        if (Number(value) >= 0) setRangeMin(+(Number(value).toFixed(2)));
    }

    const onRangeMaxChange = ({target: {value}}: React.ChangeEvent<HTMLInputElement>) => {
        setFormChecked(false);
        if (Number(value) >= 0) setRangeMax(+(Number(value).toFixed(2)));
    }

    const onCostPerMileChange = ({target: {value}}: React.ChangeEvent<HTMLInputElement>) => {
        setFormChecked(false);
        if (Number(value) >= 0) setCostPerMile(+(Number(value).toFixed(2)));
    }

    return (
        <BaseModal open={props.open} width={440} onClose={onCancel}>
            <DialogTitle onClose={onCancel}>ADD RANGE</DialogTitle>
            <DialogContent>
                <TextField
                    type="number"
                    label='Distance (Range Min)'
                    placeholder='Type Range Min'
                    error={!rangeMin && formIsChecked}
                    onChange={onRangeMinChange}
                    fullWidth
                    inputProps={{min: 0, step: 0.01}}
                    style={{ marginBottom: 20 }}
                    value={rangeMin}/>
                <TextField
                    type="number"
                    label='Distance (Range Max)'
                    placeholder='Type Range Max'
                    error={!rangeMax && formIsChecked}
                    onChange={onRangeMaxChange}
                    fullWidth
                    inputProps={{min: 0, step: 0.01}}
                    style={{ marginBottom: 20 }}
                    value={rangeMax}/>
                <TextField
                    type="number"
                    label='Cost Per Mile'
                    placeholder='Type Cost Per Mile'
                    error={!costPerMile && formIsChecked}
                    onChange={onCostPerMileChange}
                    fullWidth
                    inputProps={{min: 0, step: 0.01}}
                    value={costPerMile}/>
            </DialogContent>
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
    );
};

export default AddDistanceRange;