import {EDay} from "../../../store/reducers/demandSegments/types";
import {IOverbookingFactor} from "../../../store/reducers/optimizationWindows/types";

export type TForm = {
    [D in EDay]: IOverbookingFactor
}