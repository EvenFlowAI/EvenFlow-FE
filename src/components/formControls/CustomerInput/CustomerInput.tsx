import { withStyles } from 'tss-react/mui';
import {TextField} from "../TextFieldStyled/TextField";

export const CustomerInput = withStyles(TextField, {
    root: {
        '& input': {
            padding: 4
        }
    }
});