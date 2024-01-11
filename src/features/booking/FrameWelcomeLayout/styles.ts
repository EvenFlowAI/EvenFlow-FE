import {styled} from "@material-ui/core";

export const Wrapper = styled('div')(({theme}) => ({
    width: '80%',
    maxWidth: 1000,
}));

export const Title = styled('h1')(({theme}) => ({
    textTransform: 'uppercase',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 32,
    margin: 0,
    [theme.breakpoints.down('sm')]: {
        fontSize: 24
    },
    [theme.breakpoints.down('xs')]: {
        fontSize: 18
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
    paddingTop: 16,
    paddingBottom: 16,
}

export const MainWrapper = styled('div')({
    width: "100%",
    display: 'flex',
    flexDirection: 'column',
    justifyContent: "center",
    alignItems: 'center'
})