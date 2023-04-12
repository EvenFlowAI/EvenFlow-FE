import React, {Dispatch, SetStateAction, useCallback, useEffect, useRef, useState} from 'react';
import {
    Accordion as MuiAccordion,
    AccordionDetails,
    AccordionSummary, Button, Divider,
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
import Description from "../Description/Description";
import OrderIndex from "../OrderIndex/OrderIndex";
import {IntervalUpsellAndOptions} from "../IntervalUpsellAndOptions/IntervalUpsellAndOptions";
import PricesBlock from "../PricesRow/PricesRow";
import {EPackagePricingType} from "../../../../store/reducers/appointmentFrameReducer/types";

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
    intervalUpsellLaborHours: TSummaryCell[];
    intervalUpsellPrice: TSummaryCell[];
    suggestedUpsellPrice: TSummaryCell[];
    suggestedUpsellHours: TSummaryCell[];
}

export type TSummaryCell = {
    isEditable: boolean;
    optionType: number;
    numberValue: string;
    fieldName: string;
    error?: boolean;
}

export type TCellData = {
    isSelected: boolean;
    optionType: number;
}

export type TRequestRow = {
    requestId: number;
    cellData: TCellData[];
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
    addOrderButton: {
        marginRight: 20,
    },
    tablesWrapper: {
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
    const [complimentaryData, setComplimentaryData] = useState<TRequestRow[]>([]);
    const [upsellData, setUpsellData] = useState<TRequestRow[]>([]);
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const [editingOption, setEditingOption] = useState<IPackageOptionDetailed | null>(null);
    const {isOpen: isAssignOpsCodeOpen, onOpen: onAssignOpsCodeOpen, onClose: onAssignOpsCodeClose} = useModal();
    const {isOpen: isRequestToDMSOpen, onOpen: onRequestToDMSOpen, onClose: onRequestToDMSClose} = useModal();
    const {isOpen: isDescriptionOpen, onOpen: onDescriptionOpen, onClose: onDescriptionClose} = useModal();
    const {isOpen: isOrderOpen, onOpen: onOrderOpen, onClose: onOrderClose} = useModal();
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

    const getOptionsData = useCallback((packageData: IPackageById) => {
        if (packageData?.serviceRequests) {
            const rows = packageData.serviceRequests
                .slice()
                .sort((a, b) => a.orderIndex - b.orderIndex)
                .map((request) => ({
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
            const rows = packageData.complimentaryServices
                .slice()
                .sort((a, b) => a.orderIndex - b.orderIndex)
                .map((request) => ({
                requestId: request.id,
                cellData: packageData.options
                    .map((option: IPackageOptionDetailed)  => ({ optionType: option.type, isSelected: option.complimentaryServices.includes(request.id)}))

            }))
            setComplimentaryData(rows)
        }
        if (packageData?.intervalUpsells) {
            const rows = packageData.intervalUpsells
                .slice()
                .sort((a, b) => a.orderIndex - b.orderIndex)
                .map((request) => ({
                    requestId: request.id,
                    cellData: packageData.options
                        .map((option: IPackageOptionDetailed)  => ({
                            optionType: option.type,
                            isSelected: Boolean(option.intervalUpsells.find(r => r.serviceRequestId === request.id))
                        }))

                }))
            setUpsellData(rows)
        }
    }, [packageData])

    useEffect(() => {
        if (packageData?.options) {
            getOptionsData(packageData);
        }
    }, [packageData])

    const onComplimentaryClick = useCallback((item: TCellData, requestId: number): void => {
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
    }, [packageData])

    const onCheckboxClick = useCallback((item: TCellData, requestId: number): void => {
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
    }, [packageData])

    const onUpsellClick = useCallback((item: TCellData, requestId: number): void => {
        if (packageData) {
            const option = packageData.options.find(el => el.type === item.optionType);
            if (option) {
                const updatedOption = {...option,
                    intervalUpsells:
                        option.intervalUpsells.find(request => request.serviceRequestId === requestId)
                            ? option.intervalUpsells.filter(request => request.serviceRequestId !== requestId)
                            : [...option.intervalUpsells, {serviceRequestId: requestId, isSendToDMS: true}]
                }
                const updatedData = { ...packageData, options: packageData.options
                        .filter(el => el.type !== updatedOption.type)
                        .concat(updatedOption)
                        .sort((a, b) => a.type - b.type)
                }
                setPackageData(updatedData);
            }
        }
    }, [packageData])

    const onInputChange = useCallback((value: string, fieldName: string, optionType: string | number) => {
        if (packageData) {
            if (fieldName.toLowerCase().includes('hours') && Number(value) > 100) {
                showError('Invoiced Labor Hours must be no more than 100')
            } else {
                let currentOption = packageData.options.find(option => option.type === optionType);
                if (currentOption) {
                    currentOption = {...currentOption, [fieldName as keyof IPackageOptionDetailed]: +value};
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
    }, [packageData])

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
        if (packageData && selectedSC) {
            try {
                dispatch(removePackageById(packageData.id, selectedSC.id))
            } catch (e) {
                showError(e);
            }
        }
    }

    const askRemove = () => {
        askConfirm({
            isRemove: true,
            title: `Please confirm you want to remove Maintenance Package ${packageData?.name}`,
            onConfirm: handleRemove
        });
    }

    const handleAddOpsCode = (): void => {
        onAssignOpsCodeOpen();
    }

    const handleCancel = useCallback((): void => {
        if (currentPackage) {
            setPackageData(currentPackage);
            getOptionsData(currentPackage);
            setIsEdit(false);
            setEditingOption(null);
        }
    }, [currentPackage])

    const sendRequest = useCallback((data: IPackageById) => {
        const revisedData = data.options.map(option => ({
            ...option,
            complimentaryServiceLaborHours: +option.complimentaryServiceLaborHours,
            complimentaryServicePrice: +option.complimentaryServicePrice,
            serviceRequestLaborHours: +option.serviceRequestLaborHours,
            serviceRequestPrice: +option.serviceRequestPrice,
            intervalUpsellServiceLaborHours: +option.intervalUpsellServiceLaborHours,
            intervalUpsellServicePrice: +option.intervalUpsellServicePrice,
        }))
        try {
            const upsellPriceText = currentPackage?.priceTitles?.find(item => item.type === EPackagePricingType.PriceWithFee)?.title;
            const priceText = currentPackage?.priceTitles?.find(item => item.type === EPackagePricingType.BasePrice)?.title;
            const upsellsAreIncluded = data.options.find(opt => opt.intervalUpsells.length);
            if (upsellsAreIncluded && (!upsellPriceText|| !priceText)) {
                showError("Please save the Price Texts first")
            } else {
                dispatch(updatePackageOptions(data.id, revisedData, showError));
            }
        } catch (e){
            showError(e)
        } finally {
            setIsEdit(false);
            setEditingOption(null);
        }
    }, [dispatch, currentPackage, showError])

    const handleSave = useCallback((): void => {
        const [isValid, messages] = checkIsValid(packageData);
        if (isValid) {
            if (packageData) {
                onRequestToDMSOpen();
            }
        } else {
            messages.forEach(message => showError(message))
        }
    }, [packageData, checkIsValid, onRequestToDMSOpen, showError])

    const handleExpand = (e: any): void => {
        onExpandIconClick && onExpandIconClick(e);
        handleCancel();
    }

    const onOptionNameChange = useCallback((option: IPackageOptionDetailed, name: string): void => {
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
    }, [])

    const onRequestToDmsSave = (data: IPackageById) => {
        sendRequest(data);
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
                <div>
                    <Typography className={classes.title}>{title}</Typography>
                    <div style={{ fontSize: 16 }}>Package ID: {id}</div>
                </div>
                <div className={classes.iconsWrapper}>
                    {expanded
                        ? <>
                            <Button
                                variant="contained"
                                color="primary"
                                className={classes.addOrderButton}
                                onClick={onOrderOpen}>
                                Add Order
                            </Button>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={onDescriptionOpen}>
                                To Describe Ops Codes
                            </Button>
                        </>
                        : null
                    }
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
                     </div>

                    {detailsData && <React.Fragment>
                        <SummaryRow summaryText="Suggested Labour Hours:" valuesArray={detailsData.suggestedRequestHours}/>
                        <SummaryRow
                            summaryText="Suggested Price:"
                            valuesArray={detailsData.suggestedRequestPrice}
                            toggleField="showSuggestedPrice"
                            toggleLabel="Show Suggested Price"
                            checked={currentPackage?.isShowSuggestedPrice}/>

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
                            onInputChange={onInputChange}
                            // todo when new logic will be ready, uncomment
                            // toggleField="manualOverride"
                            // toggleLabel="Manual Override"
                            // checked={currentPackage?.isManualOverridePrice}
                        />

                        <div className={classes.complimentaryRow}>Interval Upsell</div>
                        <div className={classes.tablesWrapper}>
                            {packageData && <IntervalUpsellAndOptions
                                packageData={packageData}
                                data={upsellData}
                                onCheckboxClick={onUpsellClick}/>}
                        </div>

                        <SummaryRow summaryText="Suggested Labour Hours:" valuesArray={detailsData.suggestedUpsellHours}/>
                        <SummaryRow summaryText="Suggested Price:" valuesArray={detailsData.suggestedUpsellPrice}/>

                        <Divider/>

                        <SummaryRow
                            isEdit={isEdit}
                            setIsEdit={setIsEdit}
                            isComplimentary
                            packageHasComplimentary={Boolean(packageData?.intervalUpsells?.length)}
                            summaryText="Invoiced Labor Hours:"
                            valuesArray={detailsData.intervalUpsellLaborHours}
                            onInputChange={onInputChange}/>
                        <SummaryRow
                            isEdit={isEdit}
                            setIsEdit={setIsEdit}
                            packageHasComplimentary={Boolean(packageData?.intervalUpsells?.length)}
                            isComplimentary
                            summaryText="Market Price:"
                            valuesArray={detailsData.intervalUpsellPrice}
                            onInputChange={onInputChange}/>

                        <div className={classes.complimentaryRow}>Complimentary</div>
                        <div className={classes.tablesWrapper}>
                            {packageData && <ComplimentaryAndOptions
                                packageData={packageData}
                                data={complimentaryData}
                                onCheckboxClick={onComplimentaryClick}/>}
                        </div>

                        <SummaryRow summaryText="Suggested Labour Hours:" valuesArray={detailsData.suggestedComplimentaryHours}/>
                        <SummaryRow summaryText="Suggested Price:" valuesArray={detailsData.suggestedComplimentaryPrice}/>

                        <Divider/>

                        <SummaryRow
                            isEdit={isEdit}
                            setIsEdit={setIsEdit}
                            isComplimentary
                            packageHasComplimentary={Boolean(packageData?.complimentaryServices?.length)}
                            summaryText="Invoiced Labor Hours:"
                            valuesArray={detailsData.complimentaryLaborHours}
                            onInputChange={onInputChange}/>
                        <SummaryRow
                            isEdit={isEdit}
                            setIsEdit={setIsEdit}
                            packageHasComplimentary={Boolean(packageData?.complimentaryServices?.length)}
                            isComplimentary
                            summaryText="Market Price:"
                            valuesArray={detailsData.complimentaryPrice}
                            onInputChange={onInputChange}/>

                      <PricesBlock packageData={packageData} suggestedPrices={detailsData.suggestedRequestPrice}/>

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
            packageData={packageData}
            setPackageData={setPackageData}
            onSave={onRequestToDmsSave}
        />
        <Description open={isDescriptionOpen} onClose={onDescriptionClose}/>
        <OrderIndex onClose={onOrderClose} open={isOrderOpen}/>
    </MuiAccordion>
}