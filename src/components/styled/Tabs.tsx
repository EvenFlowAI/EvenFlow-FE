import { Tab as T } from "@mui/material";
import { withStyles } from 'tss-react/mui';
import {TabList as TL} from "@mui/lab";
import theme from '../../theme/theme'

export const Tabs = withStyles(T, {
    root: {
        width: `calc(100% + calc(${theme.spacing(4)} * 2))`,
        marginLeft: -theme.spacing(4),
        marginRight: -theme.spacing(4),
        paddingLeft: theme.spacing(4),
        paddingRight: theme.spacing(4),
        borderBottom: `1px solid ${theme.palette.divider}`,
        "& .MuiTab-root": {
            fontSize: 14,
            fontWeight: "bold",
            textTransform: "none"
        },
        "& .MuiTabs-indicator": {
            height: 5
        }
    }
});

export const TabList = withStyles(TL, {
    root: {
        width: `calc(100% + calc(${theme.spacing(4)} * 2))`,
        marginLeft: -theme.spacing(4),
        marginRight: -theme.spacing(4),
        paddingLeft: theme.spacing(4),
        paddingRight: theme.spacing(4),
        borderBottom: `1px solid ${theme.palette.divider}`,
        "& .MuiTab-root": {
            fontSize: 14,
            fontWeight: "bold",
            textTransform: "none"
        },
        "& .MuiTabs-indicator": {
            height: 5
        }
    }
});