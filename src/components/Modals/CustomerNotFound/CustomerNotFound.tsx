import React, {useCallback, useEffect} from 'react';
import {BaseModal} from "../BaseModal";
import {DialogProps} from "../types";
import {makeStyles} from "@material-ui/core/styles";
import {useDispatch} from "react-redux";
import {useException, useMessage, useSCs} from "../../../utils/hooks";
import {useTranslation} from "react-i18next";
import {LoadingButton} from "../../UI/Button";

const useStyles = makeStyles(() => ({
    buttonsWrapper: {
        display: 'flex',
        justifyContent: "space-between",
        alignItems: 'center',
        "& > div:first-child": {
            marginRight: 20,
        }
    },
    wrapper: {
        display: 'flex',
        justifyContent: 'center',
        paddingTop: 14,
    },
    modalWrapper: {
        padding: "60px 88px 36px 88px"
    },
    textWrapper: {
        fontWeight: 600,
        fontSize: 24,
        color: "#202021",
        marginBottom: 24
    }
}))

type TCustomerNotFoundProps = DialogProps & {
    handleNew: () => void;
    onTryAnotherName: () => void;
}

const CustomerNotFound: React.FC<TCustomerNotFoundProps> = ({ open, onClose, onTryAnotherName, handleNew}) => {
    const dispatch = useDispatch();
    const showError = useException();
    const showMessage = useMessage();
    const {selectedSC} = useSCs();
    const classes = useStyles();
    const {t} = useTranslation();

    useEffect(() => {

    }, [])


    const onCancel = useCallback((): void => {
        onClose();
        onTryAnotherName();
    }, [])

    const onSave = useCallback((): void => {
        onClose();
        // todo check logic
        handleNew();
    }, [])

    return (
        <BaseModal open={open} width={700} onClose={onCancel}>
            <div className={classes.modalWrapper}>
                <div className={classes.textWrapper}>{t("We are sorry but we cannot find any customers associated with that name")}</div>
                <div className={classes.textWrapper}>{t("Would you like to try a different first & last name?")}</div>
                <div className={classes.wrapper}>
                    <div className={classes.buttonsWrapper}>
                        <LoadingButton
                            color="primary"
                            variant="outlined"
                            onClick={onCancel}>
                            {t("Try other names")}
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