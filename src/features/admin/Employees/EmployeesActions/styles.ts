import {styled} from "@material-ui/core";

export const ActionsWrapper = styled('div')({
    display: 'flex',
    alignItems: 'center',
    justifyContent: "flex-end",
    '& > button': {
        marginLeft: 20,
    }
})