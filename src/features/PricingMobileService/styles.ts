import {Button, styled} from "@material-ui/core";

export const TabHeaderWrapper = styled('div')({
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    padding: '24px 32px',
})

export const ButtonsWrapper = styled('div')({
    display: 'flex',
    alignItems: 'center',
})

export const Title = styled('div')({
    fontSize: 12,
    fontWeight: "bold",
    textTransform: "uppercase",
    marginBottom: 8,
})

export const TextButton = styled(Button)({
    textTransform: 'none',
    fontSize: 18,
    fontWeight: 'normal',
    color: '#252733',
    marginRight: 20,
})

export const ZonesWrapper = styled('div')({
    display: 'flex',
    alignItems: 'flex-start',
    columnGap: 24,
})