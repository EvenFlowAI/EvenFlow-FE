import React from "react";
import { IconButton } from "@mui/material";
import { ReactComponent as CalendarBlue } from "../../../../../assets/img/calendar_small_dots_blue.svg";
import { ReactComponent as CalendarWhite } from "../../../../../assets/img/calendar_small_dots_white.svg";
import { ReactComponent as ListWhite } from "../../../../../assets/img/list.svg";
import { ReactComponent as ListBlue } from "../../../../../assets/img/list_blue.svg";
import { TView } from "../../types";
import { useStyles } from "./styles";

type TProps = {
  handleChangeView: (type: TView) => () => void;
  selectedView: TView;
};

const ChangeViewButtons: React.FC<TProps> = ({
  handleChangeView,
  selectedView,
}) => {
  const { classes } = useStyles();
  return (
    <>
      <IconButton
        onClick={handleChangeView("calendar")}
        style={{
          background: selectedView === "calendar" ? "#7898FF" : "transparent",
          marginLeft: 20,
        }}
        className={classes.leftButton}
      >
        {selectedView === "calendar" ? <CalendarWhite /> : <CalendarBlue />}
      </IconButton>
      <IconButton
        onClick={handleChangeView("list")}
        style={{
          background: selectedView === "list" ? "#7898FF" : "transparent",
        }}
        className={classes.rightButton}
      >
        {selectedView === "list" ? <ListWhite /> : <ListBlue />}
      </IconButton>
    </>
  );
};

export default ChangeViewButtons;
