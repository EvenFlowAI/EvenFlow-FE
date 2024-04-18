import React, {useEffect, useState} from 'react';
import {BaseModal, DialogActions, DialogContent, DialogTitle} from "../../../../components/modals/BaseModal/BaseModal";
import {Button, FormControlLabel, Radio, RadioGroup} from "@mui/material";
import {Loading} from "../../../../components/wrappers/Loading/Loading";
import {DialogProps} from "../../../../components/modals/BaseModal/types";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../../store/rootReducer";
import {useStyles} from "../styles";
import {Label} from "./Label/Label";
import {changeRoundPriceSetting} from "../../../../store/reducers/pricingSettings/actions";
import {useException} from "../../../../hooks/useException/useException";
import {useSCs} from "../../../../hooks/useSCs/useSCs";

const PriceDisplayModal: React.FC<DialogProps> = (props) => {
    const {isRoundPriceLoading, roundPrice} = useSelector((state: RootState) => state.pricingSettings);
    const [value, setValue] = useState<string>('decimal');
    const showError = useException();
    const {selectedSC} = useSCs();
    const dispatch = useDispatch();
    const {classes} = useStyles();

    useEffect(() => {
        setValue(roundPrice ? 'round' : 'decimal');
    }, [roundPrice])

    const onCancel = () => {
        setValue(roundPrice ? 'round' : 'decimal')
        props.onClose()
    }

    const onSave = () => {
        selectedSC && dispatch(changeRoundPriceSetting(selectedSC.id, value === 'round', showError))
        props.onClose()
    }

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value);
    }

    return (
        <BaseModal {...props} width={550} onClose={onCancel}>
            <DialogTitle onClose={onCancel}>
                Price Display
            </DialogTitle>
            <DialogContent>
                {isRoundPriceLoading
                    ? <Loading/>
                    : <RadioGroup aria-label="position" name="position" value={value} onChange={onChange}>
                        <FormControlLabel
                            style={{marginBottom: 8}}
                            value="round"
                            control={<Radio color="primary"/>}
                            label={<Label text="Display rounded prices"/>}
                            labelPlacement="end"
                        />
                        <FormControlLabel
                            value="decimal"
                            control={<Radio color="primary"/>}
                            label={<Label text="Display fractional prices"/>}
                            labelPlacement="end"
                        />
                    </RadioGroup>}
            </DialogContent>
            <DialogActions>
                <div className={classes.actionsWrapper}>
                    <div className={classes.buttonsWrapper}>
                        <Button
                            disabled={isRoundPriceLoading}
                            color="info"
                            style={{marginRight: 20}}
                            onClick={onCancel}>
                            Cancel
                        </Button>
                        <Button
                            variant="contained"
                            disabled={isRoundPriceLoading}
                            onClick={onSave}>
                            Save
                        </Button>
                    </div>
                </div>
            </DialogActions>
        </BaseModal>
    );
};

export default PriceDisplayModal;