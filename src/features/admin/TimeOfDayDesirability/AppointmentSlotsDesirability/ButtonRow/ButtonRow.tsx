import React from "react";
import {Grid} from "@material-ui/core";
import {timeString} from "../../../../../config/constants";
import {useStylesBR} from "./styles";
import {TSlot} from "../../utils";
import {EDesirabilityState} from "../../../../../store/reducers/slotScoring/types";
import {DesirabilityButtons} from "../DesirabilityButtons/DesirabilityButtons";

type TRowProps = {
    slot: TSlot;
    onClick: (t: EDesirabilityState) => () => void;
}

export const ButtonRow:React.FC<TRowProps> = ({slot, onClick}) => {
    const classes = useStylesBR();
    return <Grid className={classes.dataRow} container spacing={1}>
        <Grid item xs={6} sm={2} md={3} className={classes.time}>
            {slot.start.format(timeString)}
        </Grid>
        <Grid item xs={6} sm={2} md={2} className={classes.time}>
            {slot.end.format(timeString)}
        </Grid>
        <Grid item xs={12} sm={8} md={7} className={classes.buttons}>
            <DesirabilityButtons onClick={onClick} desirability={slot.desirability} />
        </Grid>
    </Grid>
}