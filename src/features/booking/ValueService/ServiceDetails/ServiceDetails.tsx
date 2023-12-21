import React from 'react';
import {useSelector} from "react-redux";
import {RootState} from "../../../../store/rootReducer";
import {useMediaQuery, useTheme} from "@material-ui/core";
import {Loading} from "../../../../components/Loading/Loading";
import {Actions} from "../../Actions/Actions";
import {useTranslation} from "react-i18next";
import {Description, Price} from "./styles";
import {CarName, ChangeButton, PageWrapper, SubTitle} from "../styles";

type TServiceDetails = {
    onChangeVehicle: () => void;
    onBack: () => void;
    onNext: () => void;
}

const ServiceDetails: React.FC<TServiceDetails> = ({onChangeVehicle, onBack, onNext}) => {
    const {valueService} = useSelector((state: RootState) => state.appointmentFrame);
    const theme = useTheme();
    const isSM = useMediaQuery(theme.breakpoints.down("sm"));
    const {t} = useTranslation();

    return valueService?.selectedService ? (
        <PageWrapper>
            <CarName>{valueService.year?.year} {valueService.series?.name} {valueService.model?.name}</CarName>
            <ChangeButton onClick={onChangeVehicle} variant="text">{t("Change Vehicle")}</ChangeButton>
            <SubTitle>{valueService.selectedService?.name}</SubTitle>
            <Price>${valueService.selectedService?.price}</Price>
            <Description dangerouslySetInnerHTML={{ __html: valueService.selectedService?.description}}/>
            <Actions
                onBack={onBack}
                onNext={onNext}
                nextLabel={isSM ? t("Schedule") : t("Schedule Service")}
            />
        </PageWrapper>
    )
        : <Loading/>;
};

export default ServiceDetails;