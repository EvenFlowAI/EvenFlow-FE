import {TTitle} from "../Content/ContentTitle/ContentTitle";
import {Routes} from "../../config/routes";
import {IPackageById, TExtendedComplimentary, TExtendedService, TIntervalUpsellForPackage} from "../../api/types";
import {IDetailsData} from "./MaintenancePackages/PackageAccordion/PackageAccordion";

export const optimizerRoot: TTitle = {
    to: Routes.Optimizer.Base,
    title: "Capacity Optimization"
}

export const bookingFlowRoot: TTitle = {
    to: Routes.BookingFlow.Base,
    title: "Booking Flow"
}

export const pricingRoot: TTitle = {
    to: Routes.Pricing.Base,
    title: "Pricing"
}

const getTotal = (includedRequests: TExtendedService[]): string => {
    const price = includedRequests.reduce((a, b) => a + +b.price, 0);
    return Number.isInteger(price) ? price.toString() : (+price.toFixed(2)).toString();
}

const getComplimentaryTotal = (includedRequests: TExtendedComplimentary[]): string => {
    const price = includedRequests.reduce((a, b) => a + +b.price, 0);
    return Number.isInteger(price) ? price.toString() : (+price.toFixed(2)).toString();
}

const getUpsellTotal = (includedRequests: TIntervalUpsellForPackage[]): string => {
    const price = includedRequests.reduce((a, b) => a + +b.invoiceAmount, 0);
    return Number.isInteger(price) ? price.toString() : (+price.toFixed(2)).toString();
}

const getHours = (includedRequests: TExtendedService[]): string => {
    return includedRequests.reduce((a, b) => a + +b.durationInHours, 0).toString();
}

const getComplimentaryHours = (includedRequests: TExtendedComplimentary[]): string => {
    return includedRequests.reduce((a, b) => a + +b.durationInHours, 0).toString();
}

const getUpsellHours = (includedRequests:  TIntervalUpsellForPackage[]): string => {
    return includedRequests.reduce((a, b) => a + +b.durationInHours, 0).toString();
}

export const getOptionsTableData = (pack: IPackageById) => {
    const { options, serviceRequests, complimentaryServices, intervalUpsells } = pack;
    const data: IDetailsData = {
        invoicedRequestLaborHours: [],
        complimentaryLaborHours: [],
        requestsPrice: [],
        complimentaryPrice: [],
        suggestedRequestHours: [],
        suggestedRequestPrice: [],
        suggestedComplimentaryHours: [],
        suggestedComplimentaryPrice: [],
        intervalUpsellLaborHours: [],
        intervalUpsellPrice: [],
        suggestedUpsellPrice: [],
        suggestedUpsellHours: [],
    }
    options.forEach(option => {
        const includedRequests = serviceRequests.filter(request => option.serviceRequests.find(item => item.serviceRequestId === request.id));
        const includedComplimentary = complimentaryServices.filter(request => option.complimentaryServices.includes(request.id));
        const includedUpsells = intervalUpsells.filter(request => option.intervalUpsells.find(item => item.serviceRequestId === request.id));
        data.invoicedRequestLaborHours.push({
            numberValue: option.serviceRequestLaborHours.toString(),
            isEditable: true,
            optionType: option.type,
            fieldName: 'serviceRequestLaborHours',
        });
        data.complimentaryLaborHours.push({
            numberValue: option.complimentaryServiceLaborHours.toString(),
            isEditable: Boolean(pack.complimentaryServices.length),
            optionType: option.type,
            fieldName: 'complimentaryServiceLaborHours',
        });
        data.intervalUpsellLaborHours.push({
            numberValue: option.intervalUpsellServiceLaborHours.toString(),
            isEditable: Boolean(pack.intervalUpsells.length),
            optionType: option.type,
            fieldName: 'intervalUpsellLaborHours',
        });
        data.requestsPrice.push({
            numberValue: option.serviceRequestPrice.toString(),
            isEditable: true,
            optionType: option.type,
            fieldName: 'serviceRequestPrice',
        });
        data.complimentaryPrice.push({
            numberValue: option.complimentaryServicePrice.toString(),
            isEditable: Boolean(pack.complimentaryServices.length),
            optionType: option.type,
            fieldName: 'complimentaryServicePrice',
        });
        data.intervalUpsellPrice.push({
            numberValue: option.intervalUpsellServicePrice.toString(),
            isEditable: Boolean(pack.intervalUpsells.length),
            optionType: option.type,
            fieldName: 'intervalUpsellPrice',
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
        data.suggestedUpsellPrice.push({
            numberValue: getUpsellTotal(includedUpsells),
            isEditable: false,
            optionType: option.type,
            fieldName: 'suggestedUpsellPrice',
        })
        data.suggestedUpsellHours.push({
            numberValue: getUpsellHours(includedUpsells),
            isEditable: false,
            optionType: option.type,
            fieldName: 'suggestedUpsellHours',
        })
    })
    return data;
};

export const checkIsValid = (packageData: IPackageById | null): [boolean, string[] | []] => {
    let isValid = false;
    let messages = [];
    const allRequestsHavePriceAndHours = !packageData?.options.find(option => (
        option.serviceRequestPrice < 0
        || option.serviceRequestLaborHours < 0
    ));

    const allComplimentaryHavePriceAndHours = !packageData?.options.find(option => (
        option.complimentaryServicePrice < 0 || option.complimentaryServiceLaborHours < 0
    ))

    const requestsIncluded = Boolean(packageData?.options.every(option => option.serviceRequests.length > 0));

    const complimentaryIncluded = Boolean(packageData?.options.every(option => {
        return packageData?.complimentaryServices?.length ? option.complimentaryServices.length > 0 : true}));

    const allOptionsHaveNames = !!packageData?.options.every(option => option?.name?.length);

    // if (allRequestsHavePriceAndHours && requestsIncluded && allOptionsHaveNames) isValid = true;
    if (allRequestsHavePriceAndHours) isValid = true;

    if (packageData?.complimentaryServices?.length) {
        if (!allComplimentaryHavePriceAndHours) {
            isValid = false;
            messages.push('Complimentary Requests Market Prices and Invoiced Labor Hours must be equal to or more than 0');
        }
        // if (!complimentaryIncluded) {
        //     isValid = false;
        //     messages.push(`Please choose at least one COMPLIMENTARY Request for each Package Option`)
        // }
    }

    // if (!allOptionsHaveNames) messages.push('Please enter name for each Option of Package');
    if (!allRequestsHavePriceAndHours) messages.push('Service Requests Market Prices and Invoiced Labor Hours must be equal to or more than 0');
    // if (!requestsIncluded) messages.push(`Please choose at least one SERVICE Request for each Package Option`);

    return [isValid, messages];
}