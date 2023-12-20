import {withStyles} from "@material-ui/core";
import {TextField} from "../TextFieldStyled/TextField";

export const CustomerInput = withStyles({
    root: {
        '& input': {
            padding: 4
        }
    }
})(TextField)