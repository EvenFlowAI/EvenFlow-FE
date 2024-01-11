import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../store/rootReducer";
import {useCallback} from "react";
import {IServiceCenter} from "../../store/reducers/serviceCenters/types";
import {selectSC as selectSCAction} from "../../store/reducers/serviceCenters/actions";

export const useSCs = () => {
    const [
        selectedSC, scList
    ] = useSelector((state: RootState) => [
        state.serviceCenters.selectedSC,
        state.serviceCenters.fullSCList
    ]);
    const dispatch = useDispatch();
    const selectSC = useCallback((sc: IServiceCenter) => {
        dispatch(selectSCAction(sc));
    }, [dispatch])

    return {selectedSC, scList, selectSC};
}