import React, {ChangeEvent, useEffect, useState} from 'react';
import {Tab, Tabs as Ts, withStyles} from "@material-ui/core";
import {Done} from "@material-ui/icons";
import {TabContext, TabPanel as Tp} from "@material-ui/lab";
import {makeStyles} from "@material-ui/core/styles";
import {TPackage} from "./PackageSelection";
import {setPackage} from "../../../store/reducers/appointmentFrameReducer/actions";
import {useDispatch} from "react-redux";
import {TExtendedComplimentary} from "../../../api/types";

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
    isBmWService: boolean;
    isSanfordInfinity: boolean;
}

const useStyles = makeStyles(() => ({
    wrapper: {
        width: '100%',
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
        height: '33vh',
        padding: '10px 0',
        fontSize: 14,
        borderBottom: '1px solid black',
        overflow: 'auto',
    },
    totalMaintenance: {
        display: 'flex',
        justifyContent: 'space-between',
        fontWeight: 'bold',
        fontSize: 12,
        padding: '8px 12px 0 12px',
        color: '#252733',
    },
    complimentaryTitle: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontWeight: 'bold',
        fontSize: 14,
        padding: 10,
        color: "black",
        backgroundColor: '#89E5AB',
        marginTop: 16,
    },
    complimentaryServices: {
        display: 'flex',
        flexDirection: 'column',
        alignContent: 'center',
        padding: 10,
        background: '#E6FCEC',
        height: '15vh',
        overflow: 'auto',
    },
    complimentaryTotal: {
        color: '#008331',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '8px 12px 16px 12px',
        borderBottom: '1px solid black',
        fontWeight: 'bold',
    },
    totalSums: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '8px 12px 22px 12px',
        fontSize: 20,
    },
    currentWrp: {
        display: "flex",
        alignItems: "center",
        justifyContent: "stretch"
    },
    triangle: {
        width: 0,
        height: 0,
        borderTop: "10px solid transparent",
        borderBottom: "10px solid transparent",
        borderRight: "10px solid #000000",
    },
    current: {
        background: "#000000",
        color: "#FFFFFF",
        fontSize: 20,
        fontWeight: 'bold',
        padding: '0 7px',
    },
    serviceRequest: {
        margin: 0,
        textAlign: 'center',
        padding: 5,
    },
    prevPrice: {
        color: '#828282',
        textDecoration: "line-through",
        fontSize: 20,
    },
    total: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: '8px 12px 22px 12px',
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

const PackageSelectionMobile: React.FC<PackageSelectionMobileProps> = ({ data, isBmWService, isSanfordInfinity }) => {
    const [value, setValue] = useState<string>('1');
    const dispatch = useDispatch();
    const classes = useStyles();

    useEffect(() => {
        const currentPackage = data[+value];
        currentPackage && dispatch(setPackage(currentPackage));
    }, [value])

    const handleChange = (e: ChangeEvent<{}>, newValue: any): void => {
        setValue(newValue);
        const currentPackage = data[newValue];
        currentPackage && dispatch(setPackage(currentPackage));
    }

    const getPrice = (requests: TExtendedComplimentary[]): number => {
        return requests.reduce((a, b) => a + +b.price, 0)
    }

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
                            {/*{ isBmWService && <div className={classes.totalMaintenance}>*/}
                            {/*    <span>Total Maintenance Value:</span>*/}
                            {/*    <span>${item.serviceRequests.reduce((a, b) => a + +b.price, 0)}</span>*/}
                            {/*    </div>*/}
                            {/*}*/}
                            { (isBmWService || isSanfordInfinity) && <div className={classes.totalMaintenance}>
                                <span>Total Maintenance Value:</span>
                                <span style={{ fontSize: 20 }}>${item.marketPriceServiceRequests}</span>
                            </div>
                            }
                            <div className={classes.complimentaryTitle}>Complimentary</div>
                            <div className={classes.complimentaryServices}>
                                {item.complimentaryServices.map(item => <p className={classes.serviceRequest}>{item.name}</p>)}
                            </div>
                            <div className={classes.complimentaryTotal}>
                                <span>Total Complimentary Value:</span>
                                {isBmWService || isSanfordInfinity
                                    ? <span style={{ fontSize: 20 }}>{item.marketPriceComplimentaryServices ? `$${item.marketPriceComplimentaryServices}` : ''}</span>
                                    :<span style={{ fontSize: 20 }}>{getPrice(item.complimentaryServices) ? `$${getPrice(item.complimentaryServices)}` : ''}</span>
                                }
                            </div>
                            <div className={isBmWService || isSanfordInfinity ? classes.totalSums : classes.total}>
                                {(isBmWService || isSanfordInfinity) &&
                                <div className={classes.prevPrice}>
                                    ${item.marketPriceServiceRequests + item.marketPriceComplimentaryServices}
                                </div>}
                                <div className={classes.currentWrp}>
                                    <div className={classes.triangle}/>
                                    <div
                                        className={classes.current}>${Number.isInteger(item.price) ? item.price : +item.price.toFixed(2)}</div>
                                </div>
                            </div>
                        </div>
                    </TabPanel>
                ))}
            </TabContext>
            }
        </div>
    );
};

export default PackageSelectionMobile;