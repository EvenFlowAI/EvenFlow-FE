import React from 'react';
import moment from "moment";
import {Box, styled, useMediaQuery, useTheme} from "@material-ui/core";
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

type TProps = {
    date: moment.Moment;
    onChange: (nDate: moment.Moment) => void
}
export function DateSelector(props: TProps) {
    const theme = useTheme();
    const isXS = useMediaQuery(theme.breakpoints.down("xs"));
    return <Box>
        <DateSelectorContainer>
            {!isXS ? <Box mr={2}><Title>Select date</Title></Box> : null}
            <MonthSelector date={props.date} onChange={props.onChange}/>
        </DateSelectorContainer>
    </Box>;
}