import makeStyles from '@mui/styles/makeStyles';

type TStyleProps = {
    size: number;
    disabled?: boolean
}

export const useStyles = makeStyles(theme => ({
    root: ({size, disabled}: TStyleProps) => ({
        width: size,
        height: size,
        cursor: !disabled ? "pointer" : "auto",
        backgroundColor: "#919191",
        transition: theme.transitions.create(["opacity", "box-shadow"]),
        opacity: .9,
        "&:hover": {
            boxShadow: !disabled ? theme.shadows[5] : undefined,
            opacity: !disabled ? 1 : undefined
        }
    }),
    sign: {
        fontSize: 25,
        fontWeight: "bold",
        color: "#FFFFFF",
        border: "1px solid #FFFFFF",
        borderRadius: "50%",
        width: 32,
        height: 32,
        lineHeight: "32px",
        textAlign: "center"
    },
    input: {
        display: "none"
    }
}));