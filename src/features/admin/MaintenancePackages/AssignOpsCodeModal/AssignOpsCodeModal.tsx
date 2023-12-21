import React, {useCallback, useEffect, useState} from 'react';
import {DialogProps} from "../../../../components/BaseModal/types";
import {IServiceRequest} from "../../../../store/reducers/serviceRequests/types";
import {Button, Radio} from "@material-ui/core";
import {Table} from "../../../../components/Table/Table";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../../store/rootReducer";
import {
    loadNonSelectedServiceRequests,
    setNonSelectedFilter,
    setNonSelectedPageData
} from "../../../../store/reducers/serviceRequests/actions";
import {BaseModal, DialogActions, DialogContent, DialogTitle} from "../../../../components/BaseModal/BaseModal";
import {SearchInput} from "../../../../components/FormControls/SearchInput/SearchInput";
import {updatePackageOptions} from "../../../../store/reducers/packages/actions";
import {Autocomplete} from "@material-ui/lab";
import {autocompleteRender} from "../../../../utils/AutocompleteRender";
import {IPackageById} from "../../../../api/types";
import {MaintenanceOptions} from "../constants";
import {useInputStyles, useStyles} from "./styles";
import {TSelectedOption} from "../types";
import {LoadingButton} from "../../../../components/LoadingButton/LoadingButton";
import {TableRowDataType} from "../../../../types/types";
import {usePagination} from "../../../../hooks/usePaginations/usePaginations";
import {useException} from "../../../../hooks/useException/useException";
import {useSCs} from "../../../../hooks/useSCs/useSCs";

const tableData: TableRowDataType<IServiceRequest>[] = [
    {header: "OPS CODE", val: el => el.code},
    {header: "DESCRIPTION", val: el => el.description, width: '80%'},
]

type TModalProps = DialogProps & {
    packageName: string;
}

const AssignOpsCodeModal: React.FC<TModalProps> = ({ packageName, ...props}) => {
    const [selectedCode, setSelectedCode] = useState<number | null>(null);
    const [saving, setSaving] = useState<boolean>(false);
    const [selectedOption, setSelectedOption] = useState<TSelectedOption | null>(null);
    const [optionError, setOptionError] = useState<boolean>(false);
    const [
        serviceList,
        isLoading,
        servicesCount,
        search,
        currentPackage,
        nonSelectedPageData,
    ] = useSelector((state: RootState) => [
        state.serviceRequests.nonSelectedList,
        state.serviceRequests.nonSelectedLoading,
        state.serviceRequests.nonSelectedPaging.numberOfRecords,
        state.serviceRequests.nonSelectedFilter.searchTerm,
        state.packages.currentPackage,
        state.serviceRequests.nonSelectedPageData
    ]);

    const {selectedSC} = useSCs();
    const dispatch = useDispatch();
    const showError = useException();
    const classes = useStyles();
    const inputClasses = useInputStyles();

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
        try {
            if (currentPackage && selectedOption && selectedCode) {
                let options = [...currentPackage.options];
                let optionToChange = options.find(item => item.type === selectedOption.type);
                if (optionToChange) {
                    optionToChange = {...optionToChange, serviceRequestAssignedId: selectedCode};
                    options = options.filter(item => item.type !== selectedOption.type).concat(optionToChange)
                    dispatch(updatePackageOptions(currentPackage.id, options, showError))
                }
            }
        } catch (e) {
            showError(e);
        } finally {
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

    const getOptions = (currentPackage: IPackageById | null) => {
        const defaultOptions = Object.values(MaintenanceOptions);
        const options = [];
        for (let i = 0; i < 3; i++) {
            const currentOption = currentPackage?.options?.find(item => +item.type === i);
            options.push({name: currentOption?.name ?? defaultOptions[i], type: i})
        }
        return options;
    }

    return (
        <BaseModal {...props}>
            <DialogTitle onClose={handleClose}>ASSIGN OPS CODES TO MAINTENANCE PACKAGE OPTIONS</DialogTitle>
            <div className={classes.subTitle}>{packageName}</div>
            <DialogContent>
                <div className={classes.wrapper}>
                    {currentPackage && <Autocomplete
                      classes={inputClasses}
                      options={getOptions(currentPackage)}
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
                    hidePagination={servicesCount <= nonSelectedPageData.pageSize}
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