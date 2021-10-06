import React, {ChangeEvent, useEffect, useState} from 'react';
import {Tab, Tabs as Ts, withStyles} from "@material-ui/core";
import {Done} from "@material-ui/icons";
import {TabContext, TabPanel as Tp} from "@material-ui/lab";
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

const styled = withStyles(theme => ({
    root: {
        padding: 0,
    }
}));

const Tabs = style(Ts);
const TabPanel = styled(Tp);

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
        border: '1px solid rgba(0, 0, 0, 0.15)',
        borderCollapse: 'collapse',
    },
    tabWrapper: {
        position: "relative",
        background: 'white',
        color: 'black',
        fontSize: 10,
        fontWeight: 'bold',
        borderBottom: '1px solid rgba(0, 0, 0, 0.15)',
        '&:not(:last-child), &:not(:first-child)': {
            borderRight: '1px solid rgba(0, 0, 0, 0.15)',
            borderLeft: '1px solid rgba(0, 0, 0, 0.15)',
        }
    },
    selectedTab: {
        background: 'black',
        color: 'white',
        fontSize: 10,
        fontWeight: 'bold',
        border: '1px solid black',
    },
    iconWrapper: {
        '& > svg': {
            fontSize: 16,
            verticalAlign: 'middle'
        },
    },
    icon: {
        position: "absolute",
        top: '30%',
        left: 7
    },
    contentWrapper: {

    },
    packageName: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontWeight: 'bold',
        padding: 10,
        color: "black"
    },
    serviceRequests: {
        display: 'flex',
        flexDirection: 'column',
        padding: 10,
    },
    totalMaintenance: {

    },
    complimentaryTitle: {

    },
    complimentaryServices: {
        display: 'flex',
        flexDirection: 'column',
        alignContent: 'center',
        padding: 16,
    },
    complimentaryTotal: {

    },
    totalSums: {

    },
    serviceRequest: {
        margin: 0,
        textAlign: 'center',
        padding: 5,
    }
}))

const getTitleStyle = (index: number): object => {
    switch (index) {
        case 0:
            return { backgroundColor: '#C0C0C0' };
        case 1:
            return { backgroundColor: '#B18965' };
        default:
            return { backgroundColor: '#E3CD59' };
    }
}

const TabLabel: React.FC<TTabLabelProps> = ({ text, isSelected }) => {
    const classes = useStyles();
    return <div className={classes.iconWrapper}>{isSelected && <Done  className={classes.icon} htmlColor={'white'}/>} {text}</div>
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
                    <TabPanel value={`${index}`}>
                        <div className={classes.contentWrapper}>
                            <div className={classes.packageName} style={getTitleStyle(index)}>{item.name}</div>
                            <div className={classes.serviceRequests}>
                                {item.serviceRequests.map(item => <p className={classes.serviceRequest}>{item.description}</p>)}
                            </div>
                            <div className={classes.totalMaintenance}>Total Maintenance Value:</div>
                            <div className={classes.complimentaryTitle}>Complimentary</div>
                            <div className={classes.complimentaryServices}>
                                {item.complimentaryServices.map(item => item.name)}
                            </div>
                            <div className={classes.complimentaryTotal}>Total Complimentary Value:</div>
                            <div className={classes.totalSums}/>
                        </div>
                    </TabPanel>
                ))}
            </TabContext>
            }
        </div>
    );
};

export default PackageSelectionMobile;