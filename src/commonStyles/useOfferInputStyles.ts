import {makeStyles} from "@material-ui/core/styles";

export const useOfferInputStyles = makeStyles(() => ({
    input: {
        '& > label': {
            color: '#FFFFFF'
        },
        '& > input': {
            backgroundColor: "#FFFFFF",
        },
    }
}))