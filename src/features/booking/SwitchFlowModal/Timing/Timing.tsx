import React, {Dispatch, SetStateAction} from 'react';
import {MenuItem, Select, SelectChangeEvent} from "@mui/material";
import {EServiceType} from "../../../../store/reducers/appointmentFrameReducer/types";
import {EAppointmentTimingType} from "../../../../store/reducers/appointment/types";
import {useTranslation} from "react-i18next";
import {useStyles} from "../styles";
import {useSelector} from "react-redux";
import {RootState} from "../../../../store/rootReducer";
import dayjs from "dayjs";
import {TParsableDate} from "../../../../types/types";
import {MobileDatePicker} from "@mui/x-date-pickers";
import {pickersLayoutClasses} from "@mui/x-date-pickers/PickersLayout";

type TProps = {
    address: any;
    zipCode: string;
    timingType: EAppointmentTimingType;
    setTimingType: Dispatch<SetStateAction<EAppointmentTimingType>>;
    time: TParsableDate;
    setTime: Dispatch<SetStateAction<TParsableDate>>;
    isCalendarOpen: boolean;
    setCalendarOpen: Dispatch<SetStateAction<boolean>>;
}

const Timing: React.FC<TProps> = ({
                                      address,
                                      zipCode,
                                      timingType,
                                      setTimingType,
                                      time,
                                      setTime,
                                      isCalendarOpen,
                                      setCalendarOpen,
                                  }) => {
    const {serviceTypeOption} = useSelector((state: RootState) => state.appointmentFrame)
    const {t} = useTranslation();
    const { classes  } = useStyles();

    const onTimingChange = (e: SelectChangeEvent<number>) => {
        setTimingType(e.target.value as EAppointmentTimingType)
        if (e.target.value as EAppointmentTimingType === EAppointmentTimingType.PreferredDate) {
            setCalendarOpen(true)
        }
    }

    const onTimeChange = (value: TParsableDate) => {
        setTime(value);
    }

    const onPreferredDateClick = () => {
        if (timingType === EAppointmentTimingType.PreferredDate && !isCalendarOpen) {
            setCalendarOpen(true);
        }
    }

    return (
        <>
            <div className={classes.label}>{t("Appointment Search")}</div>
            <Select
                fullWidth
                className={classes.select}
                disabled={(!address || !zipCode) && serviceTypeOption?.type === EServiceType.PickUpDropOff}
                variant="standard"
                disableUnderline
                value={timingType ?? ""}
                onChange={onTimingChange}>
                <MenuItem key="firstAvailable" value={EAppointmentTimingType.FirstAvailable}>
                    {t("First Available")}
                </MenuItem>
                <MenuItem key="preferredDate" value={EAppointmentTimingType.PreferredDate} onClick={onPreferredDateClick}>
                    {t("Preferred Date")}
                </MenuItem>
            </Select>
            <MobileDatePicker
                value={time}
                onChange={onTimeChange}
                disablePast
                open={isCalendarOpen}
                onClose={() => setCalendarOpen(false)}
                format="MMMM, DD"
                dayOfWeekFormatter={(day, date) => dayjs(date as TParsableDate).format("ddd")}
                slotProps={{
                    textField: {
                        variant: 'standard',
                        InputProps: {
                            style: {display: 'none'}
                        },
                    },
                    toolbar: {
                        toolbarFormat: "ddd, MMM DD",
                    },
                    layout: {
                        sx: {
                            [`.${pickersLayoutClasses.toolbar}`]: {
                                backgroundColor: 'black',
                                color: "white"
                            },
                            [`.${pickersLayoutClasses.toolbar} > span`]: {
                                color: "#FFFFFF8A",
                                display: 'none'
                            },
                        },
                    },
                }}
            />
        </>
    );
};

export default Timing;