import { makeStyles } from 'tss-react/mui';

//
export const useStyles = makeStyles()({
    buttonsWrapper: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        '& > button': {
            marginLeft: 8
        }
    }
});