import makeStyles from '@mui/styles/makeStyles';

export const useStyles = makeStyles({
    wrapper: {
        height: 300,
        display: 'flex',
        flexDirection: 'column',
        flexWrap: 'wrap',
        padding: '0px 8px',
    },
    label: {
        maxWidth: '50%',
        marginBottom: 12
    },
    checkbox: {
        marginRight: 12
    },
})