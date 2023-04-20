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
    "Visit Center Booking Flow (Page 1)",
    "Visit Center Booking Flow (Page 2)",
    "Mobile Service Booking Flow (Page 1)",
    "Mobile Service Booking Flow (Page 2)"
];

const ServiceOpsCodesMapping = () => {
    const [selectedTab, setTab] = useState<string>("0");
    const dispatch = useDispatch();
    const {selectedSC} = useSCs();

    useEffect(() => {
        selectedSC && dispatch(loadCategoriesByPage());
    }, [selectedSC])

    const handleTabChange = async (e: React.ChangeEvent<{}>, tab: string) => {
        setTab(tab);
        const firstPage = (+tab === 0) || (+tab === 2);
        await dispatch(setCategoriesFilter(+tab > 1 ? EServiceType.MobileService : EServiceType.VisitCenter))
        await dispatch(setCategoriesPage(firstPage ? 0 : 1));
        await dispatch(loadCategoriesByPage());
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
                {tabNames.map((name, index) => <Tab label={name} value={`${index}`}/>)}
            </TabList>
                {tabNames.map((name, index) => <CategoriesTablePage tabValue={`${index}`}/>)}
        </TabContext>
    );
};

export default ServiceOpsCodesMapping;