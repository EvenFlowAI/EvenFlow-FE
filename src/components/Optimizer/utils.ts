import {TTitle} from "../Content/ContentTitle/ContentTitle";
import {Routes} from "../../config/routes";
import {IServiceRequest} from "../../store/reducers/serviceRequests/types";
import {IComplimentaryService, IPackageById} from "../../api/types";
import {IDetailsData} from "./MaintenancePackages/PackageAccordion/PackageAccordion";

export const optimizerRoot: TTitle = {
    to: Routes.Optimizer.Base,
    title: "Optimizer Settings"
}
const getTotal = (includedRequests: IServiceRequest[]): number => {
    const price = includedRequests.reduce((a, b) => a + +b.price, 0);
    return Number.isInteger(price) ? price : +price.toFixed(2);
}

const getComplimentaryTotal = (includedRequests: IComplimentaryService[]): number => {
    const price = includedRequests.reduce((a, b) => a + +b.price, 0);
    return Number.isInteger(price) ? price : +price.toFixed(2);
}

const getHours = (includedRequests: IServiceRequest[]): number => {
    return includedRequests.reduce((a, b) => a + +b.durationInHours, 0);
}

const getComplimentaryHours = (includedRequests: IComplimentaryService[]): number => {
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