import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ActionButtons } from '../../../ActionButtons/ActionButtons';
import { useMediaQuery, useTheme } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../../store/rootReducer';
import {
  setAdditionalServicesChosen,
  setPackage,
  setPackageEMenuType,
  setPackageIsSelected,
  setPackagePricingType,
  setSelectedPackageOptionType,
  setSelectedPackagePriceTitles,
} from '../../../../../store/reducers/appointmentFrameReducer/actions';
import { useParams } from 'react-router-dom';
import { decodeSCID, getModelCode } from '../../../../../utils/utils';
import { NoItemsLoading } from '../../../../../components/wrappers/NoItemsLoading/NoItemsLoading';
import {
  EServiceCenterName,
  IPackage,
  IPackageOptions,
  PackageSourceType,
} from '../../../../../api/types';
import MaintenancePackagesMobile from '../MaintenancePackagesMobile/MaintenancePackagesMobile';
import ReactGA from 'react-ga4';
import ConfirmChangeOption from './ConfirmChangeOption/ConfirmChangeOption';
import AskAddService from '../../../../../components/modals/booking/AskAddService/AskAddService';
import PackageTitles from './PackageTitles/PackageTitles';
import PackagesServiceRequests from './PackagesServiceRequests/PackagesServiceRequests';
import PackagesTotalMaintenance from './PackagesTotalMaintenance/PackagesTotalMaintenance';
import PackagesComplimentary from './PackagesComplimentary/PackagesComplimentary';
import PackagesTotalComplimentary from './PackagesTotalComplimentary/PackagesTotalComplimentary';
import { useTranslation } from 'react-i18next';
import { TArgCallback } from '../../../../../types/types';
import { TScreen } from '../../../../../types/screens';
import PackagesIntervalUpsells from './PackagesIntervalUpsells/PackagesIntervalUpsells';
import PackagesTotalPriceRow from './PackagesTotalPriceRow/PackagesTotalPriceRow';
import PackagesTotalPriceWithFee from './PackagesTotalPriceWithFee/PackagesTotalPriceWithFee';
import { EPackagePricingType } from '../../../../../store/reducers/appointmentFrameReducer/types';
import { checkPodChanged } from '../../../../../store/reducers/appointments/actions';
import { TComplimentary, TPackage, TService, TUpsell } from './types';
import { FeesText, Info, PackagesStepWrapper, Wrapper } from './styles';
import { getPackagesData } from './utils';
import { useModal } from '../../../../../hooks/useModal/useModal';
import { useException } from '../../../../../hooks/useException/useException';
import { Api } from '../../../../../api/ApiEndpoints/ApiEndpoints';

type TPackageSelectionProps = {
  onNext: TArgCallback<TScreen>;
  onBack: () => void;
  onAddServices: () => void;
  isManagingFlow?: boolean;
};

