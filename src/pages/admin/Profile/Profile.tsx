import React, {useEffect, useState} from "react";
import {TabContext, TabPanel} from "@material-ui/lab";
import {Tab} from "@material-ui/core";
import {TabList} from "../../../components/styled/Tabs";
import {DealershipGroupProfile} from "../../../features/Profiles/DealershipGroupProfile/DealershipGroupProfile";
import {UserProfile} from "../../../features/Profiles/UserProfile/UserProfile";
import {PodsTable} from "../../../features/PodsTable/PodsTable";
import {useCurrentUser} from "../../../utils/hooks";
import {useStyles} from "./styles";
import {TTab} from "./types";

const tabs: TTab[] = [
    {label: "Dealership Group Profile", id: "1", component: DealershipGroupProfile},
    {label: "Profile", id: "2", component: UserProfile},
    {label: "Pods", id: "3", component: PodsTable}
];

export const Profile = () => {
    const [selectedTab, setTab] = useState<string>("1");
    const [tabList, setTabList] = useState<TTab[]>([]);
    const currentUser = useCurrentUser();
    const classes = useStyles();

    useEffect(() => {
        setTabList(currentUser?.role === "Owner" ? tabs : tabs.filter(item => item.id === "2"));
        if (currentUser?.role !== "Owner") setTab("2");
    }, [currentUser, tabs])

    const handleChangeTab = (e: React.ChangeEvent<{}>, tab: string) => {
        setTab(tab);
    }

    return <div className={classes.container}>
        <TabContext value={selectedTab}>
            <TabList
                variant="scrollable"
                scrollButtons="auto"
                indicatorColor="primary"
                onChange={handleChangeTab}>
                {tabList.map((t) => {
                    return <Tab label={t.label} key={t.id} value={t.id} />
                })}
            </TabList>
            {tabList.map(t => {
                return <TabPanel className={classes.panel} key={t.id} value={t.id}><t.component /></TabPanel>;
            })}
        </TabContext>
    </div>;
}