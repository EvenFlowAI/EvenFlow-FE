import React, {useEffect, useMemo, useState} from 'react';
import { ThemeProvider, Theme, StyledEngineProvider } from "@mui/material";
import {frameTheme} from "../../../theme/theme";
import {YearModel} from "../../../features/booking/ValueService/YearModel/YearModel";
import {
    setCurrentFrameScreen,
    setVehicleDataFromValueService
} from "../../../store/reducers/appointmentFrameReducer/actions";
import {useDispatch, useSelector} from "react-redux";
import {useHistory, useParams} from "react-router-dom";
import ServiceSelection from "../../../features/booking/ValueService/ServiceSelection/ServiceSelection";
import ServiceDetails from "../../../features/booking/ValueService/ServiceDetails/ServiceDetails";
import {RootState} from "../../../store/rootReducer";
import {loadSCProfile} from "../../../store/reducers/appointment/actions";
import {decodeSCID} from "../../../utils/utils";
import {EServiceType} from "../../../store/reducers/appointmentFrameReducer/types";
import {TScreen} from "../../../types/types";
import {TValueServiceScreen} from "./types";
import {Container} from "./styles";


declare module '@mui/styles/defaultTheme' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface DefaultTheme extends Theme {}
}


type TValueServiceProps = {
    onBack: () => void;
    nextScreen: TScreen;
}

const ValueService: React.FC<TValueServiceProps> = ({onBack, nextScreen}) => {
    const [screen, setScreen] = useState<TValueServiceScreen>("vehicleDetails");
    const { serviceTypeOption} = useSelector((state: RootState) => state.appointmentFrame);
    const { config } = useSelector((state: RootState) => state.bookingFlowConfig);
    const dispatch = useDispatch();
    const {id} = useParams();
    const serviceType = useMemo(() => serviceTypeOption ? serviceTypeOption.type : EServiceType.VisitCenter, [serviceTypeOption]);
    const isServiceDetailsPageOn = useMemo(() => {
        return Boolean(config.find(item => item.serviceType.toString() === serviceType.toString())?.productPageForValueService)
    }, [config, serviceType])

    const history = useHistory();

    useEffect(() => {
        dispatch(loadSCProfile(decodeSCID(id)));
    }, [id])

    const onNext = async () => {
        await dispatch(setVehicleDataFromValueService())
        await dispatch(setCurrentFrameScreen(nextScreen));
        history.push( "/f/appointment/" + id);
    };

    const onBackClick = () => {
        if (id) history.push( "/f/appointment/" + id);
        onBack();
    }

    const component = useMemo(() => {
        const screens: {[k in TValueServiceScreen]: JSX.Element} = {
            vehicleDetails: <YearModel onBack={onBackClick} onNext={() => setScreen("serviceSelection")}/>,
            serviceSelection: <ServiceSelection
                onNext={() => isServiceDetailsPageOn ? setScreen("serviceDetails") : onNext()}
                onBack={() => setScreen("vehicleDetails")}
            />,
            serviceDetails: <ServiceDetails
                onBack={() => setScreen("serviceSelection")}
                onNext={onNext}
                onChangeVehicle={() => setScreen("vehicleDetails")}
            />,
        }
        return screens[screen];
    }, [screen])

    return (
        <StyledEngineProvider injectFirst>
            <ThemeProvider theme={frameTheme}>
                <Container>
                    {component}
                </Container>
            </ThemeProvider>
        </StyledEngineProvider>
    );
};

export default ValueService;