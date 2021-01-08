import React from 'react';
import moment from "moment";
import {Box, styled} from "@material-ui/core";
import {MonthSelector} from "./AppointmentSelections/MonthSelector";


const DateSelectorContainer = styled("div")(({theme}) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    flexFlow: "row nowrap"
}));

const Title = styled("h5")({
    fontWeight: "bold",
    textTransform: "uppercase",
    fontSize: 16,
    margin: 0
});

export function DateSelector(props: { date: moment.Moment, onChange: (nDate: moment.Moment) => void }) {
    return <Box mt={2}>
        <DateSelectorContainer>
            <Box mr={2}><Title>Select date</Title></Box>
            <MonthSelector date={props.date} onChange={props.onChange}/>
        </DateSelectorContainer>
    </Box>;
}