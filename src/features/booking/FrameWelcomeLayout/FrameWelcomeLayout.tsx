import React, {useMemo} from 'react';
import {useMediaQuery, useTheme} from "@material-ui/core";
import {useTranslation} from "react-i18next";
import {useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import {EServiceCenterName} from "../../../api/types";
import {
    ServiceCenterSwitcher
} from "../AppointmentMainFlow/AppointmentFrame/ServiceCenterSwitcher/ServiceCenterSwitcher";
import {useLayout} from "../../../utils/hooks";
import {frameSmStyles, frameStyles, MainWrapper, nonFrameStyles, Title, Wrapper} from "./styles";

export const FrameWelcomeLayout: React.FC<{}> = ({children }) => {
    const {scProfile} = useSelector((state: RootState) => state.appointment);
    const {welcomeScreenView} = useSelector((state: RootState) => state.appointmentFrame);
    const {t} = useTranslation();
    const isFrame = useLayout();
    const theme = useTheme();
    const isSm = useMediaQuery(theme.breakpoints.down('sm'));
    const isTopAligning = useMemo(() => scProfile?.serviceCenterFlag === EServiceCenterName.Fremont
        || scProfile?.serviceCenterFlag === EServiceCenterName.LakePowellFord
        || scProfile?.serviceCenterFlag === EServiceCenterName.DealerBuilt
        || welcomeScreenView === 'serviceCenterSelect', [scProfile, welcomeScreenView]);
    return (
        <MainWrapper style={{height: isTopAligning ? "100%" : "100vh"}}>
            <div style={{width: "70%"}}>
                <ServiceCenterSwitcher/>
            </div>
            <div
                style={!isFrame
                    ? nonFrameStyles
                    : isSm && welcomeScreenView === 'serviceSelect'
                        ? frameSmStyles
                        : frameStyles}>
                <Wrapper style={{paddingTop: isTopAligning ? 20 : 'unset'}}>
                    <div>
                        <Title>
                            { welcomeScreenView === 'serviceCenterSelect'
                                ? `${scProfile?.dealershipName} Network Service Centers`
                                : t("Schedule your service")}
                        </Title>
                    </div>
                    <div>{children}</div>
                </Wrapper>
            </div>
        </MainWrapper>
    );
};