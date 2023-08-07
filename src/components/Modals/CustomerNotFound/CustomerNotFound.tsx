import React, {useCallback} from 'react';
import {BaseModal} from "../BaseModal";
import {DialogProps} from "../types";
import {makeStyles} from "@material-ui/core/styles";
import {useTranslation} from "react-i18next";
import {LoadingButton} from "../../UI/Button";

const useStyles = makeStyles((theme) => ({
    buttonsWrapper: {
        display: 'flex',
        justifyContent: "space-between",
        alignItems: 'center',
        "& > div:first-child": {
            marginRight: 20,
        },
        [theme.breakpoints.down('sm')]: {
            flexDirection: "column",
            "& > div:first-child": {
                marginRight: 0,
                marginBottom: 20,
            }
        },
    },
    wrapper: {
        display: 'flex',
        justifyContent: 'center',
        paddingTop: 14,
    },
    modalWrapper: {
        padding: "60px 88px 36px 88px",
        [theme.breakpoints.down('sm')]: {
            padding: "16px",
        },
    },
    textWrapper: {
        fontWeight: 600,
        fontSize: 24,
        color: "#202021",
        marginBottom: 24,
        textAlign: "center",
        [theme.breakpoints.down('sm')]: {
            fontSize: 22,
            marginBottom: 16,
        },
    }
}))

type TCustomerNotFoundProps = DialogProps & {
    handleNew: () => void;
    onTryAnotherName: () => void;
}

const CustomerNotFound: React.FC<TCustomerNotFoundProps> = ({ open, onClose, onTryAnotherName, handleNew}) => {
    const classes = useStyles();
    const {t} = useTranslation();

    const onCancel = useCallback((): void => {
        onClose();
        onTryAnotherName();
    }, [onTryAnotherName])

    const onSave = useCallback((): void => {
        onClose();
        handleNew();
    }, [handleNew])

    return (
        <BaseModal open={open} width={700} onClose={onCancel}>
            <div className={classes.modalWrapper}>
                <div className={classes.textWrapper}>{t("We cannot find any existing customers that met the search criteria you entered.")}</div>
                <div className={classes.textWrapper}>{t("Would you like to try different search criteria?")}</div>
                <div className={classes.wrapper}>
                    <div className={classes.buttonsWrapper}>
                        <LoadingButton
                            color="primary"
                            variant="outlined"
                            onClick={onCancel}>
                            {t("Try other search criteria")}
                        </LoadingButton>
                        <LoadingButton
                            onClick={onSave}
                            variant="contained"
                            color="primary">
                            {t("Continue as a new customer")}
                        </LoadingButton>
                    </div>
                </div>
            </div>
        </BaseModal>
    );
};

export default CustomerNotFound;