import React from "react";
import {TimeWindows} from "./TimeWindows";
import {DemandSegments} from "./DemandSegments";
import {Caption} from "../../UI/Caption";
import {Routes} from "../../../config/routes";
import {TextLink} from "../../UI/TextLink";
import {styled} from "@material-ui/core";
import {LoadingButton} from "../../UI/Button";
import {useDispatch} from "react-redux";
import {useSCs} from "../../../utils/hooks";
import {recalculateCapacity} from "../../../store/reducers/demandSegments/actions";

const TableContainer = styled("div")({
    overflowX: "auto"
});

const ButtonContainer = styled('div')({
    width: '100%',
    display: 'flex',
    justifyContent: 'flex-end',
    paddingBottom: 24,
})

export const ScheduledAppointments = () => {
    const dispatch = useDispatch();
    const {selectedSC} = useSCs();

    const recalculate = () => {
        if (selectedSC) dispatch(recalculateCapacity(selectedSC.id))
    }

    return <div>
        <ButtonContainer>
            <LoadingButton
                variant="contained"
                color="primary"
                onClick={recalculate}>
                Recalculate Capacity
            </LoadingButton>
        </ButtonContainer>
        <TableContainer><TimeWindows/></TableContainer>
        <div style={{padding: 10}} />
        <TableContainer><DemandSegments/></TableContainer>
        <div style={{padding: 10}} />
        <Caption title={<>
            <span>You can change the number of Demand Segments on </span>
            <TextLink
                to={Routes.Optimizer.OptimizationWindows}>
                Optimization Windows
            </TextLink>
            <span> page</span>
        </>} />
    </div>
}