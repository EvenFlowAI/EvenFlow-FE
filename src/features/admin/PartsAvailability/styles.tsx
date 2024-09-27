import {styled, Switch} from "@mui/material";
import theme from "../../../theme/theme";
import {withStyles} from "tss-react/mui";

export const FiltersWrapper = styled("div")({
    width: '100%',
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginBottom: 16,
    [theme.breakpoints.down('mdl')]:{
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'stretch',
        marginBottom: 8,
    }
})

export const ButtonsWrapper = styled("div")({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    "& > button:last-child": {
        marginLeft: 12,
    },
    [theme.breakpoints.down('mdl')]:{
        marginTop: 12,
        "& > button": {
            width: "100%"
        },
    }
})

export const InputWrapper = styled("div")({
    width: 320,
    [theme.breakpoints.down('mdl')]:{
        width: "100%"
    }
})

export const SwitcherLabel = styled('p')({
    fontSize: 14,
    fontWeight: 700,
    padding: 0,
    margin: 0,
})

export const StyledSwitch = withStyles(Switch, {
})