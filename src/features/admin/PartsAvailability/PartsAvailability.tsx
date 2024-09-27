import React, {useEffect, useState} from 'react';
import {ButtonsWrapper, FiltersWrapper, InputWrapper} from "./styles";
import {SearchDebounced} from "../../../components/formControls/SearchDebounced/SearchDebounced";
import {Button} from "@mui/material";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import {useSCs} from "../../../hooks/useSCs/useSCs";
import {usePagination} from "../../../hooks/usePaginations/usePaginations";
import {loadRecalls, setRecallPageData, setRecallSearch} from "../../../store/reducers/recall/actions";
import {IRecall} from "../../../store/reducers/recall/types";
import PartsAvailabilityTable from "./PartsAvailabilityTable/PartsAvailabilityTable";

const PartsAvailability = () => {
    const {recalls, order, searchTerm} = useSelector((state: RootState) => state.recalls);
    const [search, setSearch] = useState<string>("");
    const [isEdit, setEdit] = useState<boolean>(false);
    const [data, setData] = useState<IRecall[]>([]);

    const dispatch = useDispatch();
    const {selectedSC} = useSCs();
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
        setEdit(false);
        setData(recalls);
    }

    const onSave = () => {}

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
            <PartsAvailabilityTable isEdit={isEdit} data={data} setData={setData}/>
        </>
    );
};

export default PartsAvailability;