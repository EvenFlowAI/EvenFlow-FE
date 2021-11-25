import React, {useCallback, useEffect, SetStateAction, Dispatch, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {makeStyles} from "@material-ui/core/styles";
import {Button, Radio} from "@material-ui/core";
import {DialogProps} from "../../../types";
import {TableRowDataType} from "../../../../UI/types";
import {IServiceRequest} from "../../../../../store/reducers/serviceRequests/types";
import {RootState} from "../../../../../store/rootReducer";
import {Table} from "../../../../UI/Table";
import {BaseModal, DialogActions, DialogContent, DialogTitle} from "../../../BaseModal";
import {SearchInput} from "../../../../UI/SearchInput";
import {useException, usePagination, useSCs} from "../../../../../utils/hooks";
import {
    loadNonSelectedServiceRequests,
    setNonSelectedFilter,
    setNonSelectedPageData
} from "../../../../../store/reducers/serviceRequests/actions";

import {Autocomplete} from "@material-ui/lab";
import {autocompleteRender} from "../../../../UI/AutocompleteRender";
import {TSelectedOption} from "../../../AssignOpsCodeModal/AssignOpsCodeModal";
import {MaintenanceOptions} from "../../../../Optimizer/MaintenancePackages/OptionsTable/OptionsTable";
import {TAssignedRequest} from "../../../../../store/reducers/packages/types";
import {IPackageById} from "../../../../../api/types";

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

type TSelectOption = {
    name: string;
    type: string | number;
}

const useStyles = makeStyles(() => ({
    wrapper: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
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
    filtersWrapper: {
        width: '50%',
        display: 'flex',
        justifyContent: 'start',
        alignItems: 'center',
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


const AssignOpsCodeModal: React.FC<TAssignOpsCodeModalProps> = (props) => {
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
        if (props.isEditing && currentPackage) {
            const firstOption = currentPackage.options[0]
            setSelectedOption({ type: firstOption.type, name: firstOption.name || MaintenanceOptions[firstOption.type]})
        }
    }, [props.isEditing, currentPackage])

    const handleClose = useCallback((): void => {
        dispatch(setNonSelectedFilter({searchTerm: ''}));
        props.onClose();
    }, [props.onClose, dispatch])

    const handleSelect = useCallback((el: IServiceRequest) => {
        if (selectedOption) {
            props.setSelectedCodes(prev => {
                const code = prev.find(code => code.type === selectedOption.type);
                if (code) {
                    return prev.filter(item => item.type !== selectedOption.type).concat([{...code, serviceRequestId: el.id}])
                } else {
                    return [...prev, { type: selectedOption.type, serviceRequestId: el.id}]
                }
            });
        } else {
            showError('Please select option first');
            props.setOptionError(true);
        }
    }, [props.setSelectedCodes, selectedOption])

    const preActions = useCallback((el: IServiceRequest) => {
        const checked = !!props.selectedCodes.find(item => item.type === selectedOption?.type && item.serviceRequestId === +el.id)
        return <Radio color="primary" checked={checked} onChange={() => handleSelect(el)} />
    }, [props.selectedCodes, handleSelect])

    const handleSearch = useCallback(() => {
        if (selectedSC) {
            dispatch(loadNonSelectedServiceRequests(selectedSC.id, true));
        }
    }, [dispatch, selectedSC]);

    const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(setNonSelectedFilter({searchTerm: e.target.value}));
    }, [dispatch])

    const getModalProps = (props: TAssignOpsCodeModalProps) => {
        const modalProps = {...props};
        delete modalProps.selectedCodes;
        delete modalProps.setSelectedCodes;
        return modalProps;
    }

    const onSelectOption = useCallback((e: React.ChangeEvent<{}>, value: TSelectedOption | null) => {
        props.setOptionError(false);
        setSelectedOption(value);
        if (props.isEditing && currentPackage && value) {
            const assignedCode = currentPackage?.serviceRequestsAssigned?.find(item => item.type === value.type)
            if (assignedCode) props.setSelectedCodes(prev => {
                const request = {type: value.type, serviceRequestId: assignedCode.serviceRequestId};
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
        if (currentPackage) {
            return currentPackage.options.map(option => ({name: option.name || MaintenanceOptions[option.type], type: option.type}))
        } else {
            const options = [];
            for (let i = 0; i < 3; i++) {
                options.push({name:defaultOptions[i], type: i})
            }
            return options;
        }
    }

    return (
        <BaseModal {...getModalProps(props)}>
            <DialogTitle onClose={handleClose}>{props.title}</DialogTitle>
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
                            error: props.optionError,
                        })}
                        value={selectedOption}/>
                    {currentPackage && selectedOption && props.isEditing && <div className={classes.selectedCode}>
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