import React, {Dispatch, SetStateAction} from 'react';
import {MenuItem, Select, SelectChangeEvent} from "@mui/material";
import {EAppointmentTimingType} from "../../../../store/reducers/appointment/types";
import {useTranslation} from "react-i18next";
import {useStyles} from "../styles";

type TProps = {
    timingType: EAppointmentTimingType;
    setTimingType: Dispatch<SetStateAction<EAppointmentTimingType>>;
    disabled: boolean;
}

const Timing: React.FC<TProps> = ({
                                      timingType,
                                      setTimingType,
                                      disabled,
                                  }) => {
    const {t} = useTranslation();
    const { classes  } = useStyles();

    const onTimingChange = (e: SelectChangeEvent<number>) => {
        setTimingType(e.target.value as EAppointmentTimingType)
    }

    return (
        <>
            <div className={classes.label}>{t("Appointment Search")}</div>
            <Select
                fullWidth
                className={classes.select}
                disabled={disabled}
                variant="standard"
                disableUnderline
                value={timingType ?? ""}
                onChange={onTimingChange}>
                <MenuItem key="firstAvailable" value={EAppointmentTimingType.FirstAvailable}>
                    {t("First Available")}
                </MenuItem>
                <MenuItem key="preferredDate" value={EAppointmentTimingType.PreferredDate}>
                    {t("Preferred Date")}
                </MenuItem>
            </Select>

        </>
    );
};

export default Timing;