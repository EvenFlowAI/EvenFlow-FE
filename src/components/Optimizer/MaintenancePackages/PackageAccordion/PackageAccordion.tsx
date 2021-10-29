import React, {Dispatch, SetStateAction, useCallback, useEffect, useRef, useState} from 'react';
import {
    Accordion as MuiAccordion,
    AccordionDetails,
    AccordionSummary, Divider,
    IconButton,
    makeStyles, Menu, MenuItem,
    Typography
} from "@material-ui/core";
import {ExpandMore, MoreHoriz}from '@material-ui/icons';
import {Loading} from "../../../UI/Loading";
import {IPackageById, IPackageOptionDetailed} from "../../../../api/types";
import SummaryRow from "../SummaryRow/SummaryRow";
import {checkIsValid, getOptionsTableData} from "../../utils";
import {useConfirm, useException, useModal, useSCs} from "../../../../utils/hooks";
import AccordionActions from "../AccordionActions/AccordionActions";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../../store/rootReducer";
import {loadPackageById, removePackageById, updatePackageOptions} from "../../../../store/reducers/packages/actions";
import AssignOpsCodeModal from "../../../Modals/AssignOpsCodeModal/AssignOpsCodeModal";
import SaveRequestToDms from "../../../Modals/SaveRequestToDMS/SaveRequestToDMS";
import {ServiceRequestsWithOptions} from "../ServiceRequestsAndOptions/ServiceRequestsAndOptions";
import {ComplimentaryAndOptions} from "../ComplimenteryAndOptions/ComplimentaryAndOptions";

type TAccordionProps = {
    defaultExpanded?: boolean | undefined;
    disabled?: boolean | undefined;
    expanded?: boolean | undefined;
    onChange?: (event: React.ChangeEvent<{}>, expanded: boolean) => void;
    onExpandIconClick?: (event: any) => void;
    title: string;
    id?: number;
    setIsEditing: Dispatch<SetStateAction<boolean>>,
    onOpenEdit: () => void;
};

export interface IDetailsData {
    invoicedRequestLaborHours: TSummaryCell[];
    complimentaryLaborHours: TSummaryCell[];
    requestsPrice: TSummaryCell[];
    complimentaryPrice: TSummaryCell[];
    suggestedRequestHours: TSummaryCell[];
    suggestedRequestPrice: TSummaryCell[];
    suggestedComplimentaryHours: TSummaryCell[];
    suggestedComplimentaryPrice: TSummaryCell[];
}

export type TSummaryCell = {
    isEditable: boolean;
    optionType: number;
    numberValue: number;
    fieldName: string,
}

export type TCellData = {
    isSelected: boolean;
    optionType: number;
}

export type TRequestRow = {
    requestId: number;
    cellData: TCellData[];
}

export type TEditedRequest = {
    requestId: number;
    isSelected: boolean;
    optionType: number;
}

