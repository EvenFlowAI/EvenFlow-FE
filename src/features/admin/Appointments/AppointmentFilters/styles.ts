import {makeStyles} from "@material-ui/core/styles";
import {MenuItem, withStyles} from "@material-ui/core";

export const useStyles = makeStyles({
    label: {
        fontWeight: "bold",
        fontSize: 16,
        textTransform: "uppercase",
        transform: 'translate(0, 1.5px) scale(0.75)',
        transformOrigin: 'top left'
    }
})


export const EmptyMenuItem = withStyles({
    root: {
        color: '#858585'
    }
})(MenuItem)