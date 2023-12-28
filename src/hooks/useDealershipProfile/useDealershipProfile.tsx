import {IDealershipProfile} from "../../store/reducers/dealershipGroups/types";
import {useSelector} from "react-redux";
import {RootState} from "../../store/rootReducer";

export const useDealershipProfile = (): IDealershipProfile | undefined => {
    return useSelector((state: RootState) => state.dealershipGroups.profile);
}