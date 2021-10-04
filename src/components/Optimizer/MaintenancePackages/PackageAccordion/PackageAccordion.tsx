import React, {useEffect, useState} from 'react';
import {
    Accordion as MuiAccordion,
    AccordionDetails,
    AccordionSummary, Divider,
    IconButton,
    makeStyles,
    Typography
} from "@material-ui/core";
import {ExpandMore, MoreHoriz}from '@material-ui/icons';
import {Api} from "../../../../config/requests";
import {Loading} from "../../../UI/Loading";
import {IComplimentaryService, IPackageById, IPackageOptionDetailed} from "../../../../api/types";
import {ServiceRequests} from "../ServiceRequests/ServiceRequests";
import {OptionsTable} from "../OptionsTable/OptionsTable";
import SummaryRow from "../SummaryRow/SummaryRow";
import ComplimentaryRequests from "../../ComplimentaryRequests/ComplimentaryRequests";
import {IServiceRequest} from "../../../../store/reducers/serviceRequests/types";

type TAccordionProps = {
    defaultExpanded?: boolean | undefined;
    disabled?: boolean | undefined;
    expanded?: boolean | undefined;
    onChange?: (event: React.ChangeEvent<{}>, expanded: boolean) => void;
    onExpandIconClick?: (event: any) => void;
    title: string;
    id?: number;
};

