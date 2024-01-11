import { Tabs as Ts } from "@mui/material";
import withStyles from '@mui/styles/withStyles';
import {TabPanel as Tp} from "@mui/lab";

const style = withStyles(() => ({
    root: {
        padding: 0,
        borderBottom: `none`,
        "& .MuiTab-root": {
            fontSize: 12,
            fontWeight: "bold",
            textTransform: "uppercase",
        },
        "& .MuiTabs-indicator": {
            height: 0
        },
        "& .MuiButtonBase-root": {
            padding: 4,
        },
        "& .MuiSvgIcon-root": {
            verticalAlign: 'middle'
        },
    },
    indicator: {
        backgroundColor: 'transparent'
    }
}));

const styled = withStyles(() => ({
    root: {
        padding: 0,
    }
}));

export const Tabs = style(Ts);

export const TabPanel = styled(Tp);