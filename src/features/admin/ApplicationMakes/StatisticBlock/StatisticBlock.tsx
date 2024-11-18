import React from 'react';
import {Statistic} from "../../../../components/styled/Statistic";
import {Wrapper} from "../styles";
import {useSelector} from "react-redux";
import {RootState} from "../../../../store/rootReducer";
import {Loading} from "../../../../components/wrappers/Loading/Loading";
import {getPercentage} from "../utils";

const StatisticBlock = () => {
    const {makesStatistic, isLoading} = useSelector((state: RootState) => state.globalVehicles);

    return isLoading
        ? <Loading/>
        : <Wrapper>
            <Statistic>
                <div className="label">Makes confirmed:</div>
                {makesStatistic
                    ? <div className="value">
                        {makesStatistic?.confirmed ?? 0} ({getPercentage(makesStatistic)?.confirmed}%)
                    </div>
                    : null}
            </Statistic>
            <Statistic>
                <div className="label">Makes overridden:</div>
                {makesStatistic
                    ? <div className="value">
                        {makesStatistic?.overriden ?? 0} ({getPercentage(makesStatistic)?.overriden}%)
                    </div>
                    : null}
            </Statistic>
            <Statistic>
                <div className="label">Makes not reviewed:</div>
                {makesStatistic
                    ? <div className="value">
                        {makesStatistic?.notReviewed ?? 0} ({getPercentage(makesStatistic)?.notReviewed}%)
                    </div>
                    : null}
            </Statistic>
        </Wrapper>;
};

export default StatisticBlock;