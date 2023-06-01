import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {Actions} from "./Actions";
import {StepWrapper} from "./StepWrapper";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import {useDebounce, useModal} from "../../../utils/hooks";
import {
    handleSearch,
    selectSR,
    selectSRMultiple
} from "../../../store/reducers/appointment/actions";
import {Checkbox, FormControlLabel, IconButton, styled} from "@material-ui/core";
import {TextField} from "../UI";
import {InfoOutlined, Search} from "@material-ui/icons";
import {TArgCallback} from "../../../types/types";
import {TScreen} from "../../Layout/types";
import {checkSelectedCar} from "./utils";
//import ReactGA from "react-ga4";
import ReactGA from "react-ga";
import {IServiceRequest} from "../../../store/reducers/serviceRequests/types";
import {EServiceCategoryType} from "../../../store/reducers/categories/types";
import AskAddService from "../../Modals/AskAddService/AskAddService";
import {
    selectCategoriesIds,
    selectService,
    selectSubService,
    setAdditionalServicesChosen
} from "../../../store/reducers/appointmentFrameReducer/actions";
import {Caption} from "../../UI/Caption";
import {useTranslation} from "react-i18next";
import {EServiceType} from "../../../store/reducers/appointmentFrameReducer/types";

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
}

export const SelectOpsCode: React.FC<TProps> = ({handleSetScreen, onAddServices}) => {
    const [searchInput, setSearch] = useState<string>("");
    const [opsCodesList, setOpsCodesList] = useState<IServiceRequest[]>([]);
    const [
        selectedCode,
        srList,
        search,
        vehicles,
        vehicle,
        scProfile,
        subService,
        service,
        allCategories,
        selectedPackage,
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
        state.appointmentFrame.selectedPackage,
        state.appointmentFrame.categoriesIds,
        state.appointmentFrame.serviceTypeOption,
        state.bookingFlowConfig.config,
    ]);
    const dispatch = useDispatch();
    const isInit = useRef(true);
    const {t} = useTranslation();
    const debouncedSearch = useDebounce(searchInput);
    const { isOpen: isAdditionalOpen, onOpen: onAdditionalOpen, onClose: onAdditionalClose } = useModal();
    const serviceType = useMemo(() => serviceTypeOption?.type ?? EServiceType.VisitCenter, [serviceTypeOption]);

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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
        const diagnoseCategory = allCategories.find(item => item.type === EServiceCategoryType.Diagnose);
        const diagnoseCategoryRequestsIds = diagnoseCategory?.serviceRequests.map(item => item.id) || [];
        const individualCategory = allCategories.find(item => item.type === EServiceCategoryType.IndividualServices);
        const individualRequestsIds = individualCategory?.serviceRequests.map(item => item.id) || [];
        let categories = [...categoriesIds];
        if (Number(value) && selectedCode.includes(Number(value))) {
            if (!selectedCode.filter(id => id !== Number(value)).find(code => diagnoseCategoryRequestsIds.includes(code))) {
                categories = categories.filter(id => id !== diagnoseCategory?.id);
            }
            if (!selectedCode.filter(id => id !== Number(value)).find(code => individualRequestsIds.includes(code))) {
                categories = categories.filter(id => id !== individualCategory?.id);
            }
            dispatch(selectCategoriesIds(categories))
        }
    }

    const handleSelectCode = ({target: {value}}: React.ChangeEvent<HTMLInputElement>) => {
        handleCategories(value);
        dispatch(selectSR(value ? Number(value) : null));
    }

    const goNext = () => {
        if (!checkSelectedCar(vehicle, vehicles)) {
            handleSetScreen("maintenanceDetails");
        } else {
            const nextScreen: TScreen = config.find(item => item.serviceType.toString() === serviceType.toString())?.advisorSelection
                ? "consultantSelection"
                : "appointmentTiming";
            handleSetScreen(nextScreen);
        }
    }

    const handleNext = () => {
        ReactGA.event({
            category: 'EvenFlow User',
            action: 'Selected Individual Service Requests',
            label: `With Codes ${srList.filter(item => selectedCode.includes(item.id)).map(sr => `${sr.code} (${sr.description})`).join(', ')}`,
        })
        const categoryChosen = service?.type === 0 || subService?.type === 0;
        if (service?.type === EServiceCategoryType.Diagnose && (!selectedPackage || !categoryChosen)) {
            return onAdditionalOpen();
        }
        goNext();
    }

    const getIndCodes = (): number[] => {
        let codes: number[];
        const diagnoseCategory = allCategories.find(item => item.type === EServiceCategoryType.Diagnose);
        const diagnoseCategoryRequestsIds: number[] = diagnoseCategory?.serviceRequests.map(item => item.id) || [];
        codes = selectedCode.filter(item => {
            return !subService?.serviceRequests.find(el => item === el.id)
                || (diagnoseCategory && categoriesIds.includes(diagnoseCategory.id) && diagnoseCategoryRequestsIds.includes(item))
        })
        return codes;
    }

    const getDiagnoseCodes = (): number[] => {
        let codes: number[];
        const individualCategory = allCategories.find(item => item.type === EServiceCategoryType.IndividualServices);
        const individualRequestsIds = individualCategory?.serviceRequests.map(item => item.id) || [];
        codes = selectedCode.filter(code => {
            return !service?.serviceRequests.find(request => code === request.id)
                || (individualCategory && categoriesIds.includes(individualCategory?.id) && individualRequestsIds.includes(code))
        })
        return codes;
    }


    const handleBack = () => {
        let codes: number[] = [];
        if (subService?.type === EServiceCategoryType.IndividualServices) {
            codes = getIndCodes();
            dispatch(selectSubService(null));
            dispatch(selectCategoriesIds(categoriesIds.filter(item => item !== subService?.id)));
        } else if (service?.type === EServiceCategoryType.IndividualServices) {
            codes = getIndCodes();
            dispatch(selectService(null));
            dispatch(selectCategoriesIds(categoriesIds.filter(item => item !== service?.id)));
        } else if (subService?.type === EServiceCategoryType.Diagnose) {
            codes = getDiagnoseCodes();
            dispatch(selectSubService(null));
            dispatch(selectCategoriesIds(categoriesIds.filter(item => item !== subService?.id)));
        } else if (service?.type === EServiceCategoryType.Diagnose) {
            codes = getDiagnoseCodes();
            dispatch(selectService(null));
            dispatch(selectCategoriesIds(categoriesIds.filter(item => item !== service?.id)));
        }
        dispatch(selectSRMultiple(codes));
        handleSetScreen(service?.type === EServiceCategoryType.Diagnose
        || service?.type === EServiceCategoryType.IndividualServices
            ? 'serviceNeeds'
            : 'serviceSelection');
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
                    onChange={handleChange}
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
                                    checked={selectedCode.includes(s.id)}
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
            <Actions onBack={handleBack} nextDisabled={!selectedCode.length} onNext={handleNext} nextLabel={t("Next")}/>
        </StepWrapper>
    );
};