import makeStyles from '@mui/styles/makeStyles';

export const useStyles = makeStyles(theme => ({
    inputCell: {
        fontSize: 16,
        fontWeight: "bold",
        color: theme.palette.primary.main
    },
    editCell: {
        display: "flex",
        width: "100%",
        height: "100%",
        flexFlow: "row nowrap",
        alignItems: "center",
        justifyContent: "space-between"
    }
}));