import { Button, styled } from "@mui/material";
import withStyles from '@mui/styles/withStyles';
import {TextField} from "../../../components/formControls/TextFieldStyled/TextField";

export const ButtonWrapper = styled('div')(() => ({
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 20,
}));

export const WideButton = withStyles(() => ({
    root: {
        padding: '9px 42px'
    }
}))(Button)

export const STextField = styled(TextField)({
    maxWidth: 100
});
