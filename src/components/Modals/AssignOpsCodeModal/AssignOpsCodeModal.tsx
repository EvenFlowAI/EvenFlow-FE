import React, {useCallback, useEffect, useState} from 'react';
import {DialogProps} from "../types";
import {TableRowDataType} from "../../UI/types";
import {IServiceRequest} from "../../../store/reducers/serviceRequests/types";
import {Button, Radio} from "@material-ui/core";
import {Table} from "../../UI/Table";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import {useException, usePagination, useSCs} from "../../../utils/hooks";
import {
    loadNonSelectedServiceRequests,
    setNonSelectedFilter,
    setNonSelectedPageData
} from "../../../store/reducers/serviceRequests/actions";
import {BaseModal, DialogActions, DialogContent, DialogTitle} from "../BaseModal";
import {SearchInput} from "../../UI/SearchInput";
import {LoadingButton} from "../../UI/Button";
import {updatePackageOptions} from "../../../store/reducers/packages/actions";
import {Autocomplete} from "@material-ui/lab";
import {autocompleteRender} from "../../UI/AutocompleteRender";
import {MaintenanceOptions} from "../../Optimizer/MaintenancePackages/OptionsTable/OptionsTable";
import {makeStyles} from "@material-ui/core/styles";

const tableData: TableRowDataType<IServiceRequest>[] = [
    {header: "OPS CODE", val: el => el.code},
    {header: "DESCRIPTION", val: el => el.description, width: '80%'},
]

type TModalProps = DialogProps & {
    packageName: string;
}

export type TSelectedOption = {
    type: string | number;
    name: string;
}

const useStyles = makeStyles(() => ({
    wrapper: {
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
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
    },
    selectedCode: {
        fontWeight: 'bold',
        fontSize: 14,
        maxWidth: '40%',
    }
}))

const useInputStyles = makeStyles(() => ({
    inputRoot: {
        fontWeight: 'bold',
    }
}))

const AssignOpsCodeModal: React.FC<TModalProps> = (props) => {
    const [selectedCode, setSelectedCode] = useState<number | null>(null);
    const [saving, setSaving] = useState<boolean>(false);
    const [selectedOption, setSelectedOption] = useState<TSelectedOption | null>(null);
    const [optionError, setOptionError] = useState<boolean>(false);
    const {selectedSC} = useSCs();
    const dispatch = useDispatch();
    const showError = useException();
    const classes = useStyles();
    const inputClasses = useInputStyles();
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

    const handleClose = useCallback((): void => {
        setSelectedOption(null);
        setSelectedCode(null);
        dispatch(setNonSelectedFilter({searchTerm: ''}));
        props.onClose();
    }, [setSelectedCode, setSelectedOption, props.onClose, dispatch])

    const handleSelect = useCallback((el: IServiceRequest) => {
        if (selectedOption) {
            setSelectedCode(el.id);
        } else {
            setOptionError(true);
            showError('Please select An Option first')
        }

    }, [setSelectedCode, selectedOption])

    const preActions = useCallback((el: IServiceRequest) => {
        return <Radio color="primary" checked={selectedCode === +el.id} onChange={() => handleSelect(el)} />
    }, [selectedCode, handleSelect])

    const handleSearch = useCallback(() => {
        if (selectedSC) {
            dispatch(loadNonSelectedServiceRequests(selectedSC.id, true));
        }
    }, [dispatch, selectedSC]);

    const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(setNonSelectedFilter({searchTerm: e.target.value}));
    }, [dispatch])

    const handleAssign = async () => {
        if (currentPackage && selectedOption && selectedCode) {
            let options = [...currentPackage.options];
            let optionToChange = options.find(item => item.type === selectedOption.type);
            if (optionToChange) {
                optionToChange = {...optionToChange, serviceRequestAssignedId: selectedCode};
                options = options.filter(item => item.type !== selectedOption.type).concat(optionToChange)
                dispatch(updatePackageOptions(currentPackage.id, options))
            }
            await setSaving(false);
            await handleClose();
        }
    }

    const onSelectOption = useCallback((e: React.ChangeEvent<{}>, value: TSelectedOption | null) => {
        setOptionError(false);
        setSelectedOption(value);
        if (currentPackage && value) {
            const assignedCode = currentPackage?.serviceRequestsAssigned?.find(item => item.type === value.type)
            if (assignedCode) setSelectedCode(assignedCode.serviceRequestId);
        }
    }, [setSelectedOption, currentPackage])

    const getSelectedOpsCode = (selectedOption: TSelectedOption): string => {
        let code = ''
        const assignedCode = currentPackage?.serviceRequestsAssigned?.find(item => item.type === selectedOption.type)
        if (assignedCode?.code) code = assignedCode.code.toString();
        if (assignedCode?.description) code += ` ${assignedCode.description}`
        return code;
    }

    return (
        <BaseModal {...props}>
            <DialogTitle onClose={handleClose}>ASSIGN MAINTENANCE PACKAGE OPTIONS OPS CODES </DialogTitle>
            <div className={classes.subTitle}>{props.packageName}</div>
            <DialogContent>
                <div className={classes.wrapper}>
                    {currentPackage && <Autocomplete
                        classes={inputClasses}
                        options={currentPackage.options.map(option => ({name: option.name || MaintenanceOptions[option.type], type: option.type}))}
                        getOptionSelected={(option, value) => option.type === value.type}
                        getOptionLabel={option => option.name}
                        onChange={onSelectOption}
                        renderInput={autocompleteRender({
                            label: "Select A Package Option",
                            fullWidth: true,
                            placeholder: 'Select An Option',
                            error: optionError,
                        })}
                        value={selectedOption}/>}
                    {currentPackage && selectedOption && <div className={classes.selectedCode}>
                        Selected:  {getSelectedOpsCode(selectedOption)}
                    </div>}
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
                <Button onClick={handleClose}>
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