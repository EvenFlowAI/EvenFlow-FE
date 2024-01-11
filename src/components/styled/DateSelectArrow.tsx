import {styled, Theme} from "@material-ui/core";

export const DateSelectArrow = styled('div')<Theme, { disabled?: boolean }>({
    border: "1px solid #DADADA",
    width: 30,
    height: 30,
    flexShrink: 0,
    opacity: ({disabled}) => disabled ? .5 : 1,
    display: "flex",
    marginTop: 35,
    alignItems: "center",
    justifyContent: "center",
    cursor: ({disabled}) => disabled ? "default" : "pointer",
});