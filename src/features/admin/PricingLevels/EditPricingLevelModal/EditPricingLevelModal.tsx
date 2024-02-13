import React, {useCallback, useEffect, useState} from 'react';
import {BaseModal, DialogActions, DialogContent, DialogTitle} from "../../../../components/modals/BaseModal/BaseModal";
import {TextField} from "../../../../components/formControls/TextFieldStyled/TextField";
import {DialogProps} from "../../../../components/modals/BaseModal/types";
import {TPricingLevel} from "../types";
import {Box, Button, Divider} from "@mui/material";
import {useDispatch} from "react-redux";
import {updateSRPricingLevels} from "../../../../store/reducers/pricingSettings/actions";
import {EDemandCategory} from "../../../../store/reducers/pricingSettings/types";
import {TUpdatedSettings} from "../types";
import {useEditPricingLevelStyles} from "../styles";
import {useException} from "../../../../hooks/useException/useException";
import {useSCs} from "../../../../hooks/useSCs/useSCs";

type TEditPricingLevelsProps = DialogProps & {
  prisingLevel: TPricingLevel | null;
};

const EditPricingLevelModal: React.FC<React.PropsWithChildren<React.PropsWithChildren<TEditPricingLevelsProps>>> = ({ prisingLevel, ...props}) => {
    const [service, setService] = useState<string>('');
    const [opsCode, setOpsCode] = useState<string>('');
    const [discount, setDiscount] = useState<string>('');
    const [premium, setPremium] = useState<string>('');
    const [formIsChecked, setFormIsChecked] = useState<boolean>(false);
    const dispatch = useDispatch();
    const showError = useException();
    const {selectedSC} = useSCs();
    const { classes  } = useEditPricingLevelStyles();

    useEffect(() => {
        if (prisingLevel && props.open) {
            setService(prisingLevel.serviceRequest);
            setOpsCode(prisingLevel.opsCode);
            prisingLevel?.premium && setPremium(prisingLevel.premium);
            prisingLevel?.discount && setDiscount(prisingLevel.discount);
        }
    }, [prisingLevel, props.open])

    const onCancel = useCallback(() => {
        setFormIsChecked(false);
        setOpsCode('');
        setDiscount('');
        setPremium('');
        setService('');
        props.onClose();
    }, [])

    const onSave = useCallback(() => {
        setFormIsChecked(true);
        if (discount && (+discount > 100 || +discount <= 0)) {
            return showError('"Discount" must be more than 0 and less than 100')
        }
        if (premium && (+premium > 200 || +premium < 100)) {
            return showError('"Premium" must be between 100 and 200')
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
                dispatch(updateSRPricingLevels(prisingLevel.id, data, onCancel))
            } catch (e) {
                showError(e)
            }
        }
    }, [prisingLevel, onCancel, premium, discount, selectedSC])

    const onTextFieldChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, fieldName: string) => {
        setFormIsChecked(false);
        if (fieldName === 'opsCode') setOpsCode(e.target.value)
        if (fieldName === 'service') setService(e.target.value)
    }

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
                label='Individual Service'
                disabled
                placeholder='Type Individual Service'
                error={!service && formIsChecked}
                onChange={e => onTextFieldChange(e, 'service')}
                value={service}/>
            <Box p={1}/>
            <TextField
                fullWidth
                label='Ops Code'
                disabled
                placeholder='Type Ops Code'
                error={!opsCode && formIsChecked}
                onChange={e => onTextFieldChange(e, 'opsCode')}
                value={opsCode}/>
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

export default EditPricingLevelModal;