export const MaintenancePackages: React.FC<TPackageSelectionProps> = ({
  onBack,
  onNext,
  onAddServices,
  isManagingFlow,
}) => {
  const { scProfile } = useSelector((state: RootState) => state.appointment);
  const { makes } = useSelector((state: RootState) => state.appointmentFrame);
  const { isAdvisorAvailable, isAppointmentTimingAvailable, isTransportationAvailable } =
    useSelector((state: RootState) => state.bookingFlowConfig);
  const {
    selectedPackage,
    selectedVehicle,
    packagePricingType,
    packageOptionType,
    packageEMenuType,
    trackerData,
    serviceTypeOption,
  } = useSelector((state: RootState) => state.appointmentFrame);

  const [loading, setLoading] = useState<boolean>(false);
  const [loadedPackages, setPackages] = useState<IPackage[]>([]);
  const [localSelectedPackage, setLocalSelectedPackage] = useState<IPackageOptions | null>(null);
  const [localSelectedPricingType, setLocalSelectedPricingType] =
    useState<EPackagePricingType | null>(null);

  const theme = useTheme();
  const { isOpen, onOpen, onClose } = useModal();
  const {
    isOpen: isAdditionalOpen,
    onOpen: onAdditionalOpen,
    onClose: onAdditionalClose,
  } = useModal();
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const isXs = useMediaQuery(theme.breakpoints.down('sm'));
  const showError = useException();
  const dispatch = useDispatch();

  const isBmWService = useMemo(
    () =>
      scProfile?.serviceCenterFlag === EServiceCenterName.BMWSchererville ||
      scProfile?.serviceCenterFlag === EServiceCenterName.DealertrackTest,
    [scProfile]
  );

  const [packages, services, complimentary, upsells]: [
    TPackage[],
    TService[],
    TComplimentary[],
    TUpsell[],
  ] = useMemo(() => getPackagesData(loadedPackages), [loadedPackages]);

  useEffect(() => {
    setLocalSelectedPackage(selectedPackage);
    setLocalSelectedPricingType(packagePricingType);
  }, [selectedPackage, packagePricingType]);

  useEffect(() => {
    setLoading(true);
    const endpoint =
      scProfile?.packageSource !== PackageSourceType.eMenu
        ? Api.endpoints.MaintenancePackages.ByVehicle
        : Api.endpoints.MaintenancePackages.EMenuMaintenancePackage;
    Api.call<IPackage[]>(endpoint, {
      data: {
        serviceCenterId: decodeSCID(id),
        modelCode: getModelCode(makes, selectedVehicle),
        vehicle: {
          ...selectedVehicle,
          mileage: selectedVehicle?.mileage,
        },
      },
    })
      .then(({ data }) => {
        setPackages(data);
        if (data.length) dispatch(setSelectedPackagePriceTitles(data[0].priceTitles));
      })
      .catch(() => {
        setPackages([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id, selectedVehicle]);

  const setClasses = (id: number, cls: string): string => {
    if (id === localSelectedPackage?.id) {
      return `${cls} selected`;
    }
    return cls;
  };

  const selectPackage = (localSelectedPackage: IPackageOptions | null, sentGA: boolean): void => {
    const newPackage =
      packages.find(p => p.type === localSelectedPackage?.type) ||
      packages.find(p => p.type === packageEMenuType) ||
      null;

    if (newPackage?.id !== localSelectedPackage?.id) {
      setLocalSelectedPackage(newPackage);
    }

    const usedPackage = newPackage ?? localSelectedPackage;
    if (usedPackage) {
      const isEMenuPackage = scProfile?.packageSource === PackageSourceType.eMenu;
      dispatch(setPackageIsSelected(true));
      if (sentGA) {
        isEMenuPackage ? handleEMenuGA() : handleGA(usedPackage);
      }
      if (isEMenuPackage) {
        dispatch(setPackageEMenuType(usedPackage.type));
      } else {
        dispatch(setSelectedPackageOptionType(usedPackage.type));
      }
      dispatch(setPackage(usedPackage));
      dispatch(setPackagePricingType(localSelectedPricingType));
      if (selectedPackage && packageOptionType !== null && packageOptionType !== usedPackage.type) {
        onOpen();
      } else {
        onSelectionCompleted();
      }
    }
  };

  const handleBack = (localSelectedPackage: IPackageOptions | null): void => {
    ReactGA.event('asc_form_engagement', {
      element_text: 'Went Backwards',
      page_context: 'Selection Package Page',
    });

    if (isManagingFlow) {
      selectPackage(localSelectedPackage, false);
    }
    onBack();
  };

  const addServices = (): void => {
    dispatch(setAdditionalServicesChosen(true));
    if (onAddServices) onAddServices();
  };

  const handleNextScreen = (): void => {
    let nextScreen: TScreen = 'appointmentSelection';
    if (isAdvisorAvailable) {
      nextScreen = 'consultantSelection';
    } else if (isTransportationAvailable && !serviceTypeOption?.transportationOption) {
      nextScreen = 'transportationNeeds';
    } else if (isAppointmentTimingAvailable) {
      nextScreen = 'appointmentTiming';
    }
    onNext(nextScreen);
  };

  const onSelectionCompleted = () => {
    if (isManagingFlow) {
      dispatch(checkPodChanged(decodeSCID(id), showError));
    } else {
      onAdditionalOpen();
    }
  };

  const onSave = async () => {
    if (localSelectedPackage) {
      dispatch(setSelectedPackageOptionType(localSelectedPackage.type));
      dispatch(setPackage(localSelectedPackage));
    }
    await onClose();
    await onSelectionCompleted();
  };

  const handleGA = (selectedPackage: IPackageOptions): void => {
    const packageOptions = ['Good', 'Better', 'Best'];
    ReactGA.event('asc_form_engagement', {
      element_text: 'EvenFlow Package Selected',
      package_option: packageOptions[selectedPackage.type],
    });
  };

  const handleEMenuGA = () => {
    const firstOption = scProfile?.maintenancePackageOptionTypes[0];
    ReactGA.event('asc_form_engagement', {
      element_text: 'External Package Selected',
      emenu_package_type: packageEMenuType === firstOption ? 'Factory' : 'Dealer',
    });
  };

  const handleNext = (localSelectedPackage: IPackageOptions | null): void => {
    selectPackage(localSelectedPackage, true);
  };

  const handleClick = (p: IPackageOptions, pricing?: EPackagePricingType) => () => {
    setLocalSelectedPackage(p);
    setLocalSelectedPricingType(pricing ?? EPackagePricingType.BasePrice);
  };

  const handleDontChangeOption = (): void => {
    const prevPackage = packages.find(p => p.type === packageOptionType);
    if (prevPackage) dispatch(setPackage(prevPackage));
    onClose();
  };

  const handleYes = (): void => {
    onAdditionalClose();
    addServices();
  };

  const handleNo = (): void => {
    onAdditionalClose();
    handleNextScreen();
  };

  const getTitle = useCallback(
    (type: EPackagePricingType) => {
      let title = '';
      if (loadedPackages[0]) {
        const price = loadedPackages[0].priceTitles?.find(el => el.type === type);
        if (price) title = price.title;
      }
      return title;
    },
    [loadedPackages]
  );

  return (
    <PackagesStepWrapper>
      <NoItemsLoading
        wrapperStyles={{ marginTop: 20 }}
        items={packages}
        loading={loading}
        label={t('There are no packages available')}
      />
      {packages.length ? (
        <React.Fragment>
          {isXs ? (
            <MaintenancePackagesMobile
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
          ) : (
            <React.Fragment>
              <Wrapper count={packages.length}>
                <PackageTitles
                  packages={packages}
                  handleClick={handleClick}
                  setClasses={setClasses}
                />

                <PackagesServiceRequests
                  packages={packages}
                  services={services}
                  handleClick={handleClick}
                  setClasses={setClasses}
                  isBmWService={isBmWService}
                />

                {scProfile?.isShowPriceDetails && (
                  <PackagesTotalMaintenance
                    isBmWService={isBmWService}
                    setClasses={setClasses}
                    packages={packages}
                  />
                )}

                <PackagesIntervalUpsells
                  packages={packages}
                  services={services}
                  upsell={upsells}
                  handleClick={handleClick}
                  setClasses={setClasses}
                  loadedPackages={loadedPackages}
                  isBmWService={isBmWService}
                />

                <PackagesComplimentary
                  loadedPackages={loadedPackages}
                  packages={packages}
                  services={services}
                  complimentary={complimentary}
                  handleClick={handleClick}
                  setClasses={setClasses}
                  isBmWService={isBmWService}
                />

                {scProfile?.isShowPriceDetails ? (
                  <PackagesTotalComplimentary
                    packages={packages}
                    handleClick={handleClick}
                    setClasses={setClasses}
                    isBmWService={isBmWService}
                  />
                ) : null}
              </Wrapper>
              {loadedPackages[0].priceTitles?.length && Boolean(upsells.length) ? (
                <FeesText count={packages.length}>
                  <div>
                    {t('Total')}
                    <span className="info"> ({t('Excluding taxes & fees')}):</span>
                  </div>
                </FeesText>
              ) : null}
              <PackagesTotalPriceRow
                packages={packages}
                title={getTitle(EPackagePricingType.BasePrice)}
                isUpsells={Boolean(upsells.length)}
                handleClick={handleClick}
                selectedPackage={localSelectedPackage}
                packagePricingType={localSelectedPricingType}
              />
              {upsells.length > 0 ? (
                <PackagesTotalPriceWithFee
                  packages={packages}
                  selectedPackage={localSelectedPackage}
                  packagePricingType={localSelectedPricingType}
                  title={getTitle(EPackagePricingType.PriceWithFee)}
                  handleClick={handleClick}
                />
              ) : null}
              <Info>
                {scProfile?.maintenancePackageDisclaimer
                  ? scProfile.maintenancePackageDisclaimer
                      .split('\n')
                      .map(line => <div key={line}>{line}</div>)
                  : isBmWService
                    ? t('Please ask your service advisor')
                    : t('The maintenance packages may not be available')}
              </Info>
            </React.Fragment>
          )}
        </React.Fragment>
      ) : null}
      <ActionButtons
        onBack={() => handleBack(localSelectedPackage)}
        nextLabel={t('Next')}
        nextDisabled={!localSelectedPackage || localSelectedPricingType === null}
        onNext={() => handleNext(localSelectedPackage)}
      />
      <ConfirmChangeOption open={isOpen} onClose={handleDontChangeOption} onSave={onSave} />
      <AskAddService onSave={handleYes} onClose={handleNo} open={isAdditionalOpen} />
    </PackagesStepWrapper>
  );
};
