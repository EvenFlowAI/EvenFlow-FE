import React, {useMemo} from 'react';
import {MenuItem, Select, SelectChangeEvent, useMediaQuery, useTheme} from "@mui/material";
import {useTranslation} from "react-i18next";
import {
    selectAppointment,
    selectServiceValetAppointment,
} from "../../../../../../../store/reducers/appointment/actions";
import {setAdvisor, setAnyAdvisorSelected} from "../../../../../../../store/reducers/appointmentFrameReducer/actions";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../../../../../store/rootReducer";
import {EServiceCenterName} from "../../../../../../../api/types";
import clsx from "clsx";
import {useStyles} from "../ServiceOption/styles";

const SelectedConsultant: React.FC<{disabled?: boolean}> = ({disabled}) => {
    const { advisor, consultants } = useSelector((state: RootState) => state.appointmentFrame);
    const { scProfile } = useSelector((state: RootState) => state.appointment);
    const { currentConfig, isAdvisorAvailable } = useSelector((state: RootState) => state.bookingFlowConfig);
    const {t} = useTranslation();
    const dispatch = useDispatch();
    const { classes  } = useStyles();
    const theme = useTheme();
    const isSm = useMediaQuery(theme.breakpoints.down('mdl'));
    const isBmWService = useMemo(() => scProfile?.serviceCenterFlag === EServiceCenterName.BMWSchererville
        || scProfile?.serviceCenterFlag === EServiceCenterName.DealertrackTest, [scProfile]);

    const handleConsultantChange = (e: SelectChangeEvent<unknown>) => {
        const consultant = consultants.find(item => item.id === e.target.value);
        if (isBmWService && e.target.value !== advisor?.id) {
            dispatch(selectAppointment(null));
            dispatch(selectServiceValetAppointment(null));
        }
        dispatch(setAdvisor(consultant ? consultant : null))
        dispatch(setAnyAdvisorSelected(!Boolean(e.target.value)))
    }

    return isAdvisorAvailable && consultants?.length
        ? <div style={isSm ? {marginBottom: 4} : {}}>
            <div>
                <div className={clsx("uppercase", classes.label)}>{t("Advisor")}</div>
                <Select
                    value={advisor?.id ?? "Any"}
                    className={classes.select}
                    variant="standard"
                    disableUnderline
                    fullWidth={isSm}
                    disabled={disabled || (!!currentConfig && !consultants.length)}
                    onChange={handleConsultantChange}>`
                    {consultants
                        .map(consultant => <MenuItem value={consultant.id} key={consultant.name}>{consultant.name}</MenuItem>)
                        .concat([<MenuItem value="Any" key="any">{t("Any Available")}</MenuItem>])}
                </Select>
            </div>
        </div>
        : null
};

export default SelectedConsultant;