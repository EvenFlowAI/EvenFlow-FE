import React, {useMemo} from 'react';
import {Box, CircularProgress, styled, Typography} from "@material-ui/core";
import {useTranslation} from "react-i18next";

const Wrapper = styled("div")(({theme}) => ({
    padding: theme.spacing(1),
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start"
}))
const Label = styled("span")(({theme}) => ({
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    position: "absolute",
    display: "flex",
    fontWeight: "bold",
    alignItems: "center",
    justifyContent: "center"
}))

type TProps = {
    activeStep: number;
    steps: number;
    label: string;
    nextLabel?: string;
}
export const ProgressStepper: React.FC<TProps> = ({activeStep, steps, label, nextLabel}) => {
    const {t} = useTranslation();
    const stepWeight = useMemo(() => {
        return 100 / (steps || 1);
    }, [steps]);
    return <Wrapper>
        <Box position="relative" mr={1}>
            <CircularProgress thickness={4} size={55} variant="determinate" value={100} color="inherit" style={{color: "#fff", position: "absolute", top: 0, left: 0}} />
            <CircularProgress thickness={4} size={55} variant="determinate" value={stepWeight * activeStep} />
            <Label>
                {activeStep} {t("of")} {steps}
            </Label>
        </Box>
        <Box p={1} fontWeight="bold">
            <Typography variant="h5" color="primary"><strong>{label}</strong></Typography>
            <Typography variant="caption" color="textSecondary"><strong>{nextLabel ? `${t("Next")}: ${nextLabel}` : ""}</strong></Typography>
        </Box>
    </Wrapper>
};