import {InputBase, Paper, RadioGroup, Select, styled, withStyles} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
export const CustomSelect = withStyles(() => ({
    root: {
        border: 'none',
        display: 'flex',
        alignItems: 'center',
        background: 'transparent'
    },
}))(Select);

export const CustomInput = withStyles(() => ({
    root: {
        border: 'none',
        background: 'transparent',
        '&$disabled': {
            background: 'transparent'
        },
    },
    disabled: {}
}))(InputBase);

export const CustomRadioGroup = withStyles(() => ({
    root: {
        flexDirection: 'row'
    }
}))(RadioGroup)

export const CustomPaper = withStyles(() => ({
    root: {
        marginBottom: 20,
        borderRadius: 0,
        padding: 16,
    }
}))(Paper)

export const ControlsWrapper = styled('div')(() => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
}));

export const RadioLabel = styled('span')(() => ({
    fontSize: 14,
    textTransform: 'uppercase',
    fontWeight: "bold",
    marginRight: 26,
}))

export const RadioWrapper = styled('div')(() => ({
    display: 'flex',
    alignItems: 'center'
}))

export const useZoneStyles = makeStyles(() => ({
    progress: {
        padding: 10,
    },
    editButton: {
        textTransform: "none",
        fontSize: 14
    },
    editSaveButtons: {
        display: 'flex',
        alignItems: 'center',
        '& > button:first-child': {
            marginRight: 20
        }
    },
    tableWrapper: {
        width: 'fit-content',
        overflowX: 'auto',
        border: '1px solid #DADADA'
    }
}))