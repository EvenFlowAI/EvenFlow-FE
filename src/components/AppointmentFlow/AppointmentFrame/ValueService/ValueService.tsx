import React, {useState, useMemo} from 'react';
import {MuiThemeProvider, styled} from "@material-ui/core";
import {frameTheme} from "../../../../theme/theme";
import {YearModel} from "./YearModel";
import {setCurrentFrameScreen, setValueService} from "../../../../store/reducers/appointmentFrameReducer/actions";
import {useDispatch} from "react-redux";
import {useHistory, useParams} from "react-router-dom";
import ServiceSelection from "./ServiceSelection";
import ServiceDetails from "./ServiceDetails";
import {IValueService} from "../../../../store/reducers/appointmentFrameReducer/types";

const Container = styled('div')({
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    minHeight: "100%",
    padding: 20,
    maxWidth: 1280,
    margin: "auto"
});

type TScreen = "vehicleDetails" | "serviceSelection" | "serviceDetails";

const emptyService: IValueService = {
    year: null,
    series: null,
    model: null,
    selectedService: null,
}

const ValueService: React.FC = () => {
    const [screen, setScreen] = useState<TScreen>("vehicleDetails");
    const dispatch = useDispatch();
    const {id} = useParams();
    const history = useHistory();

    const onBack = async () => {
        await dispatch(setValueService(emptyService));
        await dispatch(setCurrentFrameScreen("serviceNeeds"));
        history.push( "/f/appointment/" + id);
    };
    const onNext = async () => {
        await dispatch(setCurrentFrameScreen("consultantSelection"));
        history.push( "/f/appointment/" + id);
    };

    const component = useMemo(() => {
        const screens: {[k in TScreen]: JSX.Element} = {
            vehicleDetails: <YearModel onBack={onBack} onNext={() => setScreen("serviceSelection")}/>,
            serviceSelection: <ServiceSelection
                onNext={() => setScreen("serviceDetails")}
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
        <MuiThemeProvider theme={frameTheme}>
            <Container>
                {component}
            </Container>
        </MuiThemeProvider>
    );
};

export default ValueService;