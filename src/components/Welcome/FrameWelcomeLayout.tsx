import React, {useMemo} from 'react';
import {styled, useMediaQuery, useTheme} from "@material-ui/core";
import {useTranslation} from "react-i18next";
import {useSelector} from "react-redux";
import {RootState} from "../../store/rootReducer";
import {EServiceCenterName} from "../../api/types";
import {ServiceCenterSwitcher} from "../AppointmentFlow/AppointmentFrame/ServiceCenterSwitcher/ServiceCenterSwitcher";
import {useLayout} from "../../utils/hooks";

const Wrapper = styled('div')(({theme}) => ({
    width: '80%',
    maxWidth: 1000,
}));

const Title = styled('h1')(({theme}) => ({
    textTransform: 'uppercase',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 32,
    margin: 0,
    [theme.breakpoints.down('sm')]: {
        fontSize: 24
    },
    [theme.breakpoints.down('xs')]: {
        fontSize: 18
    }
}));

export const nonFrameStyles = {
    display: "flex",
    flexFlow: "column nowrap",
    justifyContent: "stretch",
    width: "100%",
}
export const frameStyles = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%'
}

export const frameSmStyles = {
    ...frameStyles,
    height: 'auto',
    overflowY: 'auto',
    paddingTop: 16,
    paddingBottom: 16,
}

const MainWrapper = styled('div')({
    width: "100%",
    display: 'flex',
    flexDirection: 'column',
    justifyContent: "center",
    alignItems: 'center'
})
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