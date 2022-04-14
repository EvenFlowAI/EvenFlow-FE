import React, {useState, useMemo} from 'react';
import {MuiThemeProvider, styled} from "@material-ui/core";
import {frameTheme} from "../../../../theme/theme";
import {YearModel} from "./YearModel";

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

    const onBack = () => {};
    const onNext = () => {};

    const component = useMemo(() => {
        const screens: {[k in TScreen]: JSX.Element} = {
            vehicleDetails: <YearModel onBack={onBack} onNext={() => setScreen("serviceSelection")}/>,
            serviceSelection: <YearModel onBack={() => setScreen("vehicleDetails")} onNext={() => setScreen("serviceDetails")}/>,
            serviceDetails: <YearModel onBack={() => setScreen("serviceSelection")} onNext={onNext}/>,
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