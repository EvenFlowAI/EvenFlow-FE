import {FormControlLabel, Switch, withStyles} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";

export const useStyles = makeStyles(() => ({
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
        width: "35%",
        display: 'flex',
        alignItems: 'center',
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
        gridGap: 10,
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
    }
}))

export const CustomSwitch = withStyles({
    thumb: {
        color: 'white',
        boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.1), 0px 3px 4px rgba(0, 0, 0, 0.3)",
        border: '1px solid #DADADA'
    },
    track: {
        backgroundColor: '#D3D3D3'
    }
})(Switch)

export const Label = withStyles({
    root: {
        marginLeft: 0,
    },
    label: {
        fontWeight: "bold"
    }
})(FormControlLabel);