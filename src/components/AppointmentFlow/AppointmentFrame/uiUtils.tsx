import React from "react";
import {IPackageOptions, IServiceCategory} from "../../../api/types";
import {ISR} from "../../../store/reducers/appointment/types";

export const getMaintenanceDescription = (
    srList: ISR[],
    selectedSR: number[],
    selectedPackage?: IPackageOptions|null,
    service?: IServiceCategory|null,
    subService?: IServiceCategory|null) => {
    if (selectedPackage) {
        return `${selectedPackage.name} package`;
    }
    if (selectedSR.length) {
        const filtered = srList.filter(el => selectedSR.includes(el.id)).map(el => el.description);
        return filtered.length ? filtered.map(el => <><br /><span>{el}</span></>) : "-";
    }
    if (subService) {
        return subService.name;
    }
    return service?.name ?? "-";
}

export const getServicesDescription = (
    srList: ISR[],
    selectedSR: number[],
    service?: IServiceCategory|null,
    subService?: IServiceCategory|null,
    selectedPackage?: IPackageOptions|null) => {
    const services: string[] = [];
    if (selectedPackage) services.push(`${selectedPackage.name} package`)

    if (service?.type === 0) services.push(service.name);
    if (subService?.type === 0) services.push(subService.name);

    if (selectedSR.length) {
        const filtered: (string | undefined)[] = srList
            .filter(el => selectedSR.includes(el.id))
            .map(el => el.description);
        filtered.forEach(item => item && services.push(item));
    }

    return  services;
}