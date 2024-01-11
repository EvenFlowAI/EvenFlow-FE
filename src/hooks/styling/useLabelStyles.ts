import makeStyles from '@mui/styles/makeStyles';

export const useLabelStyles = makeStyles({
    label: {
        fontWeight: "bold",
        fontSize: 16,
        textTransform: "uppercase",
        transform: 'translate(0, 1.5px) scale(0.75)',
        transformOrigin: 'top left'
    }
})