import React, {useEffect, useMemo, useState} from 'react';
import {StepWrapper} from "./StepWrapper";
import {Actions} from "./Actions";
import {styled, Theme, useMediaQuery, useTheme} from "@material-ui/core";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import {
    setAdditionalServicesChosen,
    setPackage,
    setPackageIsSelected, setSelectedPackageOptionType
} from "../../../store/reducers/appointmentFrameReducer/actions";
import {useParams} from "react-router-dom";
import {Api} from "../../../config/requests";
import {decodeSCID} from "../../../utils/utils";
import {NoItemsLoading} from "../../UI/NoItemsLoading";
import {
    EServiceCenterName,
    IPackage,
    IPackageOptions, TExtendedComplimentary,
    TExtendedService
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
import Total from "./PackageSelectionParts/Total";
import {useTranslation} from "react-i18next";
import {TArgCallback} from "../../../types/types";
import {TScreen} from "../../Layout/types";
import {TServiceTypeSettings} from "../../../store/reducers/bookingFlowConfig/types";

const border = '1px solid #DADADA';

type TWithPackages = {
    packages: number[];
}

export type TService = TWithPackages & TExtendedService;
export type TComplimentary = TWithPackages & TExtendedComplimentary;
export type TPackage = {
    lastIdx?: number;
    moreIdx?: number[];
} & IPackageOptions;

const Wrapper = styled('div')<Theme, { count: number }>(({theme, count}) => ({
    display: "grid",
    marginTop: 12,
    gap: "0 20px",
    gridTemplateColumns: `2fr repeat(${count}, 1fr)`,
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
                borderTop: "10px solid transparent",
                borderBottom: "10px solid transparent",
                borderRight: "10px solid #000000",
            },
            "& .current": {
                background: "#000000",
                color: "#FFFFFF",
            }
        },
        '&.top': {
            borderTop: border,
        },
        '&:nth-child(4n+1)': {
            textAlign: "right",
            justifyContent: "flex-end",
            cursor: "default",
        },
        "&.gray": {
            background: "#DADADA"
        },
        "&.title": {
            padding: 20,
            fontSize: 20,
            textTransform: "uppercase"
        },
        "&.subtitle": {
            textTransform: "uppercase"
        },
        "&.service": {
            padding: "6px 8px",
        },
        "&.serviceWithInfo": {
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            padding: "6px 8px",
        },
        "&.green": {
            background: "#E6FCEC"
        },
        "&.lgray": {
            background: "#EFEFEF",
        },
        "&.green.subtitle": {
            background: "#89E5AB"
        },
        "&.totalMaintenance": {
            fontWeight: 'bold',
            borderTop: border,
            paddingBottom: 10,
            fontSize: 14,
        },
        "&.last": {
            borderBottomColor: "#000000",
        },
        "&.totalComplimentary": {
            padding: "16px 8px",
            color: "#008331",
        },
        "&.total": {
            padding: 8,
            "&.price": {
                display: "grid",
                gridTemplateColumns: "repeat(1, 1fr)",
                alignItems: "center",
                justifyContent: "center",
                "& .current": {
                    flexGrow: 1,
                    fontSize: 20
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
                    color: "#142EA1",
                    fontSize: 20,
                },
                "& .current": {
                    flexGrow: 1,
                    fontSize: 20
                }
            },
            "&>.info": {
                display: "inline-block",
                marginLeft: 4,
                textTransform: "none",
                fontWeight: "normal"
            }
        }
    }
}));

