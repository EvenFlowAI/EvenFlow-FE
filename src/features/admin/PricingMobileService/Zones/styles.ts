import {makeStyles} from "@material-ui/core/styles";

export const useStyles = makeStyles(() => ({
    wrapper: {
        width: '70%',
        display: "grid",
        gridTemplateColumns: '1fr 1fr',
        gridGap: 24,
    }
}))