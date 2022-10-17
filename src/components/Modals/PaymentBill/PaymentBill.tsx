import React from 'react';
import {Divider, Grid} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import {TableRowDataType} from "../../UI/types";
import {Table} from "../../UI/Table";

type TServiceCompleted = {
    name: string;
    labor: number;
    parts: number;
    total: number;
}

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
        year: "",
        make: "",
        model: "",
        vin: "",
        mileageIn: "",
        mileageOut: "",
        license: "",
        body: "",
        color: ""
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
        padding: 12
    },
    disclaimerTitle: {
        fontSize: 10,
        fontWeight: 600,
        textTransform: 'uppercase'
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
    }
}))

const BillHeader = () => {
    const classes = useStyles();

    return <Grid container>
        <Grid item xs={12} sm={6}>
            <h2 className={classes.headerTitle}>Detailed Invoice</h2>
            <p className={classes.name}>{data.customerData.name}</p>
            <p>{data.customerData.address}</p>
            {data.customerData.phones.map(phone => <p key={phone}>{phone}</p>)}
            <p className={classes.link}>{data.customerData.email}</p>
        </Grid>
        <Grid item xs={12} sm={6}>
            <Grid container>
                <Grid item xs={4}>
                    Logo
                </Grid>
                <Grid item xs={8}>
                    <p className={classes.departmentHours}>Service Department Hours</p>
                    <p>{data.serviceCenter.hoursOfOperation}</p>
                </Grid>
            </Grid>
            <p className={classes.name}>{data.serviceCenter.name}</p>
            <p>{data.serviceCenter.address}</p>
            {data.serviceCenter.phones.map(phone => <p key={phone}>{phone}</p>)}
            <p className={classes.link}>{data.serviceCenter.link}</p>
        </Grid>
    </Grid>
}

const VehicleData = () => {
    const classes = useStyles();
    return <Grid container>
        <Grid item xs={12} sm={6} container>
            <Grid item xs={4}>
                <p className={classes.label}>Year:</p>
                <p className={classes.data}>{data.vehicleData.year}</p>
            </Grid>
            <Grid item xs={4}>
                <p className={classes.label}>Make:</p>
                <p className={classes.data}>{data.vehicleData.make}</p>
            </Grid>
            <Grid item xs={4}>
                <p className={classes.label}>Model:</p>
                <p className={classes.data}>{data.vehicleData.model}</p>
            </Grid>
            <Grid item xs={12}>
                <p className={classes.label}>VIN:</p>
                <p className={classes.data}>{data.vehicleData.vin}</p>
            </Grid>
            <Grid item xs={4}>
                <p className={classes.label}>Mileage In:</p>
                <p className={classes.data}>{data.vehicleData.mileageIn}</p>
            </Grid>
            <Grid item xs={8}>
                <p className={classes.label}>Mileage Out:</p>
                <p className={classes.data}>{data.vehicleData.mileageOut}</p>
            </Grid>
            <Grid item xs={4}>
                <p className={classes.label}>License:</p>
                <p className={classes.data}>{data.vehicleData.license}</p>
            </Grid>
            <Grid item xs={4}>
                <p className={classes.label}>Body:</p>
                <p className={classes.data}>{data.vehicleData.body}</p>
            </Grid>
            <Grid item xs={4}>
                <p className={classes.label}>Color:</p>
                <p className={classes.data}>{data.vehicleData.color}</p>
            </Grid>
        </Grid>
        <Grid item xs={12} sm={6} container>
            <Grid item xs={6}>
                <p className={classes.label}>Repair Order:</p>
                <p className={classes.data}>{data.repairOrder.number}</p>
            </Grid>
            <Grid item xs={6}>
                <p className={classes.label}>Opened Date:</p>
                <p className={classes.data}>{data.repairOrder.openedDate}</p>
            </Grid>
            <Grid item xs={6}>
                <p className={classes.label}>Promised Date:</p>
                <p className={classes.data}>{data.repairOrder.promisedDate}</p>
            </Grid>
            <Grid item xs={6}>
                <p className={classes.label}>Closed Date:</p>
                <p className={classes.data}>{data.repairOrder.closedDate}</p>
            </Grid>
            <Grid item xs={6}>
                <p className={classes.label}>Service Advisor:</p>
                <p className={classes.data}>{data.repairOrder.serviceAdvisor}</p>
            </Grid>
            <Grid item xs={6}>
                <p className={classes.label}>Tag #:</p>
                <p className={classes.data}>{data.repairOrder.tagNumber}</p>
            </Grid>
            <Grid item xs={6}>
                <p className={classes.label}>Rate:</p>
                <p className={classes.data}>{data.repairOrder.rate}</p>
            </Grid>
            <Grid item xs={6}>
                <p className={classes.label}>Closed Rate:</p>
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
    const rowData: TableRowDataType<TServiceCompleted>[] = [
        {val: (el, i) => indexes[i], header: "#", align: "center"},
        {val: el => el.name, header: "DESCRIPTION OF SERVICE AND PARTS"},
        {val: el => `$${el.parts}`, header: "PARTS", align: "center"},
        {val: el => `$${el.labor}`, header: "LABOR", align: "center"},
        {val: el => `$${el.total}`, header: "TOTAL", align: "center"},
    ];

    return <Table<TServiceCompleted>
        data={data.servicesCompleted}
        index={"name"}
        rowData={rowData}
    />
}

