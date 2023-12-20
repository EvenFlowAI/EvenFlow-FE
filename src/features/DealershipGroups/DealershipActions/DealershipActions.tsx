import React, {useCallback} from "react";
import {Button} from "@material-ui/core";
import {CreateDealershipGroupModal} from "../CreateDealershipGroupModal/CreateDealershipGroupModal";
import {useModal} from "../../../utils/hooks";
import {SearchInput} from "../../../components/UI/SearchInput";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import {loadAll, setSearchTerm} from "../../../store/reducers/dealershipGroups/actions";
import {useStyles} from "./styles";

export const DealershipActions = () => {
    const { searchTerm } = useSelector((state: RootState) => state.dealershipGroups);
    const {isOpen, onOpen, onClose} = useModal();
    const dispatch = useDispatch();
    const classes = useStyles();

    const handleSearch = useCallback(() => {
        dispatch(loadAll());
    }, [])

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(setSearchTerm(e.target.value));
    }

    return <div className={classes.buttonsWrapper}>
        <SearchInput onSearch={handleSearch} onChange={handleSearchChange} value={searchTerm} />
        <Button
            variant="contained"
            onClick={onOpen}
            color="primary">
            Create new
        </Button>
        <CreateDealershipGroupModal open={isOpen} onClose={onClose} />
    </div>;
}
