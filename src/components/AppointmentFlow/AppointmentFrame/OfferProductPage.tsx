import React from 'react';
import {CarName, ChangeButton, PageWrapper, SubTitle} from "./ValueService/ServiceSelection";
import {Actions} from "./Actions";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import {IServiceCategory} from "../../../api/types";
import {useTranslation} from "react-i18next";
import {styled, useMediaQuery, useTheme} from "@material-ui/core";
import {offerTypes} from "../../../store/reducers/offers/types";
import moment from "moment";
import {TScreen} from "../../Layout/types";
import {EServiceCategoryType} from "../../../store/reducers/categories/types";
import {
    selectCategoriesIds,
    setAdditionalServicesChosen
} from "../../../store/reducers/appointmentFrameReducer/actions";
import ReactGA from "react-ga";

type TOfferProductPageProps = {
    category: IServiceCategory|null;
    onChangeVehicle: () => void;
    onBack: () => void;
    onNext: (screen: TScreen) => void;
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
    ".innerWrapper": {
        display: "flex",
        justifyContent: "space-between",
        alignItems: 'center',
    },
    ".greenText": {
        fontWeight: 'bold',
        color: '#008331',
        marginLeft: 16,
    },
    ".date": {
        color: '#202021',
        fontWeight: 'bold',
        fontSize: 16
    }
}))

const OfferProductPage: React.FC<TOfferProductPageProps> = ({category, onChangeVehicle, onBack, onNext, lastCategory}) => {
    const {selectedVehicle, categoriesIds, subService, service} = useSelector((state: RootState) => state.appointmentFrame);
    const dispatch = useDispatch();
    const theme = useTheme();
    const isSM = useMediaQuery(theme.breakpoints.down("sm"));
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
                return onNext('opsCode');
            case 1:
                return onNext('maintenanceDetails');
            case 3:
                return onNext('serviceSelection');
            default:
                return onNext('describeMore');
        }
    }

    return (
        <PageWrapper>
            {selectedVehicle ? <CarName>{selectedVehicle.year} {selectedVehicle.make} {selectedVehicle.model}</CarName> : null}
            {selectedVehicle ? <ChangeButton onClick={onChangeVehicle} variant="text">{t("Change Vehicle")}</ChangeButton> : null}
            <SubTitle>{category?.name ?? ''}</SubTitle>
            <PriceAndDate>
                <div className="innerWrapper">
                    Price: ${category?.price}
                    <div className="greenText">
                        {category?.offer?.valueOff ?? ''} {category?.offer?.type ? offerTypes[category?.offer?.type].label : ''}
                    </div>
                    {category?.offer?.expiringDate
                        ? <div className="date">Exp.date {moment(category.offer.expiringDate).format('MM/DD/YY')}</div>
                        : null
                    }
                </div>

            </PriceAndDate>
            {category?.offer?.description ? <Description dangerouslySetInnerHTML={{ __html: category.offer.description}}/> : null }
            <Actions
                onBack={onBack}
                onNext={onSubmit}
                nextLabel={isSM ? t("Schedule") : t("Schedule Service")}
            />
        </PageWrapper>
    );
};

export default OfferProductPage;