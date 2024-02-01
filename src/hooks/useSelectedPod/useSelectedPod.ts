import {useSelector} from "react-redux";
import {RootState} from "../../store/rootReducer";

export const useSelectedPod = () => {
    const {selectedPod} = useSelector((state: RootState) => state.pods);
    return {selectedPod};
}