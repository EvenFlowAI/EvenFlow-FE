import React from 'react';
import {CarName, ChangeButton, PageWrapper, SubTitle} from "./ValueService/ServiceSelection";
import {Actions} from "./Actions";
import {useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import {IServiceCategory} from "../../../api/types";
import {useTranslation} from "react-i18next";
import {styled, useMediaQuery, useTheme} from "@material-ui/core";
import {offerTypes} from "../../../store/reducers/offers/types";
import moment from "moment";

type TOfferProductPageProps = {
    category: IServiceCategory;
    onChangeVehicle: () => void;
    onBack: () => void;
    onNext: () => void;
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

const OfferProductPage: React.FC<TOfferProductPageProps> = ({category, onChangeVehicle, onBack, onNext}) => {
    const {selectedVehicle} = useSelector((state: RootState) => state.appointmentFrame);
    const theme = useTheme();
    const isSM = useMediaQuery(theme.breakpoints.down("sm"));
    const {t} = useTranslation();

    return (
        <PageWrapper>
            <CarName>{selectedVehicle?.year} {selectedVehicle?.make} {selectedVehicle?.model}</CarName>
            <ChangeButton onClick={onChangeVehicle} variant="text">{t("Change Vehicle")}</ChangeButton>
            <SubTitle>{category.name}</SubTitle>
            <PriceAndDate>
                <div className="innerWrapper">
                    Price: ${category.price}
                    <div className="greenText">
                        {category.offer?.valueOff ?? ''} {category.offer?.type ? offerTypes[category.offer?.type].label : ''}
                    </div>
                    {category.offer?.expiringDate
                        ? <div className="date">Exp.date {moment(category.offer.expiringDate).format('DD/MM/YY')}</div>
                        : null
                    }
                </div>

            </PriceAndDate>
            {category.offer?.description ? <Description dangerouslySetInnerHTML={{ __html: category.offer.description}}/> : null }
            <Actions
                onBack={onBack}
                onNext={onNext}
                nextLabel={isSM ? t("Schedule") : t("Schedule Service")}
            />
        </PageWrapper>
    );
};

export default OfferProductPage;