interface IDetailsData {
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
        display: "grid",
        gridTemplateColumns: '5fr 2fr',
        gridGap: 16,
    },
    details: {
        display: "block",
    },
    complimentaryRow: {
        background: 'rgba(37, 37, 37, 0.5)',
        color: 'white',
        fontWeight: 'bold',
        padding: 10,
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

const getTotal = (includedRequests: IServiceRequest[]): number => {
    return includedRequests.reduce((a, b) => a + b.price, 0);
}

const getComplimentaryTotal = (includedRequests: IComplimentaryService[]): number => {
    return includedRequests.reduce((a, b) => a + b.price, 0);
}

const getHours = (includedRequests: IServiceRequest[]): number => {
   return includedRequests.reduce((a, b) => a + b.durationInHours, 0);
}

const getComplimentaryHours = (includedRequests: IComplimentaryService[]): number => {
    return includedRequests.reduce((a, b) => a + b.durationInHours, 0);
}


const getData = (pack: IPackageById) => {
    const { options, serviceRequests, complimentaryServices} = pack;
    const data: IDetailsData = {
        invoicedRequestLaborHours: [],
        complimentaryLaborHours: [],
        requestsPrice: [],
        complimentaryPrice: [],
        suggestedRequestHours: [],
        suggestedRequestPrice: [],
        suggestedComplimentaryHours: [],
        suggestedComplimentaryPrice: [],
    }
    options.forEach(option => {
        const includedRequests = serviceRequests.filter(request => option.serviceRequests.includes(request.id));
        const includedComplimentary = complimentaryServices.filter(request => option.complimentaryServices.includes(request.id));
        data.invoicedRequestLaborHours.push({
            numberValue: option.serviceRequestLaborHours,
            isEditable: true,
            optionType: option.type,
            fieldName: 'serviceRequestLaborHours',
        });
        data.complimentaryLaborHours.push({
            numberValue: option.complimentaryServiceLaborHours,
            isEditable: true,
            optionType: option.type,
            fieldName: 'complimentaryServiceLaborHours',
        });
        data.requestsPrice.push({
            numberValue: option.serviceRequestPrice,
            isEditable: true,
            optionType: option.type,
            fieldName: 'serviceRequestPrice',
        });
        data.complimentaryPrice.push({
            numberValue: option.complimentaryServicePrice,
            isEditable: true,
            optionType: option.type,
            fieldName: 'complimentaryServicePrice',
        });
        data.suggestedRequestPrice.push({
            numberValue: getTotal(includedRequests),
            isEditable: false,
            optionType: option.type,
            fieldName: 'suggestedRequestPrice',
        })
        data.suggestedRequestHours.push({
            numberValue: getHours(includedRequests),
            isEditable: false,
            optionType: option.type,
            fieldName: 'suggestedRequestHours',
        })
        data.suggestedComplimentaryPrice.push({
            numberValue: getComplimentaryTotal(includedComplimentary),
            isEditable: false,
            optionType: option.type,
            fieldName: 'suggestedComplimentaryPrice',
        })
        data.suggestedComplimentaryHours.push({
            numberValue: getComplimentaryHours(includedComplimentary),
            isEditable: false,
            optionType: option.type,
            fieldName: 'suggestedComplimentaryHours',
        })
    })
    return data;
};

export const PackageAccordion: React.FC<TAccordionProps> = (props) => {
    const {                                                                id,
        title,
        defaultExpanded,
        expanded,
        disabled,
        onChange,
        onExpandIconClick} = props;
    const [loading, setLoading] = useState<boolean>(false);
    const [packageData, setPackageData] = useState<IPackageById | null>(null);
    const [optionsData, setOptionsData] = useState<TRequestRow[]>([]);
    const [detailsData, setDetailsData] = useState<IDetailsData | null>(null);
    const [complimentaryData, setComplimentaryData] = useState<TRequestRow[]>([])
    const accordClasses = useAccordionStyles();
    const classes = useStyles();
    const iconStyles = useIconStyles();

    useEffect(() => {
        setLoading(true);
        Api.call(Api.endpoints.MaintenancePackages.Retrieve, {urlParams: {id}})
            .then(result => {
                if (result?.data) setPackageData(result.data);
            }).catch(err => {
                console.log(err);
            }).finally(() => setLoading(false))
    }, [id])

    useEffect(() => {
        if (packageData?.serviceRequests && packageData.options) {
            const rows = packageData.serviceRequests.map((request) => ({
                requestId: request.id,
                cellData: packageData.options.map((option: IPackageOptionDetailed)  => ({ optionType: option.type, isSelected: option.serviceRequests.includes(request.id)}))
            }))
            setOptionsData(rows);
            setDetailsData(() => getData(packageData))
        }
    }, [packageData])

    useEffect(() => {
        if (packageData?.complimentaryServices && packageData.options) {
            const rows = packageData.complimentaryServices.map((request) => ({
                requestId: request.id,
                cellData: packageData.options.map((option: IPackageOptionDetailed)  => ({ optionType: option.type, isSelected: option.complimentaryServices.includes(request.id)}))
            }))
            setComplimentaryData(rows)
        }
    }, [packageData])

    const onComplimentaryClick = (item: TCellData, requestId: number): void => {

    }

    const onCheckboxClick = (item: TCellData, requestId: number): void => {
        const requestToChange = optionsData.find(item => item.requestId === requestId);
        if (requestToChange) {
            const dataToChange = requestToChange.cellData.find(el => el.optionType === item.optionType);
            if (dataToChange) {
                const cell = {...dataToChange, isSelected: !dataToChange.isSelected};
                const updatedRequest = {...requestToChange,
                    cellData: [...requestToChange.cellData.filter(el => el.optionType !== item.optionType), cell]
                        .sort((a, b) => a.optionType - b.optionType)};

                setOptionsData(prevData => {
                    return [...prevData.filter(el => el.requestId !== requestId), updatedRequest]
                        .sort((a, b) => a.requestId - b.requestId);
                });
            }
        }
    }

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
        console.log(e.target.value);
        console.log(fieldName);
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
                    <IconButton className={classes.button}><MoreHoriz /></IconButton>
                    <IconButton className={classes.button} onClick={onExpandIconClick}>
                        <ExpandMore classes={expanded ? iconStyles : {}}/>
                    </IconButton>
                </div>
            </div>
        </AccordionSummary>
        <AccordionDetails className={classes.details}>
            {loading
                ? <Loading/>
                : <div>
                    <div className={classes.tablesWrapper}>
                    {packageData && <ServiceRequests data={packageData.serviceRequests}/>}
                    {packageData && <OptionsTable
                        withHeader
                        data={optionsData}
                        onCheckboxClick={onCheckboxClick}
                        options={packageData.options}/>}
                 </div>
                    {detailsData && <React.Fragment>
                        <SummaryRow summaryText="Suggested Labour Hours:" valuesArray={detailsData.suggestedRequestHours}/>
                        <SummaryRow summaryText="Suggested Price:" valuesArray={detailsData.suggestedRequestPrice}/>

                        <Divider/>

                        <SummaryRow
                            summaryText="Invoiced Labor Hours:"
                            valuesArray={detailsData.invoicedRequestLaborHours}
                            onInputChange={onInputChange}/>
                        <SummaryRow
                            summaryText="Market Price:"
                            valuesArray={detailsData.requestsPrice}
                            onInputChange={onInputChange}/>

                        <div className={classes.complimentaryRow}>Complimentary</div>
                        <div className={classes.tablesWrapper}>
                            {packageData && <ComplimentaryRequests data={packageData.complimentaryServices} />}
                            {packageData && <OptionsTable
                                data={complimentaryData}
                                onCheckboxClick={onComplimentaryClick}
                                options={packageData.options}/>}
                        </div>
                        <SummaryRow summaryText="Suggested Labour Hours:" valuesArray={detailsData.suggestedComplimentaryHours}/>
                        <SummaryRow summaryText="Suggested Price:" valuesArray={detailsData.suggestedComplimentaryPrice}/>

                        <Divider/>

                        <SummaryRow
                            summaryText="Invoiced Labor Hours:"
                            valuesArray={detailsData.complimentaryLaborHours}
                            onInputChange={onInputChange}/>
                        <SummaryRow
                            summaryText="Market Price:"
                            valuesArray={detailsData.complimentaryPrice}
                            onInputChange={onInputChange}/>
                    </React.Fragment>}
                </div>
            }
        </AccordionDetails>
    </MuiAccordion>
}