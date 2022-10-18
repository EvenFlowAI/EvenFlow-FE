import React from 'react';
import {Divider, Grid, styled, Table, TableBody, TableCell, TableHead, TableRow} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import {useTranslation} from "react-i18next";
import {ReactComponent as DealershipLogo} from "../../../assets/img/logo_dealership_example.svg";

const Wrapper = styled('div')({
    display: "flex",
    justifyContent: "center",
    padding: 36,
    background: "#E5E5E5"
})

const Paper = styled('div')({
    width: '60%',
    padding: 28,
    border: '1px solid #DADADA',
    background: "#FFFFFF",
})

const TableContainer = styled('div')({
    // border: '1px solid #DADADA',
    marginBottom: 20,
})

const data = {
    customerData: {
        name: "Dilan Mannyx",
        address: "1400 U.S. 41, Schererville, 46375",
        phones: [
            "(310) 555-1318",
            "38094587557"
        ],
        email: "mkiii7m@gmail.com"
    },
    serviceCenter: {
        name: "DealerShipName",
        address: "Simi Valley, CA 95123",
        phones: [
            "(311) 556-1812"
        ],
        link: "dealershipname.com",
        hoursOfOperation: "Monday to Friday: 8:00 a.m. to 6:00 p.m. " + "Saturday: 9:00 a.m. to 4:00 p.m."
    },
    vehicleData: {
        year: "2021",
        make: "FORD",
        model: "BRONCO",
        vin: "JY9095495069345",
        mileageIn: "2000",
        mileageOut: "2000",
        license: "JJ900",
        body: "HJ749",
        color: "NAVY"
    },
    repairOrder: {
        number: "6167",
        openedDate: "01/06/22",
        promisedDate: "01/06/22",
        closedDate: "01/06/22",
        serviceAdvisor: "MICHAEL FREENQIA",
        tagNumber: "195",
        rate: "25 USD",
        payment: "25 USD",
    },
    servicesCompleted: [
        {
            name: "Battery Test and Replace Failed Battery",
            parts: 321.08,
            labor: 54,
            total: 375.08,
        }, {
            name: "Remove Anti Theft Cat Converter Cage Assemply",
            parts: 0,
            labor: 186.85,
            total: 186.85,
        }, {
            name: "Perform Multi Point Inspection of Vehicle",
            parts: 0,
            labor: 0,
            total: 0,
        }, {
            name: "Completed 75k Service",
            parts: 68.23,
            labor: 186.85,
            total: 255.08,
        }
    ],
    priceWithTaxes: {
        subletAmount: 0,
        shopSupplies: 250,
        hazardousMaterailes: 125,
        totalCharges: 150,
        lessAdjustments: 2850,
        salesTax: 950,
    },
    disclaimerOfWarranties: "Restimates provided are an approximation of timing and charges to you for the services requested. They are based on the anticipated work to be done. It is possible for unexpected complications to cause some deviation from the original quote. We need your approval, along with a deposit of $XX,XXX, to begin procurement of necessary material(s) and start the work described in this estimate.\n" +
        "If any additional repairs are required, we will prepare a new estimate with the cost of additional parts, labor, and revised cost. \n" +
        "DEPOSITS ARE NON-REFUNDABLE. No returns or refunds on special-ordered items or electrical parts. All parts are new unless specified otherwise. In the case that used parts or customer-supplied parts are utilized in the completion of this job, there will be no warranty provided for those materials."
}

