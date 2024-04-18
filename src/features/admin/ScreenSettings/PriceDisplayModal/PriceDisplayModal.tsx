import React from 'react';
import {BaseModal, DialogActions, DialogContent, DialogTitle} from "../../../../components/modals/BaseModal/BaseModal";
import {Button} from "@mui/material";
import {Loading} from "../../../../components/wrappers/Loading/Loading";
import {DialogProps} from "../../../../components/modals/BaseModal/types";
import {useSelector} from "react-redux";
import {RootState} from "../../../../store/rootReducer";
import {useStyles} from "../styles";

const PriceDisplayModal: React.FC<DialogProps> = (props) => {
    const {isRoundPriceLoading, roundPrice} = useSelector((state: RootState) => state.pricingSettings);
    const {classes} = useStyles();

    const onCancel = () => {
        props.onClose()
    }

    const onSave = () => {

    }

    return (
        <BaseModal {...props} width={700} onClose={onCancel}>
            <DialogTitle onClose={onCancel}>
                Price Display
            </DialogTitle>
            <DialogContent>
                {isRoundPriceLoading
                    ? <Loading/>
                    : <div/>}
            </DialogContent>
            <DialogActions>
                <div className={classes.actionsWrapper}>
                    <div className={classes.buttonsWrapper}>
                        <Button
                            disabled={isRoundPriceLoading}
                            color="info"
                            style={{marginRight: 20}}
                            onClick={onCancel}>
                            Close
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