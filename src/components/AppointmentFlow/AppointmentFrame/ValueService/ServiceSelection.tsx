import React from 'react';
import {Button, styled} from "@material-ui/core";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../../store/rootReducer";
import {TValueService} from "../../../../store/reducers/appointmentFrameReducer/types";
import {setValueServicePartial} from "../../../../store/reducers/appointmentFrameReducer/actions";

export const PageWrapper = styled('div')(({theme}) => ({
    maxWidth: '80vw',
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
        objectFit: 'contain',
        width: 300,
        [theme.breakpoints.down("sm")]: {
            width: 200,
        }
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

const mockServices = [
    {
        id: 1,
        name: 'Oil change',
        imageLink: 'https://bmwusaservice.com/content/images/valueservice/bmw/bmw-oil-change.jpg',
        price: 99.99,
        description: "<p>Replacing an engine air filter does more than just increase airflow to the engine, it also increases fuel economy and reduces your vehicle\u2019s overall emissions. Engine air filters prevent abrasive materials from entering the engine\u2019s cylinders, where they would cause mechanical wear and contaminate your oil. In turn, a clean air filter promotes increased gas mileage and reduced emissions over time.</p><p>Work performed in this service:</p><ul><li>Removal and reinstallation of the air filter housing.</li><li>Replacement of used engine air filter and replacement with new BMW engine air filter.</li><li>Multi-point check, including brakes, power steering and air conditioning belts, air filter, and tires for wear and alignment.</li><li>Security check, including condition of safety belts and function of automatic-locking retractors, belt locks and belt buckles.</li><li>Coolant levels are checked.</li><li>Fluid level and antifreeze additive in windshield washer fluid reservoir are checked and topped off, if needed.</li><li>Check brake fluid level and the corresponding interval indicator (recommend replacement every two years, at the latest).</li></ul><p>This engine air filter replacement service is performed by BMW Trained Technicians at your local BMW Center.</p><p class=\"disclaimer\">Prices include parts and labor. Taxes and additional costs may apply. Service availability and pricing may vary for non-standard options, including M Sport options and equipment. Ask your BMW Center for further details.</p>",
    },
    {
        id: 2,
        name: 'Oil change',
        imageLink: 'https://bmwusaservice.com/content/images/valueservice/bmw/bmw-oil-change.jpg',
        price: 99.99,
        description: "<p>Replacing an engine air filter does more than just increase airflow to the engine, it also increases fuel economy and reduces your vehicle\u2019s overall emissions. Engine air filters prevent abrasive materials from entering the engine\u2019s cylinders, where they would cause mechanical wear and contaminate your oil. In turn, a clean air filter promotes increased gas mileage and reduced emissions over time.</p><p>Work performed in this service:</p><ul><li>Removal and reinstallation of the air filter housing.</li><li>Replacement of used engine air filter and replacement with new BMW engine air filter.</li><li>Multi-point check, including brakes, power steering and air conditioning belts, air filter, and tires for wear and alignment.</li><li>Security check, including condition of safety belts and function of automatic-locking retractors, belt locks and belt buckles.</li><li>Coolant levels are checked.</li><li>Fluid level and antifreeze additive in windshield washer fluid reservoir are checked and topped off, if needed.</li><li>Check brake fluid level and the corresponding interval indicator (recommend replacement every two years, at the latest).</li></ul><p>This engine air filter replacement service is performed by BMW Trained Technicians at your local BMW Center.</p><p class=\"disclaimer\">Prices include parts and labor. Taxes and additional costs may apply. Service availability and pricing may vary for non-standard options, including M Sport options and equipment. Ask your BMW Center for further details.</p>",
    },
    {
        id: 3,
        name: 'Oil change',
        imageLink: 'https://bmwusaservice.com/content/images/valueservice/bmw/bmw-oil-change.jpg',
        price: 99.99,
        description: "<p>Replacing an engine air filter does more than just increase airflow to the engine, it also increases fuel economy and reduces your vehicle\u2019s overall emissions. Engine air filters prevent abrasive materials from entering the engine\u2019s cylinders, where they would cause mechanical wear and contaminate your oil. In turn, a clean air filter promotes increased gas mileage and reduced emissions over time.</p><p>Work performed in this service:</p><ul><li>Removal and reinstallation of the air filter housing.</li><li>Replacement of used engine air filter and replacement with new BMW engine air filter.</li><li>Multi-point check, including brakes, power steering and air conditioning belts, air filter, and tires for wear and alignment.</li><li>Security check, including condition of safety belts and function of automatic-locking retractors, belt locks and belt buckles.</li><li>Coolant levels are checked.</li><li>Fluid level and antifreeze additive in windshield washer fluid reservoir are checked and topped off, if needed.</li><li>Check brake fluid level and the corresponding interval indicator (recommend replacement every two years, at the latest).</li></ul><p>This engine air filter replacement service is performed by BMW Trained Technicians at your local BMW Center.</p><p class=\"disclaimer\">Prices include parts and labor. Taxes and additional costs may apply. Service availability and pricing may vary for non-standard options, including M Sport options and equipment. Ask your BMW Center for further details.</p>",
    },
    {
        id: 4,
        name: 'Oil change',
        imageLink: 'https://bmwusaservice.com/content/images/valueservice/bmw/bmw-oil-change.jpg',
        price: 99.99,
        description: "<p>Replacing an engine air filter does more than just increase airflow to the engine, it also increases fuel economy and reduces your vehicle\u2019s overall emissions. Engine air filters prevent abrasive materials from entering the engine\u2019s cylinders, where they would cause mechanical wear and contaminate your oil. In turn, a clean air filter promotes increased gas mileage and reduced emissions over time.</p><p>Work performed in this service:</p><ul><li>Removal and reinstallation of the air filter housing.</li><li>Replacement of used engine air filter and replacement with new BMW engine air filter.</li><li>Multi-point check, including brakes, power steering and air conditioning belts, air filter, and tires for wear and alignment.</li><li>Security check, including condition of safety belts and function of automatic-locking retractors, belt locks and belt buckles.</li><li>Coolant levels are checked.</li><li>Fluid level and antifreeze additive in windshield washer fluid reservoir are checked and topped off, if needed.</li><li>Check brake fluid level and the corresponding interval indicator (recommend replacement every two years, at the latest).</li></ul><p>This engine air filter replacement service is performed by BMW Trained Technicians at your local BMW Center.</p><p class=\"disclaimer\">Prices include parts and labor. Taxes and additional costs may apply. Service availability and pricing may vary for non-standard options, including M Sport options and equipment. Ask your BMW Center for further details.</p>",
    },
    {
        id: 5,
        name: 'Oil change',
        imageLink: 'https://bmwusaservice.com/content/images/valueservice/bmw/bmw-oil-change.jpg',
        price: 99.99,
        description: "<p>Replacing an engine air filter does more than just increase airflow to the engine, it also increases fuel economy and reduces your vehicle\u2019s overall emissions. Engine air filters prevent abrasive materials from entering the engine\u2019s cylinders, where they would cause mechanical wear and contaminate your oil. In turn, a clean air filter promotes increased gas mileage and reduced emissions over time.</p><p>Work performed in this service:</p><ul><li>Removal and reinstallation of the air filter housing.</li><li>Replacement of used engine air filter and replacement with new BMW engine air filter.</li><li>Multi-point check, including brakes, power steering and air conditioning belts, air filter, and tires for wear and alignment.</li><li>Security check, including condition of safety belts and function of automatic-locking retractors, belt locks and belt buckles.</li><li>Coolant levels are checked.</li><li>Fluid level and antifreeze additive in windshield washer fluid reservoir are checked and topped off, if needed.</li><li>Check brake fluid level and the corresponding interval indicator (recommend replacement every two years, at the latest).</li></ul><p>This engine air filter replacement service is performed by BMW Trained Technicians at your local BMW Center.</p><p class=\"disclaimer\">Prices include parts and labor. Taxes and additional costs may apply. Service availability and pricing may vary for non-standard options, including M Sport options and equipment. Ask your BMW Center for further details.</p>",
    },
    {
        id: 6,
        name: 'Oil change',
        imageLink: 'https://bmwusaservice.com/content/images/valueservice/bmw/bmw-oil-change.jpg',
        price: 99.99,
        description: "<p>Replacing an engine air filter does more than just increase airflow to the engine, it also increases fuel economy and reduces your vehicle\u2019s overall emissions. Engine air filters prevent abrasive materials from entering the engine\u2019s cylinders, where they would cause mechanical wear and contaminate your oil. In turn, a clean air filter promotes increased gas mileage and reduced emissions over time.</p><p>Work performed in this service:</p><ul><li>Removal and reinstallation of the air filter housing.</li><li>Replacement of used engine air filter and replacement with new BMW engine air filter.</li><li>Multi-point check, including brakes, power steering and air conditioning belts, air filter, and tires for wear and alignment.</li><li>Security check, including condition of safety belts and function of automatic-locking retractors, belt locks and belt buckles.</li><li>Coolant levels are checked.</li><li>Fluid level and antifreeze additive in windshield washer fluid reservoir are checked and topped off, if needed.</li><li>Check brake fluid level and the corresponding interval indicator (recommend replacement every two years, at the latest).</li></ul><p>This engine air filter replacement service is performed by BMW Trained Technicians at your local BMW Center.</p><p class=\"disclaimer\">Prices include parts and labor. Taxes and additional costs may apply. Service availability and pricing may vary for non-standard options, including M Sport options and equipment. Ask your BMW Center for further details.</p>",
    },
    {
        id: 7,
        name: 'Oil change',
        imageLink: 'https://bmwusaservice.com/content/images/valueservice/bmw/bmw-oil-change.jpg',
        price: 99.99,
        description: "<p>Replacing an engine air filter does more than just increase airflow to the engine, it also increases fuel economy and reduces your vehicle\u2019s overall emissions. Engine air filters prevent abrasive materials from entering the engine\u2019s cylinders, where they would cause mechanical wear and contaminate your oil. In turn, a clean air filter promotes increased gas mileage and reduced emissions over time.</p><p>Work performed in this service:</p><ul><li>Removal and reinstallation of the air filter housing.</li><li>Replacement of used engine air filter and replacement with new BMW engine air filter.</li><li>Multi-point check, including brakes, power steering and air conditioning belts, air filter, and tires for wear and alignment.</li><li>Security check, including condition of safety belts and function of automatic-locking retractors, belt locks and belt buckles.</li><li>Coolant levels are checked.</li><li>Fluid level and antifreeze additive in windshield washer fluid reservoir are checked and topped off, if needed.</li><li>Check brake fluid level and the corresponding interval indicator (recommend replacement every two years, at the latest).</li></ul><p>This engine air filter replacement service is performed by BMW Trained Technicians at your local BMW Center.</p><p class=\"disclaimer\">Prices include parts and labor. Taxes and additional costs may apply. Service availability and pricing may vary for non-standard options, including M Sport options and equipment. Ask your BMW Center for further details.</p>",
    },
    {
        id: 8,
        name: 'Oil change',
        imageLink: 'https://bmwusaservice.com/content/images/valueservice/bmw/bmw-oil-change.jpg',
        price: 99.99,
        description: "<p>Replacing an engine air filter does more than just increase airflow to the engine, it also increases fuel economy and reduces your vehicle\u2019s overall emissions. Engine air filters prevent abrasive materials from entering the engine\u2019s cylinders, where they would cause mechanical wear and contaminate your oil. In turn, a clean air filter promotes increased gas mileage and reduced emissions over time.</p><p>Work performed in this service:</p><ul><li>Removal and reinstallation of the air filter housing.</li><li>Replacement of used engine air filter and replacement with new BMW engine air filter.</li><li>Multi-point check, including brakes, power steering and air conditioning belts, air filter, and tires for wear and alignment.</li><li>Security check, including condition of safety belts and function of automatic-locking retractors, belt locks and belt buckles.</li><li>Coolant levels are checked.</li><li>Fluid level and antifreeze additive in windshield washer fluid reservoir are checked and topped off, if needed.</li><li>Check brake fluid level and the corresponding interval indicator (recommend replacement every two years, at the latest).</li></ul><p>This engine air filter replacement service is performed by BMW Trained Technicians at your local BMW Center.</p><p class=\"disclaimer\">Prices include parts and labor. Taxes and additional costs may apply. Service availability and pricing may vary for non-standard options, including M Sport options and equipment. Ask your BMW Center for further details.</p>",
    },
    {
        id: 9,
        name: 'Oil change',
        imageLink: 'https://bmwusaservice.com/content/images/valueservice/bmw/bmw-oil-change.jpg',
        price: 99.99,
        description: "<p>Replacing an engine air filter does more than just increase airflow to the engine, it also increases fuel economy and reduces your vehicle\u2019s overall emissions. Engine air filters prevent abrasive materials from entering the engine\u2019s cylinders, where they would cause mechanical wear and contaminate your oil. In turn, a clean air filter promotes increased gas mileage and reduced emissions over time.</p><p>Work performed in this service:</p><ul><li>Removal and reinstallation of the air filter housing.</li><li>Replacement of used engine air filter and replacement with new BMW engine air filter.</li><li>Multi-point check, including brakes, power steering and air conditioning belts, air filter, and tires for wear and alignment.</li><li>Security check, including condition of safety belts and function of automatic-locking retractors, belt locks and belt buckles.</li><li>Coolant levels are checked.</li><li>Fluid level and antifreeze additive in windshield washer fluid reservoir are checked and topped off, if needed.</li><li>Check brake fluid level and the corresponding interval indicator (recommend replacement every two years, at the latest).</li></ul><p>This engine air filter replacement service is performed by BMW Trained Technicians at your local BMW Center.</p><p class=\"disclaimer\">Prices include parts and labor. Taxes and additional costs may apply. Service availability and pricing may vary for non-standard options, including M Sport options and equipment. Ask your BMW Center for further details.</p>",
    },
]

type TServiceSelectionProps = {
    onNext: () => void;
    onBack: () => void;
}

const ServiceSelection: React.FC<TServiceSelectionProps> = ({onNext, onBack}) => {
    const {valueService} = useSelector((state: RootState) => state.appointmentFrame);
    const dispatch = useDispatch();

    const onSelectClick = (item: TValueService) => async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        await dispatch(setValueServicePartial({selectedService: item}));
        onNext();
    };

    return (
        <PageWrapper>
            <CarName>{valueService?.year?.year} {valueService?.series?.name} {valueService?.model}</CarName>
            <ChangeButton onClick={onBack} variant="text">Change Vehicle</ChangeButton>
            <SubTitle>Select Service</SubTitle>
            <Container>
                {mockServices.map(service => {
                    return <CardWrapper>
                        <Title>{service.name}</Title>
                        <img className="image" src={service.imageLink} alt="service picture"/>
                        <div className="buttonsWrapper">
                            <SelectButton onClick={onSelectClick(service)}>Select</SelectButton>
                            <Price>$ {service.price}</Price>
                        </div>
                    </CardWrapper>
                })}
            </Container>
        </PageWrapper>
    );
};

export default ServiceSelection;