import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { TableBody, TableHead, Button } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import {
  loadDemandCapacity,
  loadUnplannedDemand,
  loadUnplannedSlots,
} from '../../../store/reducers/demandSegments/actions';
import { RootState } from '../../../store/rootReducer';
import {
  EDay,
  IUnplannedDemand,
  IUnplannedDemandSlotsRequest,
} from '../../../store/reducers/demandSegments/types';
import UnplannedDemandEditing from './UnplannedDemandEditing/UnplannedDemandEditing';
import { remapSegments } from './utils';
import { DemandTableWithoutBorder } from '../../../components/styled/DemandTable';
import { TableRow, TableRowWithoutBorder } from '../../../components/styled/TableRow';
import { TableCell, TableCellWithLittlePadding } from '../../../components/styled/TableCell';
import { useSCs } from '../../../hooks/useSCs/useSCs';
import { useSelectedPod } from '../../../hooks/useSelectedPod/useSelectedPod';
import dayjs from 'dayjs';
import {
  UnplannedTableCell,
  UnplannedTableCellWithLittlePadding,
} from './UnplannedDemandSlots/styles';
import { useStyles } from './styles';
import { STextField } from '../AncillaryPriceByDistance/styles';
import { TForm } from '../OverbookingFactor/types';
import { initialState } from '../OverbookingFactor/constants';
import { useMessage } from '../../../hooks/useMessage/useMessage';
import { useException } from '../../../hooks/useException/useException';
import {
  loadOverbookingFactor,
  setOverbookingFactor,
} from '../../../store/reducers/optimizationWindows/actions';
import { SC_UNDEFINED } from '../../../utils/constants';
import { IOverbookingFactor } from '../../../store/reducers/optimizationWindows/types';
import { SaveEditBlock } from '../../../components/buttons/SaveEditBlock/SaveEditBlock';
import { PodSelector } from '../NavBar/PodSelector/PodSelector';
import { DForm } from './types';
import { initialStateByCapacity } from './constants';
import { Loading } from '../../../components/wrappers/Loading/Loading';

