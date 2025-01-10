import React, { useEffect, useState } from 'react';
import { useSCs } from '../../../hooks/useSCs/useSCs';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store/rootReducer';
import { useException } from '../../../hooks/useException/useException';
import { useMessage } from '../../../hooks/useMessage/useMessage';
import { SC_UNDEFINED } from '../../../utils/constants';
import {
  loadMaxPriceDateRange,
  updateMaxPriceDateRange,
} from '../../../store/reducers/optimizationWindows/actions';
import { StyledInput, Title, Value, Wrapper } from './styles';
import { SaveEditBlock } from '../../../components/buttons/SaveEditBlock/SaveEditBlock';
import { Loading } from '../../../components/wrappers/Loading/Loading';

const MaxPriceDateRange = () => {
  const [saving, setSaving] = useState<boolean>(false);
  const [isEdit, setEdit] = useState<boolean>(false);
  const [val, setVal] = useState<number>(0);

  const { selectedSC } = useSCs();
  const { maxPriceDateRange } = useSelector((state: RootState) => state.optimizationWindows);

  const dispatch = useDispatch();
  const showError = useException();
  const showMessage = useMessage();

  useEffect(() => {
    if (selectedSC) dispatch(loadMaxPriceDateRange(selectedSC.id));
  }, [selectedSC]);

  useEffect(() => {
    if (maxPriceDateRange) setVal(maxPriceDateRange);
  }, [maxPriceDateRange]);

  const onSuccess = () => {
    showMessage('Max Price Date Range updated');
    setEdit(false);
  };

  const handleSave = async () => {
    if (!selectedSC) {
      showError(SC_UNDEFINED);
    } else {
      try {
        setSaving(true);
        await dispatch(updateMaxPriceDateRange(selectedSC.id, val, showError, onSuccess));
      } catch (e) {
        showError(e);
      } finally {
        setSaving(false);
      }
    }
  };

  const onEdit = () => setEdit(true);

  const onCancel = () => {
    if (maxPriceDateRange) setVal(maxPriceDateRange);
    setEdit(false);
  };

  const handleChange = ({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => {
    setVal(Number(value));
  };
  return (
    <Wrapper>
      <Title>Max Price Date Range</Title>
      {saving ? (
        <Loading />
      ) : !isEdit ? (
        <Value>{val}</Value>
      ) : (
        <StyledInput value={val} type="number" inputProps={{ min: 0 }} onChange={handleChange} />
      )}
      <SaveEditBlock
        onSave={handleSave}
        onEdit={onEdit}
        onCancel={onCancel}
        isEdit={isEdit}
        isSaving={saving}
      />
    </Wrapper>
  );
};

export default MaxPriceDateRange;
