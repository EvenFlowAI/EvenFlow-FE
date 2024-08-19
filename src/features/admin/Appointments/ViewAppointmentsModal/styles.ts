import {styled} from "@mui/material";

export const Wrapper = styled('div')({
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 24,
})

export const TitleWrapper = styled('div')({
    marginBottom: 24,
    fontSize: 14
})

export const LoaderWrapper = styled('div')({
    height: 300,
    display: 'flex',
    justifyContent: 'center',
    alignItems: "center"
})

export const SimpleData = styled('div')({
    color: "#252733",
    fontSize: 14
})