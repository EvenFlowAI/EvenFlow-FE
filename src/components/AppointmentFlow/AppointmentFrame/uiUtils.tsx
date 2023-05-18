import React from "react";
import {EMaintenanceOptionType, IPackageOptions} from "../../../api/types";
import {ISR} from "../../../store/reducers/appointment/types";
import {IMaintenanceItem, IRecallByVin} from "./types";
import {EServiceCategoryType, ICategory} from "../../../store/reducers/categories/types";
import {
    EPackagePricingType,
    IValueService
} from "../../../store/reducers/appointmentFrameReducer/types";
import i18n from "../../../i18n";
import {TPackagePrice} from "../../../store/reducers/packages/types";

export const getMaintenanceDescription = (
    srList: ISR[],
    selectedRecalls: IRecallByVin[],
    packagePriceTitles: TPackagePrice[],
    selectedSR?: number[],
    selectedPackage?: IPackageOptions|null,
    allCategories?: ICategory[],
    selectedCategories?: number[],
    valueService?: IValueService | null,
    packagePricingType?: EPackagePricingType|null,
    packageEMenuType?: EMaintenanceOptionType|null,
    optionTypes?: EMaintenanceOptionType[] | undefined,
) => {
    const services: string[] = [];

    if (selectedPackage) {
        let name = `${selectedPackage.name} ${i18n.t("package")}`;
        if (packagePriceTitles?.length) {
            const price = packagePriceTitles.find(item => item.type === packagePricingType);
            if (price) name = name + ` (${price.title})`;
        }
        services.push(name)
    } else {
        if (packageEMenuType !== null && optionTypes?.length) {
            const firstOption = optionTypes[0];
            const name = packageEMenuType === firstOption
                ? i18n.t("Factory Package")
                : i18n.t("Dealer Package");
            services.push(i18n.t(name));
        }
    }
    if (selectedSR?.length) {
        const filtered = srList.filter(el => selectedSR.includes(el.id)).map(el => el.description);
        filtered.forEach(item => item && services.push(item));
    }
    if (selectedCategories && allCategories) {
        const categories = allCategories.filter(category => selectedCategories.includes(category.id))
        categories.forEach(item => {
            if (item.name.includes("Going")) {
                services.push(i18n.t("My Description of Needs"))
            } else {
                if (item.type === EServiceCategoryType.GeneralCategory) services.push(item.name)
            }
        })
    }
    if (valueService?.selectedService?.name) services.push(valueService.selectedService.name)
    selectedRecalls.forEach(el => services.push(el.shortDescription))
   return services;
}

export const getMaintenanceList = (
    srList: ISR[],
    selectedRecalls: IRecallByVin[],
    selectedSR?: number[],
    selectedPackage?: IPackageOptions|null,
    allCategories?: ICategory[],
    selectedCategories?: number[],
    valueService?: IValueService | null,
    packageEMenuType?: EMaintenanceOptionType|null,
    optionTypes?: EMaintenanceOptionType[] | undefined,
    ) => {
    const services: IMaintenanceItem[] = [];

    if (selectedPackage) {
        services.push({
            name: `${selectedPackage.name} ${i18n.t("package")}`,
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
    if (packageEMenuType !== null && optionTypes?.length) {
        const firstOption = optionTypes[0];
        services.push({
            type: "package",
            name: `${packageEMenuType === firstOption ? i18n.t("Factory") : i18n.t("Dealer")} Package`
        })
    }
    if (selectedRecalls.length) {
        selectedRecalls.forEach(item => {
            services.push({
                id: item.serviceRequestId,
                name: item.shortDescription,
                type: "recall",
                nhtsaRecallNumber: item.nhtsaRecallNumber,
            })
        })
    }
    return services;
}