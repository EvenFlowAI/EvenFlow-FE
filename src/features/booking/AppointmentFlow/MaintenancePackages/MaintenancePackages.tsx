import React, {useEffect, useMemo, useState} from 'react';
import {ActionButtons} from "../../ActionButtons/ActionButtons";
import {useMediaQuery, useTheme} from "@material-ui/core";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../../store/rootReducer";
import {
    setAdditionalServicesChosen,
    setPackage,
    setPackageIsSelected,
    setPackagePricingType,
    setSelectedPackageOptionType,
    setSelectedPackagePriceTitles
} from "../../../../store/reducers/appointmentFrameReducer/actions";
import {useParams} from "react-router-dom";
import {decodeSCID} from "../../../../utils/utils";
import {NoItemsLoading} from "../../../../components/wrappers/NoItemsLoading/NoItemsLoading";
import {EServiceCenterName, IPackage, IPackageOptions} from "../../../../api/types";
import MaintenancePackagesMobile from "../MaintenancePackagesMobile/MaintenancePackagesMobile";
import ReactGA from "react-ga4";
import ConfirmChangeOption from "./ConfirmChangeOption/ConfirmChangeOption";
import AskAddService from "../../../../components/modals/booking/AskAddService/AskAddService";
import PackageTitles from "./PackageTitles/PackageTitles";
import PackagesServiceRequests from "./PackagesServiceRequests/PackagesServiceRequests";
import PackagesTotalMaintenance from "./PackagesTotalMaintenance/PackagesTotalMaintenance";
import PackagesComplimentary from "./PackagesComplimentary/PackagesComplimentary";
import PackagesTotalComplimentary from "./PackagesTotalComplimentary/PackagesTotalComplimentary";
import {useTranslation} from "react-i18next";
import {TArgCallback, TScreen} from "../../../../types/types";
import PackagesIntervalUpsells from "./PackagesIntervalUpsells/PackagesIntervalUpsells";
import PackagesTotalPriceRow from "./PackagesTotalPriceRow/PackagesTotalPriceRow";
import PackagesTotalPriceWithFee from "./PackagesTotalPriceWithFee/PackagesTotalPriceWithFee";
import {EPackagePricingType} from "../../../../store/reducers/appointmentFrameReducer/types";
import PackagesEmenu from "./PackagesEmenu/PackagesEmenu";
import {checkPodChanged} from "../../../../store/reducers/appointments/actions";
import {TComplimentary, TPackage, TService, TUpsell} from "./types";
import {FeesText, Info, PackagesStepWrapper, Wrapper} from "./styles";
import {getPackagesData} from "./utils";
import {useModal} from "../../../../hooks/useModal/useModal";
import {useException} from "../../../../hooks/useException/useException";
import {Api} from "../../../../api/ApiEndpoints/ApiEndpoints";

type TPackageSelectionProps = {
    onNext: TArgCallback<TScreen>;
    onBack: () => void;
    onAddServices: () => void;
}

