import React from "react";
import {TimeWindows} from "./TimeWindows";
import {DemandSegments} from "./DemandSegments";
import {Caption} from "../../UI/Caption";
import {Routes} from "../../../config/routes";
import {TextLink} from "../../UI/TextLink";
import {styled} from "@material-ui/core";
import {LoadingButton} from "../../UI/Button";
import {useDispatch, useSelector} from "react-redux";
import {useException, useMessage, useSCs} from "../../../utils/hooks";
import {recalculateCapacity} from "../../../store/reducers/demandSegments/actions";
import {RootState} from "../../../store/rootReducer";

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
    const {isRecalculationLoading} = useSelector((state: RootState) => state.demandSegments);
    const {selectedSC} = useSCs();
    const dispatch = useDispatch();
    const showError = useException();
    const showMessage = useMessage();

    const onSuccess = () => {
        showMessage('Capacity recalculated')
    }

    const recalculate = () => {
        if (selectedSC) dispatch(recalculateCapacity(selectedSC.id, onSuccess, showError))
    }

    return <div>
        <ButtonContainer>
            <LoadingButton
                loading={isRecalculationLoading}
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