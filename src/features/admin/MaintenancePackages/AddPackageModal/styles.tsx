import { makeStyles } from 'tss-react/mui';

const baseWrapper = {
    display: "flex",
    justifyContent: 'space-between',
    alignItems: 'center',
}

export const useStyles = makeStyles()(() => ({
    formWrapper: {
        ...baseWrapper,
        '& .MuiAutocomplete-root': {
            width: '47%',
        }
    },
    addExisting: {
        display: "flex",
        alignItems: 'center',
        color: '#7898FF',
        fontSize: 12,
        marginBottom: 30,
    },
    wideButton: {
        // width: '100%',
        color: '#7898FF',
        border: '1px solid #7898FF',
        borderRadius: 0,
        marginBottom: 16,
        fontSize: 12,
    },
    redButton: {
        width: '100%',
        color: '#7898FF',
        border: '1px solid red',
        borderRadius: 0,
        marginBottom: 16,
        fontSize: 12,
    },
    label: {
        fontWeight: 'bold',
        textTransform: 'uppercase',
        fontSize: 12,
        marginBottom: 10,
    },
    btnsWrapper: {
        ...baseWrapper,

        '& > button:not(:first-child)': {
            marginLeft: 12,
        },
        '& > button': {
            fontSize: 12,
        }
    },
    opsCodesWrapper: {
        height: 124,
        display: 'flex',
        alignItems: 'start',
        alignContent: 'start',
        justifyContent: 'stretch',
        flexWrap: 'wrap',
        overflowY: 'auto',
        marginBottom: 16,
        background: '#F7F8FB',
        color: '#B8B9BF',
        padding: '6px 12px',
    },
    emptyOpsCodes: {
        height: 124,
        display: 'flex',
        justifyContent: 'center',
        alignItems: "center",
        overflowY: 'auto',
        marginBottom: 16,
        background: '#F7F8FB',
        color: '#B8B9BF',
    },
    errorOpsCodes: {
        height: 124,
        display: 'flex',
        justifyContent: 'center',
        alignItems: "center",
        overflowY: 'auto',
        marginBottom: 16,
        background: '#F7F8FB',
        color: '#B8B9BF',
        border: '1px solid red'
    },
    fullWidth: {
        '& .MuiInputBase-root': {
            width: '100%',
        }
    },
    contentWrapper: {
        padding: 20,
    },
    iconPlus: {
        marginLeft: -9,
        '& .MuiSvgIcon-root': {
            fill: '#7898FF',
        }
    },
    checkbox: {
        padding: '9px 0',
    },
    twoFieldsWrapper: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        columnGap: 8,
        '& .MuiAutocomplete-root': {
            width: '100%',
        }
    },
    wrapper: {
        display: 'flex',
        justifyContent: 'flex-end',
        paddingTop: 14,
    },
    buttonsWrapper: {
        display: 'flex',
        justifyContent: "space-between",
        alignItems: 'center',
    },
    cancelButton: {
        color: '#9FA2B4',
        marginRight: 20,
        border: 'none',
        outline: 'none',
    },
    saveButton: {
        background: '#7898FF',
        color: 'white',
        border: '1px solid #7898FF',
        outline: 'none',
        '&:hover': {
            color: '#7898FF'
        }
    },
    applyRulesWrapper: {
        display: 'flex',
        alignItems: 'center',
        marginBottom: 10,
    },
    applyText: {
        marginLeft: 5,
        fontWeight: 'bold',
        fontSize: 14,
    }
}));

export const useAutocompleteStyles = makeStyles()(() => ({
    clearIndicator: {
        width: 0,
    }
}));