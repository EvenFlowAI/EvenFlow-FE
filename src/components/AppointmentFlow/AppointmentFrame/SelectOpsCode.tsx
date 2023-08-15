import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {Actions} from "./Actions";
import {StepWrapper} from "./StepWrapper";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import {useDebounce, useModal} from "../../../utils/hooks";
import {handleSearch, selectSR, selectSRMultiple} from "../../../store/reducers/appointment/actions";
import {Checkbox, FormControlLabel, IconButton, styled} from "@material-ui/core";
import {TextField} from "../UI";
import {InfoOutlined, Search} from "@material-ui/icons";
import {TArgCallback} from "../../../types/types";
import {TScreen} from "../../Layout/types";
import {checkSelectedCar} from "./utils";
import ReactGA from "react-ga4";
//import ReactGA from "react-ga";
import {IServiceRequest} from "../../../store/reducers/serviceRequests/types";
import {EServiceCategoryType} from "../../../store/reducers/categories/types";
import AskAddService from "../../Modals/AskAddService/AskAddService";
import {
    selectCategoriesIds,
    setAdditionalServicesChosen
} from "../../../store/reducers/appointmentFrameReducer/actions";
import {Caption} from "../../UI/Caption";
import {useTranslation} from "react-i18next";
import {EServiceType} from "../../../store/reducers/appointmentFrameReducer/types";
import {EServiceCategoryPage} from "../../../api/types";

const Wrapper = styled('div')({
    width: "100%"
});

const SearchInput = styled(TextField)({
    "& button": {
        marginLeft: 6
    }
})

const CodesWrapper = styled('div')({
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    marginTop: 20
});

const CodeWrapper = styled('div')({
    border: "1px solid #DADADA",
    display: "flex",
    justifyContent: 'space-between',
    alignItems: 'center',
})

const Price = styled('span')({
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    fontSize: 18,
    fontWeight: "bold",
})

const PricesWrapper = styled('div')({
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    paddingRight: 8,
})

const OfferPrice = styled('div')({
    display: "flex",
    flexWrap: "nowrap",
    justifyContent: "space-between",
    alignItems: "center",
    marginRight: 28,
    fontSize: 14,
    color: '#008331',
})

const Code = styled(FormControlLabel)({
    width: "80%",
    padding: 0,
    margin: 0,
    textTransform: "uppercase",
    display: 'flex',
    "& span": {
        fontSize: 14,
        "&:last-child": {
            padding: "8px 8px 8px 0"
        }
    }
});

type TProps = {
    handleSetScreen: TArgCallback<TScreen>;
    onAddServices?: () => void;
    page: EServiceCategoryPage;
}

