import React from 'react';
import moment from "moment";
import {styled} from "@material-ui/core";
import {SquarePaper} from "../../UI/Paper";
import {ChevronLeft, ChevronRight} from "@material-ui/icons";

const Paper = styled(SquarePaper)(({theme}) => ({
    padding: theme.spacing(.5),
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    userSelect: "none"
}));
const DatePaper = styled(Paper)(({theme}) => ({
    padding: `${theme.spacing(.5)}px ${theme.spacing(1.5)}px`,
    marginLeft: theme.spacing(.5),
    marginRight: theme.spacing(.5),
    minWidth: 120
}));

const DateWrapper = styled("div")({
    display: "flex",
    flexFlow: "row nowrap",
    alignItems: "stretch",
    justifyContent: "flex-start",
    textTransform: "none",
    fontWeight: "normal"
});

type TProps = {
    date: moment.Moment;
    onChange: (date: moment.Moment) => void;
}
export const MonthSelector: React.FC<TProps> = ({date, onChange}) => {
    const handleChange = (s: "+"|"-") => () => {
        let nDate = s === "+"
            ? moment.utc(date).add(1, "month").startOf("month")
            : moment.utc(date).subtract(1, "month").startOf("month");
        if (nDate.isSameOrBefore(moment())) {
            nDate = moment.utc().add(1, "days").startOf("day");
        }
        onChange(nDate);
    }

    return <DateWrapper>
        <Paper onClick={handleChange("-")} variant="outlined">
            <ChevronLeft />
        </Paper>
        <DatePaper variant="outlined">
            {date.format("MMM YYYY")}
        </DatePaper>
        <Paper onClick={handleChange("+")} variant="outlined">
            <ChevronRight />
        </Paper>
    </DateWrapper>
};