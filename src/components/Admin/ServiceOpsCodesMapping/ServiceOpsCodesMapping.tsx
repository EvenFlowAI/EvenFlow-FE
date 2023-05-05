import React, {useEffect, useState} from 'react';
import {TitleContainer} from "../../Content/TitleContainer/TitleContainer";
import {TabContext} from "@material-ui/lab";
import {TabList} from "../../UI/Tabs";
import {Tab} from "@material-ui/core";
import {useDispatch} from "react-redux";
import {
    loadCategoriesByPage,
    setCategoriesFilter,
    setCategoriesPage
} from "../../../store/reducers/categories/actions";
import {useSCs} from "../../../utils/hooks";
import {bookingFlowRoot} from "../../Optimizer/utils";
import CategoriesTablePage from "./CategoriesTablePage";
import {EServiceType} from "../../../store/reducers/appointmentFrameReducer/types";

const tabNames = [
    "Visit Center (Page 1)",
    "Visit Center (Page 2)",
    "Mobile Service (Page 1)",
    "Mobile Service (Page 2)"
];

export const visitCenterTabs = ["0", "1"];

const ServiceOpsCodesMapping = () => {
    const [selectedTab, setTab] = useState<string>("0");
    const dispatch = useDispatch();
    const {selectedSC} = useSCs();

    useEffect(() => {
        selectedSC && dispatch(loadCategoriesByPage(EServiceType.VisitCenter));
        return () => setTab("0")
    }, [selectedSC])

    const handleTabChange = async (e: React.ChangeEvent<{}>, tab: string) => {
        setTab(tab);
        const isVisitCenter = visitCenterTabs.includes(tab);
        await dispatch(setCategoriesFilter(isVisitCenter ? EServiceType.VisitCenter : EServiceType.MobileService))
        await dispatch(setCategoriesPage(+tab % 2));
        await dispatch(loadCategoriesByPage(isVisitCenter ? EServiceType.VisitCenter : EServiceType.MobileService));
    }

    return (
            <TabContext value={selectedTab}>
            <TitleContainer title="Service Ops Codes Mapping" pad parent={bookingFlowRoot}/>
            <TabList
                onChange={handleTabChange}
                variant="scrollable"
                scrollButtons="auto"
                indicatorColor="primary"
            >
                {tabNames.map((name, index) => <Tab label={name} value={`${index}`} key={name}/>)}
            </TabList>
                {tabNames.map((name, index) => <CategoriesTablePage tabValue={`${index}`} key={name}/>)}
        </TabContext>
    );
};

export default ServiceOpsCodesMapping;