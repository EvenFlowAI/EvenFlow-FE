import React from 'react';
import { Table } from '../../../../components/tables/Table/Table';
import { TableRowDataTypeResp } from '../../../../types/types';
import {
  EPodSummaryOption,
  IPodSummary,
  IPodSummaryLocal,
} from '../../../../store/reducers/pods/types';
import { StyledField } from './styles';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../store/rootReducer';
import { IconButton } from '@mui/material';
import { MoreHoriz } from '@mui/icons-material';
import { ReactComponent as Checked } from '../../../../assets/img/checkmark_checked.svg';
import { ReactComponent as Unchecked } from '../../../../assets/img/radiobutton_unchecked.svg';

interface TableComponentProps {
  currentData: IPodSummaryLocal[];
  isEdit: boolean;
  isChecked: boolean;
  setChecked: React.Dispatch<React.SetStateAction<boolean>>;
  wrongOrderIndexes: number[];
  setCurrentData: React.Dispatch<React.SetStateAction<IPodSummaryLocal[]>>;
  tableMode: 'active' | 'inactive';
  openMenu: (el: IPodSummary) => (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

const TableComponent = ({
  currentData,
  isEdit,
  isChecked,
  setChecked,
  wrongOrderIndexes,
  setCurrentData,
  tableMode,
  openMenu,
}: TableComponentProps) => {
  const { summary, podsLoading } = useSelector((state: RootState) => state.pods);

  const onChangeOrder =
    (serviceBookId: number | null) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setChecked(false);
      if (Number.isInteger(+e.target.value)) {
        setCurrentData(prev => {
          const itemToUpdate = prev.find(el => el.serviceBookId === serviceBookId);
          if (itemToUpdate) {
            const updated = { ...itemToUpdate, orderIndex: +e.target.value };
            return [...prev.filter(item => item.serviceBookId !== serviceBookId), updated].sort(
              (a, b) => a.prevOrder - b.prevOrder
            );
          }
          return prev;
        });
      }
    };

  const tableActions = (el: IPodSummary) => {
    return (
      <IconButton onClick={openMenu(el)} size="large">
        <MoreHoriz />
      </IconButton>
    );
  };

  const rowData: TableRowDataTypeResp<IPodSummary>[] = [
    {
      header: 'Order',
      align: 'center',
      val: el =>
        isEdit ? (
          <StyledField
            type="tel"
            error={
              isChecked &&
              (el.orderIndex ? wrongOrderIndexes.includes(el.orderIndex) : !el.orderIndex)
            }
            inputProps={{ min: 1, step: 1, max: summary.length }}
            value={el.orderIndex ?? ''}
            onChange={onChangeOrder(el.serviceBookId)}
          />
        ) : el.orderIndex ? (
          el.orderIndex.toString()
        ) : (
          ''
        ),
      width: 80,
      hide: tableMode === 'inactive',
    },
    {
      header: 'Service Book',
      val: el => el.serviceBookName ?? '',
      width: 190,
    },
    {
      header: 'Op Codes',
      val: el => (el.options.includes(EPodSummaryOption.OpsCodes) ? <Checked /> : <Unchecked />),
      align: 'center',
    },
    {
      header: 'Make',
      val: el => (el.options.includes(EPodSummaryOption.Make) ? <Checked /> : <Unchecked />),
      align: 'center',
    },
    {
      header: 'Model',
      val: el => (el.options.includes(EPodSummaryOption.Model) ? <Checked /> : <Unchecked />),
      align: 'center',
    },
    {
      header: 'Mileage',
      val: el => (el.options.includes(EPodSummaryOption.Mileage) ? <Checked /> : <Unchecked />),
      align: 'center',
    },
    {
      header: 'Engine Type',
      val: el => (el.options.includes(EPodSummaryOption.EngineType) ? <Checked /> : <Unchecked />),
      align: 'center',
    },
    {
      header: 'Service Valet',
      val: el =>
        el.options.includes(EPodSummaryOption.ServiceValet) ? <Checked /> : <Unchecked />,
      align: 'center',
    },
    {
      header: 'Mobile Service',
      val: el =>
        el.options.includes(EPodSummaryOption.MobileService) ? <Checked /> : <Unchecked />,
      align: 'center',
    },
    {
      header: 'Transport Options',
      val: el =>
        el.options.includes(EPodSummaryOption.TransportOptions) ? <Checked /> : <Unchecked />,
      align: 'center',
    },
    {
      header: 'Advisors',
      val: el => (el.options.includes(EPodSummaryOption.Advisors) ? <Checked /> : <Unchecked />),
      align: 'center',
    },
  ];

  return (
    <Table
      data={currentData}
      index="serviceBookId"
      rowData={rowData}
      actions={tableActions}
      hidePagination
      verticalAlign="bottom"
      isLoading={podsLoading}
    />
  );
};

export default TableComponent;
