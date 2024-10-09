import {styled} from "@mui/material";
import theme from "../../../theme/theme";

export const Wrapper = styled('div')(() => ({
    width: '80%',
    maxWidth: 1000,
}));

export const Title = styled('h1')(({theme}) => ({
    textTransform: 'uppercase',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 32,
    margin: 0,
    [theme.breakpoints.down('md')]: {
        fontSize: 24
    },
    [theme.breakpoints.down('sm')]: {
        fontSize: 20
    }
}));

export const nonFrameStyles = {
    display: "flex",
    flexFlow: "column nowrap",
    justifyContent: "stretch",
    width: "100%",
}

export const frameStyles = {
    display: 'flex',
    justifyContent: 'center',
    width: '100%'
}

export const frameSmStyles = {
    ...frameStyles,
    height: 'auto',
    overflowY: 'auto',
    // paddingTop: 16,
    // paddingBottom: 16,
}

export const MainWrapper = styled('div')({
    width: "100%",
    display: 'flex',
    flexDirection: 'column',
    justifyContent: "center",
    alignItems: 'center',
    [theme.breakpoints.down('mdl')]: {
        justifyContent: 'unset',
        paddingBottom: 81,
    }
})