import React, {useState, useMemo, useEffect} from 'react';
import {MuiThemeProvider, styled} from "@material-ui/core";
import {frameTheme} from "../../../../theme/theme";
import {YearModel} from "./YearModel";
import {
    setCurrentFrameScreen,
    setVehicle, setVehicleDataFromValueService
} from "../../../../store/reducers/appointmentFrameReducer/actions";
import {useDispatch, useSelector} from "react-redux";
import {useHistory, useParams} from "react-router-dom";
import ServiceSelection from "./ServiceSelection";
import ServiceDetails from "./ServiceDetails";
import {ILoadedVehicle} from "../../../../api/types";
import {yearOptions} from "../MaintenanceDetails";
import {RootState} from "../../../../store/rootReducer";
import {TScreen} from "../../../Layout/types";
import {loadSCProfile} from "../../../../store/reducers/appointment/actions";
import {decodeSCID} from "../../../../utils/utils";
import {EServiceType} from "../../../../store/reducers/appointmentFrameReducer/types";

const Container = styled('div')(({theme}) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    minHeight: "100%",
    padding: 20,
    maxWidth: 1280,
    margin: "auto",
    [theme.breakpoints.down("sm")]: {
        padding: 0,
    },
}));

type TValueServiceScreen = "vehicleDetails" | "serviceSelection" | "serviceDetails";

type TValueServiceProps = {
    onBack: () => void;
    nextScreen: TScreen;
}

const ValueService: React.FC<TValueServiceProps> = ({onBack, nextScreen}) => {
    const [screen, setScreen] = useState<TValueServiceScreen>("vehicleDetails");
    const {makes, valueService, selectedVehicle, serviceTypeOption} = useSelector((state: RootState) => state.appointmentFrame);
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
                vehicle.make = bmwMake.name;
                if (valueService?.year?.year && yearOptions.find(option => Number(option) === valueService?.year?.year)) {
                    vehicle.year = Number(valueService.year.year)
                }
                const model = bmwMake.models.find(model => model === valueService.series?.name);
                if (model) vehicle.model = model;
                dispatch(setVehicle(vehicle));
            }
        }
    }

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
        <MuiThemeProvider theme={frameTheme}>
            <Container>
                {component}
            </Container>
        </MuiThemeProvider>
    );
};

export default ValueService;