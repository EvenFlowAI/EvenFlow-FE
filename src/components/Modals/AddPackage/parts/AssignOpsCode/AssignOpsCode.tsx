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
import {usePagination, useSCs} from "../../../../../utils/hooks";
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

type TAssignOpsCodeModalProps = DialogProps & {
    selectedCodes: TAssignedRequest[];
    setSelectedCodes: Dispatch<SetStateAction<TAssignedRequest[]>>;
    title: string;
}

const tableData: TableRowDataType<IServiceRequest>[] = [
    {header: "OPS CODE", val: el => el.code},
    {header: "DESCRIPTION", val: el => el.description, width: '80%'},
]

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
    filter: {
        marginRight: 20,
        width: 150,
    }
}))

const useInputStyles = makeStyles(() => ({
    inputRoot: {
        fontWeight: 'bold',
    }
}))


const AssignOpsCodeModal: React.FC<TAssignOpsCodeModalProps> = (props) => {
    const {selectedSC} = useSCs();
    const dispatch = useDispatch();
    const classes = useStyles();
    const inputClasses = useInputStyles();
    const [selectedOption, setSelectedOption] = useState<TSelectedOption | null>(null);
    const [
        serviceList,
        isLoading,
        servicesCount,
        search,
    ] = useSelector((state: RootState) => [
        state.serviceRequests.nonSelectedList,
        state.serviceRequests.nonSelectedLoading,
        state.serviceRequests.nonSelectedPaging.numberOfRecords,
        state.serviceRequests.nonSelectedFilter.searchTerm,
    ]);
    const { currentPackage } = useSelector((state: RootState) => state.packages);
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
        }
    }, [props.setSelectedCodes, selectedOption])

    const preActions = useCallback((el: IServiceRequest) => {
        const checked = !!props.selectedCodes.find(item => item.type === selectedOption?.type && item.serviceRequestId === +el.id)
        return <Radio color="primary" checked={checked} onChange={() => handleSelect(el)} />
    }, [props.selectedCodes, handleSelect])

    const handleSearch = useCallback(() => {
        if (selectedSC) {
            dispatch(loadNonSelectedServiceRequests(selectedSC.id));
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
        setSelectedOption(value);
    }, [setSelectedOption])

    return (
        <BaseModal {...getModalProps(props)}>
            <DialogTitle onClose={handleClose}>{props.title}</DialogTitle>
            <DialogContent>
                <div className={classes.wrapper}>
                    {currentPackage && <Autocomplete
                        classes={inputClasses}
                        options={currentPackage.options.map(option => ({name: MaintenanceOptions[option.type], type: option.type}))}
                        getOptionSelected={(option, value) => option.type === value.type}
                        getOptionLabel={option => option.name}
                        onChange={onSelectOption}
                        renderInput={autocompleteRender({
                            label: "Select A Package Option",
                            fullWidth: true,
                            placeholder: 'Select An Option'
                        })}
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
                <Button onClick={handleClose}>
                    Close
                </Button>
            </DialogActions>
        </BaseModal>
    );
};

export default AssignOpsCodeModal;