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
        '& div, & button': {
            width: '100%'
        }
    },
    '& > div:first-child, & > button:first-child': {
        marginRight: 16,
        [theme.breakpoints.down('mdl')]: {
            marginBottom: 12,
            marginRight: 0,
        }
    }
})

export const CenteredButtonsWrapper = styled(BfButtonsWrapper)({
    justifyContent: 'center',
    [theme.breakpoints.down('mdl')]: {
        justifyContent: 'space-around'
    },
    [theme.breakpoints.down('sm')]: {
        flexDirection: 'column-reverse',
        '& > div:last-child, & > button:last-child': {
            marginBottom: 12,
            marginRight: 0,
        },
        '& > div:first-child, & > button:first-child': {
            marginBottom: 0
        }
    }
})