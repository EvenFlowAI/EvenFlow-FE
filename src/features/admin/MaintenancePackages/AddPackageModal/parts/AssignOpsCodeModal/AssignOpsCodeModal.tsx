import React, {useCallback, useEffect, SetStateAction, Dispatch, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {Button, Radio} from "@mui/material";
import {DialogProps} from "../../../../../../components/modals/BaseModal/types";
import {IServiceRequest} from "../../../../../../store/reducers/serviceRequests/types";
import {RootState} from "../../../../../../store/rootReducer";
import {Table} from "../../../../../../components/tables/Table/Table";
import {BaseModal, DialogActions, DialogContent, DialogTitle} from "../../../../../../components/modals/BaseModal/BaseModal";
import {SearchInput} from "../../../../../../components/formControls/SearchInput/SearchInput";
import {
    loadNonSelectedServiceRequests,
    setNonSelectedFilter,
    setNonSelectedPageData
} from "../../../../../../store/reducers/serviceRequests/actions";

import { Autocomplete } from '@mui/material';
import {autocompleteRender} from "../../../../../../utils/autocompleteRenders";
import {MaintenanceOptions} from "../../../constants";
import {TAssignedRequest} from "../../../../../../store/reducers/packages/types";
import {IPackageById} from "../../../../../../api/types";
import {useInputStyles, useStyles} from "./styles";
import {TSelectOption} from "./types";
import {TSelectedOption} from "../../../types";
import {TableRowDataType} from "../../../../../../types/types";
import {usePagination} from "../../../../../../hooks/usePaginations/usePaginations";
import {useException} from "../../../../../../hooks/useException/useException";
import {useSCs} from "../../../../../../hooks/useSCs/useSCs";

type TAssignOpsCodeModalProps = DialogProps & {
    selectedCodes: TAssignedRequest[];
    setSelectedCodes: Dispatch<SetStateAction<TAssignedRequest[]>>;
    title: string;
    isEditing?: boolean;
    optionError: boolean;
    setOptionError: Dispatch<SetStateAction<boolean>>;
}

const tableData: TableRowDataType<IServiceRequest>[] = [
    {header: "OP CODE", val: el => el.code},
    {header: "DESCRIPTION", val: el => el.description, width: '80%'},
]

const AssignOpsCodeModal: React.FC<React.PropsWithChildren<React.PropsWithChildren<TAssignOpsCodeModalProps>>> =
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
        const {currentPackage} = useSelector((state: RootState) => state.packages)
        const {
            nonSelectedList,
            nonSelectedLoading,
            nonSelectedPageData,
            nonSelectedPaging: {numberOfRecords},
            nonSelectedFilter: {searchTerm}
        } = useSelector((state: RootState) => state.serviceRequests)
    const {changeRowsPerPage, changePage, pageIndex, pageSize} = usePagination(
        (s: RootState) => s.serviceRequests.nonSelectedPageData,
        setNonSelectedPageData
    );
    const dispatch = useDispatch();
    const { classes  } = useStyles();
    const { classes: inputClasses } = useInputStyles();
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
                        isOptionEqualToValue={(option, value) => option.type === value.type}
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
                    <SearchInput onSearch={handleSearch} onChange={handleSearchChange} value={searchTerm} />
                </div>
                <Table<IServiceRequest>
                    data={nonSelectedList}
                    index="id"
                    startActions={preActions}
                    compact
                    hidePagination={numberOfRecords <= nonSelectedPageData.pageSize}
                    rowData={tableData}
                    isLoading={nonSelectedLoading}
                    page={pageIndex}
                    rowsPerPage={pageSize}
                    onChangePage={changePage}
                    onChangeRowsPerPage={changeRowsPerPage}
                    count={numberOfRecords}
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