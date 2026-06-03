import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { CheckBoxOutlineBlank, CheckBoxOutlined } from '@mui/icons-material';
import Checkbox from '../../../../../../../components/formControls/Checkbox/Checkbox';
import { RootState } from '../../../../../../../store/rootReducer';
import { IGlobalModelYear } from '../../../../../../../store/reducers/recall/types';
import { useRecallAlertSettingsStyles } from './styles';

type TGroupedModel = {
  globalVehicleModelId: number;
  model: string;
  years: number[];
  vehicleCount: number;
};

type TGroupedMake = {
  make: string;
  models: TGroupedModel[];
};

const formatYearRanges = (years: number[]): string => {
  if (!years.length) {
    return '-';
  }

  const ranges: string[] = [];
  let rangeStart = years[0];
  let prev = years[0];

  for (let i = 1; i < years.length; i += 1) {
    const current = years[i];

    if (current === prev + 1) {
      prev = current;
      continue;
    }

    ranges.push(rangeStart === prev ? `${rangeStart}` : `${rangeStart}-${prev}`);
    rangeStart = current;
    prev = current;
  }

  ranges.push(rangeStart === prev ? `${rangeStart}` : `${rangeStart}-${prev}`);

  return ranges.join(', ');
};

interface AffectedModelsProps {
  selectedModelKeys: IGlobalModelYear[];
  setSelectedModelKeys: React.Dispatch<React.SetStateAction<IGlobalModelYear[]>>;
  isEditTable: boolean;
}

const AffectedModels: React.FC<AffectedModelsProps> = ({
  selectedModelKeys,
  setSelectedModelKeys,
  isEditTable,
}) => {
  const { classes } = useRecallAlertSettingsStyles();
  const { affectedModels } = useSelector((state: RootState) => state.recalls);

  const groupedByMake = useMemo<TGroupedMake[]>(() => {
    const makeMap = new Map<
      string,
      Map<
        number,
        {
          model: string;
          yearSet: Set<number>;
          vehicleCount: number;
        }
      >
    >();

    affectedModels.forEach(({ globalVehicleModelId, make, model, year, vehicleCount }) => {
      const makeName = make || '-';
      const modelName = model || '-';

      if (!makeMap.has(makeName)) {
        makeMap.set(makeName, new Map());
      }

      const modelsMap = makeMap.get(makeName)!;

      if (!modelsMap.has(globalVehicleModelId)) {
        modelsMap.set(globalVehicleModelId, {
          model: modelName,
          yearSet: new Set<number>(),
          vehicleCount: 0,
        });
      }

      const modelEntry = modelsMap.get(globalVehicleModelId)!;

      if (year) {
        modelEntry.yearSet.add(year);
      }

      modelEntry.vehicleCount += vehicleCount || 0;
    });

    return Array.from(makeMap.entries())
      .map(([make, modelsMap]) => ({
        make,
        models: Array.from(modelsMap.entries())
          .map(([globalVehicleModelId, data]) => ({
            globalVehicleModelId,
            model: data.model,
            years: Array.from(data.yearSet).sort((a, b) => a - b),
            vehicleCount: data.vehicleCount,
          }))
          .sort((a, b) => a.model.localeCompare(b.model)),
      }))
      .sort((a, b) => a.make.localeCompare(b.make));
  }, [affectedModels]);

  const modelKeys = useMemo(
    () =>
      groupedByMake.flatMap(({ models }) =>
        models.map(({ globalVehicleModelId }) => globalVehicleModelId)
      ),
    [groupedByMake]
  );

  const isYearSelected = (modelId: number, year: number): boolean =>
    selectedModelKeys.some(item => item.globalVehicleModelId === modelId && item.year === year);

  const isModelSelected = (modelId: number, years: number[]): boolean => {
    if (!years.length) {
      return selectedModelKeys.some(item => item.globalVehicleModelId === modelId);
    }

    return years.every(year => isYearSelected(modelId, year));
  };

  const isModelSelectedInState = (
    state: IGlobalModelYear[],
    modelId: number,
    years: number[]
  ): boolean => {
    if (!years.length) {
      return state.some(item => item.globalVehicleModelId === modelId);
    }

    return years.every(year =>
      state.some(item => item.globalVehicleModelId === modelId && item.year === year)
    );
  };

  const selectedModelsCount = useMemo(
    () =>
      groupedByMake
        .flatMap(({ models }) => models)
        .filter(({ globalVehicleModelId, years }) => isModelSelected(globalVehicleModelId, years))
        .length,
    [groupedByMake, selectedModelKeys]
  );

  const toggleModel = (modelId: number, years: number[]): void => {
    setSelectedModelKeys(prev => {
      const selectedYearsByModel = prev
        .filter(item => item.globalVehicleModelId === modelId)
        .map(item => item.year);

      const allYearsSelected =
        years.length > 0 && years.every(year => selectedYearsByModel.includes(year));

      if (allYearsSelected) {
        const selectedModelsInState = groupedByMake
          .flatMap(({ models }) => models)
          .filter(({ globalVehicleModelId, years: modelYears }) =>
            isModelSelectedInState(prev, globalVehicleModelId, modelYears)
          );

        const isTryingToUnselectLastModel =
          selectedModelsInState.length === 1 &&
          selectedModelsInState[0].globalVehicleModelId === modelId;

        if (isTryingToUnselectLastModel) {
          return prev;
        }

        return prev.filter(
          item => !years.some(year => item.globalVehicleModelId === modelId && item.year === year)
        );
      }

      const missingYears = years
        .filter(year => !selectedYearsByModel.includes(year))
        .map(year => ({ globalVehicleModelId: modelId, year }));

      return [...prev, ...missingYears];
    });
  };

  return (
    <div className={classes.affectedModelsContainer}>
      <div className={classes.affectedModelsHeader}>
        <span className={classes.affectedModelsTitle}>Affected Models</span>
        <span className={classes.affectedModelsSelected}>
          {selectedModelsCount} of {modelKeys.length} selected
        </span>
      </div>

      <div className={classes.affectedModelsBody}>
        {!groupedByMake.length && (
          <div className={classes.emptyAffectedModels}>No affected models</div>
        )}

        {groupedByMake.map(({ make, models }) => (
          <div key={make}>
            <div className={classes.makeRow}>{make}</div>

            {models.map(({ globalVehicleModelId, model, years, vehicleCount }) => {
              const modelKey = globalVehicleModelId;
              const isChecked = isModelSelected(modelKey, years);

              return (
                <div key={modelKey} className={classes.modelRow}>
                  <div className={classes.modelNameCell}>
                    <Checkbox
                      className={classes.modelCheckbox}
                      color="primary"
                      icon={
                        isChecked ? (
                          <CheckBoxOutlined htmlColor="#3855FE" />
                        ) : (
                          <CheckBoxOutlineBlank htmlColor="#DADADA" />
                        )
                      }
                      checked={isChecked}
                      disabled={!isEditTable || (isChecked && selectedModelsCount === 1)}
                      onChange={() => toggleModel(modelKey, years)}
                    />
                    {model}
                  </div>

                  <div className={classes.modelYearCell}>{formatYearRanges(years)}</div>
                  <div className={classes.modelVehicleCountCell}>{vehicleCount} vehicles</div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AffectedModels;
