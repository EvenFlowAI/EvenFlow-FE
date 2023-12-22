import {makeStyles} from "@material-ui/core/styles";

export type TStyleProps = {
    fw: boolean;
}

export const useStyles = makeStyles({
    wrapper: ({fw}: TStyleProps) => ({
        position: "relative",
        width: fw ? "100%" : "auto",
        display: "inline-flex"
    }),
    buttonProgress: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginTop: -12,
        marginLeft: -12,
    }
});