const Disclaimer = () => {
    const classes = useStyles();
    return <Grid item xs={12} sm={6} className={classes.disclaimer}>
        <h5 className={classes.disclaimerTitle}>Disclaimer Of Warranties</h5>
        <p className={classes.disclaimerText}>{data.disclaimerOfWarranties}</p>
    </Grid>
}

const DetailedPayments = () => {
    const classes = useStyles();
    return <Grid item xs={12} sm={6} container>
        <Grid item xs={12} justify="space-between">
            <div className={classes.greyDetails}>SUBLET AMOUNT</div>
            <div>${data.priceWithTaxes.subletAmount}</div>
        </Grid>
        <Grid item xs={12} justify="space-between">
            <div className={classes.greyDetails}>SHOP SUPPLIES</div>
            <div>${data.priceWithTaxes.shopSupplies}</div>
        </Grid>
        <Grid item xs={12} justify="space-between">
            <div className={classes.greyDetails}>HAZARDOUS MATERIALS</div>
            <div>${data.priceWithTaxes.hazardousMaterailes}</div>
        </Grid>
        <Grid item xs={12} justify="space-between">
            <div className={classes.greyDetails}>TOTAL CHARGES</div>
            <div>${data.priceWithTaxes.totalCharges}</div>
        </Grid>
        <Grid item xs={12} justify="space-between">
            <div className={classes.greyDetails}>LESS ADJUSTMENTS</div>
            <div>${data.priceWithTaxes.lessAdjustments}</div>
        </Grid>
        <Grid item xs={12} justify="space-between">
            <div className={classes.greyDetails}>SALES TAX</div>
            <div>${data.priceWithTaxes.salesTax}</div>
        </Grid>
        <Grid item xs={12} justify="space-between">
            <div className={classes.greyDetails}>TOTAL DUE</div>
            <div>${
                data.priceWithTaxes.subletAmount +
                data.priceWithTaxes.shopSupplies +
                data.priceWithTaxes.hazardousMaterailes +
                data.priceWithTaxes.lessAdjustments +
                data.priceWithTaxes.salesTax +
                data.priceWithTaxes.totalCharges
            }</div>
        </Grid>
    </Grid>
}

const PaymentBill = () => {
    return (
        <div>
            <BillHeader/>
            <Divider/>
            <VehicleData/>
            <RepairTable/>
            <Grid container>
                <Disclaimer/>
                <DetailedPayments/>
            </Grid>
        </div>
    );
};

export default PaymentBill;