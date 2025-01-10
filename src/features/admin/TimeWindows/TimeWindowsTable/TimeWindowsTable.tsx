import React, { useEffect, useState } from 'react';
import { CircularProgress, TableBody, TableCell, TableRow } from '@mui/material';
import { loadTimeWindow, setTimeWindow } from '../../../../store/reducers/demandSegments/actions';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../store/rootReducer';
import { SC_UNDEFINED } from '../../../../utils/constants';
import { StyledTable } from '../../../../components/styled/StyledTable';
import { useMessage } from '../../../../hooks/useMessage/useMessage';
import { useException } from '../../../../hooks/useException/useException';
import { useSCs } from '../../../../hooks/useSCs/useSCs';
import { useSelectedPod } from '../../../../hooks/useSelectedPod/useSelectedPod';
import { Button, TableBodyCell, TableHeadCell } from './styles';
import { TForm } from './types';
import { defaultForm, rows } from './constants';
import { getData } from './utils';
import { Loading } from '../../../../components/wrappers/Loading/Loading';
import { TableInput } from '../../../../components/wrappers/TableInput/TableInput';

export const TimeWindowsTable = () => {
  const { timeWindow, isTimeWindowLoading } = useSelector(
    (state: RootState) => state.demandSegments
  );
  const [form, setForm] = useState<TForm>(defaultForm);
  const [isEdit, setEdit] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const { selectedSC } = useSCs();
  const { selectedPod } = useSelectedPod();

  const showMessage = useMessage();
  const showError = useException();
  const dispatch = useDispatch();

  useEffect(() => {
    setForm(getData(timeWindow));
  }, [timeWindow]);

  useEffect(() => {
    if (selectedSC) {
      dispatch(loadTimeWindow(selectedSC.id, selectedPod?.id));
    }
  }, [selectedSC, dispatch, selectedPod]);

  const handleCancel = () => {
    setForm(getData(timeWindow));
    setEdit(false);
  };
  const handleChange = ({ target: { name, value } }: React.ChangeEvent<HTMLInputElement>) => {
    const nForm = { ...form, [name]: Number(value) };
    switch (name) {
      case 'start':
        nForm.duration1 = nForm.start;
        nForm.duration2 = nForm.stop - nForm.start;
        break;
      case 'stop':
        nForm.duration2 = nForm.stop - nForm.start;
        break;
      case 'duration1':
        nForm.start = nForm.duration1;
        break;
      case 'duration2':
        nForm.stop = nForm.start + nForm.duration2;
        break;
      default:
        break;
    }
    setForm(nForm);
  };

  const handleSave = async () => {
    if (!selectedSC) {
      showError(SC_UNDEFINED);
    } else {
      setSaving(true);
      try {
        await dispatch(
          setTimeWindow({
            serviceCenterId: selectedSC.id,
            podId: selectedPod?.id,
            startInHours: form.start,
            durationInHours: form.duration2,
          })
        );
        setSaving(false);
        setEdit(false);
        showMessage('Saved');
      } catch (e) {
        setSaving(false);
        showError(e);
      }
    }
  };

  return isTimeWindowLoading || saving ? (
    <Loading />
  ) : (
    <StyledTable>
      <TableBody>
        <TableRow>
          <TableHeadCell width={300}>Time windows</TableHeadCell>
          <TableHeadCell>Window 1</TableHeadCell>
          <TableHeadCell>Window 2</TableHeadCell>
          <TableHeadCell>Window 3</TableHeadCell>
          <TableCell rowSpan={3} width={160} align="right" style={{ padding: 12 }}>
            {!isEdit ? (
              <Button color="primary" onClick={() => setEdit(true)} style={{ fontSize: 14 }}>
                EDIT
              </Button>
            ) : !saving ? (
              <>
                <Button color="secondary" onClick={handleCancel} style={{ fontSize: 14 }}>
                  CANCEL
                </Button>
                <Button color="primary" onClick={handleSave} style={{ fontSize: 14 }}>
                  SAVE
                </Button>
              </>
            ) : (
              <CircularProgress />
            )}
          </TableCell>
        </TableRow>
        {rows.map(row => (
          <TableRow key={row.label}>
            <TableBodyCell align="left">{row.label}</TableBodyCell>
            {row.items.map((item, idx) => (
              <TableBodyCell key={idx} align="left">
                {!item.name ? (
                  item.value
                ) : (
                  <TableInput
                    name={item.name}
                    value={form[item.name]}
                    onChange={handleChange}
                    isEdit={isEdit}
                    endAdornment="hour(s)"
                    defaultValue={'0'}
                  />
                )}
              </TableBodyCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </StyledTable>
  );
};
