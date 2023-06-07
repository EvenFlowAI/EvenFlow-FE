import React, {useMemo} from 'react';
import {styled} from "@material-ui/core";
import {useTranslation} from "react-i18next";
import {useSelector} from "react-redux";
import {RootState} from "../../store/rootReducer";
import {EServiceCenterName} from "../../api/types";

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
export const FrameWelcomeLayout: React.FC<{}> = ({children }) => {
    const {scProfile} = useSelector((state: RootState) => state.appointment);
    const {welcomeScreenView} = useSelector((state: RootState) => state.appointmentFrame);
    const {t} = useTranslation();
    const isTopAligning = useMemo(() => scProfile?.serviceCenterFlag === EServiceCenterName.Fremont
        || scProfile?.serviceCenterFlag === EServiceCenterName.LakePowellFord || scProfile?.serviceCenterFlag === EServiceCenterName.DealerBuilt, [scProfile]);
    return (
        <Wrapper style={{paddingTop: isTopAligning ? 20 : 'unset'}}>
            <div>
                <Title>{ welcomeScreenView === 'serviceCenterSelect' ? "Dealership name Network Service Centers" : t("Schedule your service")}</Title>
            </div>
            <div>{children}</div>
        </Wrapper>
    );
};