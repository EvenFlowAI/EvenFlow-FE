import React, {useCallback, useEffect, useState} from "react";
import {Button} from "@material-ui/core";
import {CreateServiceCenterModal} from "../CreateServiceCenterModal/CreateServiceCenterModal";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../../store/rootReducer";
import {SearchInput} from "../../../../components/formControls/SearchInput/SearchInput";
import {loadAll, setSCSearch, setSelectedDealershipGroupId} from "../../../../store/reducers/serviceCenters/actions";
import {changePageData} from "../../../../store/reducers/dealershipGroups/actions";
import {Autocomplete} from "@material-ui/lab";
import {autocompleteRender} from "../../../../utils/autocompleteRenders";
import {useStyles} from "./styles";
import {TSelectedGroup} from "../types";
import {SearchDB} from "../../../../components/formControls/SearchDebounced/SearchDB";
import {useModal} from "../../../../hooks/useModal/useModal";
import {useCurrentUser} from "../../../../hooks/useCurrentUser/useCurrentUser";

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
        : <div className={classes.buttonsWrapper}>
            <SearchDB onSearch={handleSearch} search={search} />
            <Button
                color="primary"
                onClick={onOpen}
                variant="contained">
                Add Service Center
            </Button>
            <CreateServiceCenterModal open={isOpen} onClose={onClose} />
        </div>;
}