import React, {useState} from 'react';
import {TitleContainer} from "../../../components/TitleContainer/TitleContainer";
import {TabList} from "../../../components/styled/Tabs";
import {Switch, Tab} from "@material-ui/core";
import {TabContext, TabPanel} from "@material-ui/lab";
import { PricingLevels } from '../../../features/admin/PricingLevels/PricingLevels';
import {Eligibility} from "../../../features/admin/Eligibility/Eligibility";
import {PricingOptimization} from "../../../features/admin/PricingOptimization/PricingOptimization";
import {VariableDemand} from "../../../features/admin/VariableDemand/VariableDemand";
import { changePricingOpt } from '../../../store/reducers/serviceCenters/actions';
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import {updateMaxPrice} from "../../../store/reducers/pricingSettings/actions";
import {ButtonsWrapper, ControlLabel} from "./styles";
import {pricingRoot} from "../../../utils/constants";
import {LoadingButton} from "../../../components/LoadingButton/LoadingButton";

import {useMessage} from "../../../hooks/useMessage/useMessage";
import {useException} from "../../../hooks/useException/useException";
import {useSCs} from "../../../hooks/useSCs/useSCs";

type Tab = {
    id: string;
    label: string;
    component: JSX.Element
}

const tabs: Tab[] = [
    {id: "0", label: "Variable Demand", component: <VariableDemand />},
    {id: "1", label: "Eligibility", component: <Eligibility />},
    {id: "2", label: "Pricing Levels", component: <PricingLevels />},
    {id: "3", label: "Price Calculations", component: <PricingOptimization />},
]

export const PricingSettingsPage = () => {
    const [selectedTab, selectTab] = useState<string>("0");
    const [saving, setSaving] = useState<boolean>(false);
    const {selectedSC} = useSCs();
    const { isLoading } = useSelector((state: RootState) => state.pricingSettings);
    const dispatch = useDispatch();
    const showError = useException();
    const showMessage = useMessage();

    const handleTabChange = (e: any, value: string) => {
        selectTab(value);
    }
    const handlePricingOptChange = async (e: any, checked: boolean) => {
        if (selectedSC) {
            try {
                setSaving(true);
                await dispatch(changePricingOpt(selectedSC.id, checked));
            } catch (e) {
                showError(e);
            } finally {
                setSaving(false);
            }
        }
    }

    const onSuccessUpdate = () => {
        showMessage('Max Price updated')
    }

    const onErrorUpdate = (err: string) => {
        showError(err);
    }

    const onUpdateMaxPriceClick = () => {
        selectedSC && dispatch(updateMaxPrice(selectedSC.id, onSuccessUpdate, onErrorUpdate))
    }

    return <TabContext value={selectedTab}>
        <TitleContainer title="Service Price Settings" pad parent={pricingRoot} actions={
            <ButtonsWrapper>
            <ControlLabel labelPlacement="start" control={
                <Switch
                    color="primary"
                    disabled={saving}
                    checked={selectedSC?.applyPricingOptimization ?? false}
                    onChange={handlePricingOptChange}
                />
            } label={"Pricing optimization"} />
                <LoadingButton loading={isLoading} onClick={onUpdateMaxPriceClick}>
                    Update Max Price
                </LoadingButton>
            </ButtonsWrapper>
        } />
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
                style={{width: "100%", padding: "24px 0"}}
                key={t.id}
                value={t.id}>
                {t.component}
            </TabPanel>
        })}
    </TabContext>
};