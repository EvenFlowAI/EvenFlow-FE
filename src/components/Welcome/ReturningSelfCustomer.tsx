import React, {useMemo} from 'react';
import {TextField} from "../UI/EndUserInputs";
import {LoadingButton} from "../UI/Button";
import {Grid, useMediaQuery} from "@material-ui/core";
import {useLoadingStyles, useStyles} from "./CustomerSelect";
import {useTranslation} from "react-i18next";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../store/rootReducer";
import {setCustomerEnteredEmail} from "../../store/reducers/appointment/actions";
import {EServiceType, EUserType} from "../../store/reducers/appointmentFrameReducer/types";
import {setUserType} from "../../store/reducers/appointmentFrameReducer/actions";

type TProps = {
    onComplete: (serviceType: EServiceType, userType?: EUserType) => void;
    loading: boolean;
}

const ReturningSelfCustomer: React.FC<TProps> = ({loading, onComplete}) => {
    const {customerEnteredEmail} = useSelector((state: RootState) => state.appointment);
    const {serviceTypeOption} = useSelector((state: RootState) => state.appointmentFrame);

    const classes = useStyles();
    const loadingClasses = useLoadingStyles();
    const { t } = useTranslation();
    const isXs = useMediaQuery("xs");
    const dispatch = useDispatch();

    const serviceType = useMemo(() => serviceTypeOption ? serviceTypeOption.type : EServiceType.VisitCenter, [serviceTypeOption]);

    const handleChange: React.ChangeEventHandler<HTMLInputElement> = ({target: {value}}) => {
        dispatch(setCustomerEnteredEmail(value));
    }

    const handleComplete = async () => {
        dispatch(setUserType(EUserType.Existing));
        onComplete(serviceType, EUserType.Existing);
    }

    return <Grid item xs={12} sm={12} md={6}>
        <div className={classes.existing}>
            <span>{t("I`m a returning customer")}</span>
            <TextField
                style={{ marginTop: 20, marginBottom: 20 }}
                placeholder={`${t("Enter your")} ${t("Email or ")}${t("Phone")}`}
                InputProps={{disableUnderline: true}}
                variant="standard"
                onChange={handleChange}
                value={customerEnteredEmail}
                fullWidth/>
            <LoadingButton
                fullWidth={isXs}
                loading={loading}
                variant="contained"
                color="primary"
                classes={loadingClasses}
                className={classes.loadingButton}
                disabled={loading || !customerEnteredEmail}
                onClick={handleComplete}>
                {t("Search")}
            </LoadingButton>
        </div>
    </Grid>
};

export default ReturningSelfCustomer;