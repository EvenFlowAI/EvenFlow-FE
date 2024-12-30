import React from 'react';
import {MenuItem, Select, SelectChangeEvent, useMediaQuery, useTheme} from "@mui/material";
import {useTranslation} from "react-i18next";
import {
    setAdvisor,
    setAnyAdvisorSelected,
} from "../../../../../../../store/reducers/appointmentFrameReducer/actions";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../../../../../store/rootReducer";
import clsx from "clsx";
import {useStyles} from "../ServiceOption/styles";
import {Loading} from "../../../../../../../components/wrappers/Loading/Loading";

type TProps = {
    disabled?: boolean;
    isVisible: boolean;
    loading?: boolean;
}

const SelectedConsultant: React.FC<TProps> = ({disabled, isVisible, loading}) => {
    const { advisor, consultants } = useSelector((state: RootState) => state.appointmentFrame);
    const {isAppointmentSlotsLoading} = useSelector((state: RootState) => state.appointment);
    const { currentConfig } = useSelector((state: RootState) => state.bookingFlowConfig);
    const {t} = useTranslation();
    const dispatch = useDispatch();
    const { classes  } = useStyles();
    const theme = useTheme();
    const isSm = useMediaQuery(theme.breakpoints.down('mdl'));

    const handleConsultantChange = (e: SelectChangeEvent<unknown>) => {
        const consultant = consultants.find(item => item.id === e.target.value);
        dispatch(setAdvisor(consultant ? consultant : null))
        dispatch(setAnyAdvisorSelected(!Boolean(e.target.value)))
    }

    return isVisible
        ? <div style={isSm ? {marginBottom: 4} : {}}>
            <div>
                <div className={clsx("uppercase", classes.label)}>{t("Advisor")}</div>
                {loading ? <Loading/>
                    : <Select
                        value={advisor?.id ?? "Any"}
                        className={classes.select}
                        displayEmpty
                        variant="standard"
                        disableUnderline
                        fullWidth={isSm}
                        disabled={disabled || (!!currentConfig && !consultants.length) || isAppointmentSlotsLoading}
                        onChange={handleConsultantChange}>`
                        {consultants
                            .map(consultant => <MenuItem value={consultant.id}
                                                         key={consultant.name}>{consultant.name}</MenuItem>)
                            .concat([<MenuItem value="Any" key="any">{t("Any Available")}</MenuItem>])}
                    </Select>}
            </div>
        </div>
        : null
};

export default SelectedConsultant;