import React, {useEffect} from 'react';
import {Button, styled} from "@material-ui/core";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../../store/rootReducer";
import {IServiceOffer} from "../../../../store/reducers/appointmentFrameReducer/types";
import {loadServiceOffers, setValueServicePartial} from "../../../../store/reducers/appointmentFrameReducer/actions";
import {Loading} from "../../../UI/Loading";
import {useTranslation} from "react-i18next";

export const PageWrapper = styled('div')(({theme}) => ({
    // maxWidth: '80vw',
    minWidth: '50vw',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: 40,
    border: '1px solid #DADADA',
    [theme.breakpoints.down("md")]: {
        padding: 30,
    },
    [theme.breakpoints.down("sm")]: {
        padding: 20,
    }
}))

const Container = styled('div')(({theme}) => ({
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    gap: 10,
    [theme.breakpoints.down("md")]: {
        gridTemplateColumns: '1fr 1fr',
    },
    [theme.breakpoints.down("sm")]: {
        gridTemplateColumns: '1fr',
    }
}))

const CardWrapper= styled('div')(({theme}) => ({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: 24,
    margin: 16,
    backgroundColor: "#DADADA",
    "& > .buttonsWrapper": {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 16,
    },
    "& > .image": {
        backgroundPosition: "50% 50%",
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        height: 100,
        width: '100%'
    }
}))

const Title = styled('span')(() => ({
    marginBottom: 27,
    fontSize: 16,
    fontWeight: 600,
}))

export const SubTitle = styled('span')(() => ({
    marginBottom: 8,
    fontSize: 20,
    fontWeight: 600,
    color: '#202021',
    textTransform: 'uppercase',
}))

const Price = styled('span')(() => ({
    fontSize: 20,
    fontWeight: 600,
    color: "#202021"
}))

const SelectButton = styled(Button)(() => ({
    color: '#FFFFFF',
    backgroundColor: "#202021",
    padding: '9px 18px'
}))

export const CarName = styled('div')(() => ({
    color: "#202021",
    fontWeight: 600,
    fontSize: 24,
}))

export const ChangeButton = styled(Button)(({theme}) => ({
    width: 'fit-content',
    justifyContent: 'flex-start',
    padding: 8,
    marginBottom: 50,
    marginTop: 12,
    textTransform: 'unset',
    textDecoration: 'underline',
    fontWeight: 'normal',
    [theme.breakpoints.down("md")]: {
        marginBottom: 30,
    },
    [theme.breakpoints.down("sm")]: {
        marginBottom: 20,
    }
}))

type TServiceSelectionProps = {
    onNext: () => void;
    onBack: () => void;
}

const ServiceSelection: React.FC<TServiceSelectionProps> = ({onNext, onBack}) => {
    const {valueService, serviceOffers, offersLoading} = useSelector((state: RootState) => state.appointmentFrame);
    const {scProfile} = useSelector((state: RootState) => state.appointment);
    const dispatch = useDispatch();
    const {t} = useTranslation();

    useEffect(() => {
        const year = valueService?.year?.year;
        const seriesId = valueService?.series?.id;
        const modelId = valueService?.model?.id;
        if (year && seriesId && modelId && scProfile) dispatch(loadServiceOffers(+year, seriesId, modelId, scProfile.id));
    }, [valueService])

    const onSelectClick = (item: IServiceOffer) => async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        await dispatch(setValueServicePartial({selectedService: item}));
        onNext();
    };

    return (
        <PageWrapper>
            <CarName>{valueService?.year?.year} {valueService?.series?.name} {valueService?.model?.name}</CarName>
            <ChangeButton onClick={onBack} variant="text">{t("Change Vehicle")}</ChangeButton>
            <SubTitle>{t("Select Service")}</SubTitle>
            <Container>
                {offersLoading
                    ? <Loading/>
                    : serviceOffers.map(service => {
                    return <CardWrapper>
                        <Title>{service.name}</Title>
                        <div  className="image" style={{backgroundImage: `url(${service.imagePath})`}}/>
                        <div className="buttonsWrapper">
                            <SelectButton onClick={onSelectClick(service)}>{t("Select")}</SelectButton>
                            <Price>$ {service.price}</Price>
                        </div>
                    </CardWrapper>
                })}
            </Container>
        </PageWrapper>
    );
};

export default ServiceSelection;