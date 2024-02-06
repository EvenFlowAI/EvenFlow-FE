import { makeStyles } from 'tss-react/mui';

//
export const useIconStyles = makeStyles()(() => ({
    root: {
        transform: 'rotate(180deg)',
    }
}));

//
export const useAccordionStyles = makeStyles()(() => ({
    root: {
        backgroundColor: '#F7F8FB',
    },
    expanded: {
        backgroundColor: 'white',
    },
}));