import React, {useEffect, useMemo, useState} from 'react';
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
import {IPackageById, IPackageOptionDetailed} from "../../../../api/types";
import {ServiceRequests} from "../ServiceRequests/ServiceRequests";
import {OptionsTable} from "../OptionsTable/OptionsTable";
import SummaryRow from "../SummaryRow/SummaryRow";

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
    suggestedRequestLaborHours: TSummaryCell[];
    complimentaryLaborHours: TSummaryCell[];
    requestsPrice: TSummaryCell[];
    complimentaryPrice: TSummaryCell[];
}

export type TSummaryCell = {
    value: string | number;
    isEditable: boolean;
    optionType: number;
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

const getData = (options: IPackageOptionDetailed[]) => {
    const data: IDetailsData = {
        suggestedRequestLaborHours: [],
        complimentaryLaborHours: [],
        requestsPrice: [],
        complimentaryPrice: []
    }
    options.forEach(option => {
        data.suggestedRequestLaborHours.push({value: `${option.serviceRequestLaborHours}h`, isEditable: false, optionType: option.type});
        data.complimentaryLaborHours.push({value: `${option.complimentaryServiceLaborHours}h`, isEditable: false, optionType: option.type});
        data.requestsPrice.push({value: `$${option.serviceRequestPrice}`, isEditable: true, optionType: option.type});
        data.complimentaryPrice.push({value: `$${option.complimentaryServicePrice}`, isEditable: true, optionType: option.type})
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
            setDetailsData(() => getData(packageData.options))
        }
    }, [packageData])

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
                        <SummaryRow
                            summaryText="Suggested Labour Hours:"
                            valuesArray={detailsData.suggestedRequestLaborHours}/>
                        <SummaryRow
                            summaryText="Suggested Price:"
                            valuesArray={detailsData.requestsPrice}/>
                        <Divider/>
                        <SummaryRow
                            summaryText="Suggested Labour Hours:"
                            valuesArray={detailsData.complimentaryLaborHours}/>
                        <SummaryRow
                            summaryText="Suggested Price:"
                            valuesArray={detailsData.complimentaryPrice}/>
                    </React.Fragment>}
                </div>
            }
        </AccordionDetails>
    </MuiAccordion>
}