import React from "react";
import { Grid } from "@mui/material";
import { time12HourFormat } from "../../../../../utils/constants";
import { useStylesBR } from "./styles";
import { TSlot } from "../../utils";
import { EDesirabilityState } from "../../../../../store/reducers/slotScoring/types";
import { DesirabilityButtons } from "../DesirabilityButtons/DesirabilityButtons";
import dayjs from "dayjs";

type TRowProps = {
  slot: TSlot;
  onClick: (t: EDesirabilityState) => () => void;
};

export const ButtonRow: React.FC<
  React.PropsWithChildren<React.PropsWithChildren<TRowProps>>
> = ({ slot, onClick }) => {
  const { classes } = useStylesBR();
  return (
    <Grid className={classes.dataRow} container spacing={1}>
      <Grid item xs={6} sm={2} md={3} className={classes.time}>
        {dayjs.utc(slot.start).format(time12HourFormat)}
      </Grid>
      <Grid item xs={6} sm={2} md={2} className={classes.time}>
        {dayjs.utc(slot.end).format(time12HourFormat)}
      </Grid>
      <Grid item xs={12} sm={8} md={7} className={classes.buttons}>
        <DesirabilityButtons
          onClick={onClick}
          desirability={slot.desirability}
        />
      </Grid>
    </Grid>
  );
};
