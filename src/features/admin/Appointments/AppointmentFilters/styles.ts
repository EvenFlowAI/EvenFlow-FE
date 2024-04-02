import { MenuItem } from "@mui/material";

import {makeStyles, withStyles} from 'tss-react/mui';

export const EmptyMenuItem = withStyles(MenuItem, {
    root: {
        color: '#858585'
    }
});

export const useAutocompleteClasses = makeStyles()(() => ({
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
        padding: 0,
        paddingRight: 8,
    },
}));