import React from "react";
import {TimeWindows} from "../AppointmentAllocation/TimeWindows";
import {Caption} from "../../../components/wrappers/Caption/Caption";
import {TextLink} from "../../../components/wrappers/TextLink/TextLink";
import {useDispatch, useSelector} from "react-redux";
import {recalculateCapacity} from "../../../store/reducers/demandSegments/actions";
import {RootState} from "../../../store/rootReducer";
import {ButtonContainer, TableContainer} from "./styles";
import {LoadingButton} from "../../../components/buttons/LoadingButton/LoadingButton";

import {useMessage} from "../../../hooks/useMessage/useMessage";
import {useException} from "../../../hooks/useException/useException";
import {useSCs} from "../../../hooks/useSCs/useSCs";
import {Routes} from "../../../routes/constants";

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
        <Caption title={<>
            <span>You can change the number of Demand Segments on </span>
            <TextLink
                to={Routes.CapacityManagement.OptimizationWindows}>
                Optimization Windows
            </TextLink>
            <span> page</span>
        </>} />
    </div>
}