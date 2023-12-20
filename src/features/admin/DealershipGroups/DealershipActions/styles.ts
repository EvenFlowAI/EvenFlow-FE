import {makeStyles} from "@material-ui/core/styles";

export const useStyles = makeStyles({
    buttonsWrapper: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        '& > button': {
            marginLeft: 8
        }
    }
})