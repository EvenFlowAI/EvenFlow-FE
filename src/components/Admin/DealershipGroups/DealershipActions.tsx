import React, {useCallback} from "react";
import {Button} from "@material-ui/core";
import {CreateDealershipGroup} from "../../Modals/CreateDealershipGroup/CreateDealershipGroup";
import {useModal} from "../../../utils/hooks";
import {SearchInput} from "../../UI/SearchInput";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import {loadAll, setSearchTerm} from "../../../store/reducers/dealershipGroups/actions";

export const DealershipActions = () => {
    const { searchTerm } = useSelector((state: RootState) => state.dealershipGroups);
    const {isOpen, onOpen, onClose} = useModal();
    const dispatch = useDispatch();

    const handleSearch = useCallback(() => {
        dispatch(loadAll());
    }, [])

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(setSearchTerm(e.target.value));
    }

    return <>
        <SearchInput onSearch={handleSearch} onChange={handleSearchChange} value={searchTerm} />
        <Button
            variant="contained"
            onClick={onOpen}
            color="primary">
            Create new
        </Button>
        <CreateDealershipGroup open={isOpen} onClose={onClose} />
    </>;
}
