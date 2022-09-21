import React from 'react';
import {BaseModal, DialogActions, DialogContent, DialogTitle} from "../BaseModal";
import {Button} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import {DialogProps} from "../types";
import {useDispatch} from "react-redux";
import {setCurrentFrameScreen} from "../../../store/reducers/appointmentFrameReducer/actions";
import {useTranslation} from "react-i18next";

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
    const {t} = useTranslation();

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
            <div className={classes.bigText}>{t("leave a card")}</div>
            </DialogContent>
            <DialogActions>
                    <div className={classes.buttonsWrapper}>
                        <Button
                            onClick={handleYes}
                            variant="outlined"
                            color={'primary'}>
                            {t("Yes")}
                        </Button>
                        <Button
                            onClick={handleNo}
                            variant="contained"
                            color={'primary'}>
                            {t("No")}
                        </Button>
                    </div>
            </DialogActions>
            <DialogContent>
                <div className={classes.smallTextWrapper}>
                    <p>{t("Leaving a card on file will allow us")}.</p>
                    <p>{t("Rest assured")}</p>
                </div>
            </DialogContent>
        </BaseModal>
    );
};

export default PaymentType;