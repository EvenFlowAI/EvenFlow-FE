import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useMemo,
  useState,
} from "react";
import { ActionButtons } from "../../../ActionButtons/ActionButtons";
import { StepWrapper } from "../../../../../components/styled/StepWrapper";
import { TArgCallback, TCallback, TScreen } from "../../../../../types/types";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../../store/rootReducer";
import {
  clearAppointmentSteps,
  selectCategoriesIds,
  selectService,
  selectSubService,
  setAdditionalServicesChosen,
  setUserType,
} from "../../../../../store/reducers/appointmentFrameReducer/actions";
import { ServiceCard } from "./ServiceCard/ServiceCard";
import { decodeSCID, getMaintenanceList } from "../../../../../utils/utils";
import { useHistory, useParams } from "react-router-dom";
import {
  EServiceCategoryPage,
  IServiceCategory,
} from "../../../../../api/types";
import { Loading } from "../../../../../components/wrappers/Loading/Loading";
import ReactGA from "react-ga4";
import ShoppingCart from "./ShoppingCart/ShoppingCart";
import { EServiceCategoryType } from "../../../../../store/reducers/categories/types";
import {
  EServiceType,
  EUserType,
} from "../../../../../store/reducers/appointmentFrameReducer/types";
import { useTranslation } from "react-i18next";
import {
  selectAppointment,
  selectServiceValetAppointment,
} from "../../../../../store/reducers/appointment/actions";
import { Routes } from "../../../../../routes/constants";
import { Api } from "../../../../../api/ApiEndpoints/ApiEndpoints";
import { CardsWrapper } from "../../../../../components/wrappers/CardsWrapper/CardsWrapper";

type TProps = {
  onSelect: TArgCallback<TScreen>;
  setLastSelectedCategory: Dispatch<SetStateAction<IServiceCategory | null>>;
  page: EServiceCategoryPage;
  setPage: Dispatch<SetStateAction<EServiceCategoryPage>>;
  goNext: TCallback;
  goBack: TCallback;
  isManagingAppointment?: boolean;
};
export const ServiceNeedsCards: React.FC<
  React.PropsWithChildren<React.PropsWithChildren<TProps>>
