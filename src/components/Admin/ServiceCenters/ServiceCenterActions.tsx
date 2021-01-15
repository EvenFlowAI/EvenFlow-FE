import React, {useCallback} from "react";
import {SquareIconButton} from "../../UI/Button";
import {Search} from "@material-ui/icons";
import {Button} from "@material-ui/core";
import {useCurrentUser, useModal} from "../../../utils/hooks";
import {CreateServiceCenter} from "../../Modals/CreateServiceCenter/CreateServiceCenter";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import {SearchDB} from "../../UI/SearchInput";
import {setSCSearch} from "../../../store/reducers/serviceCenters/actions";

export const ServiceCenterActions = () => {
    const currentUser = useCurrentUser();
    const {isOpen, onClose, onOpen} = useModal();
    const search = useSelector((state: RootState) => state.serviceCenters.searchTerm);
    const dispatch = useDispatch();
    const handleSearch = useCallback((val: string) => {
        dispatch(setSCSearch(val));
    }, [dispatch]);

    return currentUser?.isSuperUser
        ? <>
            <SquareIconButton variant="outlined">
                <Search/>
            </SquareIconButton>
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