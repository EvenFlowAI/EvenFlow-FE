import React, {useEffect, useRef, useState} from 'react';
import {Actions} from "./Actions";
import {StepWrapper} from "./StepWrapper";
import {useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import {useDebounce, useModal} from "../../../utils/hooks";
import {
    handleSearch,
    selectAppointment,
    selectSR, selectSRMultiple
} from "../../../store/reducers/appointment/actions";
import {Checkbox, FormControlLabel, IconButton, styled} from "@material-ui/core";
import {InputLoading, TextField} from "../UI";
import {Search} from "@material-ui/icons";
import {TArgCallback, TCallback} from "../../../types/types";
import {TScreen} from "../../Layout/types";
import {checkSelectedCar} from "./utils";
import ReactGA from "react-ga";
import {IServiceRequest} from "../../../store/reducers/serviceRequests/types";
import {EServiceCategoryType} from "../../../store/reducers/categories/types";
import {loadCategoriesByQuery} from "../../../store/reducers/categories/actions";
import AskAddService from "../../Modals/AskAddService/AskAddService";
import {setAdditionalServicesChosen} from "../../../store/reducers/appointmentFrameReducer/actions";


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

const Code = styled(FormControlLabel)({
    width: "100%",
    padding: 0,
    margin: 0,
    border: "1px solid #DADADA",
    textTransform: "uppercase",
    "& span": {
        fontSize: 12,
        "&:last-child": {
            padding: "8px 8px 8px 0"
        }
    }
});

type TProps = {
    onNext: TArgCallback<TScreen>;
    onBack: TCallback;
    onAddServices?: () => void;
}

export const SelectOpsCode: React.FC<TProps> = ({onNext, onBack, onAddServices}) => {
    const [loading, setLoading] = useState<boolean>(false);

    const [searchInput, setSearch] = useState<string>("");
    const [opsCodesList, setOpsCodesList] = useState<IServiceRequest[]>([]);
    const { isOpen: isAdditionalOpen, onOpen: onAdditionalOpen, onClose: onAdditionalClose } = useModal();

    const {id} = useParams();
    const [selectedCode, srList, search, vehicles, vehicle, scProfile, subService, service, allCategories, selectedPackage] = useSelector((state: RootState) => [
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
    ]);
    const dispatch = useDispatch();
    const isInit = useRef(true);
    const debouncedSearch = useDebounce(searchInput);

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

    // todo change search request logic if needed

    useEffect(() => {
        if (scProfile) dispatch(loadCategoriesByQuery(scProfile.id))
    }, [scProfile])

    useEffect(() => {
        if (subService?.type === EServiceCategoryType.IndividualServices && service?.type === EServiceCategoryType.LinkToPage2) {
            setOpsCodesList(() => subService.serviceRequests);
        } else if (service?.type === EServiceCategoryType.Diagnose) {
            setOpsCodesList(() => service.serviceRequests);
        }
    }, [subService, service])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    }

    const handleSelectCode = ({target: {value}}: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(selectSR(value ? Number(value) : null));
        dispatch(selectAppointment(null));
    }

    const goNext = () => {
        if (!checkSelectedCar(vehicle, vehicles)) {
            onNext("carDetails");
        } else {
            onNext("consultantSelection");
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

    const handleBack = () => {
        let codes: number[] = [];
        if (subService?.type === EServiceCategoryType.IndividualServices && service?.type === EServiceCategoryType.LinkToPage2) {
            const diagnoseCategoryRequestsIds: number[] = allCategories
                .find(item => item.type === EServiceCategoryType.Diagnose)
                ?.serviceRequests.map(item => item.id) || [];
            codes = selectedCode
                .filter(item => !subService.serviceRequests.find(el => item === el.id) || diagnoseCategoryRequestsIds.includes(item))
        } else if (service?.type === EServiceCategoryType.Diagnose) {
            const individualRequestsIds: number[] = allCategories
                .find(item => item.type === EServiceCategoryType.IndividualServices)
                ?.serviceRequests.map(item => item.id) || [];
            codes = selectedCode
                .filter(item => !service.serviceRequests.find(el => item === el.id) || individualRequestsIds.includes(item))
        }
       dispatch(selectSRMultiple(codes));
        onBack();
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
                    placeholder="Type here"
                    value={searchInput}
                    onChange={handleChange}
                    style={{flexShrink: 0}}
                    InputProps={{
                        startAdornment: <IconButton
                            size="small">
                            <Search />
                        </IconButton>,
                        endAdornment: loading ?
                            <InputLoading />
                            : undefined
                    }}
                />
                <CodesWrapper>
                    {opsCodesList.map(s => {
                        return <Code
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
                        />
                    })}
                </CodesWrapper>
            </Wrapper>
            <AskAddService onSave={handleYes} onClose={handleNo} open={isAdditionalOpen}/>
            <Actions onBack={handleBack} nextDisabled={!selectedCode.length} onNext={handleNext} />
        </StepWrapper>
    );
};