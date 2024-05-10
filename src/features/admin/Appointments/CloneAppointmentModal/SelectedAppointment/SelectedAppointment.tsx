import React from 'react';
import {useSelector} from "react-redux";
import {RootState} from "../../../../../store/rootReducer";
import {EServiceType} from "../../../../../store/reducers/appointmentFrameReducer/types";
import {useTranslation} from "react-i18next";
import ServiceValetDateTime from "./ServiceValetDateTime/ServiceValetDateTime";
import ServicesList from "./Services/Services";
import Prices from "./Prices/Prices";
import ServiceOption from "./ServiceOption/ServiceOption";
import Address from "./Address/Address";
import Info from "./Info/Info";
import {useSelectedAppointmentStyles} from "../../../../../hooks/styling/useSelectedAppointmentStyles";
import {DateWrapper} from "../../../../../components/styled/DateWrapper";
import {List, PriceWrapper, Wrapper} from "./styles";
import dayjs from "dayjs";
import SelectedConsultant
    from "./SelectedConsultant/SelectedConsultant";

export const SelectedAppointment = () => {
    const {currentAppointment} = useSelector((state: RootState) => state.appointments);
    const { appointment, serviceValetAppointment} = useSelector((state: RootState) => state.appointment);
    const { classes  } = useSelectedAppointmentStyles();
    const {t} = useTranslation();

    const price = currentAppointment?.serviceTypeOption?.type === EServiceType.PickUpDropOff && serviceValetAppointment
        ? serviceValetAppointment?.price.value ?? 0
        : appointment?.price.value ?? 0;
    const ancillaryPrice = currentAppointment?.serviceTypeOption?.type === EServiceType.PickUpDropOff && serviceValetAppointment
        ? serviceValetAppointment?.price.ancillaryPrice ?? 0
        : appointment?.price.ancillaryPrice ?? 0;

    return (
        <div>
            <Wrapper>
                <div>
                    <p className={classes.title}>{t("Your selections")}</p>
                <List>
                    <li className={"service-item"} key="service-item">
                       <ServicesList/>
                    </li>
                    <li key="advisor">
                        <SelectedConsultant/>
                        <Address />
                        <ServiceOption/>
                    </li>
                </List>
                </div>
                <PriceWrapper>
                    {appointment
                        ? <DateWrapper>
                            {t("Date & Time")}: <br /> {dayjs.utc(appointment.date).format('ddd, MMMM D, h:mm A')}
                        </DateWrapper>
                        : serviceValetAppointment
                            ? <ServiceValetDateTime serviceValetAppointment={serviceValetAppointment}/>
                            : null}
                    <React.Fragment>
                        {Boolean(price) && <Prices price={price} ancillaryPrice={ancillaryPrice}/>}
                        <Info/>
                    </React.Fragment>
                </PriceWrapper>
            </Wrapper>
        </div>
    );
};