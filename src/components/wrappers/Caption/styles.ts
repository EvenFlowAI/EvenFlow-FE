import makeStyles from '@mui/styles/makeStyles';

export const useStyles = makeStyles({
    caption: {
        display: "flex",
        fontSize: 16,
        marginTop: 10,
        alignItems: "center",
        "& .MuiSvgIcon-root": {
            marginRight: 8
        }
    }
});