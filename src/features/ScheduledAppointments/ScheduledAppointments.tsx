import React from "react";
import {TimeWindows} from "../AppointmentAllocation/TimeWindows";
import {DemandSegments} from "../AppointmentAllocation/DemandSegments";
import {Caption} from "../../components/UI/Caption";
import {Routes} from "../../config/routes";
import {TextLink} from "../../components/UI/TextLink";
import {LoadingButton} from "../../components/UI/Button";
import {useDispatch, useSelector} from "react-redux";
import {useException, useMessage, useSCs} from "../../utils/hooks";
import {recalculateCapacity} from "../../store/reducers/demandSegments/actions";
import {RootState} from "../../store/rootReducer";
import {ButtonContainer, TableContainer} from "./styles";

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