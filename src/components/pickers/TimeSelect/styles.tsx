import {Button, styled} from "@mui/material";

export const Wrapper = styled("div")({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8
})

export const ArrowWrapper = styled("div")({
    width: 16,
    height: 8,
    display: "flex",
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#EAEBEE",
    cursor: 'pointer'
})

export const ButtonAmPm = styled(Button)<{selected: boolean, isUpper?: boolean}>(({selected, isUpper}) => ({
    minWidth: 0,
    borderRadius: isUpper ? "4px 4px 0 0" : "0 0 4px 4px",
    width: 54,
    height: 20,
    margin: 0,
    backgroundColor: selected ? "#7898FF": "#EAEBEE",
    color: selected ? "#FFFFFF" : "#858585",
    display: 'flex'
}))