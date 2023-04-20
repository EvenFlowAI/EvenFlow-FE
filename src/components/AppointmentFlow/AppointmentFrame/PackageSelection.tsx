import React, {useEffect, useMemo, useState} from 'react';
import {PackagesStepWrapper} from "./StepWrapper";
import {Actions} from "./Actions";
import {styled, Theme, useMediaQuery, useTheme} from "@material-ui/core";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import {
    setAdditionalServicesChosen,
    setPackage,
    setPackageIsSelected,
    setPackagePricingType,
    setSelectedPackageOptionType, setSelectedPackagePriceTitles
} from "../../../store/reducers/appointmentFrameReducer/actions";
import {useParams} from "react-router-dom";
import {Api} from "../../../config/requests";
import {decodeSCID} from "../../../utils/utils";
import {NoItemsLoading} from "../../UI/NoItemsLoading";
import {
    EServiceCenterName,
    IPackage,
    IPackageOptions,
    TExtendedComplimentary,
    TExtendedService,
    TUpsellOfOption
} from "../../../api/types";
import PackageSelectionMobile from "./PackageSelectionMobile";
import ReactGA from "react-ga";
//import ReactGA from "react-ga4";
import {useModal} from "../../../utils/hooks";
import ConfirmChangeOption from "../../Modals/ConfirmChangeOption/ConfirmChangeOption";
import AskAddService from "../../Modals/AskAddService/AskAddService";
import {getPackagesData} from "./utils";
import PackageTitles from "./PackageSelectionParts/PackageTitles";
import IncludedInPackage from "./PackageSelectionParts/IncludedInPackage";
import TotalMaintenance from "./PackageSelectionParts/TotalMaintenance";
import Complimentary from "./PackageSelectionParts/Complimentary";
import TotalComplimentary from "./PackageSelectionParts/TotalComplimentary";
import {useTranslation} from "react-i18next";
import {TArgCallback} from "../../../types/types";
import {TScreen} from "../../Layout/types";
import {TServiceTypeSettings} from "../../../store/reducers/bookingFlowConfig/types";
import IntervalUpsells from "./PackageSelectionParts/IntervalUpsells";
import TotalPriceRow from "./PackageSelectionParts/TotalPriceRow";
import TotalPriceWithFeeRow from "./PackageSelectionParts/TotalPriceWithFeeRow";
import {EPackagePricingType} from "../../../store/reducers/appointmentFrameReducer/types";

const border = '1px solid #DADADA';

type TWithPackages = {
    packages: number[];
}

export type TService = TWithPackages & TExtendedService;
export type TComplimentary = TWithPackages & TExtendedComplimentary;
export type TUpsell = TWithPackages & TUpsellOfOption;
export type TPackage = {
    lastIdx?: number;
    moreIdx?: number[];
} & IPackageOptions;

