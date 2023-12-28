import {styled} from "@material-ui/core";

export const SectionWrapper = styled('div')(() => ({
    display: 'flex',
    flexDirection: 'column',
    gap: '30px',
    alignItems: "stretch",
    justifyContent: "center",
}))

export const RoHistoryLink = styled('div')(() => ({
    fontSize: 16,
    fontWeight: 600,
}))