import React from 'react';
import {BaseModal, DialogActions, DialogContent, DialogTitle} from "../BaseModal";
import {Button} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import {DialogProps} from "../types";
import {useDispatch} from "react-redux";
import {setCurrentFrameScreen} from "../../../store/reducers/appointmentFrameReducer/actions";

const useStyles = makeStyles(() => ({
    buttonsWrapper: {
        width: '100%',
        display: 'flex',
        justifyContent: "center",
        alignItems: 'center',
        paddingTop: 14,
        "& > button:first-child": {
            marginRight: 20,
        }
    },
    bigText: {
        fontSize: 24,
        fontWeight: 600,
    },
    smallTextWrapper: {
        '& > p': {
            fontSize: 10,
            fontWeight: 600,
            color: "#828282",
            textTransform: "uppercase",
            marginBottom: 12,
        }
    }
}))

type TPaymentTypeProps = DialogProps & {
    onNo: () => void;
}

const PaymentType: React.FC<TPaymentTypeProps> = (props) => {
    const classes = useStyles();
    const dispatch = useDispatch();

    const handleYes = () => {
        dispatch(setCurrentFrameScreen("payment"))
        props.onClose();
    }

    const handleNo = () => {
        props.onNo()
        props.onClose();
    }

    return (
        <BaseModal {...props} width={600} onClose={props.onClose}>
            <DialogTitle onClose={props.onClose}> </DialogTitle>
            <DialogContent>
            <div className={classes.bigText}>Would you like to leave a card on file so you can take advantage for remote payment?</div>
            </DialogContent>
            <DialogActions>
                    <div className={classes.buttonsWrapper}>
                        <Button
                            onClick={handleYes}
                            variant="outlined"
                            color={'primary'}>
                            Yes
                        </Button>
                        <Button
                            onClick={handleNo}
                            variant="contained"
                            color={'primary'}>
                            No
                        </Button>
                    </div>
            </DialogActions>
            <DialogContent>
                <div className={classes.smallTextWrapper}>
                    <p>Leaving a card on file will allow us to send you an email or text with you service bill so you can pay at you own convenience before you come to pick up your vehicle.</p>
                    <p>Rest assured, we will not charge you credit or debit card until after your vehicle servicing is complete and you have authorized payment</p>
                </div>
            </DialogContent>
        </BaseModal>
    );
};

export default PaymentType;