const Wrapper = styled('div')<Theme, { count: number }>(({theme, count}) => ({
    display: "grid",
    marginTop: 12,
    gap: "0 16px",
    gridTemplateColumns: count === 3
        ? `2fr repeat(${count}, 1fr)`
        : count === 2
            ? '1fr 1fr 1fr'
            : '1fr 1fr',
    width: "100%",
    alignItems: "stretch",
    [theme.breakpoints.down('sm')]: {
        overflowX: "auto"
    },

    "& .currentWrp": {
        flexBasis: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "stretch"
    },
    "& > div": {
        textAlign: "center",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderBottom: border,
        padding: '2px 8px',
        fontWeight: "bold",
        borderLeft: border,
        borderRight: border,
        cursor: "pointer",
        transition: "all .2s",
        [theme.breakpoints.down("xs")]: {
            minWidth: "180px"
        },
        "&.selected": {
            borderLeftColor: "#000000",
            borderRightColor: "#000000",
            "&.top": {
                borderTopColor: "#000000"
            },
            "&.end": {
                borderBottomColor: "#000000"
            },
            "&.title": {
                background: "#000000",
                color: "#FFFFFF"
            },
            "& .triangle": {
                width: 0,
                height: 0,
                borderTop: "14px solid transparent",
                borderBottom: "14px solid transparent",
            },
            "& .current": {
                background: "#D32F2F",
                color: "#FFFFFF",
            }
        },
        '&.top': {
            borderTop: border,
        },
        '&:nth-child(4n+1)': {
            justifyContent: "center",
            cursor: "default",
        },
        "&.gray": {
            background: "#DADADA",
        },
        "&.title": {
            padding: 20,
            fontSize: 20,
            textTransform: "uppercase"
        },
        "&.subtitle": {
            textTransform: "uppercase",
            justifyContent: "flex-end",
        },
        "&.service": {
            justifyContent: "center",
            padding: "6px 8px",
        },
        "&.serviceWithInfo": {
            display: 'flex',
            justifyContent: "flex-end",
            alignItems: 'center',
            padding: "6px 8px",
            textAlign: 'right',
        },
        "&.green": {
            background: "#E5F5FF"
        },
        "&.yellow": {
            background: "#FFF2CC"
        },
        "&.lgray": {
            background: "#EFEFEF",
        },
        "&.green.subtitle": {
            background: "#91CFF7"
        },
        "&.yellow.subtitle": {
            background: "#FFD966"
        },
        "&.totalMaintenance": {
            justifyContent: "flex-end",
            fontWeight: 'bold',
            borderTop: border,
            paddingBottom: 10,
            fontSize: 14,
        },
        "&.last": {
            borderBottomColor: "#000000",
        },
        "&.totalComplimentary": {
            justifyContent: "center",
            padding: "16px 8px",
            color: "#202021",
        },
        "&.complimentaryTitle": {
            justifyContent: "flex-end",
            borderBottomColor: "#000000",
        },
        "&.total": {
            justifyContent: "flex-end",
            padding: 8,
            "&>.info": {
                display: "inline-block",
                marginLeft: 4,
                textTransform: "none",
                fontWeight: "normal",
            }
        },
        "&.price": {
            display: "grid",
            gridTemplateColumns: "repeat(1, 1fr)",
            alignItems: "center",
            justifyContent: "center",
            "& .current": {
                flexGrow: 1,
                fontSize: 20,
                color: '#000000'
            },
            "&.selected": {
                "& .current": {
                    background: "#000000",
                    color: "#FFFFFF",
                },
                "& .triangle": {
                    borderRight: "14px solid #000000",
                },
            }
        },
        '&.priceWithBefore': {
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            alignItems: "center",
            justifyContent: "center",
            "&>.before": {
                textDecoration: "line-through",
                fontWeight: "bold",
                color: "#000000",
                fontSize: 20,
            },
            "& .current": {
                flexGrow: 1,
                fontSize: 20,
                color: '#D32F2F'
            },
            "&.selected": {
                "& .current": {
                    background: "#D32F2F",
                    color: "#FFFFFF",
                },
                "& .triangle": {
                    borderRight: "14px solid #D32F2F",
                },
            }
        },
    }
}));

const Info = styled("div")({
    width: '100%',
    display: 'flex',
    justifyContent: 'flex-start',
    fontSize: 14,
    color: "#808080",
})

const FeesText = styled('div')<Theme, { count: number }>(({theme, count}) => ({
    width: "100%",
    display: "grid",
    gap: "0 16px",
    gridTemplateColumns: count === 3
        ? `2fr repeat(${count}, 1fr)`
        : count === 2
            ? '1fr 1fr 1fr'
            : '1fr 1fr',
    alignItems: "stretch",
    justifyItems: 'flex-end',
    fontSize: 16,
    fontWeight: 'bold',
    [theme.breakpoints.down('sm')]: {
        overflowX: "auto"
    },
}))

type TPackageSelectionProps = {
    onNext: TArgCallback<TScreen>;
    onBack: () => void;
    currentConfig: TServiceTypeSettings|undefined;
    onAddServices: () => void;
}