const useStyles = makeStyles(() => ({
    title: {
        fontSize: 20,
    },
    titleWrapper: {
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    iconsWrapper: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    button: {
        borderRadius: '50%',
    },
    tablesWrapper: {
        // display: "grid",
        // gridTemplateColumns: '5fr 2fr',
        // gridGap: 16,
    },
    details: {
        display: "block",
    },
    complimentaryRow: {
        background: 'rgba(37, 37, 37, 0.5)',
        color: 'white',
        fontWeight: 'bold',
        padding: '10px 16px',
    }
}));

const useIconStyles = makeStyles(() => ({
    root: {
        transform: 'rotate(180deg)',
    }
}));

const useAccordionStyles = makeStyles(() => ({
    root: {
        backgroundColor: '#F7F8FB',
    },
    expanded: {
        backgroundColor: 'white',
    },
}));

export const PackageAccordion: React.FC<TAccordionProps> = (props) => {
    const {
        id,
        title,
        defaultExpanded,
        expanded,
        disabled,
        onChange,
        onExpandIconClick} = props;
    const { isPackageLoading, currentPackage } = useSelector((state: RootState) => state.packages);
    const [isEdit, setIsEdit] = useState<boolean>(false);
    const [packageData, setPackageData] = useState<IPackageById | null>(null);
    const [optionsData, setOptionsData] = useState<TRequestRow[]>([]);
    const [detailsData, setDetailsData] = useState<IDetailsData | null>(null);
    const [complimentaryData, setComplimentaryData] = useState<TRequestRow[]>([])
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const [editingOption, setEditingOption] = useState<IPackageOptionDetailed | null>(null);
    const [editedRequests, setEditedRequests] = useState<TEditedRequest[]>([]);
    const {isOpen: isAssignOpsCodeOpen, onOpen: onAssignOpsCodeOpen, onClose: onAssignOpsCodeClose} = useModal();
    const {isOpen: isRequestToDMSOpen, onOpen: onRequestToDMSOpen, onClose: onRequestToDMSClose} = useModal();
    const { askConfirm } = useConfirm();
    const {selectedSC} = useSCs();
    const anchorRef = useRef(null);
    const dispatch = useDispatch();
    const showError = useException();

    const accordClasses = useAccordionStyles();
    const classes = useStyles();
    const iconStyles = useIconStyles();

    useEffect(() => {
        if (id && expanded) dispatch(loadPackageById(id));
    }, [id, expanded])

    useEffect(() => {
        if (currentPackage) setPackageData(currentPackage);
    }, [currentPackage])

    const getOptionsData = (packageData: IPackageById) => {
        if (packageData?.serviceRequests) {
            const rows = packageData.serviceRequests.map((request) => ({
                requestId: request.id,
                cellData: packageData.options
                    .map((option: IPackageOptionDetailed)  => ({
                        optionType: option.type,
                        isSelected: !!option.serviceRequests.find(item => item.serviceRequestId === request.id)
                    }))
            }))
            setOptionsData(rows);
            setDetailsData(() => getOptionsTableData(packageData))
        }
        if (packageData?.complimentaryServices) {
            const rows = packageData.complimentaryServices.map((request) => ({
                requestId: request.id,
                cellData: packageData.options
                    .map((option: IPackageOptionDetailed)  => ({ optionType: option.type, isSelected: option.complimentaryServices.includes(request.id)}))

            }))
            setComplimentaryData(rows)
        }
    }

    useEffect(() => {
        if (packageData?.options) {
            getOptionsData(packageData);
        }
    }, [packageData])

    const onComplimentaryClick = (item: TCellData, requestId: number): void => {
        if (packageData) {
            const option = packageData.options.find(el => el.type === item.optionType);
            if (option) {
                const updatedOption = {...option,
                    complimentaryServices:
                        option.complimentaryServices.includes(requestId)
                            ? option.complimentaryServices.filter(request => request !== requestId)
                            : [...option.complimentaryServices, requestId]
                }
                const updatedData = { ...packageData, options: packageData.options
                        .filter(el => el.type !== updatedOption.type)
                        .concat(updatedOption)
                        .sort((a, b) => a.type - b.type)}
                setPackageData(updatedData);
            }
        }
    }

    const onCheckboxClick = useCallback((item: TCellData, requestId: number): void => {
        setEditedRequests(prev => {
            const request = prev.find(request => request.requestId === requestId && request.optionType === item.optionType);
            if (request) {
                return prev.filter(item => item.requestId !==requestId);
            } else {
                return [...prev, {
                    requestId: requestId,
                    optionType: item.optionType,
                    isSelected: !item.isSelected,
                }]
            }
        })
        if (packageData) {
            const option = packageData.options.find(el => el.type === item.optionType);
            if (option) {
                const updatedOption = {...option,
                    serviceRequests:
                        option.serviceRequests.find(request => request.serviceRequestId === requestId)
                            ? option.serviceRequests.filter(request => request.serviceRequestId !== requestId)
                            : [...option.serviceRequests, {serviceRequestId: requestId, isSendToDMS: true}]
                }
                const updatedData = { ...packageData, options: packageData.options
                        .filter(el => el.type !== updatedOption.type)
                        .concat(updatedOption)
                        .sort((a, b) => a.type - b.type)
                }
                setPackageData(updatedData);
            }
        }
    }, [packageData, setEditedRequests])

    const getFixedValue = (value: number): number => {
        if (Number.isInteger(+value)) return +value;
        const [integer, decimal] = value.toString().split('.');
        if (decimal.length <= 2) {
            return +value
        } else {
            return Number(`${integer}.${decimal.slice(0, 2)}`);
        }
    }

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: string, optionType: string | number) => {
        if (packageData) {
            let currentOption = packageData.options.find(option => option.type === optionType);
            if (currentOption) {
                const value = getFixedValue(+e.target.value);
                currentOption = {...currentOption, [fieldName as keyof IPackageOptionDetailed]: value};
                const updated = {...packageData,
                    options: packageData.options
                        .filter(item => item.type !== optionType)
                        .concat(currentOption)
                        .sort((a, b) => a.type - b.type)
                };
                setPackageData(updated);
            }
        }
    }

    const onMoreIconClick = () => {
        if (expanded && anchorRef?.current && packageData) setAnchorEl(anchorRef.current);
    }

    const handleCloseMenu = (): void => setAnchorEl(null);

    const handleEdit = () => {
        props.setIsEditing(true);
        props.onOpenEdit();
        setAnchorEl(null);
    }

    const handleRemove = (): void => {
        setAnchorEl(null);
        if (packageData && selectedSC) dispatch(removePackageById(packageData.id, selectedSC.id))
    }

    const askRemove = () => {
        askConfirm({
            isRemove: true,
            title: `Remove ${packageData?.name} from Packages List?`,
            onConfirm: handleRemove
        });
    }

    const handleAddOpsCode = (): void => {
        if (currentPackage?.options?.find(item => !item.serviceRequests?.length)) {
            showError('Please save Service Requests for each Package Option first')
        } else {
            onAssignOpsCodeOpen();
        }
    }

    const handleCancel = (): void => {
        if (currentPackage) {
            setPackageData(currentPackage);
            getOptionsData(currentPackage);
            setIsEdit(false);
            setEditingOption(null);
            setEditedRequests([]);
        }
    }

    const sendRequest = () => {
        if (packageData) {
            dispatch(updatePackageOptions(packageData.id, packageData.options))
            setIsEdit(false);
            setEditingOption(null);
            setEditedRequests([]);
        }
    }

    const handleSave = (): void => {
        const [isValid, messages] = checkIsValid(packageData);
        if (isValid) {
            if (packageData) {
                if (editedRequests.length && editedRequests.find(item => item.isSelected)) {
                    onRequestToDMSOpen();
                } else {
                    sendRequest();
                }
            }
        } else {
            messages.forEach(message => showError(message))
        }

    }

    const handleExpand = (e: any): void => {
        onExpandIconClick && onExpandIconClick(e);
        handleCancel();
    }

    const onOptionNameChange = (option: IPackageOptionDetailed, name: string): void => {
        setPackageData(prev => {
            if (prev) {
                const optionToChange = prev.options.find(item => item.type === option.type);
                if (optionToChange) {
                    const newOption = {...optionToChange, name};
                    return {
                        ...prev,
                        options: prev.options
                            .filter(item => item.type !== option.type)
                            .concat(newOption)
                            .sort((a, b) => a.type - b.type)
                    }
                }
            }
            return prev;
        })
    }

    const onRequestToDmsSave = () => {
        sendRequest();
        setEditedRequests([]);
        onRequestToDMSClose();
    }

    return <MuiAccordion
        classes={accordClasses}
        defaultExpanded={defaultExpanded}
        disabled={disabled}
        expanded={expanded}
        onChange={onChange}
        square={true}
    >
        <AccordionSummary id={title}>
            <div className={classes.titleWrapper}>
                <Typography className={classes.title}>{title}</Typography>
                <div className={classes.iconsWrapper}>
                    <IconButton
                        className={classes.button}
                        onClick={onMoreIconClick}
                        ref={anchorRef}
                        disabled={!expanded || !packageData}>
                        <MoreHoriz />
                    </IconButton>
                    <IconButton className={classes.button} onClick={handleExpand}>
                        <ExpandMore classes={expanded ? iconStyles : {}}/>
                    </IconButton>
                </div>
            </div>
        </AccordionSummary>
        <AccordionDetails className={classes.details}>
            {isPackageLoading
                ? <Loading/>
                : <div>
                    <div className={classes.tablesWrapper}>
                        {packageData && <ServiceRequestsWithOptions
                            packageData={packageData}
                            data={optionsData}
                            editingOption={editingOption}
                            setEditingOption={setEditingOption}
                            onOptionNameChange={onOptionNameChange}
                            onCheckboxClick={onCheckboxClick}/>
                        }
                    {/*{packageData && <ServiceRequests data={packageData.serviceRequests}/>}*/}
                    {/*{packageData && <OptionsTable*/}
                    {/*    withHeader*/}
                    {/*    data={optionsData}*/}
                    {/*    editingOption={editingOption}*/}
                    {/*    setEditingOption={setEditingOption}*/}
                    {/*    onOptionNameChange={onOptionNameChange}*/}
                    {/*    onCheckboxClick={onCheckboxClick}*/}
                    {/*    options={packageData.options}/>}*/}
                     </div>

                    {detailsData && <React.Fragment>
                        <SummaryRow summaryText="Suggested Labour Hours:" valuesArray={detailsData.suggestedRequestHours}/>
                        <SummaryRow summaryText="Suggested Price:" valuesArray={detailsData.suggestedRequestPrice}/>

                        <Divider/>

                        <SummaryRow
                            isEdit={isEdit}
                            setIsEdit={setIsEdit}
                            summaryText="Invoiced Labor Hours:"
                            valuesArray={detailsData.invoicedRequestLaborHours}
                            onInputChange={onInputChange}/>
                        <SummaryRow
                            isEdit={isEdit}
                            setIsEdit={setIsEdit}
                            summaryText="Market Price:"
                            valuesArray={detailsData.requestsPrice}
                            onInputChange={onInputChange}/>

                        <div className={classes.complimentaryRow}>Complimentary</div>
                        <div className={classes.tablesWrapper}>
                            {packageData && <ComplimentaryAndOptions
                                packageData={packageData}
                                data={complimentaryData}
                                onCheckboxClick={onComplimentaryClick}/>}
                            {/*{packageData && <ComplimentaryRequests data={packageData.complimentaryServices} />}*/}
                            {/*{packageData && <OptionsTable*/}
                            {/*    data={complimentaryData}*/}
                            {/*    onCheckboxClick={onComplimentaryClick}*/}
                            {/*    options={packageData.options}/>}*/}
                        </div>

                        <SummaryRow summaryText="Suggested Labour Hours:" valuesArray={detailsData.suggestedComplimentaryHours}/>
                        <SummaryRow summaryText="Suggested Price:" valuesArray={detailsData.suggestedComplimentaryPrice}/>

                        <Divider/>

                        <SummaryRow
                            isEdit={isEdit}
                            setIsEdit={setIsEdit}
                            summaryText="Invoiced Labor Hours:"
                            valuesArray={detailsData.complimentaryLaborHours}
                            onInputChange={onInputChange}/>
                        <SummaryRow
                            isEdit={isEdit}
                            setIsEdit={setIsEdit}
                            summaryText="Market Price:"
                            valuesArray={detailsData.complimentaryPrice}
                            onInputChange={onInputChange}/>
                    </React.Fragment>}

                    {<AccordionActions onAddOpsCode={handleAddOpsCode} onCancel={handleCancel}
                                       onSave={handleSave}/>}
                </div>
            }
        </AccordionDetails>
        <Menu open={Boolean(anchorEl)} anchorEl={anchorEl} onClose={handleCloseMenu}>
            <MenuItem onClick={handleEdit}>Edit</MenuItem>
            <MenuItem onClick={askRemove}>Remove</MenuItem>
        </Menu>
        <AssignOpsCodeModal packageName={title} open={isAssignOpsCodeOpen} onClose={onAssignOpsCodeClose}/>
        <SaveRequestToDms
            open={isRequestToDMSOpen}
            onClose={onRequestToDMSClose}
            editedRequests={editedRequests}
            packageData={packageData}
            setPackageData={setPackageData}
            onSave={onRequestToDmsSave}
        />
    </MuiAccordion>
}