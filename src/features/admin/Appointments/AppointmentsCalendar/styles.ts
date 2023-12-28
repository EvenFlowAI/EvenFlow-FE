import {makeStyles} from "@material-ui/core/styles";

export const useStyles = makeStyles(() => ({
    number: {
        '& > span': {
            fontSize: 14,
            marginLeft: 3,
        }
    }
}))