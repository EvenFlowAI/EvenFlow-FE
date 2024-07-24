import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {ActionButtons} from "../../../ActionButtons/ActionButtons";
import {StepWrapper} from "../../../../../components/styled/StepWrapper";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../../../store/rootReducer";
import {handleSearch, selectSRMultiple} from "../../../../../store/reducers/appointment/actions";
import {Checkbox, IconButton} from "@mui/material";
import {InfoOutlined, Search} from "@mui/icons-material";
import {TArgCallback, TScreen} from "../../../../../types/types";
import ReactGA from "react-ga4";
import {IServiceRequest} from "../../../../../store/reducers/serviceRequests/types";
import {EServiceCategoryType} from "../../../../../store/reducers/categories/types";
import AskAddService from "../../../../../components/modals/booking/AskAddService/AskAddService";
import {
    checkCarIsValid,
    selectCategoriesIds,
    setAdditionalServicesChosen,
} from "../../../../../store/reducers/appointmentFrameReducer/actions";
import {Caption} from "../../../../../components/wrappers/Caption/Caption";
import {useTranslation} from "react-i18next";
import {EServiceCategoryPage} from "../../../../../api/types";
import {checkPodChanged} from "../../../../../store/reducers/appointments/actions";
import {getSortedRequests} from "./utils";
import {Code, CodesWrapper, CodeWrapper, Price, PricesWrapper, SearchInput, Wrapper} from "./styles";
import {useModal} from "../../../../../hooks/useModal/useModal";
import {useDebounce} from "../../../../../hooks/useDebounce/useDebounce";
import {useException} from "../../../../../hooks/useException/useException";

type TProps = {
    handleSetScreen: TArgCallback<TScreen>;
    onAddServices?: () => void;
    page: EServiceCategoryPage;
    isManagingFlow?: boolean;
}

export const SelectOpsCode: React.FC<TProps> = ({
                                                    isManagingFlow,
                                                    handleSetScreen,
                                                    onAddServices,
                                                    page
}) => {
    const {
        selectedSR,
        serviceRequests,
        search,
        scProfile,
    } = useSelector(({appointment}: RootState) => appointment)
    const {
        subService,
        service,
        categoriesIds,
        trackerData
    } = useSelector(({appointmentFrame}: RootState) => appointmentFrame)
    const {allCategories} = useSelector(({categories}: RootState) => categories)

    const [searchInput, setSearch] = useState<string>("");
    const [opsCodesList, setOpsCodesList] = useState<IServiceRequest[]>([]);
    const [selectedOpsCodes, setSelectedOpsCodes] = useState<number[]>([]);

    const dispatch = useDispatch();
    const isInit = useRef(true);
    const {t} = useTranslation();
    const debouncedSearch = useDebounce(searchInput);
    const showError = useException();
    const { isOpen: isAdditionalOpen, onOpen: onAdditionalOpen, onClose: onAdditionalClose } = useModal();
    const allRequestsHavePrice = useMemo(() => opsCodesList.every(el => Boolean(el.price)), [opsCodesList])

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
        return () => {
            dispatch(handleSearch(''))
        }
    }, [search]);

    useEffect(() => {isInit.current = false}, []);

    const setInitialData = useCallback(() => {
        if (service?.type === EServiceCategoryType.IndividualServices || service?.type === EServiceCategoryType.Diagnose) {
            setOpsCodesList(getSortedRequests(service.serviceRequests))
        } else if (subService?.type === EServiceCategoryType.IndividualServices || subService?.type === EServiceCategoryType.Diagnose) {
            setOpsCodesList(getSortedRequests(subService.serviceRequests))
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
    }

    const onCarIsValid = () => scProfile && dispatch(checkPodChanged(scProfile.id, showError))

    const handleGA = () => {
        ReactGA.event({
            category: 'EvenFlow User',
            action: 'Selected Individual Service Requests',
            label: `With Codes ${serviceRequests.filter(item => selectedOpsCodes.includes(item.id)).map(sr => `${sr.code} (${sr.description})`).join(', ')}`,
        })
        //, trackerData.ids
    }

    const handleNext = () => {
        handleGA();
        dispatch(selectSRMultiple(selectedOpsCodes))
        if (isManagingFlow) {
            dispatch(checkCarIsValid(onCarIsValid, goNext))
        } else {
            onAdditionalOpen()
        }
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
                {opsCodesList.length > 10 || searchInput.length
                    ? <SearchInput
                        placeholder={t("Type here")}
                        value={searchInput}
                        fullWidth
                        onChange={handleSearchChange}
                        style={{flexShrink: 0}}
                        variant="standard"
                        InputProps={{
                            startAdornment: <IconButton
                                size="small">
                                <Search/>
                            </IconButton>,
                            disableUnderline: true,
                        }}
                    />
                    : null}
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
                                }/>
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
                {allRequestsHavePrice ? null : <Caption title={t("The price for the service will be quoted at the dealership")}/>}
            </Wrapper>
            <AskAddService onSave={handleYes} onClose={handleNo} open={isAdditionalOpen}/>
            <ActionButtons onBack={handleBack} nextDisabled={!selectedOpsCodes.length} onNext={handleNext} nextLabel={t("Next")}/>
        </StepWrapper>
    );
};