import React, {useState} from "react";
import {makeStyles} from "@material-ui/core/styles";
import {TabContext} from "@material-ui/lab";
import {Tab} from "@material-ui/core";
import {TabList} from "../../UI/Tabs";

const useStyles = makeStyles({
    container: {
        width: "100%",
        marginTop: 20
    }
});

type TTab = {
    id: string;
    label: string;
}
const tabs: TTab[] = [
    {label: "Dealership Group Profile", id: "1"},
    {label: "Profile", id: "2"}
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
        </TabContext>
    </div>;
}