export const PackageSelection: React.FC<TPackageSelectionProps> = ({onBack, onNext, onAddServices, currentConfig}) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [loadedPackages, setPackages] = useState<IPackage[]>([]);
    const {selectedSR, scProfile} = useSelector((state: RootState) => state.appointment);
    const {
        selectedPackage,
        selectedVehicle,
        maintenanceDetails,
        packageIsSelected,
        service,
        subService,
        packageOptionType,
    } = useSelector((state: RootState) => state.appointmentFrame);

    const theme = useTheme();
    const { isOpen, onOpen, onClose } = useModal();
    const { isOpen: isAdditionalOpen, onOpen: onAdditionalOpen, onClose: onAdditionalClose } = useModal();
    const isXs = useMediaQuery(theme.breakpoints.down('xs'));
    const {t} = useTranslation();

    const isBmWService = useMemo(() => scProfile?.serviceCenterFlag === EServiceCenterName.BMWSchererville
        || scProfile?.serviceCenterFlag === EServiceCenterName.DealertrackTest, [scProfile]);
    const isSanfordInfinity = useMemo(() => scProfile?.serviceCenterFlag === EServiceCenterName.SanfordInfiniti,[scProfile]);
    const isRiverviewFord = useMemo(() => scProfile?.serviceCenterFlag === EServiceCenterName.RiverviewFord, [scProfile])

    const [packages, services, complimentary, upsells]: [TPackage[], TService[], TComplimentary[], TUpsell[]] = useMemo(() => getPackagesData(loadedPackages),
        [loadedPackages]);

    const dispatch = useDispatch();
    const {id} = useParams();

    useEffect(() => {
        setLoading(true);
        Api.call<IPackage[]>(
            Api.endpoints.MaintenancePackages.ByVehicle,
            {
                data: {
                    serviceCenterId: decodeSCID(id),
                    vehicle: {
                        ...selectedVehicle,
                        mileage: selectedVehicle?.mileage ?? maintenanceDetails.mileage
                    }
                }
            }
        )
            .then(({data}) => {
                setPackages(data);
                if (data.length) dispatch(setSelectedPackagePriceTitles((data[0].priceTitles)))
            })
            .catch(() => {
                setPackages([]);
            })
            .finally(() => {setLoading(false)})

    }, [id, selectedVehicle, maintenanceDetails]);

    const setClasses = (id: number, cls: string): string => {
        if (id === selectedPackage?.id) {
            return `${cls} selected`;
        }
        return cls;
    }

    const handleBack = (): void => {
        ReactGA.event({
            category: 'EvenFlow User',
            action: 'Went back',
            label: 'From Selection Package Page',
        })
        onBack();
    }

    const addServices = (): void => {
        dispatch(setAdditionalServicesChosen(true));
        if (onAddServices) onAddServices();
    }

    const handleNextScreen = (): void => {
        onNext(currentConfig?.advisorSelection
            ? 'consultantSelection'
            : currentConfig?.appointmentSelection
                ? 'appointmentTiming'
                : "appointmentSelection")
    }

    const askAdditionalServices = (): void => {
        const categoryChosen = service?.type === 0 || subService?.type === 0;
        if (!categoryChosen || !selectedSR.length) {
            onAdditionalOpen();
        } else {
            handleNextScreen();
        }
    }

    const onSave = async () => {
        selectedPackage && dispatch(setSelectedPackageOptionType(selectedPackage.type));
        await onClose();
        await askAdditionalServices();
    }

    const handleGA = (selectedPackage: IPackageOptions): void => {
        const packageOptions = ['Good', 'Better', 'Best'];
        ReactGA.event({
            category: 'EvenFlow User',
            action: `Selected Package`,
            label: `With ${packageOptions[selectedPackage.type]} Option`,
        });
    }

    const handleNext = (selectedPackage: IPackageOptions|null): void => {
        if (selectedPackage) {
            dispatch(setPackageIsSelected(true));
            handleGA(selectedPackage);
            if (packageIsSelected && packageOptionType !== null && packageOptionType !== selectedPackage.type) {
                onOpen();
            } else {
                askAdditionalServices();
                dispatch(setSelectedPackageOptionType(selectedPackage.type));
            }
        }
    }

    const handleClick = (p: IPackageOptions, pricing?: EPackagePricingType) => () => {
        dispatch(setPackage(p));
        dispatch(setPackagePricingType(pricing ?? EPackagePricingType.BasePrice));
        //handleNext(p);
    }

    const handleDontChangeOption = (): void => {
        const prevPackage = packages.find(p => p.type === packageOptionType);
        if (prevPackage) dispatch(setPackage(prevPackage));
        onClose();
    }

    const handleYes = (): void => {
        onAdditionalClose();
        addServices();
    }

    const handleNo = (): void => {
        onAdditionalClose();
        handleNextScreen();
    }

    const getTitle = (type: EPackagePricingType) => {
        let title = '';
        if (loadedPackages[0]) {
            const price = loadedPackages[0].priceTitles?.find(el => el.type === type);
            if (price) title = price.title;
        }
        return title;
    }

    return (
        <PackagesStepWrapper>
            <NoItemsLoading
                wrapperStyles={{marginTop: 20}}
                items={packages}
                loading={loading}
                label={t("There are no packages available")}
            />
            {packages.length ? <React.Fragment>
                {isXs
                    ? <PackageSelectionMobile
                        getTitle={getTitle}
                        data={packages}
                        isBmWService={isBmWService}
                        isSanfordInfinity={isSanfordInfinity}
                    />
                    : <React.Fragment>
                        <Wrapper count={packages.length}>
                            <PackageTitles
                                packages={packages}
                                handleClick={handleClick}
                                setClasses={setClasses}/>

                            <IncludedInPackage
                                packages={packages}
                                services={services}
                                handleClick={handleClick}
                                setClasses={setClasses}
                                isBmWService={isBmWService}
                                isRiverviewFord={isRiverviewFord}
                            />

                            {scProfile?.isShowPriceDetails
                                && <TotalMaintenance
                                    isBmWService={isBmWService}
                                    setClasses={setClasses}
                                    packages={packages}/>
                            }

                            <IntervalUpsells
                                packages={packages}
                                services={services}
                                upsell={upsells}
                                handleClick={handleClick}
                                setClasses={setClasses}
                                isBmWService={isBmWService}
                                isRiverviewFord={isRiverviewFord}/>

                            <Complimentary
                                packages={packages}
                                services={services}
                                complimentary={complimentary}
                                handleClick={handleClick}
                                setClasses={setClasses}
                                isBmWService={isBmWService}
                                isRiverviewFord={isRiverviewFord}/>

                            {scProfile?.isShowPriceDetails ? <TotalComplimentary
                                packages={packages}
                                handleClick={handleClick}
                                setClasses={setClasses}
                                isBmWService={isBmWService}
                            /> : null}

                            {/*<Total*/}
                            {/*    packages={packages}*/}
                            {/*    handleClick={handleClick}*/}
                            {/*    isSanfordInfinity={isSanfordInfinity}*/}
                            {/*    isBmWService={isBmWService}*/}
                            {/*    setClasses={setClasses}*/}
                            {/*/>*/}

                        </Wrapper>
                        {loadedPackages[0].priceTitles?.length && Boolean(upsells.length)
                            ? <FeesText count={packages.length}>
                                <div>{t("Total")}<span className="info"> ({t("Excluding taxes & fees")}):</span></div>
                            </FeesText>
                            : null}
                        <TotalPriceRow
                            packages={packages}
                            title={getTitle(EPackagePricingType.BasePrice)}
                            isUpsells={Boolean(upsells.length)}
                            handleClick={handleClick}
                        />
                        {upsells.length > 0
                            ? <TotalPriceWithFeeRow
                                packages={packages}
                                title={getTitle(EPackagePricingType.PriceWithFee)}
                                handleClick={handleClick}/>
                            : null}
                        <Info>
                            {scProfile?.maintenancePackageDisclaimer
                                ? scProfile.maintenancePackageDisclaimer.split('\n').map(line => <div key={line}>{line}</div>)
                                :  isBmWService
                                    ? t("Please ask your service advisor")
                                    : t("The maintenance packages may not be available")
                            }
                        </Info>
                    </React.Fragment>
                }
            </React.Fragment> : null}
            <Actions
                onBack={handleBack}
                // hideNext={!isXs}
                nextDisabled={!selectedPackage}
                onNext={() => handleNext(selectedPackage)} />
            <ConfirmChangeOption open={isOpen} onClose={handleDontChangeOption} onSave={onSave}/>
            <AskAddService onSave={handleYes} onClose={handleNo} open={isAdditionalOpen}/>
        </PackagesStepWrapper>
    );
};