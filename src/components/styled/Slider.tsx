import { withStyles } from "tss-react/mui";
import { ValueSlider } from "./ValueSlider";

export const Slider = withStyles(ValueSlider, {
  root: {
    margin: "0 25px",
    width: "calc(100% - 50px)",
  },
  markLabel: {
    top: 5,
    left: "-12px !important",
    "& ~ .MuiSlider-mark ~ .MuiSlider-markLabel": {
      left: "unset !important",
      right: -25,
    },
  },
  valueLabel: {
    "& > span": {
      width: 57,
    },
  },
});
