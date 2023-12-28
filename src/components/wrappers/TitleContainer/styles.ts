import {makeStyles} from "@material-ui/core/styles";

type TStyleProps = {
    pad: boolean;
}

export const useStyles = makeStyles(theme => ({
    container: ({pad}: TStyleProps) => ({
        display: "flex",
        flexFlow: "row",
        alignItems: "center",
        justifyContent: "space-between",
        width: `calc(100% + ${theme.spacing(4) * 2}px)`,
        maxWidth: theme.breakpoints.values.lg,
        marginLeft: -theme.spacing(4),
        marginRight: -theme.spacing(4),
        marginTop: theme.spacing(3),
        paddingLeft: theme.spacing(4),
        paddingRight: theme.spacing(4),
        paddingBottom: pad ? theme.spacing(3) : 0,
        [theme.breakpoints.down("sm")]: {
            flexFlow: "column",
            "&>*:not(:first-child)": {
                marginTop: theme.spacing(1)
            }
        }
    }),
    emptyTitle: {
        width: '50%',
    }
}));