import React, { useCallback, useEffect, useState } from 'react';
import {
  Button,
  CircularProgress,
  Paper,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material';
import { StyledTable } from '../../../components/styled/StyledTable';
import { EditDemandSegmentsModal } from '../TimeOfDayDesirability/EditDemandSegmentsModal/EditDemandSegmentsModal';
import { useDispatch, useSelector } from 'react-redux';
import {
  loadOptimizationSettings,
  setLoading,
  setSettingValues,
} from '../../../store/reducers/slotScoring/actions';
import { RootState } from '../../../store/rootReducer';
import {
  EOptimizationSettingValueType,
  IOptimizationSettingValue,
  IOptimizationSettingValueForm,
} from '../../../store/reducers/slotScoring/types';
import { SC_UNDEFINED } from '../../../utils/constants';
import { NormalTableCell, Slider, StyledTableCell, useStyles } from './styles';
import { SliderRange, TForm } from './types';
import { initialForm } from './constants';
import { useModal } from '../../../hooks/useModal/useModal';

import { useMessage } from '../../../hooks/useMessage/useMessage';
import { useException } from '../../../hooks/useException/useException';
import { useSCs } from '../../../hooks/useSCs/useSCs';
import { useSelectedPod } from '../../../hooks/useSelectedPod/useSelectedPod';
import { Loading } from '../../../components/wrappers/Loading/Loading';

export const DemandSegmentsDesirability = () => {
  const { onOpen, onClose, isOpen } = useModal();
  const [form, setForm] = useState<TForm[]>(initialForm);
  const [edit, setEdit] = useState<boolean>(false);
  const dispatch = useDispatch();
  const { selectedSC } = useSCs();
  const { selectedPod } = useSelectedPod();
  const { optimizationSettings: optSettings, isLoading } = useSelector(
    (state: RootState) => state.slotScoring
  );
  const showError = useException();
  const showMessage = useMessage();
  const { classes } = useStyles();

  useEffect(() => {
    if (selectedSC) {
      dispatch(loadOptimizationSettings(selectedSC.id, selectedPod?.id));
    }
  }, [dispatch, selectedSC, selectedPod]);

  const setInitialData = useCallback(() => {
    if (optSettings.length) {
      dispatch(setLoading(true));
      const nForm: TForm[] = [];
      for (let i = 0; i < 3; i++) {
        const row = optSettings[i];
        const r1 = row?.values.find(v => v.type === EOptimizationSettingValueType.LessThanW3);
        const r2 = row?.values.find(v => v.type === EOptimizationSettingValueType.GreaterOrEqualW3);
        nForm.push({
          undesirable: r1?.undesirablePoint || 0,
          desirable: r1?.desirablePoint || 0,
          id: r1?.optimizationSettingsId || row?.id || 0,
        });
        nForm.push({
          undesirable: r2?.undesirablePoint || 0,
          desirable: r2?.desirablePoint || 0,
          id: r2?.optimizationSettingsId || row?.id || 0,
        });
      }
      setForm(nForm);
      dispatch(setLoading(false));
    }
  }, [optSettings]);

  useEffect(() => {
    setInitialData();
  }, [optSettings, setInitialData]);

  const handleOpen = () => {
    onOpen();
  };

  const handleChange = (idx: number, name: keyof TForm) => (e: Event, val: number | number[]) => {
    const f = [...form];
    const r = { ...form[idx] };
    r[name] = val as number;
    f[idx] = r;
    setForm(f);
  };

  const handleSave = async () => {
    if (!selectedSC) {
      showError(SC_UNDEFINED);
    } else {
      try {
        dispatch(setLoading(true));
        const items: IOptimizationSettingValue[] = [];
        for (let i = 0; i < 3; i++) {
          const r1 = form[i * 2];
          const r2 = form[i * 2 + 1];
          items.push({
            undesirablePoint: r1.undesirable,
            desirablePoint: r1.desirable,
            type: EOptimizationSettingValueType.LessThanW3,
            optimizationSettingsId: r1.id,
          });
          items.push({
            undesirablePoint: r2.undesirable,
            desirablePoint: r2.desirable,
            type: EOptimizationSettingValueType.GreaterOrEqualW3,
            optimizationSettingsId: r2.id,
          });
        }
        const data: IOptimizationSettingValueForm = { items };
        await dispatch(setSettingValues(data, selectedSC.id, selectedPod?.id));
        setEdit(false);
        showMessage('Saved');
      } catch (e) {
        dispatch(setLoading(false));
        showError(e);
      } finally {
        dispatch(setLoading(true));
      }
    }
  };

  const onCancelOptimizationSettings = () => {
    setEdit(false);
    setInitialData();
  };

  return (
    <Paper variant="outlined" style={{ borderRadius: 0, overflowX: 'auto' }}>
      {isLoading ? (
        <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
          <Loading />
        </div>
      ) : (
        <StyledTable className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell className={classes.buttonCell} colSpan={2}>
                Demand Segment
                <Button
                  className={classes.edit}
                  onClick={handleOpen}
                  color="primary"
                  disabled={isLoading}
                >
                  Edit
                </Button>
              </TableCell>
              <TableCell width={135} rowSpan={2}>
                Time Windows
              </TableCell>
              <TableCell
                width={550}
                colSpan={2}
                style={{ minWidth: 400 }}
                className={classes.buttonCell}
                align="left"
              >
                Optimization Settings
                {edit ? (
                  isLoading ? (
                    <div className={classes.editWrapper}>
                      <CircularProgress />
                    </div>
                  ) : (
                    <div className={classes.editWrapper}>
                      <Button
                        color="secondary"
                        className={classes.editN}
                        onClick={onCancelOptimizationSettings}
                      >
                        Cancel
                      </Button>
                      <Button color="primary" className={classes.editN} onClick={handleSave}>
                        Save
                      </Button>
                    </div>
                  )
                ) : (
                  <Button
                    color="primary"
                    disabled={!optSettings.length}
                    className={classes.edit}
                    onClick={() => setEdit(true)}
                  >
                    Edit
                  </Button>
                )}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className={classes.subtitleCell}>Segment Start</TableCell>
              <TableCell className={classes.subtitleCell}>Segment End</TableCell>
              <TableCell className={classes.subtitleCell} align="left">
                Undesirable
              </TableCell>
              <TableCell className={classes.subtitleCell} align="left">
                Desirable
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {optSettings.map((seg, idx) => (
              <React.Fragment key={seg.id}>
                <TableRow key={`${seg.id}-1`}>
                  <NormalTableCell rowSpan={2} style={{ fontWeight: 300 }}>
                    from <span className={classes.segment}>{seg.from}</span>
                  </NormalTableCell>
                  <NormalTableCell rowSpan={2} style={{ fontWeight: 300 }}>
                    to <span className={classes.segment}>{seg.to}</span>
                  </NormalTableCell>
                  <StyledTableCell style={{ fontWeight: 300 }}>{'< Window3'}</StyledTableCell>
                  <StyledTableCell>
                    <Slider
                      min={SliderRange.Min}
                      max={SliderRange.Max}
                      disabled={!edit}
                      onChange={handleChange(idx * 2, 'undesirable')}
                      marks={[
                        { value: SliderRange.Min, label: SliderRange.Min },
                        { value: SliderRange.Max, label: SliderRange.Max },
                      ]}
                      value={form[idx * 2].undesirable}
                      valueLabelDisplay="on"
                    />
                  </StyledTableCell>
                  <StyledTableCell>
                    <Slider
                      min={SliderRange.Min}
                      max={SliderRange.Max}
                      disabled={!edit}
                      onChange={handleChange(idx * 2, 'desirable')}
                      marks={[
                        { value: SliderRange.Min, label: SliderRange.Min },
                        { value: SliderRange.Max, label: SliderRange.Max },
                      ]}
                      value={form[idx * 2].desirable}
                      valueLabelDisplay="on"
                    />
                  </StyledTableCell>
                </TableRow>
                <TableRow key={`${seg.id}-2`}>
                  <StyledTableCell style={{ fontWeight: 300 }}>{'>= Window3'}</StyledTableCell>
                  <StyledTableCell>
                    <Slider
                      min={SliderRange.Min}
                      max={SliderRange.Max}
                      disabled={!edit}
                      onChange={handleChange(idx * 2 + 1, 'undesirable')}
                      marks={[
                        { value: SliderRange.Min, label: SliderRange.Min },
                        { value: SliderRange.Max, label: SliderRange.Max },
                      ]}
                      value={form[idx * 2 + 1].undesirable}
                      valueLabelDisplay="on"
                    />
                  </StyledTableCell>
                  <StyledTableCell>
                    <Slider
                      min={SliderRange.Min}
                      max={SliderRange.Max}
                      disabled={!edit}
                      onChange={handleChange(idx * 2 + 1, 'desirable')}
                      marks={[
                        { value: SliderRange.Min, label: SliderRange.Min },
                        { value: SliderRange.Max, label: SliderRange.Max },
                      ]}
                      value={form[idx * 2 + 1].desirable}
                      valueLabelDisplay="on"
                    />
                  </StyledTableCell>
                </TableRow>
              </React.Fragment>
            ))}
          </TableBody>
        </StyledTable>
      )}
      <EditDemandSegmentsModal payload={optSettings} onClose={onClose} open={isOpen} />
    </Paper>
  );
};
