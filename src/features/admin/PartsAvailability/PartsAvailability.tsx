import React, {useEffect, useState} from 'react';
import {ButtonsWrapper, FiltersWrapper, InputWrapper} from "./styles";
import {SearchDebounced} from "../../../components/formControls/SearchDebounced/SearchDebounced";
import {Button} from "@mui/material";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import {useSCs} from "../../../hooks/useSCs/useSCs";
import {usePagination} from "../../../hooks/usePaginations/usePaginations";
import {
    loadRecalls,
    setRecallPageData,
    setRecallSearch,
    updatePartsAvailability
} from "../../../store/reducers/recall/actions";
import {IRecall} from "../../../store/reducers/recall/types";
import PartsAvailabilityTable from "./PartsAvailabilityTable/PartsAvailabilityTable";
import {useException} from "../../../hooks/useException/useException";
import {useMessage} from "../../../hooks/useMessage/useMessage";

const PartsAvailability = () => {
    const {recalls, order, searchTerm} = useSelector((state: RootState) => state.recalls);
    const [search, setSearch] = useState<string>("");
    const [isEdit, setEdit] = useState<boolean>(false);
    const [isChecked, setChecked] = useState<boolean>(false);
    const [data, setData] = useState<IRecall[]>([]);

    const dispatch = useDispatch();
    const {selectedSC} = useSCs();
    const showError = useException();
    const showMessage  =useMessage();
    const {pageIndex,pageSize} = usePagination(
        (s: RootState) => s.recalls.recallPageData,
        setRecallPageData
    );

    useEffect(() => {
        setData([...recalls].sort((a, b) => a.localIndex - b.localIndex))
    }, [recalls])

    useEffect(() => {
        if (selectedSC) {
            dispatch(loadRecalls(selectedSC.id))
        }
    }, [selectedSC, pageIndex, pageSize, order, searchTerm])



    const onSearch = () => {
        dispatch(setRecallSearch(search))
    }

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value)
    }

    const onCancel = () => {
        setChecked(false);
        setEdit(false);
        setData(recalls);
    }

    const checkIsValid = (): boolean => {
        setChecked(true)
        const isValid = data
            .every(el => el.partLeadDaysCount >=0 && el.partLeadDaysCount <= 99 && el.dailyPartsCount >= 1 && el.dailyPartsCount <= 99)
        if (!isValid) {
            if (data.find(el => el.partLeadDaysCount < 0 || el.partLeadDaysCount > 99)) {
                showError("Part Lead Days Count must be from 0 to 99")
            }
            if (data.find(el => el.dailyPartsCount < 1 || el.dailyPartsCount > 99)) {
                showError("Daily Parts Count must be from 1 to 99")
            }
        }
        return isValid
    }

    const onSuccess = () => {
        showMessage("Parts Availability saved")
        setEdit(false)
        setChecked(false)
    }

    const onSave = () => {
        if (checkIsValid()) {
            const dataToSave = data.map(el => ({
                id: el.id,
                partLeadDaysCount: el.partLeadDaysCount ?? 0,
                dailyPartsCount: el.dailyPartsCount ?? 0,
                isRemedyAvailable: el.isRemedyAvailable,
                rolloverMessage: el.rolloverMessage ?? '',
            }))
            if (selectedSC) dispatch(updatePartsAvailability(selectedSC.id, dataToSave, showError, onSuccess))
        }
    }

    return (
        <>
            <FiltersWrapper>
                <InputWrapper>
                    <SearchDebounced
                        fullWidth
                        onSearch={onSearch}
                        onChange={handleSearchChange}
                        value={search}
                        placeholder="Search..."/>
                </InputWrapper>
                <ButtonsWrapper>
                    {!isEdit
                        ? <Button onClick={() => setEdit(true)} variant="text" color="primary">Edit Table</Button>
                        : <>
                            <Button onClick={onCancel} variant="text" color="secondary">Cancel</Button>
                            <Button onClick={onSave} variant="text" color="primary">Save</Button>
                        </>
                    }
                </ButtonsWrapper>
            </FiltersWrapper>
            <PartsAvailabilityTable isEdit={isEdit} data={data} setData={setData} checked={isChecked} setChecked={setChecked}/>
        </>
    );
};

export default PartsAvailability;