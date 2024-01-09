import {styled} from "@material-ui/core";

export const FiltersWrapper = styled('div')({
    width: '100%',
    display: "flex",
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginBottom: 20,
    '& > div:first-child': {
        marginRight: 20
    }
});

export const ButtonsWrapper = styled('div')({
    width: '100%',
    display: "flex",
    alignItems: 'center',
    justifyContent: 'flex-end',
    '& > button:first-child': {
        marginRight: 20
    }
})