import { makeStyles } from 'tss-react/mui';
import {styled} from "@mui/material";
import {TextField} from "../../../../components/formControls/TextFieldStyled/TextField";

// 
export const useStyles = makeStyles()(() => ({
    actionsWrapper: {
        display: 'flex',
        justifyContent: 'flex-end',
        paddingTop: 14,
    },
    buttonsWrapper: {
        display: 'flex',
        justifyContent: "space-between",
        alignItems: 'center',
    },
    cancelButton: {
        marginRight: 20,
    },
    saveButton: {
        background: '#7898FF',
        color: 'white',
        border: '1px solid #7898FF',
        outline: 'none',
        '&:hover': {
            color: '#7898FF'
        }
    },
}));

export const Textarea = styled(TextField)({
    "& textarea": {
        padding: "8px 11px"
    },
});
