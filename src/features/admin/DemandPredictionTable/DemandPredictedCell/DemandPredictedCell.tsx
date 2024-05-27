import React from "react";
import {EPredictedDemandMethod, IDemandPrediction} from "../../../../store/reducers/demandManagement/types";
import {RadioBtn, RadioGroupStyled, StyledTableCell} from "../styles";
import {Radio} from "@mui/material";
import LabelLink from "../LabelLink/LabelLink";
import {ReactComponent as CheckIcon} from '../../../../assets/img/checkboxSmall.svg'
import {ReactComponent as RedCross} from '../../../../assets/img/redCross.svg'
import {useDispatch, useSelector} from "react-redux";
import {useSCs} from "../../../../hooks/useSCs/useSCs";
import {RootState} from "../../../../store/rootReducer";
import {updateDemandManagementSettings} from "../../../../store/reducers/demandManagement/actions";

export const DemandPredictedCell: React.FC<{ item: IDemandPrediction }> = ({item}) => {
    const {settings} = useSelector((state: RootState) => state.demandManagement);
    const dispatch = useDispatch();
    const {selectedSC} = useSCs();

    const predictedMethod = item.predictedDemandMethodSettings
        ?.find(el => el.method === EPredictedDemandMethod.Predicted);
    const probabilityMethod = item.predictedDemandMethodSettings
        ?.find(el => el.method === EPredictedDemandMethod.Probability);

    const onPredictedClick = () => {

    }

    const onProbabilityClick = () => {

    }

    const handleChangePredictedDemandMethod = (id: number | undefined) => (e: React.ChangeEvent<HTMLInputElement>) => {
        if (selectedSC) {
            const itemToUpdate = id
                ? settings.find(el => el.podId === id)
                : settings.find(el => !el.podId)
            if (itemToUpdate) {
                const updated = {...itemToUpdate, predictedMethod: +e.target.value as EPredictedDemandMethod}
                dispatch(updateDemandManagementSettings(updated))
            }
        }
    }

    return <StyledTableCell key="predictedDemandMethod" align="left">
        <RadioGroupStyled
            value={item.predictedDemandMethod}
            onChange={handleChangePredictedDemandMethod(item.podId)}
            aria-labelledby="demo-controlled-radio-buttons-group"
            name="controlled-radio-buttons-group">
            <RadioBtn
                value={EPredictedDemandMethod.Predicted}
                control={<Radio color="primary" size="small"/>}
                label={<LabelLink
                    text="Predicted"
                    subText={predictedMethod?.isConfigured ? "Configured" : "Not Configured"}
                    icon={predictedMethod?.isConfigured ? <CheckIcon/> : <RedCross/>}
                    color={predictedMethod?.isConfigured ? "#7898FF" : "#C71062"}
                    onClick={onPredictedClick}/>}
            />
            <RadioBtn
                value={EPredictedDemandMethod.Probability}
                control={<Radio color="primary" size="small"/>}
                label={<LabelLink
                    text="Probability"
                    subText={probabilityMethod?.isConfigured ? "Configured" : "Not Configured"}
                    color={probabilityMethod?.isConfigured ? "#7898FF" : "#C71062"}
                    icon={probabilityMethod?.isConfigured ? <CheckIcon/> : <RedCross/>}
                    onClick={onProbabilityClick}/>}
            />
        </RadioGroupStyled>
    </StyledTableCell>
}