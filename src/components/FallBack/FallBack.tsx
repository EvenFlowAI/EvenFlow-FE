import React from 'react';
import {LogoWrapper, MainCard, Wrapper} from "./styles";
import {ReactComponent as Evenflow} from '../../assets/img/evenflow.svg';
import {ReactComponent as Ai} from '../../assets/img/ai.svg';
import {ReactComponent as Picture} from '../../assets/img/fallback1.svg';

const FallBack = () => {
    return (
        <Wrapper>
            <LogoWrapper>
                <div className="mainText">
                    <Evenflow/>
                </div>
                <div className="secondaryText">
                    <Ai/>
                </div>
            </LogoWrapper>
            <MainCard>
                <div className="boldText">
                    Oops, something went wrong.<br/>
                    We are working hard to get things back up & running again.
                </div>
                <div className="img"><Picture/></div>
                <div className="normalText">
                    Feel free to drop us a line if you have any questions.
                </div>
                <a href="mailto:support@evenflow-ai.atlassian.net" className="button">SUPPORT</a>
            </MainCard>
        </Wrapper>
    );
};

export default FallBack;