const useStyles = makeStyles(() => ({
    headerWrapper: {
        color: "#202021",
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 700,
    },
    name: {
        fontSize: 16,
        fontWeight: 600
    },
    link: {
        color: "#142EA1"
    },
    departmentHours: {
        fontWeight: 600,
        fontSize: 14,
        textTransform: 'uppercase'
    },
    label: {
        fontSize: 14,
        fontWeight: 700,
        textTransform: 'uppercase'
    },
    data: {
        fontSize: 14,
        textTransform: 'uppercase'
    },
    disclaimer: {
        border: '1px solid #DADADA',
        padding: 12,
    },
    disclaimerTitle: {
        fontSize: 10,
        fontWeight: 600,
        textTransform: 'uppercase',
        marginBottom: 8
    },
    disclaimerText: {
        fontSize: 10,
    },
    greyDetails: {
        color: "#828282",
        fontSize: 16,
        fontWeight: 600,
        textTransform: 'uppercase'
    },
    totalDue: {
        fontSize: 16,
        fontWeight: 600,
        textTransform: 'uppercase'
    },
    headerCell: {
        fontWeight: 700,
        fontSize: 20,
        textTransform: 'uppercase',
        borderTop: '1px solid #DADADA',
        borderLeft: '1px solid #DADADA',
        borderRight: '1px solid #DADADA',
    },
    cell: {
        borderLeft: '1px solid #DADADA',
        borderRight: '1px solid #DADADA',
    },
    greyRow: {
        width: "100%",
        background: '#DADADA',
        height: 24,
        border: '1px solid #DADADA',
    },
    totalRow: {
        borderBottom: '1px solid #202021',
    },
    totalCell: {
        fontWeight: 700,
        borderLeft: '1px solid #DADADA',
        borderRight: '1px solid #DADADA',
        borderBottom: '1px solid #202021',
    },
    lastRowCell: {
        borderLeft: '1px solid #DADADA',
        borderRight: '1px solid #DADADA',
        borderBottom: '1px solid #202021',
    },
    detailsRow:{
        marginBottom: 10
    }
}))

const BillHeader = () => {
    const classes = useStyles();
    const {t} = useTranslation();

    return <Grid container>
        <Grid item xs={12} sm={6}>
            <h2 className={classes.headerTitle}>{t("Detailed Invoice")}</h2>
        </Grid>
        <Grid  item xs={12} sm={6}>
            <Grid container>
                <Grid item xs={4}>
                    <DealershipLogo/>
                </Grid>
                <Grid item xs={8}>
                    <p className={classes.departmentHours}>{t("Service Department Hours")}</p>
                    <p>{data.serviceCenter.hoursOfOperation}</p>
                </Grid>
            </Grid>
        </Grid>
        <Grid item xs={12} sm={6} container direction="column" justify="space-between">
            <p className={classes.name}>{data.customerData.name}</p>
            <div>{data.customerData.address}</div>
            {data.customerData.phones.map(phone => <div key={phone}>{phone}</div>)}
            <p className={classes.link}>{data.customerData.email}</p>
        </Grid>
        <Grid item xs={12} sm={6} container direction="column" justify="space-between">
            <p className={classes.name}>{data.serviceCenter.name}</p>
            <div>{data.serviceCenter.address}</div>
            {data.serviceCenter.phones.map(phone => <div key={phone}>{phone}</div>)}
            <p className={classes.link}>{data.serviceCenter.link}</p>
        </Grid>
    </Grid>
}

