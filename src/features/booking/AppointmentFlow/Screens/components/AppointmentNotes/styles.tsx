import {styled} from "@mui/material";
import {TextField} from "../../../../../../components/formControls/TextFieldStyled/TextField";
import { makeStyles } from 'tss-react/mui';

//
export const useStyles = makeStyles()({
    title: {
        fontSize: 14,
        fontWeight: 700,
        color: "#202021",
        marginBottom: 4,
        textTransform: 'uppercase'
    },
    inputWrapper: {
        width: "100%",
        height: 115,
        border: '1px solid #DADADA',
        borderRadius: 2,
        '& div': {
            border: 'none'
        }
    },
    input: {
        maxHeight: 77,
        overflowY: 'auto'
    },
    bottomWrapper: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    buttonsWrapper: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '8px'
    },
    button: {
        textTransform: "uppercase",
    },
    counter: {
        fontWeight: 600,
        fontSize: 10,
        textTransform: "uppercase",
        paddingLeft: 12,
    },
});

export const Textarea = styled(TextField)({
    "& textarea": {
        padding: "8px 11px"
    },
});