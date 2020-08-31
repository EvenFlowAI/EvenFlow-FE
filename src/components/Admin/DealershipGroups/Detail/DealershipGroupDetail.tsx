import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {TitleContainer} from "../../../Content/TitleContainer/TitleContainer";
import {Api} from "../../../../config/requests";
import {IDealershipGroupExtended} from "../../../../store/reducers/dealershipGroups/types";
import {concatAddress} from "../../../../utils/utils";
import {Tab} from "@material-ui/core";
import {TabList} from "../../../UI/Tabs";
import {TabContext, TabPanel} from "@material-ui/lab";
import {DetailSC, TDetailSCProps} from "./DetailSC";
import {DetailEmployees, TDetailEmployeesProps} from "./DetailEmployees";
import {IPageRequest} from "../../../../types/types";
import {defaultRowsPerPage} from "../../../../config/config";
import {useDispatch} from "react-redux";
import {loadDealershipEmployees} from "../../../../store/reducers/employees/actions";
import {useStatePagination} from "../../../../utils/hooks";

type TTab = {
    id: string;
    label: string;
    component: React.FC<TDetailEmployeesProps> | React.FC<TDetailSCProps>;
}

const tabs: TTab[] = [
    {id: "1", label: "Service centers", component: DetailSC},
    {id: "2", label: "Employees", component: DetailEmployees}
];
const initialPageData: IPageRequest = {
    pageIndex: 0,
    pageSize: defaultRowsPerPage
}
export const DealershipGroupDetail = () => {
    const {id} = useParams();
    const [dealership, setDS] = useState<IDealershipGroupExtended | undefined>();
    const {page, setPage, rowsPerPage, setRowsPerPage} = useStatePagination();

    const dispatch = useDispatch();

    useEffect(() => {
        Api.call<IDealershipGroupExtended>(Api.endpoints.Dealerships.Retrieve, {urlParams: {id}})
            .then(r => {
                setDS(r.data);
            });
    }, [setDS, id]);

    useEffect(() => {
        dispatch(loadDealershipEmployees(id, {pageIndex: page, pageSize: rowsPerPage}));
    }, [id, dispatch]);

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
            return <TabPanel value={t.id} key={t.id}><t.component /></TabPanel>
        })}
    </TabContext>;
}