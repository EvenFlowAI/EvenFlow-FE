import React, {FunctionComponent, memo} from 'react';
import {Box, Button, styled, useMediaQuery, useTheme} from "@material-ui/core";
import {SquarePaper} from "../../UI/Paper";
import {timeString} from "../../../config/constants";
import {DirectionsCar} from "@material-ui/icons";
import {LoanerCarChip, OfferChip, ShortWaitChip} from "./UI";
import {selectAppointment} from "../../../store/reducers/appointment/actions";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import {EAppointmentTimingType, IRemappedAppointmentSlot} from "../../../store/reducers/appointment/types";
import {TPopoverProps} from "../Steps/types";
import {FixedSizeList, ListChildComponentProps} from "react-window";
import {DateSelector} from "../DateSelector";
import moment from "moment";
import {AppointmentSelectInfo} from "../AppointmentSelectInfo";
import AutoSizer from "react-virtualized-auto-sizer";
import {LoadingWrapper} from "../../UI/NoItemsLoading";

const ListWrapper = styled("div")({
    height: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "stretch"
});
const ListContainer = styled("div")({
    flexGrow: 1
})

const Appointment = styled(SquarePaper)(({theme}) => ({
    padding: theme.spacing(1),
    display: "grid",
    gridTemplateColumns: "120px 60px 40px 3fr repeat(2, 2fr) 1fr 100px",
    gridGap: theme.spacing(.5),
    fontSize: 14,
    alignItems: "center",
    minHeight: 54,
    justifyItems: "center",
    [theme.breakpoints.down("xs")]: {
        gridTemplate: `
            "date time . price"
            "offer sw loaner drop"
            "button button button button"
        `,
        padding: theme.spacing(1),
        gridGap: theme.spacing(2),
        "&>.price": {
            justifySelf: "self-end",
            textAlign: "right",
            gridArea: "price"
        },
        "&>span": {
            width: "100%",
            height: "100%"
        },
        "&>.date": {
            gridArea: "date"
        },
        "&>.time": {
            gridArea: "time"
        },
        "&>.offer": {
            gridArea: "offer"
        },
        "&>.sw": {
            gridArea: "sw"
        },
        "&>.loaner": {
            gridArea: "loaner"
        },
        "&>.drop": {
            gridArea: "drop"
        },
        "&>.button": {
            gridArea: "button"
        }
    }
}));
const AppointmentHeader = styled(Appointment)(({theme}) => ({
    fontWeight: "bold",
    textTransform: "uppercase",
    "&>span": {
        textAlign: "center",
    },
    "&>span:last-child": {
        gridColumnStart: 6,
        gridColumnEnd: -1,
        justifySelf: "self-start"
    },
    [theme.breakpoints.down("xs")]: {
        display: "none"
    }
}));
const justifyStart = {justifySelf: "self-start"};

const labels: string[] = [
    "Date", "Time", "Price", "Special Offer", "Wait Time", "Loaner Car"
]

type TListItemProps = {
    style?: React.CSSProperties,
    appointment: IRemappedAppointmentSlot,
    // onHover: (a: IRemappedAppointmentSlot) => (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void,
    // onLeave: () => void,
    onClick: (a: IRemappedAppointmentSlot) => () => void,
    selectedAppointment: IRemappedAppointmentSlot|null
}
const ListItem: React.FC<TListItemProps> = memo((props) => {
    return <Box mt={.5} style={props.style}>
        <Appointment variant="outlined">
            <span className="date" style={justifyStart}>{props.appointment.date.format("MMM D, YYYY ddd")}</span>
            <span className="hour">{props.appointment.date.format(timeString)}</span>
            <span className="price"><strong>${
                props.appointment.priceWithOffer?.value.toFixed(0) || props.appointment.price.value.toFixed(0)
            }</strong></span>
            <span className="offer">{props.appointment.offer ?
                <OfferChip white offer={props.appointment.offer}/> : null}</span>
            <span className="sw">{props.appointment.isShorterWaitTime ? <ShortWaitChip white/> : null}</span>
            <span className="loaner">{false ? <LoanerCarChip white/> : null}</span>
            <span className="drop">{false ? <DirectionsCar fontSize="small"/> : null}</span>
            <Button
                className="button"
                color="primary"
                // onMouseEnter={props.onHover(props.appointment)}
                // onMouseLeave={props.onLeave}
                fullWidth
                onClick={props.onClick(props.appointment)}
                variant={props.selectedAppointment?.id === props.appointment.id ? "contained" : "outlined"}>
                Schedule
            </Button>
        </Appointment>
    </Box>;
});
type TListProps = {
    date: moment.Moment;
    onDateChange: (date: moment.Moment) => void;
}
export const ListAppointmentSelection: React.FC<TPopoverProps & TListProps> = ({onPopoverOpen, date, onDateChange, onPopoverClose}) => {
    const selectedAppointment = useSelector((state: RootState) => state.appointment.appointment);
    const appointments = useSelector((state: RootState) => state.appointment.appointmentSlots);
    const selectedAppointmentType = useSelector((state: RootState) => state.appointment.s3Data.appointmentType);
    const theme = useTheme();
    const isXS = useMediaQuery(theme.breakpoints.down("xs"));
    const dispatch = useDispatch();

    const handleSelectAppointment = (a: IRemappedAppointmentSlot) => () => {
        if (selectedAppointment?.id === a.id) {
            dispatch(selectAppointment(null));
        } else {
            dispatch(selectAppointment(a));
        }
    }

    const Item: FunctionComponent<ListChildComponentProps> = ({index, style}) => {
        return <ListItem
            key={index}
            style={style}
            appointment={appointments[index]}
            onClick={handleSelectAppointment}
            selectedAppointment={selectedAppointment}
        />;
    }

    return <ListWrapper>
        {selectedAppointmentType === EAppointmentTimingType.SpecialOffers ? <DateSelector date={date} onChange={onDateChange}/> : null}
        <AppointmentHeader elevation={0}>
            {labels.map((label, idx) =>
                <span key={idx} style={!idx ? justifyStart : undefined}>{label}</span>
            )}
        </AppointmentHeader>
        <ListContainer>
            <LoadingWrapper
                isLoading={false}
                itemsExist={Boolean(appointments.length)}
                noItemsLabel="There is no free slots on selected date"
            >
                <AutoSizer>
                    {({height, width}) => (
                        <FixedSizeList
                            height={height}
                            width={width}
                            itemSize={isXS ? 134 : 58}
                            itemCount={appointments.length}
                        >
                            {Item}
                        </FixedSizeList>
                )}
                </AutoSizer>
            </LoadingWrapper>
        </ListContainer>
        <AppointmentSelectInfo/>
    </ListWrapper>
};