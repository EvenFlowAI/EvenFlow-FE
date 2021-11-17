import React, {useCallback} from "react";
import {Button} from "@material-ui/core";
import {useCurrentUser, useModal} from "../../../utils/hooks";
import {CreateServiceCenter} from "../../Modals/CreateServiceCenter/CreateServiceCenter";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import {SearchDB, SearchInput} from "../../UI/SearchInput";
import {loadAll, setSCSearch} from "../../../store/reducers/serviceCenters/actions";

export const ServiceCenterActions = () => {
    const currentUser = useCurrentUser();
    const {isOpen, onClose, onOpen} = useModal();
    const search = useSelector((state: RootState) => state.serviceCenters.searchTerm);
    const dispatch = useDispatch();

    const handleSearch = useCallback((val: string) => {
        dispatch(setSCSearch(val));
    }, [dispatch]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(setSCSearch(e.target.value));
    }

    const onSearch = useCallback(() => {
        dispatch(loadAll())
    }, [])

    return currentUser?.isSuperUser
        ? <>
            <SearchInput onSearch={onSearch} onChange={handleSearchChange} value={search} />
            <Button variant="outlined">
                Filters
            </Button>
        </>
        : <>
            <SearchDB onSearch={handleSearch} search={search} />
            <Button
                color="primary"
                onClick={onOpen}
                variant="contained">
                Add service center
            </Button>
            <CreateServiceCenter open={isOpen} onClose={onClose} />
        </>;
}