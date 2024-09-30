import { FormControlLabel, Switch } from "@mui/material";
import { withStyles } from 'tss-react/mui';
import { makeStyles } from 'tss-react/mui';

export const useStyles = makeStyles()(() => ({
    mainTitle: {
        fontSize: 24,
        fontWeight: "bold",
    },
    vinData: {
        fontSize: 20,
        marginBottom: 24,
    },
    title: {
        fontSize: 20,
        color: "#142EA1",
        textTransform: "uppercase",
    },
    serviceAddedBtn: {
        width: "45%",
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        textTransform: 'uppercase',
        fontWeight: 'bold',
    },
    recallComponent: {
        fontSize: 16,
        color: "#828282",
        fontWeight: 600,
        textTransform: 'uppercase',
    },
    label: {
        fontWeight: "bold",
    },
    data: {
        fontWeight: "normal",
    },
    status: {
        color: "red",
    },
    recallTitleWrapper: {
        display: 'flex',
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: 20,
    },
    recallDetailsWrapper: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 10,
        marginBottom: 20,
    },
    textBox: {
        marginBottom: 20,
    },
    actionsWrapper: {
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "center",
        '& > button:not(:first-child)': {
            marginLeft: 20,
        }
    },
    iIcon: {
        position: 'absolute',
        top: -5,
        right: -20,
    }
}));

export const CustomSwitch = withStyles(Switch, {
    thumb: {
        color: 'white',
        boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.1), 0px 3px 4px rgba(0, 0, 0, 0.3)",
        border: '1px solid #DADADA'
    },
    track: {
        backgroundColor: '#D3D3D3'
    }
});

export const Label = withStyles(FormControlLabel, {
    root: {
        marginLeft: 0,
    },
    label: {
        fontWeight: "bold",
        position: 'relative',
        marginRight: 20,
    },
});