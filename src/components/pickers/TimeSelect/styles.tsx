import {Button, styled} from "@mui/material";

export const Wrapper = styled("div")({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8
})

export const ArrowWrapper = styled("div", {
    shouldForwardProp: (prop) => prop !== "disabled"
})<{disabled: boolean}>(({disabled}) =>({
    width: 16,
    height: 8,
    display: "flex",
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: disabled ? 'transparent' : "#EAEBEE",
    cursor: 'pointer'
}))

export const ButtonAmPm = styled(Button, ({
    shouldForwardProp: (prop) => prop !== "disabled" && prop !== "selected" && prop !== "isUpper"
}))<{selected: boolean, disabled?: boolean, isUpper?: boolean}>(({selected, disabled, isUpper}) => ({
    minWidth: 0,
    borderRadius: isUpper ? "4px 4px 0 0" : "0 0 4px 4px",
    width: 54,
    height: 20,
    margin: 0,
    backgroundColor: selected
        ? disabled
            ? "#B8B9BF"
            : "#7898FF !important"
        : disabled
            ? "#EAEBEE"
            : "#EAEBEE",
    color: selected
        ? disabled
            ? "#FFFFFF"
            : "#FFFFFF"
        : disabled
            ? "#B8B9BF"
            : "#858585",
    display: 'flex',
}))