export const UnplannedDemand = () => {
  const [isEdit, setEdit] = useState<boolean>(false);
  const [isEditOverbooking, setEditOverBooking] = useState<boolean>(false);
  const [editingElement, setEditingElement] = useState<IUnplannedDemand | null>(null);
  const { selectedSC } = useSCs();
  const [loading, setLoading] = useState(false);
  const { selectedPod } = useSelectedPod();
  const dispatch = useDispatch();
  const unplannedSegments = useSelector(
    (state: RootState) => state.demandSegments.unplannedDemands
  );

  const { classes } = useStyles();

  const segments: IUnplannedDemand[] = useMemo(() => {
    return remapSegments(unplannedSegments);
  }, [unplannedSegments]);

  const loadingStart = () => {
    setLoading(true);
  };

  const loadingStop = () => {
    setLoading(false);
  };

  useEffect(() => {
    if (selectedSC) {
      loadingStart();
      dispatch(loadUnplannedDemand(selectedSC.id, selectedPod?.id, loadingStop));
      dispatch(loadDemandCapacity(selectedSC.id, selectedPod?.id, loadingStop));
    }
  }, [dispatch, selectedSC, selectedPod]);

  useEffect(() => {
    if (selectedSC && editingElement) {
      const data: IUnplannedDemandSlotsRequest = {
        serviceCenterId: selectedSC.id,
        podId: selectedPod?.id,
        day: editingElement?.day,
      };
      dispatch(loadUnplannedSlots(data));
    }
  }, [selectedSC, editingElement, selectedPod]);

  const onEdit = (d: number) => {
    const el = unplannedSegments.find(item => item.day === (d as EDay));
    if (el) {
      setEditingElement(el);
      setEdit(true);
    }
  };

  const [saving, setSaving] = useState<boolean>(false);
  const [form, setForm] = useState<TForm>(initialState);
  const [demandForm, setDemandForm] = useState<DForm>(initialStateByCapacity);
  const overbookingList = useSelector(
    (state: RootState) => state.optimizationWindows.overbookingFactor
  );
  const demandCapacity = useSelector((state: RootState) => state.demandSegments.demandCapacity);

  const showMessage = useMessage();
  const showError = useException();

  useEffect(() => {
    if (selectedSC) {
      dispatch(loadOverbookingFactor(selectedSC.id, selectedPod?.id));
    }
  }, [selectedSC, selectedPod, dispatch]);

  const setInitialData = useCallback(() => {
    const nForm = {} as TForm;
    if (overbookingList.length) {
      for (const overbookingItem of overbookingList) {
        nForm[overbookingItem.day] = overbookingItem;
      }
      setForm(nForm);
    } else {
      setForm(initialState);
    }
  }, [overbookingList]);

  const setDemandCapacity = useCallback(() => {
    const nForm = {} as DForm;
    if (demandCapacity.length) {
      for (const item of demandCapacity) {
        nForm[item.dayOfWeek] = item;
      }
      setDemandForm(nForm);
    } else {
      setDemandForm(initialStateByCapacity);
    }
  }, [demandCapacity]);

  useEffect(() => {
    setInitialData();
  }, [overbookingList]);

  useEffect(() => {
    setDemandCapacity();
  }, [demandCapacity]);

  const handleCancel = () => {
    setInitialData();
    setEditOverBooking(false);
  };

  const handleChange =
    (day: EDay) =>
    ({ target: { name, value } }: React.ChangeEvent<HTMLInputElement>) => {
      setForm({ ...form, [day]: { ...form[day], [name]: Number(value) } });
    };

  const onSuccess = () => {
    setSaving(false);
    showMessage('Saved');
    setEditOverBooking(false);
    if (selectedSC) {
      dispatch(loadDemandCapacity(selectedSC.id, selectedPod?.id));
      loadingStop();
    }
  };

  const onError = (err: string) => {
    setSaving(false);
    showError(err);
  };

  const handleSave = async () => {
    if (!selectedSC) {
      showError(SC_UNDEFINED);
    } else {
      setSaving(true);
      const data: IOverbookingFactor[] = Object.values(form).map(di => ({
        ...di,
        serviceCenterId: selectedSC.id,
        podId: selectedPod?.id,
        overbookingFactorValue: di.overbookingFactorValue || 0,
      }));
      dispatch(setOverbookingFactor(data, onSuccess, onError));
    }
  };

  return (
    <div style={{ overflowX: 'auto', overflowY: loading ? 'hidden' : 'auto' }}>
      <div style={{ marginBottom: '20px' }}>
        <PodSelector individualStyles />
      </div>
      {!isEdit ? (
        loading ? (
          <Loading />
        ) : (
          <>
            <DemandTableWithoutBorder>
              <TableHead>
                <TableRowWithoutBorder>
                  <TableCell>Day</TableCell>
                  <TableCell>Appointment Capacity</TableCell>
                  <TableCell>Production capacity</TableCell>
                  <TableCell>Unplanned Demand</TableCell>
                  <TableCell>Overbooking Factor</TableCell>
                  {isEditOverbooking ? (
                    <TableCell width="15%" style={{ textAlign: 'right' }}>
                      <SaveEditBlock
                        onSave={handleSave}
                        onEdit={() => setEdit(true)}
                        onCancel={handleCancel}
                        isEdit={isEditOverbooking}
                        isSaving={saving}
                      />
                    </TableCell>
                  ) : null}
                </TableRowWithoutBorder>
              </TableHead>
              <TableBody>
                {dayjs.weekdays().map((d, idx) => {
                  return (
                    <TableRow key={d}>
                      <UnplannedTableCellWithLittlePadding>{d}</UnplannedTableCellWithLittlePadding>
                      <UnplannedTableCellWithLittlePadding>
                        <span>
                          {demandForm[idx as EDay].appointmentCapacity
                            ? demandForm[idx as EDay].appointmentCapacity
                            : '0'}
                        </span>
                      </UnplannedTableCellWithLittlePadding>
                      <UnplannedTableCellWithLittlePadding>
                        <span>
                          {demandForm[idx as EDay].productionCapacity
                            ? demandForm[idx as EDay].productionCapacity
                            : '0'}
                        </span>
                      </UnplannedTableCellWithLittlePadding>
                      <UnplannedTableCellWithLittlePadding>
                        <p className={classes.overBookingFactorWrapper}>
                          <span className={classes.overBookingValue}>
                            {segments[idx].optimizerSetting || 0}
                          </span>
                          <Button variant="text" color="primary" onClick={() => onEdit(idx)}>
                            Edit
                          </Button>
                        </p>
                      </UnplannedTableCellWithLittlePadding>
                      <UnplannedTableCellWithLittlePadding>
                        <p className={classes.overBookingFactorWrapper}>
                          {!isEditOverbooking ? (
                            <span className={classes.overBookingValue}>
                              {form[idx as EDay].overbookingFactorValue
                                ? form[idx as EDay].overbookingFactorValue + '%'
                                : '0%'}
                            </span>
                          ) : (
                            <STextField
                              type="number"
                              inputProps={{
                                min: 0,
                              }}
                              name="overbookingFactorValue"
                              id="overbookingFactorValue"
                              value={form[idx as EDay].overbookingFactorValue ?? ''}
                              onChange={handleChange(idx as EDay)}
                            />
                          )}
                          {!isEditOverbooking ? (
                            <div className={classes.editOverBooking}>
                              {' '}
                              <SaveEditBlock
                                onSave={handleSave}
                                isLowerCase={true}
                                onEdit={() => setEditOverBooking(true)}
                                onCancel={handleCancel}
                                isEdit={isEditOverbooking}
                                isSaving={saving}
                              />
                            </div>
                          ) : null}
                        </p>
                      </UnplannedTableCellWithLittlePadding>
                      {/* empty column to continue row styles */}
                      {isEditOverbooking ? (
                        <TableCellWithLittlePadding></TableCellWithLittlePadding>
                      ) : null}
                    </TableRow>
                  );
                })}
              </TableBody>
            </DemandTableWithoutBorder>
          </>
        )
      ) : (
        <UnplannedDemandEditing setEdit={setEdit} isEdit={isEdit} editingElement={editingElement} />
      )}
    </div>
  );
};
