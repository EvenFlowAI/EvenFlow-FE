import {TMakeOrder} from "../../../../api/types";

export const truncateMakes = (makes: TMakeOrder[]): TMakeOrder[] => {
    const formattedData: TMakeOrder[] = [];
    makes.forEach(make => {
        const formattedMake = {...make};

        if (formattedMake.name.length > 30) {
            formattedMake.name = formattedMake.name.slice(0, 26).concat('...');
        }
        formattedMake.models = formattedMake.models
            .map(model => model.name?.length > 30
                ? {...model, name: model.name.slice(0, 26).concat('...')}
                : model)
        formattedData.push(formattedMake);
    })
    return formattedData;
}