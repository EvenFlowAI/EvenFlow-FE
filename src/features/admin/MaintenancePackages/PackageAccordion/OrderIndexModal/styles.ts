import {makeStyles} from "@material-ui/core/styles";

const baseCellStyles = {
    backgroundColor: 'white',
    border: "none",
}

export const useStyles = makeStyles(() => ({
    title: {
        textAlign: "center"
    },
    headerCell: {
        ...baseCellStyles,
        color: "#9DA8B5",
        fontWeight: 'bold',
        justifyContent: 'left',
    }
}))