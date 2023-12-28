import {EOptimizationWindowType, IOptimizationWindow} from "../../../store/reducers/optimizationWindows/types";

export type TOptParam = {
    [k in EOptimizationWindowType]: IOptimizationWindow;
}