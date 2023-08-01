import React, {useMemo} from 'react';
import {MenuItem, Select, useMediaQuery, useTheme} from "@material-ui/core";
import {useTranslation} from "react-i18next";
import {
    getSlotsConsultantId,
    selectAppointment,
    selectServiceValetAppointment
} from "../../../../store/reducers/appointment/actions";
import {setAdvisor} from "../../../../store/reducers/appointmentFrameReducer/actions";
import {useDispatch, useSelector} from "react-redux";
import {useSelectedAppointmentStyles} from "../SelectedAppointment";
import {RootState} from "../../../../store/rootReducer";
import {EServiceCenterName} from "../../../../api/types";

const SelectedConsultant = () => {
    const { advisor, consultants } = useSelector((state: RootState) => state.appointmentFrame);
    const { scProfile } = useSelector((state: RootState) => state.appointment);
    const { currentConfig, isAdvisorAvailable } = useSelector((state: RootState) => state.bookingFlowConfig);
    const {t} = useTranslation();
    const dispatch = useDispatch();
    const classes = useSelectedAppointmentStyles();
    const theme = useTheme();
    const isSm = useMediaQuery(theme.breakpoints.down("sm"));
    const isBmWService = useMemo(() => scProfile?.serviceCenterFlag === EServiceCenterName.BMWSchererville
        || scProfile?.serviceCenterFlag === EServiceCenterName.DealertrackTest, [scProfile]);

    const handleConsultantChange = (e: React.ChangeEvent<{ value: unknown }>) => {
        const consultant = consultants.find(item => item.id === e.target.value);
        if (isBmWService && e.target.value !== advisor?.id) {
            dispatch(selectAppointment(null));
            dispatch(selectServiceValetAppointment(null));
        }
        dispatch(setAdvisor(consultant ? consultant : null))
        if (!consultant) dispatch(getSlotsConsultantId(null));
    }

    return isAdvisorAvailable && consultants.length
        ? <div className={classes.selectWrapper}>
            <div className={classes.selectWrapper}>
                {t("Advisor")}: {isSm ? <br/> : null}
                <Select
                    value={advisor?.id || "Any"}
                    className={classes.select}
                    disabled={!!currentConfig && !consultants.length}
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