import React, {useEffect, useState} from 'react';
import {FormControlLabel, Radio, RadioGroup, styled, Tab} from "@material-ui/core";
import {TabList} from "../../../UI/Tabs";
import {TabContext, TabPanel} from "@material-ui/lab";
import ByZone from "./ByZone";
import {makeStyles} from "@material-ui/core/styles";
import ByDistance from "./ByDistance";
import {useSCs} from "../../../../utils/hooks";
import {useDispatch} from "react-redux";
import {
    loadServiceValetPrisingByDistance,
    loadServiceValetPrisingByZones
} from "../../../../store/reducers/serviceValet/actions";

export const TablesWrapper = styled('div')({
    display: 'flex',
    flexDirection: 'column',
    padding: 24,
    border: '1px solid #DADADA',
    backgroundColor: "#FFFFFF",
})

type TTab = {
    id: string;
    label: string;
    component: JSX.Element
}

const useStyles = makeStyles(() => ({
    wrapper: {
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    optionsTitleWrapper: {
        display: 'flex',
        alignItems: 'center',
        marginRight: 20,
        fontSize: 14,
        fontWeight: "bold",
        textTransform: 'uppercase',
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        padding: 8,
        textTransform: 'uppercase',
    },
    text: {
        fontSize: 16,
        padding: 8,
        marginBottom: 15,
    }
}))

const AncillaryPrice = () => {
    const [selectedTab, selectTab] = useState<string>("0");
    const [typeOfPrice, setTypeOfPrice] = useState<string>("byZone");
    const classes = useStyles();
    const {selectedSC} = useSCs();
    const dispatch = useDispatch();

    useEffect(() => {
        if (selectedSC) {
            dispatch(loadServiceValetPrisingByDistance(selectedSC.id))
            dispatch(loadServiceValetPrisingByZones(selectedSC.id))
        }
    }, [selectedSC])

    const tabs: TTab[] = [
        {id: "0", label: "Ancillary Price By Zone", component: <ByZone/>},
        {id: "1", label: "Ancillary Price By Distance", component: <ByDistance/>},
    ]
    const handleTabChange = (e: any, value: string) => {
        selectTab(value);
    }

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.persist();
        setTypeOfPrice(e.target.value)
    }

    return (
        <TablesWrapper>
            <div className={classes.wrapper}>
                <div className={classes.optionsTitleWrapper}>Pricing Settings: </div>
                <RadioGroup row aria-label="countType" name="countType" value={typeOfPrice} onChange={onChange}>
                    <FormControlLabel
                        value="byZone"
                        control={<Radio color="primary"/>}
                        label="By Zone"
                        labelPlacement="end"
                    />
                    <FormControlLabel
                        value="byDistance"
                        control={<Radio color="primary"/>}
                        label="By Distance"
                        labelPlacement="end"
                    />
                </RadioGroup>
            </div>

            <TabContext value={selectedTab}>
                <TabList
                    variant="scrollable"
                    scrollButtons="auto"
                    onChange={handleTabChange}
                    indicatorColor="primary"
                >
                    {tabs.map(t => {
                        return <Tab label={t.label} value={t.id} key={t.id} />;
                    })}
                </TabList>
                {tabs.map(t => {
                    return <TabPanel
                        style={{width: "100%"}}
                        key={t.id}
                        value={t.id}>
                        {t.component}
                    </TabPanel>
                })}
            </TabContext>
        </TablesWrapper>
    )
};

export default AncillaryPrice;