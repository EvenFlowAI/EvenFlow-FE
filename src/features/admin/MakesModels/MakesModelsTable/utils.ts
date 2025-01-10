import { IMake } from '../../../../api/types';

export const truncateMakes = (makes: IMake[]): IMake[] => {
  const formattedData: IMake[] = [];
  makes.forEach(make => {
    const formattedMake = { ...make };

    if (formattedMake.name.length > 30) {
      formattedMake.name = formattedMake.name.slice(0, 26).concat('...');
    }
    formattedMake.models = formattedMake.models.map(model =>
      model.length > 30 ? model.slice(0, 26).concat('...') : model
    );
    formattedData.push(formattedMake);
  });
  return formattedData;
};
