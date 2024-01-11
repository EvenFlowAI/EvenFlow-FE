import withStyles from '@mui/styles/withStyles';
import {TextField} from "../TextFieldStyled/TextField";

export const CustomerInput = withStyles({
    root: {
        '& input': {
            padding: 4
        }
    }
})(TextField)