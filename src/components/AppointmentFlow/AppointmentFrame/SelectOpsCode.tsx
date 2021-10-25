import React, {useEffect, useRef, useState} from 'react';
import {Actions} from "./Actions";
import {StepWrapper} from "./StepWrapper";
import {useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import {useDebounce} from "../../../utils/hooks";
import {handleSearch, loadSRs, selectAppointment, selectSR} from "../../../store/reducers/appointment/actions";
import {decodeSCID} from "../../../utils/utils";
import {Checkbox, FormControlLabel, IconButton, styled} from "@material-ui/core";
import {InputLoading, TextField} from "../UI";
import {Search} from "@material-ui/icons";
import {TArgCallback, TCallback} from "../../../types/types";
import {TScreen} from "../../Layout/types";
import {checkSelectedCar} from "./utils";
import ReactGA from "react-ga";


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
}

export const SelectOpsCode: React.FC<TProps> = ({onNext, onBack}) => {
    const [loading, setLoading] = useState<boolean>(false);

    const [searchInput, setSearch] = useState<string>("");

    const {id} = useParams();
    const [selectedCode, srList, search, vehicles, vehicle] = useSelector((state: RootState) => [
        state.appointment.selectedSR,
        state.appointment.serviceRequests,
        state.appointment.search,
        state.appointment.customerLoadedData?.vehicles,
        state.appointment.customerSelectedVehicle
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

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            try {
                await dispatch(loadSRs(decodeSCID(id)));
            } finally {
                setLoading(false);
            }
        }
        fetchData().finally();
    }, [id, dispatch, search]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    }

    const handleSelectCode = ({target: {value}}: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(selectSR(value ? Number(value) : null));
        dispatch(selectAppointment(null));
    }

    const handleNext = () => {
        ReactGA.event({
            category: 'User',
            action: 'Selected Individual Service Requests',
            label: `With Codes ${srList.filter(item => selectedCode.includes(item.id)).map(sr => sr.code).join(', ')}`
        })
        if (!checkSelectedCar(vehicle, vehicles)) {
            onNext("carDetails");
        } else {
            onNext("consultantSelection");
        }
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
                    {srList.map(s => {
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
            <Actions onBack={onBack} nextDisabled={!selectedCode.length} onNext={handleNext} />
        </StepWrapper>
    );
};