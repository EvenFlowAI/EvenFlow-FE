import React, {useCallback, useEffect, SetStateAction, Dispatch, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {Button, Radio} from "@material-ui/core";
import {DialogProps} from "../../../../../components/BaseModal/types";
import {TableRowDataType} from "../../../../../components/UI/types";
import {IServiceRequest} from "../../../../../store/reducers/serviceRequests/types";
import {RootState} from "../../../../../store/rootReducer";
import {Table} from "../../../../../components/UI/Table";
import {BaseModal, DialogActions, DialogContent, DialogTitle} from "../../../../../components/BaseModal/BaseModal";
import {SearchInput} from "../../../../../components/UI/SearchInput";
import {useException, usePagination, useSCs} from "../../../../../utils/hooks";
import {
    loadNonSelectedServiceRequests,
    setNonSelectedFilter,
    setNonSelectedPageData
} from "../../../../../store/reducers/serviceRequests/actions";

import {Autocomplete} from "@material-ui/lab";
import {autocompleteRender} from "../../../../../components/UI/AutocompleteRender";
import {MaintenanceOptions} from "../../../constants";
import {TAssignedRequest} from "../../../../../store/reducers/packages/types";
import {IPackageById} from "../../../../../api/types";
import {useInputStyles, useStyles} from "./styles";
import {TSelectOption} from "./types";
import {TSelectedOption} from "../../../types";

type TAssignOpsCodeModalProps = DialogProps & {
    selectedCodes: TAssignedRequest[];
    setSelectedCodes: Dispatch<SetStateAction<TAssignedRequest[]>>;
    title: string;
    isEditing?: boolean;
    optionError: boolean;
    setOptionError: Dispatch<SetStateAction<boolean>>;
}

const tableData: TableRowDataType<IServiceRequest>[] = [
    {header: "OPS CODE", val: el => el.code},
    {header: "DESCRIPTION", val: el => el.description, width: '80%'},
]

const AssignOpsCodeModal: React.FC<TAssignOpsCodeModalProps> =
    ({
         selectedCodes,
         setSelectedCodes,
         title,
         isEditing,
         optionError,
         setOptionError,
         ...props}) => {
    const {selectedSC} = useSCs();
    const [selectedOption, setSelectedOption] = useState<TSelectedOption | null>(null);
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
    const {changeRowsPerPage, changePage, pageIndex, pageSize} = usePagination(
        (s: RootState) => s.serviceRequests.nonSelectedPageData,
        setNonSelectedPageData
    );
    const dispatch = useDispatch();
    const classes = useStyles();
    const inputClasses = useInputStyles();
    const showError = useException();

    useEffect(() => {
        if (props.open && selectedSC) {
            dispatch(loadNonSelectedServiceRequests(selectedSC.id));
        }
    }, [props.open, dispatch, selectedSC, pageSize, pageIndex]);

    useEffect(() => {
        if (isEditing && currentPackage) {
            const firstOption = currentPackage.options[0]
            setSelectedOption({ type: firstOption.type, name: firstOption.name || MaintenanceOptions[firstOption.type]})
        }
    }, [isEditing, currentPackage])

    const handleClose = useCallback((): void => {
        dispatch(setNonSelectedFilter({searchTerm: ''}));
        props.onClose();
    }, [props.onClose, dispatch])

    const handleSelect = useCallback((el: IServiceRequest) => {
        if (selectedOption) {
           setSelectedCodes(prev => {
                const code = prev.find(code => +code.type === +selectedOption.type);
                if (code) {
                    return prev.filter(item => +item.type !== +code.type).concat([{type: selectedOption.type, serviceRequestId: el.id, code: el.code}])
                } else {
                    return [...prev, { type: selectedOption.type, serviceRequestId: el.id, code: el.code}]
                }
            });
        } else {
            showError('Please select option first');
            setOptionError(true);
        }
    }, [setSelectedCodes, selectedOption])

    const preActions = useCallback((el: IServiceRequest) => {
        const checked = !!selectedCodes.find(item => item.type === selectedOption?.type && item.serviceRequestId === +el.id)
        return <Radio color="primary" checked={checked} onChange={() => handleSelect(el)} />
    }, [selectedCodes, handleSelect])

    const handleSearch = useCallback(async () => {
        if (selectedSC) {
            changePage(null, 0)
            await dispatch(setNonSelectedPageData({pageIndex: 0, pageSize: 10}))
            await dispatch(loadNonSelectedServiceRequests(selectedSC.id, true));
        }
    }, [dispatch, selectedSC]);

    const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(setNonSelectedFilter({searchTerm: e.target.value}));
    }, [dispatch])

    const onSelectOption = useCallback((e: React.ChangeEvent<{}>, value: TSelectedOption | null) => {
        setOptionError(false);
        setSelectedOption(value);
        if (isEditing && currentPackage && value) {
            const assignedCode = currentPackage?.serviceRequestsAssigned?.find(item => item.type === value.type)
            if (assignedCode) setSelectedCodes(prev => {
                const request = {type: value.type, serviceRequestId: assignedCode.serviceRequestId, code: assignedCode.code};
                if (prev.find(item => item.type === value.type)) {
                    const data = prev.filter(item => item.type !== value.type);
                    return [...data, request]
                } else {
                 return [...prev, request];
                }
            });
        }
    }, [setSelectedOption, currentPackage])

    const getSelectedOpsCode = (selectedOption: TSelectedOption): string => {
        let code = ''
        const assignedCode = currentPackage?.serviceRequestsAssigned?.find(item => item.type === selectedOption.type)
        if (assignedCode) code = `${assignedCode.code} `;
        if (assignedCode?.description) code += assignedCode.description;
        return code;
    }

    const getOptions = (currentPackage: IPackageById | null): TSelectOption[] => {
        const defaultOptions = Object.values(MaintenanceOptions);
        const options = [];
        for (let i = 0; i < 3; i++) {
            const currentOption = currentPackage?.options?.find(item => +item.type === i);
            options.push({name: currentOption?.name && isEditing ? currentOption?.name : defaultOptions[i], type: i})
        }
        return options;
    }

    return (
        <BaseModal {...props} onClose={handleClose}>
            <DialogTitle onClose={handleClose}>{title}</DialogTitle>
            <DialogContent>
                <div className={classes.wrapper}>
                   <Autocomplete
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
                        value={selectedOption}/>
                    {currentPackage && selectedOption && isEditing && <div className={classes.selectedCode}>
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
            </DialogActions>
        </BaseModal>
    );
};

export default AssignOpsCodeModal;