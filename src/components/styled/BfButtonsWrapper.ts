import {styled} from "@mui/material";
import theme from "../../theme/theme";

export const BfButtonsWrapper = styled('div')({
    padding: "10px 25px 25px",
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    [theme.breakpoints.down('mdl')]: {
        flexDirection: 'column',
        justifyContent: 'space-around',
        padding: '16px !important',
        '& div': {
            width: '100%'
        }
    },
    '& div:first-child': {
        marginRight: 16,
        [theme.breakpoints.down('mdl')]: {
            marginBottom: 12,
            marginRight: 0,
        }
    },
})