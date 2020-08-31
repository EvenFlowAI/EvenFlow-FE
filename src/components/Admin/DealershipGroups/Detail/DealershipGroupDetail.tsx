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
import {defaultRowsPerPage} from "../../../../config/config";

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

    const changePageCb = (pageIndex: number, pageSize: number) => {
        dispatch(loadDealershipEmployees(id, {pageIndex, pageSize}));
    }
    const changePageSizeCb = (pageSize: number) => {
        dispatch(loadDealershipEmployees(id, {pageIndex: 0, pageSize}));
    }

    const dispatch = useDispatch();

    useEffect(() => {
        Api.call<IDealershipGroupExtended>(Api.endpoints.Dealerships.Retrieve, {urlParams: {id}})
            .then(r => {
                setDS(r.data);
            });
    }, [setDS, id]);

    useEffect(() => {
        dispatch(loadDealershipEmployees(id, {pageIndex: 0, pageSize: defaultRowsPerPage}));
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
            return <TabPanel style={{width: "100%"}} value={t.id} key={t.id}><t.component
                onChangePage={changePageCb}
                onChangeRowsPerPage={changePageSizeCb}
            /></TabPanel>
        })}
    </TabContext>;
}