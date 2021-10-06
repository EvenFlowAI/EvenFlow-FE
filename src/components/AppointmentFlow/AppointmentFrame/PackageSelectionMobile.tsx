import React, {ChangeEvent, useEffect, useState} from 'react';
import {Tab, Tabs as Ts, withStyles} from "@material-ui/core";
import {Done} from "@material-ui/icons";
import {TabContext, TabPanel} from "@material-ui/lab";
import {makeStyles} from "@material-ui/core/styles";
import {useParams} from "react-router-dom";
import {loadPackages} from "../../../store/reducers/appointmentFrameReducer/actions";
import {useDispatch} from "react-redux";
import {TPackage} from "./PackageSelection";

const style = withStyles(theme => ({
    root: {
        padding: 0,
        borderBottom: `none`,
        "& .MuiTab-root": {
            fontSize: 12,
            fontWeight: "bold",
            textTransform: "uppercase",
        },
        "& .MuiTabs-indicator": {
            height: 0
        },
        "& .MuiButtonBase-root": {
            padding: 4,
        },
        "& .MuiSvgIcon-root": {
            verticalAlign: 'middle'
        },
    },
    indicator: {
        backgroundColor: 'transparent'
    }
}));

const Tabs = style(Ts);

type TTabLabelProps = {
    text: string;
    isSelected: boolean;
}

type PackageSelectionMobileProps = {
    data: TPackage[];
}

const useStyles = makeStyles(() => ({
    wrapper: {
        padding: 0,
        marginTop: 17,
        border: '1px solid rgba(0, 0, 0, 0.15)'
    },
    tabWrapper: {
        // display: 'flex',
        // justifyContent: 'flex-start',
        // alignItems: 'center',
        background: 'white',
        color: 'black',
        fontSize: 10,
        fontWeight: 'bold',
    },
    selectedTab: {
        background: 'black',
        color: 'white',
        fontSize: 10,
        fontWeight: 'bold',
    },
    iconWrapper: {
        '& > svg': {
            fontSize: 16,
            verticalAlign: 'middle'
        },
    }
}))

const TabLabel: React.FC<TTabLabelProps> = ({ text, isSelected }) => {
    const classes = useStyles();
    return <div className={classes.iconWrapper}>{isSelected && <Done htmlColor={'white'}/>} {text}</div>
}

const PackageSelectionMobile: React.FC<PackageSelectionMobileProps> = ({ data }) => {
    const [value, setValue] = useState<string>('1');
    const {id} = useParams();
    const dispatch = useDispatch();
    const classes = useStyles();

    const handleChange = (e: ChangeEvent<{}>, newValue: any): void => {
        setValue(newValue);
    }

    useEffect(() => {
        if (id) dispatch(loadPackages(id))
    }, [id])

    return (
        <div className={classes.wrapper}>
            {data?.length &&
            <TabContext value={value}>
                <Tabs
                    value={value}
                    onChange={handleChange}
                    variant="fullWidth"
                    aria-label="icon tabs example">
                    {data.map((item, index) => (
                        <Tab
                        className={index === +value ? classes.selectedTab : classes.tabWrapper}
                        value={`${index}`}
                        label={<TabLabel text={item.name} isSelected={index === +value}/>}/>)
                    )}
                </Tabs>
                {data.map((item, index) => (
                    <TabPanel value={`${index}`}>{item.name}</TabPanel>
                ))}
            </TabContext>
            }
        </div>
    );
};

export default PackageSelectionMobile;