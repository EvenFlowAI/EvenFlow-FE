import React, {useCallback, useEffect, useState} from "react";
import {Button} from "@material-ui/core";
import {useCurrentUser, useModal} from "../../../utils/hooks";
import {CreateServiceCenter} from "../../Modals/CreateServiceCenter/CreateServiceCenter";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import {SearchDB, SearchInput} from "../../UI/SearchInput";
import {loadAll, setSCSearch, setSelectedDealershipGroupId} from "../../../store/reducers/serviceCenters/actions";
import {changePageData} from "../../../store/reducers/dealershipGroups/actions";
import {Autocomplete} from "@material-ui/lab";
import {autocompleteRender} from "../../UI/AutocompleteRender";
import {makeStyles} from "@material-ui/core/styles";

type TSelectedGroup = {
    name: string;
    id: number;
}

const useStyles = makeStyles(() => ({
   filtersWrapper: {
       display: 'flex',
       alignItems: 'center',
   },
    autocomplete: {
       marginLeft: 20,
    }
}))

export const ServiceCenterActions = () => {
    const search = useSelector((state: RootState) => state.serviceCenters.searchTerm);
    const { dealershipList } = useSelector((state: RootState) => state.dealershipGroups);
    const [selectedGroup, setSelectedGroup] = useState<TSelectedGroup | null>(null);
    const currentUser = useCurrentUser();
    const {isOpen, onClose, onOpen} = useModal();
    const dispatch = useDispatch();
    const classes = useStyles();

    useEffect(() => {
        if (currentUser?.isSuperUser) {
            dispatch(changePageData({pageIndex: 0, pageSize: 0}))
        }
    }, [currentUser])

    const handleSearch = useCallback((val: string) => {
        dispatch(setSCSearch(val));
    }, [dispatch]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(setSCSearch(e.target.value));
    }

    const onSearch = useCallback(() => {
        dispatch(loadAll())
    }, [])

    const onGroupChange = async (e: React.ChangeEvent<{}>, option: TSelectedGroup | null) => {
        setSelectedGroup(option);
        await dispatch(setSelectedDealershipGroupId(option?.id ? Number(option.id) : undefined));
        await dispatch(loadAll());
    }

    return currentUser?.isSuperUser
        ? <div className={classes.filtersWrapper}>
            <SearchInput onSearch={onSearch} onChange={handleSearchChange} value={search} />
            <Autocomplete
                renderInput={autocompleteRender({
                    label: '',
                    placeholder: 'Filter by Dealership Group',
                })}
                fullWidth
                onChange={onGroupChange}
                options={dealershipList.map(({ name, id }) => ({ name, id }))}
                value={selectedGroup}
                getOptionLabel={option => option.name}
                className={classes.autocomplete}
            />
        </div>
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