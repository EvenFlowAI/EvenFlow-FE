import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {TitleContainer} from "../../../Content/TitleContainer/TitleContainer";
import {Api} from "../../../../config/requests";
import {IDealershipGroupExtended} from "../../../../store/reducers/dealershipGroups/types";
import {concatAddress} from "../../../../utils/utils";
import {Tab} from "@material-ui/core";
import {TabList} from "../../../UI/Tabs";
import {TabContext, TabPanel} from "@material-ui/lab";
import {DetailSC} from "./DetailSC";
import {DetailEmployees} from "./DetailEmployees";
import {useDispatch} from "react-redux";
import {loadDealershipEmployees} from "../../../../store/reducers/employees/actions";
import {TDetailComponentProps} from "./types";
import {useStatePagination} from "../../../../utils/hooks";

type TTab = {
    id: string;
    label: string;
    component: React.FC<TDetailComponentProps>;
}

const tabs: TTab[] = [
    {id: "1", label: "Service centers", component: DetailSC},
    {id: "2", label: "Employees", component: DetailEmployees}
];

export const DealershipGroupDetail = () => {
    const {id} = useParams();
    const [dealership, setDS] = useState<IDealershipGroupExtended | undefined>();

    const dispatch = useDispatch();

    const {pageData, onChangeRowsPerPage, onChangePage} = useStatePagination();

    useEffect(() => {
        Api.call<IDealershipGroupExtended>(Api.endpoints.Dealerships.Retrieve, {urlParams: {id}})
            .then(r => {
                setDS(r.data);
            });
    }, [setDS, id]);

    useEffect(() => {
        dispatch(loadDealershipEmployees(id, pageData));
    }, [id, dispatch, pageData]);

    const [selectedTab, setTab] = useState<string>("1");
    const handleChangeTab = (e: React.ChangeEvent<{}>, tab: string) => {
        setTab(tab);
    }

    return <TabContext value={selectedTab}>
        <TitleContainer
            title={dealership?.name || ""}
            subtitle={dealership?.address ? concatAddress(dealership.address) : dealership?.mainAddress}
            pad />
        <TabList indicatorColor="primary" onChange={handleChangeTab}>
            {tabs.map((t) => {
                return <Tab label={t.label} key={t.id} value={t.id} />
            })}
        </TabList>
        {tabs.map((t) => {
            return <TabPanel style={{width: "100%"}} value={t.id} key={t.id}><t.component
                onChangePage={onChangePage}
                onChangeRowsPerPage={onChangeRowsPerPage}
                page={pageData.pageIndex}
                rowsPerPage={pageData.pageSize}
            /></TabPanel>
        })}
    </TabContext>;
}