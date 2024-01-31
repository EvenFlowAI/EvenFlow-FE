import { makeStyles } from 'tss-react/mui';

export const useStyles = makeStyles()(() => ({
    number: {
        '& > span': {
            fontSize: 14,
            marginLeft: 3,
        }
    }
}));