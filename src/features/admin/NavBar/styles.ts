import makeStyles from '@mui/styles/makeStyles';
import {sideBarWidth} from "../../../theme/theme";

export const useStyles = makeStyles(theme => ({
    root: {
        width: `calc(100% - ${sideBarWidth}px)`,
        color: "#858585",
        alignItems: "center",
        backgroundColor: theme.palette.background.paper,
        marginLeft: sideBarWidth,
        boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
        flexDirection: "row",
        justifyContent: "space-between",
        transition: theme.transitions.create(["width"]),
        [theme.breakpoints.down('lg')]: {
            transition: theme.transitions.create(["width"]),
            width: "100%",
        }
    },
    openedRoot: {
        [theme.breakpoints.down('lg')]: {
            width: `calc(100% - ${sideBarWidth}px)`,
        }
    },
    toolbar: {
        justifyContent: "flex-end"
    },
    name: {
        fontSize: 16,
        marginRight: 10,
        fontWeight: "bold",
        [theme.breakpoints.down('sm')]: {
            display: "none"
        }
    },
    avatar: {
        backgroundColor: theme.palette.primary.dark,
        cursor: "pointer",
    },
    rootAvatar: {
        border: `2px solid ${theme.palette.secondary.main}`
    }
}));