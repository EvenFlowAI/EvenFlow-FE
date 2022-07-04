import React, {useState} from 'react';
import {TextField} from "../../UI/TextField";
import {BaseModal, DialogActions, DialogContent, DialogTitle} from "../BaseModal";
import {DialogProps} from "../types";
import {Button} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";

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

const AddDistanceRange: React.FC<DialogProps> = (props) => {
    const [rangeMin, setRangeMin] = useState<number>(0);
    const [rangeMax, setRangeMax] = useState<number>(0);
    const [costPerMile, setCostPerMile] = useState<number>(0);
    const [formIsChecked, setFormChecked] = useState<boolean>(false);
    const classes = useStyles();

    const onCancel = () => {

    }

    const onSave = () => {

    }

    const onRangeMinChange = ({target: {value}}: React.ChangeEvent<HTMLInputElement>) => {
        if (Number(value) >= 0) setRangeMin(+value)
    }

    const onRangeMaxChange = ({target: {value}}: React.ChangeEvent<HTMLInputElement>) => {
        if (Number(value) >= 0) setRangeMax(+value)
    }

    const onCostPerMileChange = ({target: {value}}: React.ChangeEvent<HTMLInputElement>) => {
        if (Number(value) >= 0) setCostPerMile(+value)
    }

    return (
        <BaseModal {...props} width={440} onClose={onCancel}>
            <DialogTitle onClose={onCancel}>ADD RANGE</DialogTitle>
            <DialogContent>
                <TextField
                    type="number"
                    label='Distance (Range Min)'
                    placeholder='0.00'
                    error={!rangeMin && formIsChecked}
                    onChange={onRangeMinChange}
                    fullWidth
                    inputProps={{min: 0, step: 0.01}}
                    style={{ marginBottom: 20 }}
                    value={rangeMin.toFixed(2)}/>
                <TextField
                    type="number"
                    label='Distance (Range Max)'
                    placeholder='0.00'
                    error={!rangeMax && formIsChecked}
                    onChange={onRangeMaxChange}
                    fullWidth
                    inputProps={{min: 0, step: 0.01}}
                    style={{ marginBottom: 20 }}
                    value={rangeMax.toFixed(2)}/>
                <TextField
                    type="number"
                    label='Distance (Range Min)'
                    placeholder='0.00'
                    error={!costPerMile && formIsChecked}
                    onChange={onCostPerMileChange}
                    fullWidth
                    inputProps={{min: 0, step: 0.01}}
                    value={costPerMile.toFixed(2)}/>
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