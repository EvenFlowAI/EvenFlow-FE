import React, { useEffect, useState } from 'react';
import { useSCs } from '../../../../hooks/useSCs/useSCs';
import { useDispatch, useSelector } from 'react-redux';
import {
  loadPodsSummary,
  removePod,
  setPodById,
  setPodsOrderIndex,
  deactivatePod,
  activatePod,
} from '../../../../store/reducers/pods/actions';
import { RootState } from '../../../../store/rootReducer';
import { Menu, MenuItem } from '@mui/material';
import { IPodSummary, IPodSummaryLocal, TPodOrder } from '../../../../store/reducers/pods/types';
import { useException } from '../../../../hooks/useException/useException';
import { useConfirm } from '../../../../hooks/useConfirm/useConfirm';
import { useModal } from '../../../../hooks/useModal/useModal';
import { ServiceBookModal } from '../../ServiceBookModal/ServiceBookModal';
import ButtonsRow from '../ButtonsRow/ButtonsRow';
import { findMissingNumbers } from '../../ServiceCategories/AddServiceCategoryModal/utils';
import { EOrderError } from '../../ServiceCategories/AddServiceCategoryModal/types';
import TableMode from '../TableMode/TableMode';
import TableComponent from './TableComponent';

const ServiceBooksTable = () => {
  const { summary, podsLoading } = useSelector((state: RootState) => state.pods);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [currentItem, setCurrentItem] = useState<IPodSummary | null>(null);
  const [currentData, setCurrentData] = useState<IPodSummaryLocal[]>([]);
  const [isEdit, setEdit] = useState<boolean>(false);
  const [isChecked, setChecked] = useState<boolean>(false);
  const [wrongOrderIndexes, setWrongOrderIndexes] = useState<number[]>([]);
  const { selectedSC } = useSCs();
  const dispatch = useDispatch();
  const showError = useException();
  const { askConfirm } = useConfirm();
  const { isOpen, onClose, onOpen } = useModal();
  const [tableMode, setTableMode] = useState<'active' | 'inactive'>('active');
  const isActive = tableMode === 'active';
  useEffect(() => {
    setEdit(false);
    setWrongOrderIndexes([]);
  }, [selectedSC]);

  const handleErrors = (errors: EOrderError[]) => {
    if (errors.includes(EOrderError.MissingNumber)) {
      showError(
        'An order value was skipped while assigning. Please adjust so there are no missing values.'
      );
    }
    if (errors.includes(EOrderError.SameNumber)) {
      showError(
        'Two or more service books have the same order value. Please adjust so each service book has a unique value.'
      );
    }
    if (!currentData.every(el => el.orderIndex)) {
      showError(
        'A service book(s) is missing an order value. Please assign a value for all service books.'
      );
    }
  };

  const clearState = () => {
    setEdit(false);
    setChecked(false);
    setWrongOrderIndexes([]);
  };

  const onSave = () => {
    setChecked(true);
    const indexes: number[] = currentData.map(el => el.orderIndex ?? 0);
    const { wrongNumbers, errors } = findMissingNumbers(indexes, currentData.length);
    if (!wrongNumbers.length) {
      const data: TPodOrder[] = currentData.map(el => ({
        id: el.serviceBookId,
        orderIndex: el.orderIndex ?? 0,
      }));
      if (selectedSC) {
        dispatch(
          setPodsOrderIndex(selectedSC?.id, data, tableMode === 'active', showError, clearState)
        );
      }
    } else {
      setWrongOrderIndexes(wrongNumbers);
      handleErrors(errors);
    }
  };

  const onCancel = () => {
    clearState();
    setCurrentData(summary.map(el => ({ ...el, prevOrder: el.orderIndex ?? 0 })));
  };

  useEffect(() => {
    if (selectedSC) dispatch(loadPodsSummary(selectedSC.id, tableMode === 'active'));
  }, [selectedSC, tableMode, dispatch]);

  useEffect(() => {
    setCurrentData(summary.map(el => ({ ...el, prevOrder: el.orderIndex ?? 0 })));
  }, [summary]);

  const openMenu = (el: IPodSummary) => (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    setCurrentItem(el);
    setAnchorEl(e.currentTarget);
  };

  const openEdit = () => {
    setAnchorEl(null);
    onOpen();
  };

  const activateHandler = async () => {
    if (!currentItem?.serviceBookId || !selectedSC?.id) {
      showError('Service Book or Service Center not specified');
      return;
    }
    try {
      setAnchorEl(null);
      await dispatch(activatePod(isActive, currentItem.serviceBookId, selectedSC.id, showError));
    } catch (e) {
      showError(e);
    }
  };

  const deactivateHandler = async () => {
    if (!currentItem?.serviceBookId || !selectedSC?.id) {
      showError('Service Book or Service Center not specified');
      return;
    }
    try {
      setAnchorEl(null);
      await dispatch(deactivatePod(isActive, currentItem.serviceBookId, selectedSC.id, showError));
    } catch (e) {
      showError(e);
    }
  };

  const handleRemove = async () => {
    if (!currentItem) {
      showError('Service Book not specified');
    } else {
      try {
        setCurrentItem(null);
        await dispatch(removePod(currentItem.serviceBookId, isActive, selectedSC?.id, showError));
      } catch (e) {
        showError(e);
      }
    }
  };

  const askRemove = () => {
    setAnchorEl(null);
    if (!currentItem) {
      showError('Service Book is not chosen');
    } else {
      askConfirm({
        isRemove: true,
        title: `Please confirm you want to remove Service Book ${currentItem.serviceBookName ?? '-'}?`,
        onConfirm: handleRemove,
      });
    }
  };

  const onEditClose = () => {
    setCurrentItem(null);
    dispatch(setPodById(null));
    onClose();
  };

  return (
    <>
      <ButtonsRow
        isActive={isActive}
        setEdit={(value: boolean) => {
          setEdit(value);
          setTableMode('active');
        }}
        isEdit={isEdit}
        onSave={onSave}
        onCancel={onCancel}
      />
      <TableMode
        tableMode={tableMode}
        setTableMode={(value: 'active' | 'inactive') => {
          setTableMode(value);
          setEdit(false);
        }}
      />
      <div style={{ paddingTop: 32 }}>
        <TableComponent
          tableMode={tableMode}
          isEdit={isEdit}
          isChecked={isChecked}
          setChecked={setChecked}
          wrongOrderIndexes={wrongOrderIndexes}
          setCurrentData={setCurrentData}
          openMenu={openMenu}
          currentData={currentData}
        />
        <Menu
          open={Boolean(anchorEl)}
          onClose={() => {
            setAnchorEl(null);
          }}
          anchorEl={anchorEl}
        >
          {tableMode === 'active' && (
            <MenuItem onClick={openEdit} disabled={podsLoading}>
              Edit
            </MenuItem>
          )}
          {tableMode === 'active' && (
            <MenuItem onClick={deactivateHandler} disabled={podsLoading}>
              Deactivate
            </MenuItem>
          )}
          {tableMode === 'inactive' && (
            <MenuItem onClick={activateHandler} disabled={podsLoading}>
              Activate
            </MenuItem>
          )}
          <MenuItem onClick={askRemove} disabled={podsLoading}>
            Remove
          </MenuItem>
        </Menu>
        <ServiceBookModal
          open={isOpen}
          isActive={isActive}
          onClose={onEditClose}
          editingItemId={currentItem?.serviceBookId}
        />
      </div>
    </>
  );
};

export default ServiceBooksTable;
