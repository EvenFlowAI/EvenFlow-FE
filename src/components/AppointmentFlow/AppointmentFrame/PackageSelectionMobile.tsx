import React, {ChangeEvent, Dispatch, SetStateAction, useEffect, useState} from 'react';
import {Tab, Tabs as Ts, withStyles} from "@material-ui/core";
import {Done} from "@material-ui/icons";
import {TabContext, TabPanel as Tp} from "@material-ui/lab";
import {makeStyles} from "@material-ui/core/styles";
import {Info, TPackage} from "./PackageSelection";
import { useSelector} from "react-redux";
import {EMaintenanceOptionType, IPackageOptions} from "../../../api/types";
import {RootState} from "../../../store/rootReducer";
import {useTranslation} from "react-i18next";
import TotalPriceMobile from "./PackageSelectionParts/TotalPriceMobile";
import {EPackagePricingType} from "../../../store/reducers/appointmentFrameReducer/types";
import ServiceRequestsMobile from "./PackageSelectionParts/ServiceRequestsMobile";
import TotalMaintenanceMobile from "./PackageSelectionParts/TotalMaintenanceMobile";
import IntervalUpsellsMobile from "./PackageSelectionParts/IntervalUpsellsMobile";
import ComplimentaryMobile from "./PackageSelectionParts/ComplimentaryMobile";
import TotalComplimentaryMobile from "./PackageSelectionParts/TotalComplimentaryMobile";

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
    getTitle: (type: EPackagePricingType) => string;
    withUpsells: boolean;
    selectedPackage: IPackageOptions|null;
    setLocalPackage: Dispatch<SetStateAction<IPackageOptions|null>>;
    setLocalPricingType: Dispatch<SetStateAction<EPackagePricingType|null>>;
}
export const usePackageMobileStyles = makeStyles(() => ({
    wrapper: {
        width: '100%',
        padding: 0,
        marginTop: 17,
        borderCollapse: 'collapse',
    },
    tabWrapper: {
        position: "relative",
        background: 'white',
        color: 'black',
        fontSize: 10,
        fontWeight: 'bold',
        borderBottom: '1px solid rgba(0, 0, 0, 0.15)',
        borderTop: '1px solid rgba(0, 0, 0, 0.15)',
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
        backgroundColor: '#91CFF7',
    },
    upsellTitle: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontWeight: 'bold',
        fontSize: 14,
        padding: 10,
        color: "black",
        background: "#FFD966",
    },
    complimentaryServices: {
        display: 'flex',
        flexDirection: 'column',
        alignContent: 'center',
        padding: 10,
        background: '#E5F5FF',
        overflow: 'auto',
    },
    complimentaryTotal: {
        color: '#252733',
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
        color: "#D32F2F",
        fontSize: 20,
        fontWeight: 'bold',
    },
    serviceRequest: {
        margin: 0,
        textAlign: 'center',
        padding: 5,
        fontWeight: 'bold',
    },
    serviceRequestUnderlined: {
        margin: 0,
        textAlign: 'center',
        padding: 5,
        textDecoration: 'underline'
    },
    prevPrice: {
        color: '#202021',
        textDecoration: "line-through",
        fontWeight: 'bold',
        fontSize: 20,
        marginRight: 12
    },
    total: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: '8px 12px 22px 12px',
    },
    totalName: {
        fontSize: 14,
        fontWeight: 'bold'
    },
    totalText: {
        fontSize: 14,
    },
    pricesWrapper: {
        display: 'flex',
        alignItems: 'center'
    },
    smallText: {
        fontSize: 14,
    },
    bigText: {
        fontSize: 20,
    },
    intervalUpsells: {
        background: '#FFF2CC',
        paddingBottom: 16,
    },
    info: {
        display: "inline-block",
        marginLeft: 4,
        textTransform: "none",
        fontWeight: "bold",
        paddingTop: 12,
    },
    wrapperWithBorder: {
        border: '1px solid rgba(0, 0, 0, 0.15)'
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
    const classes = usePackageMobileStyles();
    return <div className={classes.iconWrapper}>{isSelected && <Done  className={classes.icon} htmlColor={'white'}/>} {text}</div>
}

const PackageSelectionMobile: React.FC<PackageSelectionMobileProps> = ({
                                                                           getTitle,
                                                                           data,
                                                                           isBmWService,
                                                                           withUpsells,
                                                                           selectedPackage,
    setLocalPackage,
                                                                           setLocalPricingType
                                                                       }) => {
    const [value, setValue] = useState<string>('1');
    const {scProfile} = useSelector((state: RootState) => state.appointment);
    const classes = usePackageMobileStyles();
    const {t} = useTranslation();

    useEffect(() => {
        if (selectedPackage) {
            setValue(selectedPackage.type.toString());
        } else {
            const currentPackage = data[+value];
            if (currentPackage) {
                setLocalPackage(currentPackage)
            } else {
                if (data.length) {
                    setLocalPackage(data[0])
                    setValue('0')
                }
            }
        }
    }, [selectedPackage, data])

    const handleChange = (e: ChangeEvent<{}>, newValue: any): void => {
        setValue(newValue);
        const currentPackage = data[newValue];
        currentPackage && setLocalPackage(currentPackage);
    }

    const handleClick = (type: EMaintenanceOptionType, pricing?: EPackagePricingType) => {
        const p = data.find(item => item.type === type);
        if (p) setLocalPackage(p);
        setLocalPricingType(pricing ?? EPackagePricingType.BasePrice)
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
                            <div className={classes.wrapperWithBorder}>
                                <div className={classes.packageName} style={getTitleStyle(index, isBmWService)}>{item.name}</div>

                                <ServiceRequestsMobile isBmWService={isBmWService} serviceRequests={item.serviceRequests}/>

                                <TotalMaintenanceMobile item={item}/>

                                <IntervalUpsellsMobile intervalUpsells={item.intervalUpsells} isBmWService={isBmWService}/>

                                <ComplimentaryMobile isBmWService={isBmWService} complimentaryServices={item.complimentaryServices}/>

                                <TotalComplimentaryMobile item={item}/>

                            </div>
                        </TabPanel>
                    ))}
                </TabContext>
            }
            {withUpsells && Boolean(getTitle(EPackagePricingType.BasePrice).length)
                ? <div style={{fontWeight: "bold"}}>{t("Total")}<span className={classes.info}> ({t("Excluding taxes & fees")}):</span></div>
                : null}
            {selectedPackage ? <React.Fragment>
                <TotalPriceMobile
                    withUpsells={withUpsells}
                    isUpsellPrice={false}
                    handleClick={handleClick}
                    type={selectedPackage.type}
                    text={getTitle(EPackagePricingType.BasePrice)}
                    price={selectedPackage.price}
                    totalMaintenanceValue={selectedPackage.totalMaintenanceValue}
                    complimentaryPrice={selectedPackage.marketPriceComplimentaryServices}
                />
                {withUpsells
                    ? <TotalPriceMobile
                        isUpsellPrice
                        withUpsells={withUpsells}
                        handleClick={handleClick}
                        type={selectedPackage.type}
                        text={getTitle(EPackagePricingType.PriceWithFee)}
                        price={selectedPackage.price}
                        totalMaintenanceValue={selectedPackage.totalMaintenanceValue}
                        complimentaryPrice={selectedPackage.marketPriceComplimentaryServices}
                        upsellPrice={selectedPackage.marketPriceIntervalUpsells}
                    />
                    : null}
            </React.Fragment> : null}
            <Info style={{paddingTop: 8}}>
                {scProfile?.maintenancePackageDisclaimer
                    ? scProfile.maintenancePackageDisclaimer.split('\n').map(line => <div key={line}>{line}</div>)
                    :  isBmWService
                        ? t("Please ask your service advisor")
                        : t("The maintenance packages may not be available")
                }
            </Info>
        </div>
    );
};

export default PackageSelectionMobile;