export const MaintenancePackages: React.FC<TPackageSelectionProps> = ({onBack, onNext, onAddServices}) => {
    const {scProfile, customerLoadedData} = useSelector((state: RootState) => state.appointment);
    const {isAdvisorAvailable, isAppointmentTimingAvailable} = useSelector((state: RootState) => state.bookingFlowConfig);
    const {
        selectedPackage,
        selectedVehicle,
        packagePricingType,
        packageOptionType,
        packageEMenuType,
        isUsualFlowNeeded,
    } = useSelector((state: RootState) => state.appointmentFrame);

    const [loading, setLoading] = useState<boolean>(false);
    const [loadedPackages, setPackages] = useState<IPackage[]>([]);
    const [localSelectedPackage, setLocalSelectedPackage] = useState<IPackageOptions|null>(null);
    const [localSelectedPricingType, setLocalSelectedPricingType] = useState<EPackagePricingType|null>(null);

    const theme = useTheme();
    const { isOpen, onOpen, onClose } = useModal();
    const { isOpen: isAdditionalOpen, onOpen: onAdditionalOpen, onClose: onAdditionalClose } = useModal();
    const isXs = useMediaQuery(theme.breakpoints.down('xs'));
    const {t} = useTranslation();
    const showError = useException();

    const isBmWService = useMemo(() => scProfile?.serviceCenterFlag === EServiceCenterName.BMWSchererville
        || scProfile?.serviceCenterFlag === EServiceCenterName.DealertrackTest, [scProfile]);

    const [packages, services, complimentary, upsells]: [TPackage[], TService[], TComplimentary[], TUpsell[]] = useMemo(() => getPackagesData(loadedPackages),
        [loadedPackages]);

    const dispatch = useDispatch();
    const {id} = useParams();

    useEffect(() => {
        setLocalSelectedPackage(selectedPackage);
        setLocalSelectedPricingType(packagePricingType);
    }, [selectedPackage, packagePricingType])

    useEffect(() => {
        if (!scProfile?.eMenuEnabled) {
            setLoading(true);
            Api.call<IPackage[]>(
                Api.endpoints.MaintenancePackages.ByVehicle,
                {
                    data: {
                        serviceCenterId: decodeSCID(id),
                        vehicle: {
                            ...selectedVehicle,
                            mileage: selectedVehicle?.mileage
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

        }
    }, [id, selectedVehicle]);

    const setClasses = (id: number, cls: string): string => {
        if (id === localSelectedPackage?.id) {
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
        onNext(isAdvisorAvailable
            ? 'consultantSelection'
            : isAppointmentTimingAvailable
                ? 'appointmentTiming'
                : "appointmentSelection")
    }

    const onSelectionCompleted = () => {
        if (customerLoadedData?.isUpdating && !isUsualFlowNeeded) {
            dispatch(checkPodChanged(decodeSCID(id), showError))
        } else {
            onAdditionalOpen()
        }
    }

    const onSave = async () => {
        if (localSelectedPackage) {
            dispatch(setSelectedPackageOptionType(localSelectedPackage.type));
            dispatch(setPackage(localSelectedPackage))
        }
        await onClose();
        await onSelectionCompleted();
    }

    const handleGA = (selectedPackage: IPackageOptions): void => {
        const packageOptions = ['Good', 'Better', 'Best'];
        ReactGA.event({
            category: 'EvenFlow User',
            action: `Selected Package`,
            label: `With ${packageOptions[selectedPackage.type]} Option`,
        });
    }

    const handleNext = (localSelectedPackage: IPackageOptions|null): void => {
        if (localSelectedPackage) {
            dispatch(setPackageIsSelected(true));
            handleGA(localSelectedPackage);
            if (selectedPackage && packageOptionType !== null && packageOptionType !== localSelectedPackage.type) {
                onOpen();
            } else {
                dispatch(setSelectedPackageOptionType(localSelectedPackage.type));
                dispatch(setPackage(localSelectedPackage))
                dispatch(setPackagePricingType(localSelectedPricingType))
                onSelectionCompleted();
            }
        }
    }

    const onEMenuNext = () => {
        dispatch(setPackageIsSelected(true));
        const firstOption = scProfile?.maintenancePackageOptionTypes[0];
        ReactGA.event({
            category: 'EvenFlow User',
            action: `Selected eMenu Package`,
            label: `With ${packageEMenuType === firstOption ? 'Factory' : "Dealer"} Option`,
        });
        onSelectionCompleted();
    }

    const handleClick = (p: IPackageOptions, pricing?: EPackagePricingType) => () => {
        setLocalSelectedPackage(p)
        setLocalSelectedPricingType(pricing ?? EPackagePricingType.BasePrice)
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
            {!scProfile?.eMenuEnabled
                ?  <NoItemsLoading
                wrapperStyles={{marginTop: 20}}
                items={packages}
                loading={loading}
                label={t("There are no packages available")}
            />
                : null}
            {scProfile?.eMenuEnabled
                ? <React.Fragment>
                    <PackagesEmenu onBack={handleBack} onNext={onEMenuNext}/>
                </React.Fragment>
                : packages.length ? <React.Fragment>
                {isXs
                    ? <MaintenancePackagesMobile
                        loadedPackages={loadedPackages}
                        getTitle={getTitle}
                        withUpsells={!!upsells.length}
                        data={packages}
                        isBmWService={isBmWService}
                        selectedPackage={localSelectedPackage}
                        setLocalPackage={setLocalSelectedPackage}
                        setLocalPricingType={setLocalSelectedPricingType}
                        localSelectedPricingType={localSelectedPricingType}
                    />
                    : <React.Fragment>
                        <Wrapper count={packages.length}>
                            <PackageTitles
                                packages={packages}
                                handleClick={handleClick}
                                setClasses={setClasses}/>

                            <PackagesServiceRequests
                                packages={packages}
                                services={services}
                                handleClick={handleClick}
                                setClasses={setClasses}
                                isBmWService={isBmWService}
                            />

                            {scProfile?.isShowPriceDetails
                                && <PackagesTotalMaintenance
                                    isBmWService={isBmWService}
                                    setClasses={setClasses}
                                    packages={packages}/>
                            }

                            <PackagesIntervalUpsells
                                packages={packages}
                                services={services}
                                upsell={upsells}
                                handleClick={handleClick}
                                setClasses={setClasses}
                                loadedPackages={loadedPackages}
                                isBmWService={isBmWService}/>

                            <PackagesComplimentary
                                loadedPackages={loadedPackages}
                                packages={packages}
                                services={services}
                                complimentary={complimentary}
                                handleClick={handleClick}
                                setClasses={setClasses}
                                isBmWService={isBmWService}/>

                            {scProfile?.isShowPriceDetails ? <PackagesTotalComplimentary
                                packages={packages}
                                handleClick={handleClick}
                                setClasses={setClasses}
                                isBmWService={isBmWService}
                            /> : null}

                        </Wrapper>
                        {loadedPackages[0].priceTitles?.length && Boolean(upsells.length)
                            ? <FeesText count={packages.length}>
                                <div>{t("Total")}<span className="info"> ({t("Excluding taxes & fees")}):</span></div>
                            </FeesText>
                            : null}
                        <PackagesTotalPriceRow
                            packages={packages}
                            title={getTitle(EPackagePricingType.BasePrice)}
                            isUpsells={Boolean(upsells.length)}
                            handleClick={handleClick}
                            selectedPackage={localSelectedPackage}
                            packagePricingType={localSelectedPricingType}
                        />
                        {upsells.length > 0
                            ? <PackagesTotalPriceWithFee
                                packages={packages}
                                selectedPackage={localSelectedPackage}
                                packagePricingType={localSelectedPricingType}
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
            {scProfile?.eMenuEnabled
                ? null
                : <ActionButtons
                onBack={handleBack}
                nextLabel={t("Next")}
                nextDisabled={!localSelectedPackage || localSelectedPricingType === null}
                onNext={() => handleNext(localSelectedPackage)}/>}
            <ConfirmChangeOption open={isOpen} onClose={handleDontChangeOption} onSave={onSave}/>
            <AskAddService onSave={handleYes} onClose={handleNo} open={isAdditionalOpen}/>
        </PackagesStepWrapper>
    );
};