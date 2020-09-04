import React, {useState} from "react";
import {makeStyles} from "@material-ui/core/styles";
import {TabContext, TabPanel} from "@material-ui/lab";
import {Tab} from "@material-ui/core";
import {TabList} from "../../UI/Tabs";
import {DealershipGroupProfile} from "./DealershipGroupProfile";
import {UserProfile} from "./UserProfile";

const useStyles = makeStyles({
    container: {
        width: "100%",
        marginTop: 20
    },
    panel: {
        // padding: "20px 0"
    }
});

type TTab = {
    id: string;
    label: string;
    component: React.ComponentType
}
const tabs: TTab[] = [
    {label: "Dealership Group Profile", id: "1", component: DealershipGroupProfile},
    {label: "Profile", id: "2", component: UserProfile}
];

export const Profile = () => {
    const [selectedTab, setTab] = useState<string>("1");
    const handleChangeTab = (e: React.ChangeEvent<{}>, tab: string) => {
        setTab(tab);
    }

    const classes = useStyles();
    return <div className={classes.container}>
        <TabContext value={selectedTab}>
            <TabList indicatorColor="primary" onChange={handleChangeTab}>
                {tabs.map((t) => {
                    return <Tab label={t.label} key={t.id} value={t.id} />
                })}
            </TabList>
            {tabs.map(t => {
                return <TabPanel className={classes.panel} key={t.id} value={t.id}><t.component /></TabPanel>;
            })}
        </TabContext>
    </div>;
}