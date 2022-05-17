import React, {useState, useMemo, useEffect} from 'react';
import {MuiThemeProvider, styled} from "@material-ui/core";
import {frameTheme} from "../../../../theme/theme";
import {YearModel} from "./YearModel";
import {
    setCurrentFrameScreen,
    setMaintenanceDetails,
    setValueService, setVehicle
} from "../../../../store/reducers/appointmentFrameReducer/actions";
import {useDispatch, useSelector} from "react-redux";
import {useHistory, useParams} from "react-router-dom";
import ServiceSelection from "./ServiceSelection";
import ServiceDetails from "./ServiceDetails";
import {ILoadedVehicle} from "../../../../api/types";
import {yearOptions} from "../MaintenanceDetails";
import {RootState} from "../../../../store/rootReducer";
import {loadSCProfile} from "../../../../store/reducers/appointment/actions";
import {decodeSCID} from "../../../../utils/utils";

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

const ValueService: React.FC = () => {
    const [screen, setScreen] = useState<TScreen>("vehicleDetails");
    const {makes, valueService, selectedVehicle} = useSelector((state: RootState) => state.appointmentFrame);
    const dispatch = useDispatch();
    const {id} = useParams();
    const history = useHistory();

    useEffect(() => {
        dispatch(loadSCProfile(decodeSCID(id)));
    }, [id])

    const onBack = async () => {
        await dispatch(setValueService(null));
        await dispatch(setCurrentFrameScreen("serviceNeeds"));
        history.push( "/f/appointment/" + id);
    };

    const setSelectedVehicle = () => {
        if (valueService) {
            const vehicle: ILoadedVehicle = {
                vin: "",
                make: "",
                model: "",
                year: null,
                mileage: selectedVehicle?.mileage ?? null,
                appointmentHashKeys: [],
            };
            const bmwMake = makes.find(item => item.name === "BMW");
            if (bmwMake) {
                dispatch(setMaintenanceDetails({make: bmwMake.name}));
                vehicle.make = bmwMake.name;

                if (valueService?.year?.year && yearOptions.find(option => Number(option) === valueService?.year?.year)) {
                    dispatch(setMaintenanceDetails({year: valueService.year.year.toString()}));
                    vehicle.year = Number(valueService.year.year)
                }

                const model = bmwMake.models.find(model => model === valueService.series?.name);
                if (model) {
                    dispatch(setMaintenanceDetails({model}));
                    vehicle.model = model;
                }
                dispatch(setVehicle(vehicle));
            }
        }
    }

    const onNext = async () => {
        await setSelectedVehicle();
        await dispatch(setCurrentFrameScreen("consultantSelection"));
        history.push( `/f/appointment/${id}`);
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