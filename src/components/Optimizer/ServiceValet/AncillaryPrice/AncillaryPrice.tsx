import React, {useEffect, useState} from 'react';
import {FormControlLabel, Radio, RadioGroup, styled, Tab} from "@material-ui/core";
import {TabList} from "../../../UI/Tabs";
import {TabContext, TabPanel} from "@material-ui/lab";
import ByZone from "../../AnicllaryPriceParts/ByZone";
import {makeStyles} from "@material-ui/core/styles";
import ByDistance from "../../AnicllaryPriceParts/ByDistance";
import {useConfirm, useException, useMessage, useSCs} from "../../../../utils/hooks";
import {useDispatch, useSelector} from "react-redux";
import {
    addServiceValetDistanceRange,
    changeServiceValetPriceSettings,
    deleteServiceValetPrisingByDistance,
    loadServiceValetPricingOption,
    loadServiceValetPrisingByDistance,
    loadServiceValetPrisingByZones,
    updateServiceValetPrisingByDistance,
    updateServiceValetPrisingByZones
} from "../../../../store/reducers/serviceValet/actions";
import {IZonePriceSettings, TDistanceRange, TDistanceRangeUpdate} from "../../../../store/reducers/serviceValet/types";
import {RootState} from "../../../../store/rootReducer";
import {Loading} from "../../../UI/Loading";
import {EServiceType} from "../../../../store/reducers/appointmentFrameReducer/types";
import {EAncillaryPriceType} from "../../../../store/reducers/mobileService/types";

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
    const {pricingByDistance, pricingByZones, ancillaryPriceType, isPricingByZoneLoading, isLoading} = useSelector((state: RootState) => state.serviceValet);
    const [selectedTab, selectTab] = useState<string>("0");
    const [typeOfPrice, setTypeOfPrice] = useState<EAncillaryPriceType>(EAncillaryPriceType.Zone);
    const classes = useStyles();
    const {selectedSC} = useSCs();
    const dispatch = useDispatch();
    const {askConfirm} = useConfirm();
    const showError = useException();
    const showMessage = useMessage();

    useEffect(() => {
        if (ancillaryPriceType) {
            setTypeOfPrice(ancillaryPriceType)
        }
    }, [ancillaryPriceType])

    useEffect(() => {
        if (selectedSC) {
            dispatch(loadServiceValetPrisingByDistance(selectedSC.id))
            dispatch(loadServiceValetPrisingByZones(selectedSC.id))
            dispatch(loadServiceValetPricingOption(selectedSC.id))
        }
    }, [selectedSC])

    const onSuccess = () => {
        showMessage('New Distance Range Created')
    }

    const onError = (err:string) => {
        showError(err);
    }

    const onDeleteDistanceRange = (itemId: number) => {
        if (selectedSC) dispatch(deleteServiceValetPrisingByDistance(selectedSC.id, itemId, onError))
    }

    const onSaveDistanceRange = (item: TDistanceRangeUpdate) => {
        if (selectedSC) dispatch(updateServiceValetPrisingByDistance(selectedSC.id, item.id, item, onError))
    }

    const onAddRange = (data: TDistanceRange) => {
        if (selectedSC) {
            data.serviceCenterId = selectedSC.id;
            data.serviceType = EServiceType.PikUpDropOff;
            dispatch(addServiceValetDistanceRange(selectedSC.id, data, onSuccess, onError))
        }
    }

    const onSaveZonePricing = (data: IZonePriceSettings) => {
        if (selectedSC) dispatch(updateServiceValetPrisingByZones(selectedSC.id, data.id, data, (err) => showError(err)))
    }

    const tabs: TTab[] = [
        {
            id: "0",
            label: "Ancillary Price By Zone",
            component: <ByZone onUpdate={onSaveZonePricing} data={pricingByZones} isLoading={isLoading}/>
        },
        {
            id: "1",
            label: "Ancillary Price By Distance",
            component: <ByDistance
                data={pricingByDistance}
                isLoading={isLoading}
                onItemDelete={onDeleteDistanceRange}
                onItemSave={onSaveDistanceRange}
                onAddRange={onAddRange}
            />},
    ]
    const handleTabChange = (e: any, value: string) => {
        selectTab(value);
    }

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.persist();
        if (selectedSC) {
            askConfirm({
                title: `Please confirm you want to change the Service Valet pricing settings`,
                onConfirm: () => {
                    try {
                        const value = e.target?.value === "byZone" ? EAncillaryPriceType.Zone : EAncillaryPriceType.Distance;
                        setTypeOfPrice(value)
                        dispatch(changeServiceValetPriceSettings(selectedSC.id, value, err => showError(err)))
                    } catch (e) {
                        showError(e);
                    }
                }
            });
        }
    }

    return (
        <TablesWrapper>
            {isPricingByZoneLoading
                ? <Loading/>
                : <div className={classes.wrapper}>
                    <div className={classes.optionsTitleWrapper}>Pricing Settings: </div>
                    <RadioGroup
                        row
                        aria-label="countType"
                        name="countType"
                        value={typeOfPrice === EAncillaryPriceType.Zone ? "byZone" : "byDistance"}
                        onChange={onChange}
                    >
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
            }

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