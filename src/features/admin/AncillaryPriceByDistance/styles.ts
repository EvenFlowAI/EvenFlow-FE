import {Button, styled, withStyles} from "@material-ui/core";
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
