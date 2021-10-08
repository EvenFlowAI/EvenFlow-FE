import React, {useCallback, useEffect, useState} from 'react';
import {DialogProps} from "../types";
import {TableRowDataType} from "../../UI/types";
import {IServiceRequest} from "../../../store/reducers/serviceRequests/types";
import {Button, Radio} from "@material-ui/core";
import {Table} from "../../UI/Table";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import {usePagination, useSCs} from "../../../utils/hooks";
import {
    loadNonSelectedServiceRequests,
    setNonSelectedFilter,
    setNonSelectedPageData
} from "../../../store/reducers/serviceRequests/actions";
import {BaseModal, DialogActions, DialogContent, DialogTitle} from "../BaseModal";
import {SearchInput} from "../../UI/SearchInput";
import {LoadingButton} from "../../UI/Button";
import {updatePackage} from "../../../store/reducers/packages/actions";
import {Autocomplete} from "@material-ui/lab";
import {autocompleteRender} from "../../UI/AutocompleteRender";
import {MaintenanceOptions} from "../../Optimizer/MaintenancePackages/OptionsTable/OptionsTable";
import {makeStyles} from "@material-ui/core/styles";

const tableData: TableRowDataType<IServiceRequest>[] = [
    {header: "OPS CODE", val: el => el.code},
    {header: "DESCRIPTION", val: el => el.description},
]

type TModalProps = DialogProps & {
    packageName: string;
}

type TSelectedOption = {
    type: string | number;
    name: string;
}

const useStyles = makeStyles(() => ({
    wrapper: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center', width: '100%',
        marginBottom: 10,
        padding: 10,
    },
    optionLabel: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    subTitle: {
        display: 'flex',
        justifyContent: 'center',
        marginBottom: 20,
        fontSize: 17,
    }
}))

const AssignOpsCodeModal: React.FC<TModalProps> = (props) => {
    const [selectedCode, setSelectedCode] = useState<number | null>(null);
    const [saving, setSaving] = useState<boolean>(false);
    const [selectedOption, setSelectedOption] = useState<TSelectedOption | null>(null);
    const {selectedSC} = useSCs();
    const dispatch = useDispatch();
    const classes = useStyles();
    const [
        serviceList,
        isLoading,
        servicesCount,
        search,
        currentPackage,
    ] = useSelector((state: RootState) => [
        state.serviceRequests.nonSelectedList,
        state.serviceRequests.nonSelectedLoading,
        state.serviceRequests.nonSelectedPaging.numberOfRecords,
        state.serviceRequests.nonSelectedFilter.searchTerm,
        state.packages.currentPackage,
    ]);
    const {changeRowsPerPage, changePage, pageIndex, pageSize} = usePagination(
        (s: RootState) => s.serviceRequests.nonSelectedPageData,
        setNonSelectedPageData
    );

    useEffect(() => {
        if (props.open && selectedSC) {
            dispatch(loadNonSelectedServiceRequests(selectedSC.id));
        }
    }, [props.open, dispatch, selectedSC, pageSize, pageIndex]);

    const handleSelect = (el: IServiceRequest) => {
        setSelectedCode(el.id);
    }

    const preActions = (el: IServiceRequest) => {
        return <Radio color="primary" checked={selectedCode === +el.id} onChange={() => handleSelect(el)} />
    }

    const handleSearch = useCallback(() => {
        if (selectedSC) {
            dispatch(loadNonSelectedServiceRequests(selectedSC.id));
        }
    }, [dispatch, selectedSC]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(setNonSelectedFilter({searchTerm: e.target.value}));
    }

    const handleAssign = async () => {
        if (currentPackage && selectedOption && selectedCode) {
            const newRequest = {type: +selectedOption.type, serviceRequestId: selectedCode};
            const data = {...currentPackage, serviceRequestsAssigned: [...currentPackage.serviceRequestsAssigned, newRequest]};
            await dispatch(updatePackage(currentPackage.id, data))
            await setSaving(false);
        }
    }

    const onSelectOption = (e: React.ChangeEvent<{}>, value: TSelectedOption | null) => {
        setSelectedOption(value);
    }

    return (
        <BaseModal {...props}>
            <DialogTitle onClose={props.onClose}>ASSIGN OPS CODE</DialogTitle>
            <div className={classes.subTitle}>{props.packageName}</div>
            <DialogContent>
                <div className={classes.wrapper}>
                    {currentPackage && <Autocomplete
                        options={currentPackage.options.map(option => ({name: MaintenanceOptions[option.type], type: option.type}))}
                        getOptionSelected={(option, value) => option.type === value.type}
                        getOptionLabel={option => option.name}
                        onChange={onSelectOption}
                        renderInput={autocompleteRender({label: "Select A Package Option", fullWidth: true})}
                        value={selectedOption}/>}
                    <SearchInput onSearch={handleSearch} onChange={handleSearchChange} value={search} />
                </div>
                <Table<IServiceRequest>
                    data={serviceList}
                    index="id"
                    startActions={preActions}
                    compact
                    rowData={tableData}
                    isLoading={isLoading}
                    page={pageIndex}
                    rowsPerPage={pageSize}
                    onChangePage={changePage}
                    onChangeRowsPerPage={changeRowsPerPage}
                    count={servicesCount}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={props.onClose}>
                    Close
                </Button>
                <LoadingButton
                    loading={saving}
                    disabled={!selectedCode || !selectedOption}
                    onClick={handleAssign}
                    color="primary"
                    variant="contained"
                >
                    Save
                </LoadingButton>
            </DialogActions>
        </BaseModal>
    );
};

export default AssignOpsCodeModal;