> = ({
  onSelect,
  setLastSelectedCategory,
  page,
  setPage,
  isManagingAppointment,
  goNext,
  goBack,
}) => {
  const {
    service: selectedService,
    subService,
    categoriesIds,
    selectedPackage,
    valueService,
    userType,
    serviceTypeOption,
    packageEMenuType,
    selectedRecalls,
    trackerData,
  } = useSelector((state: RootState) => state.appointmentFrame);
  const { selectedSR, serviceRequests, scProfile } = useSelector(
    (state: RootState) => state.appointment,
  );
  const { allCategories } = useSelector((state: RootState) => state.categories);
  const { isTransportationAvailable } = useSelector(
    (state: RootState) => state.bookingFlowConfig,
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [serviceCategories, setServiceCategories] = useState<
    IServiceCategory[]
  >([]);
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch();
  const history = useHistory();
  const { t } = useTranslation();

  const currentService = useMemo(
    () => (page === EServiceCategoryPage.Page1 ? selectedService : subService),
    [page, selectedService, subService],
  );
  const selectedServices = useMemo(() => {
    return getMaintenanceList(
      serviceRequests,
      selectedRecalls,
      selectedSR,
      selectedPackage,
      allCategories,
      categoriesIds,
      valueService,
      packageEMenuType,
      scProfile?.maintenancePackageOptionTypes,
    );
  }, [
    serviceRequests,
    selectedSR,
    selectedPackage,
    allCategories,
    categoriesIds,
    valueService,
    selectedRecalls,
    packageEMenuType,
    scProfile,
  ]);

  const handleBack = () => {
    if (page === EServiceCategoryPage.Page2) {
      setPage(EServiceCategoryPage.Page1);
    } else {
      goBack();
    }
  };

  useEffect(() => {
    setLoading(true);
    Api.call<IServiceCategory[]>(Api.endpoints.ServiceCategories.GetByPage, {
      data: {
        serviceCenterId: decodeSCID(id),
        page,
        serviceType:
          serviceTypeOption?.type === EServiceType.MobileService
            ? EServiceType.MobileService
            : EServiceType.VisitCenter,
      },
    })
      .then(({ data }) => {
        setServiceCategories(data);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id, serviceTypeOption, page]);

  useEffect(() => {
    if (!userType) dispatch(setUserType(EUserType.New));
  }, [userType]);

  const handleGA = (selectedCategory: IServiceCategory) => {
    const requestsString = selectedCategory.serviceRequests
      .map((item) => `${item.code} (${item.description})`)
      .join(", ");
    ReactGA.event(
      {
        category: "EvenFlow User",
        action: `Selected ${page === EServiceCategoryPage.Page1 ? "Service" : "Sub Service"} `,
        label: `With Name ${selectedCategory.name} And Service Requests ${requestsString}`,
      },
      trackerData.ids,
    );
  };

  const handleCategoryHighlight = (selectedCategory: IServiceCategory) => {
    if (
      categoriesIds &&
      selectedCategory.type !== EServiceCategoryType.LinkToPage2
    ) {
      dispatch(selectCategoriesIds([...categoriesIds, selectedCategory.id]));
    }
  };

  const clearData = () => {
    dispatch(setAdditionalServicesChosen(false));
    dispatch(selectAppointment(null));
    dispatch(selectServiceValetAppointment(null));
    dispatch(
      clearAppointmentSteps(
        isTransportationAvailable
          ? "transportationNeeds"
          : "appointmentSelection",
      ),
    );
  };

  const handleSubmit = (selectedCategory: IServiceCategory) => {
    if (selectedCategory) {
      setLastSelectedCategory(selectedCategory);
      if (selectedCategory.offer?.description) {
        onSelect("serviceOfferProductPage");
      } else {
        handleGA(selectedCategory);
        handleCategoryHighlight(selectedCategory);
        !isManagingAppointment && clearData();

        switch (selectedCategory?.type) {
          case 2:
          case 4:
            return onSelect("opsCode");
          case 1:
          case 6:
            return onSelect("maintenanceDetails");
          case 3:
            setPage(EServiceCategoryPage.Page2);
            return;
          case 5:
            return history.push(
              `${Routes.EndUser.AppointmentFrameBase}/${id}/valueService`,
            );
          default:
            return onSelect("describeMore");
        }
      }
    }
  };

  const handleSelectCard = (card: IServiceCategory) => () => {
    page === EServiceCategoryPage.Page1
      ? dispatch(selectService(card))
      : dispatch(selectSubService(card));
    handleSubmit(card);
  };

  const getCardIsSelected = (card: IServiceCategory): boolean => {
    if (card.type === EServiceCategoryType.MaintenancePackage)
      return Boolean(selectedPackage || packageEMenuType !== null);
    if (card.type === EServiceCategoryType.ValueService)
      return Boolean(valueService?.selectedService);
    if (card.type === EServiceCategoryType.OpenRecalls) {
      return Boolean(selectedRecalls.length);
    }
    if (card.type === EServiceCategoryType.IndividualServices) {
      return Boolean(
        serviceCategories.find(
          (cat) =>
            cat.type === EServiceCategoryType.IndividualServices &&
            card.id === cat.id &&
            cat.serviceRequests.find((req) => selectedSR.includes(req.id)),
        ),
      );
    }
    if (card.type === EServiceCategoryType.Diagnose) {
      return Boolean(
        serviceCategories.find(
          (cat) =>
            cat.type === EServiceCategoryType.Diagnose &&
            card.id === cat.id &&
            cat.serviceRequests.find((req) => selectedSR.includes(req.id)),
        ),
      );
    }
    return categoriesIds?.includes(card.id);
  };

  const getCardIsActive = (card: IServiceCategory): boolean => {
    return (
      currentService?.id === card.id &&
      !categoriesIds.includes(card.id) &&
      card.type !== EServiceCategoryType.LinkToPage2
    );
  };

  return (
    <StepWrapper>
      {!loading ? (
        <CardsWrapper>
          {serviceCategories.map((card) => {
            return (
              <ServiceCard
                selected={getCardIsSelected(card)}
                active={getCardIsActive(card)}
                onSelect={handleSelectCard(card)}
                card={card}
                key={card.id}
              />
            );
          })}
        </CardsWrapper>
      ) : (
        <Loading />
      )}
      <ShoppingCart />
      <ActionButtons
        prevDisabled={history?.location?.search?.includes("view=unique")}
        hideNext={!selectedServices?.length}
        hidePrev={!selectedServices.length && isManagingAppointment}
        nextLabel={t("Next")}
        onNext={goNext}
        onBack={handleBack}
      />
    </StepWrapper>
  );
};