const Info = styled("p")<Theme, { count: number }>(({theme, count}) => ({
    color: "#808080",
    fontSize: 14,
    gridColumnStart: 1,
    gridColumnEnd: `${count + 2}`,
    marginTop: 18,
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
        packageOptionType
    } = useSelector((state: RootState) => state.appointmentFrame);

    const theme = useTheme();
    const { isOpen, onOpen, onClose } = useModal();
    const { isOpen: isAdditionalOpen, onOpen: onAdditionalOpen, onClose: onAdditionalClose } = useModal();
    const isXs = useMediaQuery(theme.breakpoints.down('xs'));
    const {t} = useTranslation();

    const isBmWService = useMemo(() => scProfile?.serviceCenterFlag === EServiceCenterName.BMWSchererville
        || scProfile?.serviceCenterFlag === EServiceCenterName.DealertrackTest, [scProfile]);
    const isSanfordInfinity = useMemo(() => scProfile?.serviceCenterFlag === EServiceCenterName.SanfordInfinity,[scProfile]);
    const isRiverviewFord = useMemo(() => scProfile?.serviceCenterFlag === EServiceCenterName.RiverviewFord, [scProfile])

    const [packages, services, complimentary]: [TPackage[], TService[], TComplimentary[]] = useMemo(() => getPackagesData(loadedPackages),
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
            })
            .catch(() => {
                setPackages([]);
            })
            .finally(() => {setLoading(false)})

    }, [id, selectedVehicle, maintenanceDetails]);

    const setClasses = (id: number, cls: string) => {
        if (id === selectedPackage?.id) {
            return `${cls} selected`;
        }
        return cls;
    }

    const handleClick = (p: IPackageOptions) => () => {
        dispatch(setPackage(p));
    }

    const handleBack = (): void => {
        ReactGA.event({
            category: 'EvenFlow User',
            action: 'Went back',
            label: 'From Selection Package Page',
        })
        onBack();
    }

    const addServices = () => {
        dispatch(setAdditionalServicesChosen(true));
        if (onAddServices) onAddServices();
    }

    const onSave = async () => {
        await onClose();
        await askAdditionalServices();
    }

    const handleNextScreen = () => {
        onNext(!currentConfig?.advisorSelection
            ? currentConfig?.appointmentSelection
                ? 'appointmentTiming'
                : "appointmentSelection"
            : 'consultantSelection')
    }

    const askAdditionalServices = () => {
        selectedPackage && dispatch(setSelectedPackageOptionType(selectedPackage.type));
        const categoryChosen = service?.type === 0 || subService?.type === 0;
        if (!categoryChosen || !selectedSR.length) {
            onAdditionalOpen();
        } else {
            handleNextScreen();
        }
    }

    const handleGA = () => {
        if (selectedPackage) {
            const packageOptions = ['Good', 'Better', 'Best'];
            ReactGA.event({
                category: 'EvenFlow User',
                action: `Selected Package`,
                label: `With ${packageOptions[selectedPackage.type]} Option`,
            })
        }
    }

    const handleNext = (): void => {
        if (selectedPackage) {
            dispatch(setPackageIsSelected(true));
            handleGA();
            if (packageIsSelected && packageOptionType && packageOptionType !== selectedPackage.type) {
                onOpen();
            } else {
                askAdditionalServices()
            }
        }
    }

    const handleDontChangeOption = () => {
        const prevPackage = packages.find(p => p.type === packageOptionType);
        if (prevPackage) dispatch(setPackage(prevPackage));
        onClose();
    }

    const handleYes = () => {
        onAdditionalClose();
        addServices();
    }

    const handleNo = () => {
        onAdditionalClose();
        handleNextScreen();
    }

    return (
        <StepWrapper>
            <NoItemsLoading
                wrapperStyles={{marginTop: 20}}
                items={packages}
                loading={loading}
                label={t("There are no packages available")}
            />
            {packages.length ? <React.Fragment>
                {isXs
                    ? <PackageSelectionMobile
                        data={packages}
                        isBmWService={isBmWService}
                        isSanfordInfinity={isSanfordInfinity}
                    />
                    : <Wrapper count={packages.length}>
                        <PackageTitles packages={packages} handleClick={handleClick} setClasses={setClasses}/>

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
                            isSanfordInfinity={isSanfordInfinity}
                        /> : null}

                        <Total
                            packages={packages}
                            handleClick={handleClick}
                            isSanfordInfinity={isSanfordInfinity}
                            isBmWService={isBmWService}
                            setClasses={setClasses}
                        />
                        <Info count={packages.length}>
                            {scProfile?.maintenancePackageDisclaimer
                                ? scProfile.maintenancePackageDisclaimer.split('\n').map(line => <p key={line}>{line}</p>)
                                :  isBmWService
                                    ? t("Please ask your service advisor")
                                    : t("The maintenance packages may not be available")
                            }
                        </Info>
                    </Wrapper>
                }
            </React.Fragment> : null}
            <Actions
                onBack={handleBack}
                nextDisabled={!selectedPackage}
                onNext={handleNext} />
            <ConfirmChangeOption open={isOpen} onClose={handleDontChangeOption} onSave={onSave}/>
            <AskAddService onSave={handleYes} onClose={handleNo} open={isAdditionalOpen}/>
        </StepWrapper>
    );
};