const VehicleData = () => {
    const classes = useStyles();
    const {t} = useTranslation();

    return <Grid container>
        <Grid item xs={12} sm={6} container>
            <Grid item xs={4}>
                <p className={classes.label}>{t("Year")}:</p>
                <p className={classes.data}>{data.vehicleData.year}</p>
            </Grid>
            <Grid item xs={4}>
                <p className={classes.label}>{t("Make")}:</p>
                <p className={classes.data}>{data.vehicleData.make}</p>
            </Grid>
            <Grid item xs={4}>
                <p className={classes.label}>{t("Model")}:</p>
                <p className={classes.data}>{data.vehicleData.model}</p>
            </Grid>
            <Grid item xs={12}>
                <p className={classes.label}>{t("VIN")}:</p>
                <p className={classes.data}>{data.vehicleData.vin}</p>
            </Grid>
            <Grid item xs={4}>
                <p className={classes.label}>{t("Mileage In")}:</p>
                <p className={classes.data}>{data.vehicleData.mileageIn}</p>
            </Grid>
            <Grid item xs={8}>
                <p className={classes.label}>{t("Mileage Out")}:</p>
                <p className={classes.data}>{data.vehicleData.mileageOut}</p>
            </Grid>
            <Grid item xs={4}>
                <p className={classes.label}>{t("License")}:</p>
                <p className={classes.data}>{data.vehicleData.license}</p>
            </Grid>
            <Grid item xs={4}>
                <p className={classes.label}>{t("Body")}:</p>
                <p className={classes.data}>{data.vehicleData.body}</p>
            </Grid>
            <Grid item xs={4}>
                <p className={classes.label}>{t("Color")}:</p>
                <p className={classes.data}>{data.vehicleData.color}</p>
            </Grid>
        </Grid>
        <Grid item xs={12} sm={6} container>
            <Grid item xs={6}>
                <p className={classes.label}>{t("Repair Order")}:</p>
                <p className={classes.data}>{data.repairOrder.number}</p>
            </Grid>
            <Grid item xs={6}>
                <p className={classes.label}>{t("Opened Date")}:</p>
                <p className={classes.data}>{data.repairOrder.openedDate}</p>
            </Grid>
            <Grid item xs={6}>
                <p className={classes.label}>{t("Promised Date")}:</p>
                <p className={classes.data}>{data.repairOrder.promisedDate}</p>
            </Grid>
            <Grid item xs={6}>
                <p className={classes.label}>{t("Closed Date")}:</p>
                <p className={classes.data}>{data.repairOrder.closedDate}</p>
            </Grid>
            <Grid item xs={6}>
                <p className={classes.label}>{t("Service Advisor")}:</p>
                <p className={classes.data}>{data.repairOrder.serviceAdvisor}</p>
            </Grid>
            <Grid item xs={6}>
                <p className={classes.label}>{t("Tag")} #:</p>
                <p className={classes.data}>{data.repairOrder.tagNumber}</p>
            </Grid>
            <Grid item xs={6}>
                <p className={classes.label}>{t("Rate")}:</p>
                <p className={classes.data}>{data.repairOrder.rate}</p>
            </Grid>
            <Grid item xs={6}>
                <p className={classes.label}>{t("Closed Rate")}:</p>
                <p className={classes.data}>{data.repairOrder.payment}</p>
            </Grid>
        </Grid>
    </Grid>
}

const getAlphabeticalIndexes = () => {
    return [...Array(26)].map((_, i) => String.fromCharCode(i + 97).toUpperCase());
}

const RepairTable = () => {
    const indexes = getAlphabeticalIndexes();
    const classes = useStyles();
    const {t} = useTranslation();

    return <TableContainer>
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell key="#" className={classes.headerCell} align="center">
                        #
                    </TableCell>
                    <TableCell key="#" className={classes.headerCell}>
                        {t("Description of Service And Parts")}
                    </TableCell>
                    <TableCell key="#" className={classes.headerCell} align="center">
                        {t("Parts")}
                    </TableCell>
                    <TableCell key="#" className={classes.headerCell} align="center">
                        {t("Labor")}
                    </TableCell>
                    <TableCell key="#" className={classes.headerCell} align="center">
                        {t("Total")}
                    </TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                <TableRow className={classes.greyRow}>
                    <TableCell/>
                    <TableCell/>
                    <TableCell/>
                    <TableCell/>
                    <TableCell/>
                </TableRow>
                {data.servicesCompleted.map((service, i) => {
                    const lastRow = i === data.servicesCompleted.length - 1;
                    return <TableRow key={i.toString()}>
                        <TableCell key="index" align="center" className={lastRow ? classes.lastRowCell : classes.cell}>{indexes[i]}</TableCell>
                        <TableCell key={service.name} className={lastRow ? classes.lastRowCell : classes.cell}>{service.name}</TableCell>
                        <TableCell key="parts" align="center" className={lastRow ? classes.lastRowCell : classes.cell}>${service.parts}</TableCell>
                        <TableCell key="labor" align="center" className={lastRow ? classes.lastRowCell : classes.cell}>${service.labor}</TableCell>
                        <TableCell key="total" align="center" className={lastRow ? classes.lastRowCell : classes.cell}>${service.total}</TableCell>
                    </TableRow>
                })}
                <TableRow className={classes.totalRow}>
                    <TableCell key="totalName" className={classes.totalCell}>Total</TableCell>
                    <TableCell key="totalEmpty" className={classes.totalCell}/>
                    <TableCell key="totalParts" className={classes.totalCell} align="center">
                        ${data.servicesCompleted.reduce((a, v) => a + v.parts, 0)}
                    </TableCell>
                    <TableCell key="totalLabor" className={classes.totalCell} align="center">
                        ${data.servicesCompleted.reduce((a, v) => a + v.labor, 0)}
                    </TableCell>
                    <TableCell key="total" className={classes.totalCell} align="center">
                        ${data.servicesCompleted.reduce((a, v) => a + v.total, 0)}
                    </TableCell>
                </TableRow>
            </TableBody>
        </Table>
    </TableContainer>
}

