import {withStyles, Tab as T} from "@material-ui/core";
import {TabList as TL} from "@material-ui/lab";

const style = withStyles(theme => ({
    root: {
        width: `calc(100% + ${theme.spacing(4) * 2}px)`,
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
}));

export const Tabs = style(T);

export const TabList = style(TL);