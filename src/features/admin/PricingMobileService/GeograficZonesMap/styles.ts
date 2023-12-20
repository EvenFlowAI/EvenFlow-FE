import {makeStyles} from "@material-ui/core/styles";

export const useStyles = makeStyles(() => ({
    wrapper: {
        width: '70%',
        '& > iframe': {
            width: '100%',
            height: 548,
        },
        '& > div': {
            fontSize: 10
        }
    }
}))