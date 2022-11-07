import React, {useCallback, useEffect, useState} from 'react';
import {useDispatch} from "react-redux";
import {useException, useSCs} from "../../../utils/hooks";
import {EDemandCategory} from "../../../store/reducers/pricingSettings/types";
import {updateMPPricingLevels} from "../../../store/reducers/pricingSettings/actions";
import {BaseModal, DialogActions, DialogContent, DialogTitle} from "../BaseModal";
import {TextField} from "../../UI/TextField";
import {Box, Button, Divider} from "@material-ui/core";
import {DialogProps} from "../types";
import {TPackagePricingLevel} from "../../Optimizer/PricingSettings/PricingLevels/PricingLevelsByPackage";
import {useEditPricingLevelStyles} from "../EditPricingLevel/EditPricingLevel";

type TEditPricingLevelsProps = DialogProps & {
    prisingLevel: TPackagePricingLevel | null;
};

type TValue = {
    demandCategory: EDemandCategory.Low | EDemandCategory.High;
    value: number;
}

type TUpdatedSettings = {
    serviceCenterId: number;
    values: TValue[];
}

const EditPackagePricingLevel: React.FC<TEditPricingLevelsProps> = ({ prisingLevel, ...props}) => {
    const [discount, setDiscount] = useState<string>('');
    const [premium, setPremium] = useState<string>('');
    const [formIsChecked, setFormIsChecked] = useState<boolean>(false);
    const dispatch = useDispatch();
    const showError = useException();
    const {selectedSC} = useSCs();
    const classes = useEditPricingLevelStyles();

    useEffect(() => {
        if (prisingLevel && props.open) {
            prisingLevel?.premium && setPremium(prisingLevel.premium);
            prisingLevel?.discount && setDiscount(prisingLevel.discount);
        }
    }, [prisingLevel, props.open])

    const onCancel = useCallback(() => {
        setFormIsChecked(false);
        setDiscount('');
        setPremium('');
        props.onClose();
    }, [])

    const onSave = useCallback(() => {
        setFormIsChecked(true);
        if (discount && (+discount > 100 || +discount < 0)) {
            return showError('Discount value must not be less than 0 and more than 100')
        }
        if (premium && (+premium > 200 || +premium < 100)) {
            return showError('Premium value must not be less than 100 and more than 200')
        }
        if ((discount && !discount.match(/(^\d*\.?\d{1,3}?)$/)) || (premium && !premium.match(/(^\d*\.?\d{1,3}?)$/))) {
            return showError('Value must be a number with maximum 3 decimal digits')
        }
        if (prisingLevel && selectedSC) {
            const data: TUpdatedSettings = {
                serviceCenterId: selectedSC.id,
                values: [],
            }
            if (discount) {
                data.values.push({
                    demandCategory: EDemandCategory.Low,
                    value: Number(discount)
                })
            }
            if (premium) {
                data.values.push({
                    demandCategory: EDemandCategory.High,
                    value: Number(premium)
                })
            }
            try {
                dispatch(updateMPPricingLevels(prisingLevel.maintenancePackageOptionId, data, onCancel))
            } catch (e) {
               showError(e)
            }
        }
    }, [prisingLevel, onCancel, premium, discount, selectedSC])

    const onDiscountChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        e.persist()
        setDiscount(e.target.value.toString());
    }
    const onPremiumChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        e.persist()
        setPremium(e.target.value.toString());
    }

    return <BaseModal  {...props} width={540} onClose={onCancel}>
        <DialogTitle onClose={onCancel}>Edit Pricing Levels by Ops Code</DialogTitle>
        <DialogContent>
            <TextField
                fullWidth
                label='Package Name'
                disabled
                value={prisingLevel?.maintenancePackageName || ''}/>
            <Box p={1}/>
            <TextField
                fullWidth
                label='Package ID'
                disabled
                value={prisingLevel?.maintenancePackageId || ''}/>
            <Box p={1}/>
            <TextField
                fullWidth
                label='Package Level'
                disabled
                value={prisingLevel?.maintenancePackageOptionName || ''}/>
            <Box p={1}/>
            <TextField
                fullWidth
                label='Discount'
                type="number"
                inputProps={{min: 0, max: 100, step: 0.001}}
                placeholder='Type Discount'
                error={formIsChecked && (+discount < 0 || +discount > 100)}
                onChange={onDiscountChange}
                value={discount ?? ''}/>
            <Box p={1}/>
            <TextField
                fullWidth
                label='Premium'
                type="number"
                inputProps={{min: 100, max: 200, step: 0.001}}
                placeholder='Type Premium'
                error={formIsChecked && (premium !== '' && +premium < 100 || premium !== '' && +premium > 200)}
                onChange={onPremiumChange}
                value={premium ?? ''}/>
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

export default EditPackagePricingLevel;