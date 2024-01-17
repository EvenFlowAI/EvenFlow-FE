import makeStyles from '@mui/styles/makeStyles';

export const useAutocompleteStyles = makeStyles(() => ({
    tag: {
        display: 'flex',
        alignItems: 'center',
        backgroundColor: '#7898FF',
        borderRadius: 4,
        color: 'white',
        fontWeight: 'bold',
        margin: '1px 2px',
        '& > svg': {
            color: 'white',
        }
    },
    option: {
        height: 28,
        display: 'flex',
        alignItems: 'center',
        padding: 0,
        fontSize: 15,
    },
    inputRoot: {
        paddingRight: 8,
    },
}))