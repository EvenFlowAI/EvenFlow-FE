import React from 'react';
import {CarName, ChangeButton, PageWrapper, SubTitle} from "./ValueService/ServiceSelection";
import {Actions} from "./Actions";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import {IServiceCategory} from "../../../api/types";
import {useTranslation} from "react-i18next";
import {styled} from "@material-ui/core";
import moment from "moment";
import {TScreen} from "../../Layout/types";
import {EServiceCategoryType} from "../../../store/reducers/categories/types";
import {
    selectCategoriesIds,
    setAdditionalServicesChosen
} from "../../../store/reducers/appointmentFrameReducer/actions";
import ReactGA from "react-ga4";
import {getOfferString} from "./utils";

type TOfferProductPageProps = {
    category: IServiceCategory|null;
    onChangeVehicle: () => void;
    handleSetScreen: (screen: TScreen) => void;
    lastCategory: IServiceCategory|null;
}
const Description = styled('div')(() => ({
    padding: 10,
    marginBottom: 20,
    "& > p:not(:last-child)": {
        fontWeight: 600,
        color: "#828282",
    }
}))

const PriceAndDate = styled('div')(() => ({
    display: "flex",
    justifyContent: "space-between",
    alignItems: 'center',
    fontSize: 20,
    "& .innerWrapper": {
        width: "100%",
        display: "flex",
        justifyContent: "space-between",
        alignItems: 'center',
    },
    "& .price": {
        marginRight: 16,
    },
    "& .greenText": {
        fontWeight: 'bold',
        color: '#008331',
    },
    "& .date": {
        color: '#202021',
        fontWeight: 'bold',
        fontSize: 16
    }
}))

const OfferProductPage: React.FC<TOfferProductPageProps> = ({category, onChangeVehicle, handleSetScreen, lastCategory}) => {
    const {selectedVehicle, categoriesIds, subService, service} = useSelector((state: RootState) => state.appointmentFrame);
    const {scProfile} = useSelector((state: RootState) => state.appointment);
    const dispatch = useDispatch();
    const {t} = useTranslation();

    const handleCategoriesAndGA = () => {
        dispatch(setAdditionalServicesChosen(false));
        if (service && service.id === lastCategory?.id) {
            if (categoriesIds && service.type !== EServiceCategoryType.LinkToPage2) {
                const categories = categoriesIds?.includes(service.id)
                    ? categoriesIds
                    : [...categoriesIds, service.id];
                dispatch(selectCategoriesIds(categories));
            }
            const requestsString = service.serviceRequests.map(item => `${item.code} (${item.description})`).join(', ');
            ReactGA.event({
                category: 'EvenFlow User',
                action: 'Selected Service',
                label: `With Name ${service.name} And Service Requests ${requestsString}`,
            })
        } else {
            if (subService && subService?.id === lastCategory?.id) {
                if (categoriesIds && subService.type !== EServiceCategoryType.LinkToPage2) {
                    const categories = categoriesIds?.includes(subService.id) ? categoriesIds : [...categoriesIds, subService.id];
                    dispatch(selectCategoriesIds(categories));
                }
                const requestsString = subService.serviceRequests.map(item => `${item.code} (${item.description})`).join(', ');
                ReactGA.event({
                    category: 'EvenFlow User',
                    action: 'Selected Sub Service',
                    label: `With Name ${subService.name} ${subService.serviceRequests?.length && `And Service Requests ${requestsString}`}`,
                })
            }
        }
    }

    const onSubmit = () => {
        handleCategoriesAndGA();
        let type: null|number = null;
        if (service && service.id === lastCategory?.id) type = service.type;
        if (subService && subService?.id === lastCategory?.id) type = subService.type;
        switch (type) {
            case 2:
            case 4:
                return handleSetScreen('opsCode');
            case 1:
                return handleSetScreen('maintenanceDetails');
            case 3:
                return handleSetScreen('serviceSelection');
            default:
                return handleSetScreen('describeMore');
        }
    }

    const handleBack = () => {
        handleSetScreen(service?.type === EServiceCategoryType.Diagnose
        || service?.type === EServiceCategoryType.IndividualServices
            ? 'serviceNeeds'
            : 'serviceSelection')
    }

    return (
        <PageWrapper>
            {selectedVehicle?.make ? <CarName>{selectedVehicle.year} {selectedVehicle.make} {selectedVehicle.model}</CarName> : null}
            {selectedVehicle?.make ? <ChangeButton onClick={onChangeVehicle} variant="text">{t("Change Vehicle")}</ChangeButton> : null}
            <SubTitle>{category?.name ?? ''}</SubTitle>
            <PriceAndDate>
                <div className="innerWrapper">
                    {category?.price
                        ? <span className="price">{t("Price")}: ${scProfile?.isRoundPrice ? category.price : category.price.toFixed(2)}</span>
                        : null}
                    {category?.offer ? <div className="greenText">{getOfferString(category.offer, Boolean(scProfile?.isRoundPrice))}</div> : null}
                    {category?.offer?.expiringDate
                        ? <div className="date">{t("Exp.date")} {moment(category.offer.expiringDate).format('MM/DD/YY')}</div>
                        : null
                    }
                </div>

            </PriceAndDate>
            {category?.offer?.description ? <Description dangerouslySetInnerHTML={{ __html: category.offer.description}}/> : null }
            <Actions
                onBack={handleBack}
                onNext={onSubmit}
            />
        </PageWrapper>
    );
};

export default OfferProductPage;