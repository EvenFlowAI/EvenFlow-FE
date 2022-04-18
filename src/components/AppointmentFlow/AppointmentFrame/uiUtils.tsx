import React from "react";
import {IPackageOptions} from "../../../api/types";
import {ISR} from "../../../store/reducers/appointment/types";
import {IMaintenanceItem} from "./types";
import {EServiceCategoryType, ICategory} from "../../../store/reducers/categories/types";
import {IValueService} from "../../../store/reducers/appointmentFrameReducer/types";

export const getMaintenanceDescription = (
    srList: ISR[],
    selectedSR?: number[],
    selectedPackage?: IPackageOptions|null,
    allCategories?: ICategory[],
    selectedCategories?: number[]) => {
    const services: string[] = [];

    if (selectedPackage) {
        services.push(`${selectedPackage.name} package`)
    }
    if (selectedSR?.length) {
        const filtered = srList.filter(el => selectedSR.includes(el.id)).map(el => el.description);
        filtered.forEach(item => item && services.push(item));
    }
    if (selectedCategories && allCategories) {
        const categories = allCategories.filter(category => selectedCategories.includes(category.id))
        categories.forEach(item => {
            if (item.name.includes("Going")) {
                services.push("My Description of Needs")
            } else {
                if (item.type === EServiceCategoryType.GeneralCategory) services.push(item.name)
            }
        })
    }
   return services;
}

export const getMaintenanceList = (
    srList: ISR[],
    selectedSR?: number[],
    selectedPackage?: IPackageOptions|null,
    allCategories?: ICategory[],
    selectedCategories?: number[],
    valueService?: IValueService | null,
    ) => {
    const services: IMaintenanceItem[] = [];

    if (selectedPackage) {
        services.push({
            name: `${selectedPackage.name} package`,
            id: selectedPackage.id,
            type: 'package',
    })
    }
    if (selectedSR?.length) {
        const filtered = srList.filter(el => selectedSR.includes(el.id));
        filtered.forEach(item => item && services.push({id: item.id, name: item.description ?? item.code, type: 'service'}));
    }
    if (selectedCategories && allCategories) {
        const categories = allCategories.filter(category => selectedCategories.includes(category.id) && category.type === EServiceCategoryType.GeneralCategory)
        categories.forEach(item => {
            if (item.type === EServiceCategoryType.GeneralCategory) {
                services.push({
                    id: item.id,
                    name: item.name,
                    type: 'category'
                })
            }
        })
    }
    if (valueService?.selectedService) {
        services.push({
            id: valueService.selectedService.id,
            name: valueService.selectedService.name,
            type: 'valueService'
        })
    }
    return services;
}