export const SelectOpsCode: React.FC<TProps> = ({handleSetScreen, onAddServices, page}) => {
    const [
        selectedSR,
        srList,
        search,
        vehicles,
        vehicle,
        scProfile,
        subService,
        service,
        allCategories,
        categoriesIds,
        serviceTypeOption,
        config,
    ] = useSelector((state: RootState) => [
        state.appointment.selectedSR,
        state.appointment.serviceRequests,
        state.appointment.search,
        state.appointment.customerLoadedData?.vehicles,
        state.appointment.customerSelectedVehicle,
        state.appointment.scProfile,
        state.appointmentFrame.subService,
        state.appointmentFrame.service,
        state.categories.allCategories,
        state.appointmentFrame.categoriesIds,
        state.appointmentFrame.serviceTypeOption,
        state.bookingFlowConfig.config,
    ]);

    const [searchInput, setSearch] = useState<string>("");
    const [opsCodesList, setOpsCodesList] = useState<IServiceRequest[]>([]);
    const [selectedOpsCodes, setSelectedOpsCodes] = useState<number[]>([]);

    const dispatch = useDispatch();
    const isInit = useRef(true);
    const {t} = useTranslation();
    const debouncedSearch = useDebounce(searchInput);
    const { isOpen: isAdditionalOpen, onOpen: onAdditionalOpen, onClose: onAdditionalClose } = useModal();
    const serviceType = useMemo(() => serviceTypeOption ? serviceTypeOption.type : EServiceType.VisitCenter, [serviceTypeOption]);

    useEffect(() => {
        setSelectedOpsCodes(selectedSR);
    }, [selectedSR])

    useEffect(() => {
        if (!isInit.current) {
            dispatch(handleSearch(debouncedSearch));
        }
    }, [debouncedSearch, dispatch]);
    useEffect(() => {
        if (isInit.current) {
            setSearch(search);
        }
    }, [search]);
    useEffect(() => {isInit.current = false}, []);

    const setInitialData = useCallback(() => {
        if (service?.type === EServiceCategoryType.IndividualServices || service?.type === EServiceCategoryType.Diagnose) {
            setOpsCodesList(() => service.serviceRequests);
        } else if (subService?.type === EServiceCategoryType.IndividualServices || subService?.type === EServiceCategoryType.Diagnose) {
            setOpsCodesList(() => subService.serviceRequests);
        }
    }, [subService, service])

    useEffect(() => {
        setInitialData()
    }, [subService, service])

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.persist()
        setSearch(e.target.value);
        const value = e?.target?.value?.toLowerCase().trim();
        const initialData = service?.type === EServiceCategoryType.IndividualServices || service?.type === EServiceCategoryType.Diagnose
            ? service.serviceRequests
            : subService?.type === EServiceCategoryType.IndividualServices || subService?.type === EServiceCategoryType.Diagnose
                ? subService.serviceRequests
                : []
        setOpsCodesList(() => {
            if (value?.length) {
                return initialData.filter(item => item.description.toLowerCase().includes(value));
            } else {
                return initialData;
            }
        })
    }

    const handleCategories = (value: string) => {
        const diagnoseCategory = allCategories.find(item => item.type === EServiceCategoryType.Diagnose && item.page === page);
        const diagnoseCategoryRequestsIds = diagnoseCategory?.serviceRequests.map(item => item.id) || [];
        const individualCategory = allCategories.find(item => item.type === EServiceCategoryType.IndividualServices && item.page === page);
        const individualRequestsIds = individualCategory?.serviceRequests.map(item => item.id) || [];
        let categories = [...categoriesIds];
        if (Number(value) && selectedSR.includes(Number(value))) {
            const filteredCodes = selectedSR.filter(id => id !== Number(value));
            if (!filteredCodes.find(code => diagnoseCategoryRequestsIds.includes(code))) {
                categories = categories.filter(id => id !== diagnoseCategory?.id);
            }
            if (!filteredCodes.find(code => individualRequestsIds.includes(code))) {
                categories = categories.filter(id => id !== individualCategory?.id);
            }
            dispatch(selectCategoriesIds(categories))
        }
    }

    const handleSelectCode = ({target: {value}}: React.ChangeEvent<HTMLInputElement>) => {
        handleCategories(value);
        setSelectedOpsCodes(prev => {
            return prev.includes(Number(value))
                ? prev.filter(el => el !== Number(value))
                : [...prev, Number(value)];
        })
    }

    const goNext = () => {
        handleSetScreen("maintenanceDetails");
        // if (!checkSelectedCar(vehicle, vehicles)) {
        //     handleSetScreen("maintenanceDetails");
        // } else {
        //     const nextScreen: TScreen = config.find(item => item.serviceType.toString() === serviceType.toString())?.advisorSelection
        //         ? "consultantSelection"
        //         : "appointmentTiming";
        //     handleSetScreen(nextScreen);
        // }
    }

    const handleNext = () => {
        ReactGA.event({
            category: 'EvenFlow User',
            action: 'Selected Individual Service Requests',
            label: `With Codes ${srList.filter(item => selectedOpsCodes.includes(item.id)).map(sr => `${sr.code} (${sr.description})`).join(', ')}`,
        })
        dispatch(selectSRMultiple(selectedOpsCodes))
        onAdditionalOpen()
    }

    const handleBack = () => {
        handleSetScreen('serviceNeeds');
    }

    const addServices = () => {
        dispatch(setAdditionalServicesChosen(true));
        if (onAddServices) onAddServices();
    }

    const handleYes = () => {
        onAdditionalClose();
        addServices();
    }

    const handleNo = () => {
        onAdditionalClose();
        goNext();
    }

    return (
        <StepWrapper>
            <Wrapper>
                <SearchInput
                    placeholder={t("Type here")}
                    value={searchInput}
                    onChange={handleSearchChange}
                    style={{flexShrink: 0}}
                    InputProps={{
                        startAdornment: <IconButton
                            size="small">
                            <Search />
                        </IconButton>,
                    }}
                />
                <CodesWrapper>
                    {opsCodesList.map(s => {
                        return <CodeWrapper key={`${s.code} ${s.id}`}>
                            <Code
                            key={s.id}
                            label={s?.description ?? s.code}
                            labelPlacement={"end"}
                            value={s.id}
                            control={
                                <Checkbox
                                    onChange={handleSelectCode}
                                    value={s.id}
                                    size={"small"}
                                    checked={selectedOpsCodes.includes(s.id)}
                                    color="primary"
                                />
                            }
                            >
                            </Code>
                            <PricesWrapper>
                                {/*todo uncomment for offer new functionality*/}
                                {/*{s.offer ? <OfferPrice style={{fontWeight: s.offer.type === EOfferType.FreeService ? 400 : 600}}>*/}
                                {/*    {getOfferString(s.offer, Boolean(scProfile?.isRoundPrice))}*/}
                                {/*</OfferPrice> : null}*/}
                            {Boolean(s.price)
                                ? <Price>${scProfile?.isRoundPrice ? s.price : s.price.toFixed(2)}</Price>
                                : <InfoOutlined style={{paddingRight: 8, fontSize: '2rem'}}/>}
                            </PricesWrapper>
                        </CodeWrapper>
                    })}
                </CodesWrapper>
                <Caption title={t("The price for the service will be quoted at the dealership")}/>
            </Wrapper>
            <AskAddService onSave={handleYes} onClose={handleNo} open={isAdditionalOpen}/>
            <Actions onBack={handleBack} nextDisabled={!selectedOpsCodes.length} onNext={handleNext} nextLabel={t("Next")}/>
        </StepWrapper>
    );
};