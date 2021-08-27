import React, {useMemo} from 'react';
import {StepWrapper} from "./StepWrapper";
import {Button, styled} from "@material-ui/core";
import moment from "moment";


const Wrapper = styled('div')({
    boxShadow: "1px 5px 15px rgba(0, 0, 0, 0.25);",
    padding: 20,
    display: "grid",
    minWidth: 545,
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "15px",
    fontSize: 15,
    "& h2": {
        textTransform: "uppercase",
        gridColumnStart: 1,
        gridColumnEnd: 3,
        margin: "0 0 10px",
        padding: 0,
        fontSize: 19,
        textAlign: 'center'
    },
    "& h3": {
        textTransform: "uppercase",
        gridColumnStart: 1,
        gridColumnEnd: 3,
        margin: "10px 0 0",
        padding: 0,
        fontSize: 24,
        textAlign: 'center'
    },
    "&>div": {
        textAlign: "right"
    },
    "&>.label": {
        textAlign: "left",
        textTransform: "uppercase",
        color: "#9FA2B4",
        fontWeight: "bold"
    }
});

const Divider = styled("div")(({theme}) => ({
    width: "100%",
    height: 2,
    gridColumnStart: 1,
    gridColumnEnd: 3,
    marginTop: 16,
    background: `repeating-linear-gradient(to right,
        ${theme.palette.divider} 0,${theme.palette.divider} 10px,
        transparent 10px,
        transparent 20px)`
}));

type TItem = {
    label: string;
    content: string;
}


export const AppointmentConfirmed = () => {
    const data: TItem[] = useMemo(() => {
        return [
            {
                label: "Date and time",
                content: moment.utc().format('DDD, MMM d, h:mm a'),
            },
            {
                label: "Address",
                content: "2200 US Highway 30 • Oswego, IL 60543"
            },
            {
                label: "Service type",
                content: "The Works Preferred"
            },
            {
                label: "Selected Price",
                content: "$148"
            },
            {
                label: "Name",
                content: "Hugo Johns"
            },
            {
                label: "Vehicle",
                content: "2019 Ford Focus"
            },
            {
                label: "Phone number",
                content: "(773) 889-3000"
            },
            {
                label: "Email",
                content: "hugo@gmail.com"
            }
        ]
    }, []);
    return <StepWrapper>
        <Wrapper>
            <h2>Appointment Confirmed!</h2>
            {data.map(item =>
                <React.Fragment key={item.label}>
                    <div className="label">{item.label}</div>
                    <div>{item.content}</div>
                </React.Fragment>
            )}

            <Button color="primary" fullWidth variant="outlined">
                Modify Appointment
            </Button>
            <Button color="primary" fullWidth variant="contained">
                Add to Calendar
            </Button>
            <Divider />
            <h3>We will see you soon !</h3>
        </Wrapper>
    </StepWrapper>
};