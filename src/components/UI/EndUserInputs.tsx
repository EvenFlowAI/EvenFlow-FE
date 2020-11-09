import {withStyles, TextField as TF} from "@material-ui/core";

export const TextField = withStyles({
    root: {
        "&::placeholder": {
            textTransform: "uppercase"
        },
        "&>div": {
            borderRadius: 2,
            fontWeight: "bold",
        }
    },
})(TF);