import React, {useState} from 'react';
import {TitleContainer} from "../../Content/TitleContainer/TitleContainer";
import {optimizerRoot} from "../utils";
import {TabList} from "../../UI/Tabs";
import {FormControlLabel, styled, Switch, Tab} from "@material-ui/core";
import {TabContext, TabPanel} from "@material-ui/lab";
import { PricingLevels } from './PricingLevels/PricingLevels';
import {Eligibility} from "./Eligibility/Eligibility";
import {PricingOptimization} from "./PricingOptimization";
import {VariableDemand} from "./VariableDemand";
import {useException, useMessage, useSCs} from "../../../utils/hooks";
import { changePricingOpt } from '../../../store/reducers/serviceCenters/actions';
import {useDispatch, useSelector} from "react-redux";
import {LoadingButton} from "../../UI/Button";
import {RootState} from "../../../store/rootReducer";
import {updateMaxPrice} from "../../../store/reducers/pricingSettings/actions";


const ControlLabel = styled(FormControlLabel)({
    textTransform: "uppercase",
    "& .MuiFormControlLabel-label": {
        fontWeight: "bold"
    }
})

const ButtonsWrapper = styled('div')({
    display: "flex",
    flexDirection: "column",
    gap: 10,
    alignItems: "flex-end"
})

type Tab = {
    id: string;
    label: string;
    component: JSX.Element
}
const tabs: Tab[] = [
    {id: "0", label: "Variable demand", component: <VariableDemand />},
    {id: "1", label: "Eligibility", component: <Eligibility />},
    {id: "2", label: "Pricing Levels", component: <PricingLevels />},
    {id: "3", label: "Pricing Optimization", component: <PricingOptimization />},
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
        showMessage('Max Price Updated Successfully!')
    }

    const onErrorUpdate = (err: string) => {
        showError(err);
    }

    const onUpdateMaxPriceClick = () => {
        selectedSC && dispatch(updateMaxPrice(selectedSC.id, onSuccessUpdate, onErrorUpdate))
    }

    return <TabContext value={selectedTab}>
        <TitleContainer title="Pricing Settings" pad parent={optimizerRoot} actions={
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