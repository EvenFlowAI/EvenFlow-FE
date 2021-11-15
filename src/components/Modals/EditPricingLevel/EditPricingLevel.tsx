import React, {ChangeEvent, useEffect, useState} from 'react';
import {BaseModal, DialogActions, DialogContent, DialogTitle} from "../BaseModal";
import {TextField} from "../../UI/TextField";
import {DialogProps} from "../types";
import {TPricingLevel} from "../../Optimizer/PricingSettings/PricingLevels/PricingLevelsByOpsCode";
import {Box, Button, Divider} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import {autocompleteRender} from "../../UI/AutocompleteRender";
import {Autocomplete} from "@material-ui/lab";

type TEditPricingLevelsProps = DialogProps & {
  prisingLevel: TPricingLevel | null;
};

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

const EditPricingLevel: React.FC<TEditPricingLevelsProps> = (props) => {
    const [service, setService] = useState<string>('');
    const [opsCode, setOpsCode] = useState<string>('');
    const [discount, setDiscount] = useState<string | null>(null);
    const [premium, setPremium] = useState<string | null>(null);
    const [formIsChecked, setFormIsChecked] = useState<boolean>(false);
    const classes = useStyles();

    useEffect(() => {
        if (props.prisingLevel) {
            setService(props.prisingLevel.serviceRequest);
            setOpsCode(props.prisingLevel.opsCode);
            props.prisingLevel?.premium && setPremium(props.prisingLevel.premium);
            props.prisingLevel?.discount && setDiscount(props.prisingLevel.discount);
        }
    }, [props.prisingLevel])

    const getOptions = (from = 0, to = 100) => {
        let options = ['Default'];
        for (let i = from; i <= to; i++) {
            options.push(i.toString())
        }
        return options;
    }

    const onSave = () => {
        setFormIsChecked(true);
        // TODO request
    }

    const onCancel = () => {
        setFormIsChecked(false);
        props.onClose();
    }

    const onTextFieldChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, fieldName: string) => {
        setFormIsChecked(false);
        if (fieldName === 'opsCode') setOpsCode(e.target.value)
        if (fieldName === 'service') setService(e.target.value)
    }

    const onDiscountChange = (e: ChangeEvent<{}>, value: string | null) => {
        setDiscount(value);
    }
    const onPremiumChange = (e: ChangeEvent<{}>, value: string | null) => {
        setPremium(value);
    }

    return <BaseModal  {...props} width={540} onClose={onCancel}>
        <DialogTitle onClose={onCancel}>Edit Pricing Levels By Ops Code</DialogTitle>
        <DialogContent>
            <TextField
                fullWidth
                label='Individual Service'
                placeholder='Type Individual Service'
                error={!service && formIsChecked}
                onChange={e => onTextFieldChange(e, 'service')}
                value={service}/>
            <Box p={1}/>
            <TextField
                fullWidth
                label='Ops Code'
                placeholder='Type Ops Code'
                error={!opsCode && formIsChecked}
                onChange={e => onTextFieldChange(e, 'opsCode')}
                value={opsCode}/>
            <Box p={1}/>
            <Autocomplete
                style={{ marginBottom: 10 }}
                options={getOptions()}
                disableCloseOnSelect
                value={discount}
                onChange={onDiscountChange}
                renderInput={autocompleteRender({
                    label: "Discount",
                    error: !discount && formIsChecked,
                    placeholder: 'Select Discount'
                })}
            />
            <Box p={1}/>
            <Autocomplete
                style={{ marginBottom: 10 }}
                options={getOptions(101, 200)}
                disableCloseOnSelect
                value={premium}
                onChange={onPremiumChange}
                renderInput={autocompleteRender({
                    label: "Premium",
                    error: !premium && formIsChecked,
                    placeholder: 'Select Premium'
                })}
            />
        </DialogContent>
        <Divider style={{ margin: 0 }}/>
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

export default EditPricingLevel;