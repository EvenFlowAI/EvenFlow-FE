import makeStyles from '@mui/styles/makeStyles';
import {sideBarWidth} from "../../../theme/theme";

export const useStyles = makeStyles(theme => ({
    root: {
        display: "flex",
        minHeight: "100vh",
    },
    divider: {
        marginTop: 20,
        marginBottom: 10
    },
    main: {
        flexGrow: 1,
        transition: theme.transitions.create(["margin"]),
        minWidth: 0,
        position: "relative",
        marginLeft: -sideBarWidth,
        backgroundColor: theme.palette.background.default,
        [theme.breakpoints.up("lg")]: {
            marginLeft: 0
        },
        [theme.breakpoints.down('sm')]: {
            marginLeft: "-100%"
        }
    },
    mainOpened: {
        transition: theme.transitions.create(["margin"]),
        marginLeft: 0,
    }
}));