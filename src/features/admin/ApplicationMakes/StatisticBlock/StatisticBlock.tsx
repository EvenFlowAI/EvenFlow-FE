import React from 'react';
import {Statistic} from "../../../../components/styled/Statistic";
import {Wrapper} from "../styles";

const StatisticBlock = () => {
    return (
        <Wrapper>
            <Statistic>
                <div className="label">Makes confirmed:</div>
                <div className="value">12,432,677 (86%)</div>
            </Statistic>
            <Statistic>
                <div className="label">Makes overridden:</div>
                <div className="value">2,176,679 (12%)</div>
            </Statistic>
            <Statistic>
                <div className="label">Makes not reviewed:</div>
                <div className="value">427,753 (2%)</div>
            </Statistic>
        </Wrapper>
    );
};

export default StatisticBlock;