const Disclaimer = () => {
    const classes = useStyles();
    const {t} = useTranslation();

    return <Grid item xs={12} sm={6} className={classes.disclaimer}>
        <p className={classes.disclaimerTitle}>{t("Disclaimer Of Warranties")}</p>
        <p className={classes.disclaimerText}>{data.disclaimerOfWarranties}</p>
    </Grid>
}

const DetailedPayments = () => {
    const classes = useStyles();
    const {t} = useTranslation();

    return <Grid item xs={12} sm={6} container style={{marginTop: -12}}>
        <Grid item xs={12} justify="space-between" container className={classes.detailsRow}>
            <Grid item xs={8} className={classes.greyDetails}>{t("Sublet Amount")}</Grid>
            <Grid item xs={4} justify="flex-end" container>${data.priceWithTaxes.subletAmount}</Grid>
        </Grid>
        <Grid item xs={12} justify="space-between" container className={classes.detailsRow}>
            <Grid item xs={8}  className={classes.greyDetails}>{t("Shop Supplies")}</Grid>
            <Grid item xs={4} justify="flex-end" container>${data.priceWithTaxes.shopSupplies}</Grid>
        </Grid>
        <Grid item xs={12} justify="space-between" container className={classes.detailsRow}>
            <Grid item xs={8} className={classes.greyDetails}>{t("Hazardous Materials")}</Grid>
            <Grid item xs={4} justify="flex-end" container>${data.priceWithTaxes.hazardousMaterailes}</Grid>
        </Grid>
        <Grid item xs={12} justify="space-between" container className={classes.detailsRow}>
            <Grid item xs={8} className={classes.greyDetails}>{t("Total Charges")}</Grid>
            <Grid item xs={4} justify="flex-end" container>${data.priceWithTaxes.totalCharges}</Grid>
        </Grid>
        <Grid item xs={12} justify="space-between" container className={classes.detailsRow}>
            <Grid item xs={8} className={classes.greyDetails}>{t("Less Adjustments")}</Grid>
            <Grid item xs={4} justify="flex-end" container>${data.priceWithTaxes.lessAdjustments}</Grid>
        </Grid>
        <Grid item xs={12} justify="space-between" container className={classes.detailsRow}>
            <Grid item xs={8} className={classes.greyDetails}>{t("Sales Tax")}</Grid>
            <Grid item xs={4} justify="flex-end" container>${data.priceWithTaxes.salesTax}</Grid>
        </Grid>
        <Grid item xs={12} justify="space-between" container>
            <Grid item xs={8} className={classes.totalDue}>{t("Total Due")}</Grid>
            <Grid item xs={4} justify="flex-end" container className={classes.totalDue}>${
                data.priceWithTaxes.subletAmount +
                data.priceWithTaxes.shopSupplies +
                data.priceWithTaxes.hazardousMaterailes +
                data.priceWithTaxes.lessAdjustments +
                data.priceWithTaxes.salesTax +
                data.priceWithTaxes.totalCharges
            }</Grid>
        </Grid>
    </Grid>
}

const PaymentBill = () => {
    return (
        <Wrapper>
            <Paper>
                <BillHeader/>
                <Divider/>
                <VehicleData/>
                <RepairTable/>
                <Grid container spacing={3}>
                    <Disclaimer/>
                    <DetailedPayments/>
                </Grid>
            </Paper>
        </Wrapper>
    );
};

export default PaymentBill;