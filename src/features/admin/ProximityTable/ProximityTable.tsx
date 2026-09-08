import React, { useEffect, useMemo, useState } from 'react';
import { ValueSlider } from '../../../components/styled/ValueSlider';
import {
  Box,
  Button,
  CircularProgress,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import {
  createProximity,
  loadProximity,
  setLoading,
} from '../../../store/reducers/slotScoring/actions';
import { RootState } from '../../../store/rootReducer';
import { EProximityType, IProximity } from '../../../store/reducers/slotScoring/types';
import { SOMETHING_WRONG } from '../../../utils/constants';
import { StyledTable } from '../../../components/styled/StyledTable';
import { SliderRange, TForm } from './types';
import { blankSlider, initialForm, rows } from './constants';

import { useMessage } from '../../../hooks/useMessage/useMessage';
import { useException } from '../../../hooks/useException/useException';
import { useSCs } from '../../../hooks/useSCs/useSCs';
import { useSelectedPod } from '../../../hooks/useSelectedPod/useSelectedPod';
import { SliderCell, TableBodyCell } from './styles';
import { Loading } from '../../../components/wrappers/Loading/Loading';

export const ProximityTable = () => {
  const { proximity, isLoading } = useSelector((state: RootState) => state.slotScoring);
  const [edit, setEdit] = useState<EProximityType | null>(null);
  const [form, setForm] = useState<TForm>(initialForm);
  const { selectedSC } = useSCs();
  const { selectedPod } = useSelectedPod();

  const dispatch = useDispatch();
  const showMessage = useMessage();
  const showError = useException();
  const theme = useTheme();
  const isXS = useMediaQuery(theme.breakpoints.down('sm'));

  const [closest, earliest] = useMemo(() => {
    return [
      proximity.find(e => e.type === EProximityType.Closest),
      proximity.find(e => e.type === EProximityType.Earliest),
    ];
  }, [proximity]);

  useEffect(() => {
    if (selectedSC) dispatch(loadProximity(selectedSC.id, selectedPod?.id));
  }, [dispatch, selectedPod, selectedSC]);

  useEffect(() => {
    setForm({
      [EProximityType.Closest]: closest ? { ...closest } : { ...blankSlider },
      [EProximityType.Earliest]: earliest ? { ...earliest } : { ...blankSlider },
    });
  }, [closest, earliest]);

  const handleEdit = (el: EProximityType) => () => {
    setEdit(el);
  };
  const handleSlide = (_: any, val: number | number[]) => {
    if (edit !== null) {
      setForm({ ...form, [edit]: { point: val as number } });
    }
  };
  const handleCancel = () => {
    setForm({
      [EProximityType.Closest]: closest ? { ...closest } : { ...blankSlider },
      [EProximityType.Earliest]: earliest ? { ...earliest } : { ...blankSlider },
    });
    setEdit(null);
  };
  const handleSave = async () => {
    if (edit === null) {
      showError(SOMETHING_WRONG);
    } else {
      const data: IProximity = {
        point: form[edit].point,
        serviceCenterId: selectedSC?.id,
        podId: selectedPod?.id,
        type: edit,
      };
      try {
        await dispatch(createProximity(data));
        setEdit(null);
        showMessage('Saved');
      } catch (e) {
        dispatch(setLoading(false));
        handleCancel();
        showError(e);
      }
    }
  };

  const editButton = (t: EProximityType) => {
    return isLoading ? (
      <CircularProgress color="primary" />
    ) : edit === t ? (
      <>
        <Button onClick={handleCancel} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleSave} color="primary">
          Save
        </Button>
      </>
    ) : (
      <Button disabled={edit !== null} color="primary" onClick={handleEdit(t)}>
        Edit
      </Button>
    );
  };

  return (
    <div>
      {isLoading ? (
        <Loading />
      ) : (
        <StyledTable>
          <TableHead>
            <TableRow>
              {!isXS ? <TableCell width={300}>Proximity Search</TableCell> : null}
              <TableCell>Optimization setting</TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map(row => (
              <TableRow key={row.id}>
                {!isXS ? <TableBodyCell>{row.label}</TableBodyCell> : null}
                <SliderCell>
                  {isXS ? <span>{row.label}</span> : null}
                  <Box p={isXS ? 1 : 0}>
                    <ValueSlider
                      min={SliderRange.Min}
                      max={SliderRange.Max}
                      onChange={handleSlide}
                      disabled={edit !== row.id}
                      marks={[
                        { value: SliderRange.Min, label: SliderRange.Min },
                        { value: SliderRange.Max, label: SliderRange.Max },
                      ]}
                      value={form[row.id].point}
                      valueLabelDisplay="on"
                    />
                  </Box>
                </SliderCell>
                <TableCell align="right" width={160} style={{ padding: 12 }}>
                  {editButton(row.id)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </StyledTable>
      )}
    </div>
  );
};
