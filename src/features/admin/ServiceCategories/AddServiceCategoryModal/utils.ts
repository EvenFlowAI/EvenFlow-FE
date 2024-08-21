import {EServiceType} from "../../../../store/reducers/appointmentFrameReducer/types";
import {EServiceCategoryType} from "../../../../store/reducers/categories/types";
import {EOrderError, TOption} from "./types";

export const getPageOptions = (serviceType: EServiceType): TOption[] => {
    const typeName = serviceType === EServiceType.MobileService ? "Mobile Service" : "Visit Center";
    return [
        {name: `Owned By ${typeName} (Page 1)`, value: 0},
        {name: `Owned By ${typeName} (Page 2)`, value: 1}
    ]
}

export const categoryOptions = Object.keys(EServiceCategoryType)
    .filter(item => Number.isNaN(+item))
    // @ts-ignore
    .map(item => ({name: item, value: EServiceCategoryType[item]}));


export const getOptionLabel = (option: TOption) => {
    const array = [];
    for (let i = 0; i < option.name.length; i++) {
        if (option.name[i] === option.name[i].toUpperCase() && i > 0) {
            array.push(' ');
        }
        array.push(option.name[i]);
    }
    return array.join('');
}

export const findMissingNumbers = (numbers: number[], max?:number): { wrongNumbers: number[], errors: EOrderError[] } => {
    const missed: number[] = [];
    const errors: EOrderError[] = [];
    const sorted = numbers.sort((a, b) => a - b)
    sorted.forEach((number, index) => {
        if (numbers.filter(el => el === number).length > 1) {
            missed.push(number)
            errors.push(EOrderError.SameNumber)
        }
        if (number > 1 && number - numbers[index - 1] !== 1) {
            missed.push(number)
            errors.push(EOrderError.MissingNumber)
        }
        if (max && number > max) {
            missed.push(number)
            errors.push(EOrderError.MissingNumber)
        }
    })
    return {wrongNumbers: Array.from(new Set(missed)), errors};
}