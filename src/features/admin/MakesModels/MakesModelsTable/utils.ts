import { IMake } from '../../../../api/types';

export const truncateMakes = (makes: IMake[]): IMake[] => {
  const formattedData: IMake[] = [];
  makes.forEach(make => {
    const formattedMake = { ...make };

    if (formattedMake.name.length > 30) {
      formattedMake.name = formattedMake.name.slice(0, 26).concat('...');
    }
    formattedMake.models = formattedMake.models.map(model => ({
      ...model,
      name: model.name.length > 30 ? model.name.slice(0, 26).concat('...') : model.name,
    }));
    formattedData.push(formattedMake);
  });
  return formattedData;
};
