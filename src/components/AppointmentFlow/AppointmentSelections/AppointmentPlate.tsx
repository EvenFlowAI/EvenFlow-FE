import React from 'react';
import {TAppointment} from "./mock";
import {styled} from "@material-ui/core";
import {timeString} from "../../../config/constants";
import moment from "moment";
import {SquarePaper} from "../../UI/Paper";
import {CalendarOfferChip, ShortWaitChip} from "./UI";

const Wrapper = styled("div")(({theme}) => ({

}));
const Paper = styled(SquarePaper)({

});
const Time = styled("div")(({theme}) => ({

}));
const Price = styled("div")({

});
const OfferContainer = styled("div")({

});


type TProps = {
    appointment: TAppointment
}
export const AppointmentPlate: React.FC<TProps> = ({appointment}) => {
    return <Wrapper>
        <Time>{moment(appointment.date).format(timeString)}</Time>
        <Paper variant="outlined">
            <Price>
                <sup>$</sup>{appointment.price.toFixed(0)}
            </Price>
            {(appointment.offer || appointment.shortWait) ?
                <OfferContainer>
                    {appointment.offer ? <CalendarOfferChip offer={appointment.offer} /> : null}
                    {appointment.shortWait ? <ShortWaitChip />: null}
                </OfferContainer> : null
            }
        </Paper>
    </Wrapper>
};