import {TTitle} from "../Content/ContentTitle/ContentTitle";
import {Routes} from "../../config/routes";
import {IPackageById, TExtendedComplimentary, TExtendedService} from "../../api/types";
import {IDetailsData} from "./MaintenancePackages/PackageAccordion/PackageAccordion";

export const optimizerRoot: TTitle = {
    to: Routes.Optimizer.Base,
    title: "Optimizer Settings"
}
const getTotal = (includedRequests: TExtendedService[]): number => {
    const price = includedRequests.reduce((a, b) => a + +b.price, 0);
    return Number.isInteger(price) ? price : +price.toFixed(2);
}

const getComplimentaryTotal = (includedRequests: TExtendedComplimentary[]): number => {
    const price = includedRequests.reduce((a, b) => a + +b.price, 0);
    return Number.isInteger(price) ? price : +price.toFixed(2);
}

const getHours = (includedRequests: TExtendedService[]): number => {
    return includedRequests.reduce((a, b) => a + +b.durationInHours, 0);
}

const getComplimentaryHours = (includedRequests: TExtendedComplimentary[]): number => {
    return includedRequests.reduce((a, b) => a + +b.durationInHours, 0);
}


export const getOptionsTableData = (pack: IPackageById) => {
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
        const includedRequests = serviceRequests.filter(request => option.serviceRequests.find(item => item.serviceRequestId === request.id));
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

export const checkIsValid = (packageData: IPackageById | null): [boolean, string[] | []] => {
    let isValid = false;
    let messages = [];
    const allRequestsHavePriceAndHours = !packageData?.options.find(option => (
        !Boolean(option.serviceRequestPrice)
        || !Boolean(option.serviceRequestLaborHours)
    ));

    const allComplimentaryHavePriceAndHours = !packageData?.options.find(option => (
        !Boolean(option.complimentaryServicePrice) || !Boolean(option.complimentaryServiceLaborHours)
    ))

    const requestsIncluded = Boolean(packageData?.options.every(option => option.serviceRequests.length > 0));

    const complimentaryIncluded = Boolean(packageData?.options.every(option => {
        return packageData?.complimentaryServices?.length ? option.complimentaryServices.length > 0 : true}));

    const allOptionsHaveNames = !!packageData?.options.every(option => option?.name?.length);
    if (allRequestsHavePriceAndHours && requestsIncluded && allOptionsHaveNames && complimentaryIncluded) isValid = true;
    if (complimentaryIncluded && !allComplimentaryHavePriceAndHours) {
        isValid = false;
        messages.push('Complimentary Requests Market Prices and Invoiced Labor Hours must be more than 0');
    }

    if (!allOptionsHaveNames) messages.push('Please enter name for each Option of Package');
    if (!allRequestsHavePriceAndHours) messages.push('Service Requests Market Prices and Invoiced Labor Hours must be more than 0');
    if (!complimentaryIncluded) messages.push(`Please choose at least one COMPLIMENTARY Request for each Package Option`)
    if (!requestsIncluded) messages.push(`Please choose at least one SERVICE Request for each Package Option`);

    return [isValid, messages];
}