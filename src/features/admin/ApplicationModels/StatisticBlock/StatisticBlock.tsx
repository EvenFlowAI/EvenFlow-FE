import React from 'react';
import {Statistic} from "../../../../components/styled/Statistic";
import {Wrapper} from "../styles";
import {useSelector} from "react-redux";
import {RootState} from "../../../../store/rootReducer";
import {Loading} from "../../../../components/wrappers/Loading/Loading";
import {getPercentage} from "../../ApplicationMakes/utils";

const StatisticBlock = () => {
    const {modelsStatistic, isLoading} = useSelector((state: RootState) => state.globalVehicles);

    return isLoading
        ? <Loading/>
        : <Wrapper>
            <Statistic>
                <div className="label">Models confirmed:</div>
                {modelsStatistic
                    ? <div className="value">
                        {modelsStatistic?.confirmed ?? 0} ({getPercentage(modelsStatistic)?.confirmed}%)
                    </div>
                    : null}
            </Statistic>
            <Statistic>
                <div className="label">Models overridden:</div>
                {modelsStatistic
                    ? <div className="value">
                        {modelsStatistic?.overriden ?? 0} ({getPercentage(modelsStatistic)?.overriden}%)
                    </div>
                    : null}
            </Statistic>
            <Statistic>
                <div className="label">Models not reviewed:</div>
                {modelsStatistic
                    ? <div className="value">
                        {modelsStatistic?.notReviewed ?? 0} ({getPercentage(modelsStatistic)?.notReviewed}%)
                    </div>
                    : null}
            </Statistic>
        </Wrapper>;
};

export default StatisticBlock;