import {makeStyles} from "tss-react/mui";
import {styled} from "@mui/material";
import theme from "../../../../theme/theme";

export const useStyles = makeStyles()(theme => ({
   titleBooking: {
       textAlign: "left",
       paddingRight: 25,
       paddingLeft: 8,
       fontSize: 24,
       lineHeight: 1.2
   },
    titleAdmin: {
        textAlign: "left",
        paddingRight: 25,
    },
    buttonsWrapper: {
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        [theme.breakpoints.down('mdl')]: {
            flexDirection: 'column',
            justifyContent: 'space-around',
            '& div, & button': {
                width: '100%'
            }
        },
    }
}))

export const ButtonsWrapper = styled('div')({
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
})