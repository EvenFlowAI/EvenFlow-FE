import React, {ChangeEvent, useEffect, useState} from 'react';
import {Tab, Tabs as Ts, withStyles} from "@material-ui/core";
import {Done} from "@material-ui/icons";
import {TabContext, TabPanel as Tp} from "@material-ui/lab";
import {makeStyles} from "@material-ui/core/styles";
import {TPackage} from "./PackageSelection";
import {setPackage} from "../../../store/reducers/appointmentFrameReducer/actions";
import {useDispatch, useSelector} from "react-redux";
import {TExtendedComplimentary} from "../../../api/types";
import {RootState} from "../../../store/rootReducer";
import {useTranslation} from "react-i18next";
import {HtmlTooltip} from "./ServiceCard";

const style = withStyles(() => ({
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

const styled = withStyles(() => ({
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
    serviceRequestUnderlined: {
        margin: 0,
        textAlign: 'center',
        padding: 5,
        textDecoration: 'underline'
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

type TStyleProp = {
    backgroundColor?: string;
    fontSize?: number;
}

const getTitleStyle = (index: number, isBMWService: boolean): TStyleProp => {
    let style: TStyleProp = {};
    switch (index) {
        case 0:
            style = { backgroundColor: '#C0C0C0' };
            break;
        case 1:
            style = { backgroundColor: '#B18965' };
            break;
        default:
            style = { backgroundColor: '#E3CD59' };
    }
    if (isBMWService) style.fontSize = 16;
    return style;
}

const TabLabel: React.FC<TTabLabelProps> = ({ text, isSelected }) => {
    const classes = useStyles();
    return <div className={classes.iconWrapper}>{isSelected && <Done  className={classes.icon} htmlColor={'white'}/>} {text}</div>
}

const PackageSelectionMobile: React.FC<PackageSelectionMobileProps> = ({ data,isBmWService, isSanfordInfinity }) => {
    const [value, setValue] = useState<string>('1');
    const {selectedPackage} = useSelector((state: RootState) => state.appointmentFrame);
    const {scProfile} = useSelector((state: RootState) => state.appointment);
    const dispatch = useDispatch();
    const classes = useStyles();
    const {t} = useTranslation();

    useEffect(() => {
        if (selectedPackage) {
            setValue(selectedPackage.type.toString());
        } else {
            const currentPackage = data[+value];
            currentPackage && dispatch(setPackage(currentPackage));
        }
    }, [value, data, selectedPackage])

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
                      <Tab style={isBmWService ? {fontSize: 16} : {}}
                           key={item.id}
                           className={index === +value ? classes.selectedTab : classes.tabWrapper}
                           value={`${index}`}
                           label={<TabLabel text={item.name} isSelected={index === +value}/>}/>)
                  )}
              </Tabs>

                {data.map((item, index) => (
                    <TabPanel value={`${index}`} key={item.name}>
                        <div>
                            <div className={classes.packageName} style={getTitleStyle(index, isBmWService)}>{item.name}</div>
                            <div className={classes.serviceRequests}>
                                {item.serviceRequests
                                    .map(item => {
                                  return item.detailedDescription?.length
                                      ? <HtmlTooltip
                                          key={item.id}
                                          placement="top"
                                          enterTouchDelay={0}
                                          title={<div dangerouslySetInnerHTML={{__html: item.detailedDescription}}/>}
                                      >
                                          <p className={classes.serviceRequestUnderlined}
                                             style={isBmWService ? {fontSize: 18} : {}}>
                                              {item.description}
                                          </p>
                                      </HtmlTooltip>
                                      :  <p className={classes.serviceRequest}
                                            key={item.id}
                                            style={isBmWService ? {fontSize: 18} : {}}>
                                          {item.description}
                                      </p>
                                })
                                }
                            </div>

                            { scProfile?.isShowPriceDetails
                            && <div className={classes.totalMaintenance}>
                                <span style={isBmWService ? {fontSize: 16} : {}}>
                                  {t("Total Maintenance Value)")}:
                                </span>
                              <span style={{ fontSize: 20 }}>${scProfile?.isRoundPrice ? item.price : item.price.toFixed(2)}</span>
                            </div>}

                            <div className={classes.complimentaryTitle} style={isBmWService ? {fontSize: 16} : {}}>
                                {t("Complimentary")}
                            </div>

                            <div className={classes.complimentaryServices}>
                                {item.complimentaryServices
                                    .map(item => {
                                    return item.detailedDescription?.length
                                        ? <HtmlTooltip
                                            key={item.id}
                                            placement="top"
                                            enterTouchDelay={0}
                                            title={<div dangerouslySetInnerHTML={{__html: item.detailedDescription}}/>}
                                        >
                                            <p className={classes.serviceRequestUnderlined}
                                                style={isBmWService ? {fontSize: 18} : {}}>{item.name}</p>
                                        </HtmlTooltip>
                                        : <p className={classes.serviceRequest}
                                             key={item.id}
                                             style={isBmWService ? {fontSize: 18} : {}}>{item.name}</p>
                                })}
                            </div>

                            {scProfile?.isShowPriceDetails
                                ? <div className={classes.complimentaryTotal}>
                                <span style={isBmWService ? {fontSize: 16} : {}}>
                                    {t("Total Complimentary Value")}:
                                </span>
                                    {isBmWService || isSanfordInfinity
                                        ? <span style={{ fontSize: 20 }}>
                                        {item.marketPriceComplimentaryServices
                                            ? `$${scProfile?.isRoundPrice
                                                ? item.marketPriceComplimentaryServices
                                                : item.marketPriceComplimentaryServices.toFixed(2)}`
                                            : ''}
                                </span>
                                        : <span style={{ fontSize: 20 }}>
                                        {getPrice(item.complimentaryServices)
                                            ? `$${scProfile?.isRoundPrice
                                                ? getPrice(item.complimentaryServices)
                                                : getPrice(item.complimentaryServices).toFixed(2)}`
                                            : ''}
                                    </span>
                                    }
                                </div>
                                : null
                            }
                            <div className={isBmWService || isSanfordInfinity ? classes.totalSums : classes.total}>
                                {scProfile?.isShowPriceDetails &&
                                <div className={classes.prevPrice}>
                                  ${scProfile?.isRoundPrice
                                    ? item.price + item.marketPriceComplimentaryServices
                                    : (item.price + item.marketPriceComplimentaryServices).toFixed(2)}
                                </div>}

                                <div className={classes.currentWrp}>
                                    <div className={classes.triangle}/>
                                    <div className={classes.current}>
                                        ${scProfile?.isRoundPrice ? item.price : item.price.toFixed(2)}
                                    </div>
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