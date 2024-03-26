import {Divider, styled} from "@mui/material";

export const ConsentTitle = styled("div")({
    fontSize: 24,
    fontWeight: 600,
    marginBottom: 16,
})

export const ConsentText = styled("div")({
    fontSize: 16,
    marginBottom: 24,
})

export const ConsentWrapper = styled("div")({
    marginBottom: 24,
    '& > hr': {
        margin: '24px 0 0 0 !important',
    }
})

export const ConsentDivider = styled(Divider)({

})

export const ConsentButtonsWrapper = styled("div")({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    '& > button:first-child': {
        marginRight: 16
    }
})