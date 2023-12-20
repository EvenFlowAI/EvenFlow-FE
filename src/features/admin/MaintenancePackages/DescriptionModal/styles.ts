import {makeStyles} from "@material-ui/core/styles";

export const useStyles = makeStyles({
    wrapper: {
        display: "grid",
        gridGap: 10,
        gridTemplateColumns: "1fr 3fr 4fr 1fr 1fr",
        alignItems: "baseline",
    },
    iconWrapper: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
    title: {
        textAlign: "center"
    }
})