import React, {useEffect, useState} from 'react';
import {
    Accordion as MuiAccordion,
    AccordionDetails,
    AccordionSummary,
    IconButton,
    makeStyles,
    Typography
} from "@material-ui/core";
import {ExpandMore, MoreHoriz}from '@material-ui/icons';
import {Api} from "../../../../config/requests";
import {Loading} from "../../../UI/Loading";
import {IPackageById} from "../../../../api/types";
import {ServiceRequests} from "../ServiceRequests/ServiceRequests";
import {OptionsTable} from "../OptionsTable/OptionsTable";

type TAccordionProps = {
    defaultExpanded?: boolean | undefined;
    disabled?: boolean | undefined;
    expanded?: boolean | undefined;
    onChange?: (event: React.ChangeEvent<{}>, expanded: boolean) => void;
    onExpandIconClick?: (event: any) => void;
    title: string;
    id?: number;

};

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

    console.log(packageData);

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
                : <div className={classes.tablesWrapper}>
                    {packageData && <ServiceRequests data={packageData.serviceRequests}/>}
                    {packageData && <OptionsTable withHeader requests={packageData.serviceRequests} options={packageData.options}/>}
                 </div>
            }
        </AccordionDetails>
    </MuiAccordion>
}