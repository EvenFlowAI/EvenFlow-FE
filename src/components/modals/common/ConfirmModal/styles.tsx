import {makeStyles} from "tss-react/mui";

export const useStyles = makeStyles()({
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
        gap: 8
    }
})