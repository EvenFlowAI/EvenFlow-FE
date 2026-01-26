import React, { Dispatch, SetStateAction, useCallback } from 'react';
import { IAssignedServiceRequest } from '../../../../../store/reducers/serviceRequests/types';
import { TextField } from '../../../../../components/formControls/TextFieldStyled/TextField';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../../store/rootReducer';
import Checkbox from '../../../../../components/formControls/Checkbox/Checkbox';
import { CheckBoxOutlineBlank, CheckBoxOutlined } from '@mui/icons-material';
import { Table } from '../../../../../components/tables/Table/Table';
import { useStyles } from './styles';
import { TableRowDataType } from '../../../../../types/types';
import { CategoryFormState } from '../types';

type TOpsCodesTableProps = {
  disabled: boolean;
  form: CategoryFormState;
  setForm: Dispatch<SetStateAction<CategoryFormState>>;
};

export const OpsCodesOrderTable: React.FC<
  React.PropsWithChildren<React.PropsWithChildren<TOpsCodesTableProps>>
> = ({ disabled, form, setForm }) => {
  const { allAssignedList, assignedLoading } = useSelector(
    (state: RootState) => state.serviceRequests
  );
  const { classes } = useStyles();

  const onSROrderChange = (id: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
    e.persist();
    const elementToChange = form.selectedCodesWithOrder.find(item => item.id === id);
    if (elementToChange) {
      const updated = {
        ...elementToChange,
        orderIndex: e.target?.value && e?.target?.value.match(/^\d+$/) ? e.target?.value : '',
      };
      setForm(prev => {
        const filtered = prev.selectedCodesWithOrder.filter(item => item.id !== id);
        const updatedCodes = [...filtered, updated];

        const updatedWrongOrderIndexes = e.target?.value
          ? prev.wrongOrderIndexes.filter(el => el !== +e.target.value)
          : prev.wrongOrderIndexes;

        return {
          ...prev,
          selectedCodesWithOrder: updatedCodes,
          wrongOrderIndexes: updatedWrongOrderIndexes,
        };
      });
    }
  };

  const checkError = (el: IAssignedServiceRequest): boolean => {
    const codes = form.selectedCodesWithOrder.filter(item =>
      form.wrongOrderIndexes.includes(+item.orderIndex)
    );
    return !!codes.find(code => code.id === el.id);
  };

  const RowData: TableRowDataType<IAssignedServiceRequest>[] = [
    {
      header: 'ORDER INDEX',
      val: el => (
        <TextField
          fullWidth
          error={checkError(el)}
          disabled={!form.selectedCodesWithOrder.find(item => item.id === el.id)}
          inputProps={{ min: 1, step: 1, max: allAssignedList.length + 1 }}
          value={form.selectedCodesWithOrder.find(item => item.id === el.id)?.orderIndex ?? ''}
          onChange={onSROrderChange(el.id)}
        />
      ),
    },
    {
      header: 'OP CODE',
      val: el => el.serviceRequest.code,
    },
    {
      header: 'DESCRIPTION',
      val: el =>
        el.serviceRequestOverride?.description?.length
          ? el.serviceRequestOverride.description
          : el.serviceRequest.description,
    },
    {
      header: 'LABOR HOURS',
      align: 'center',
      val: el =>
        `${el.serviceRequestOverride?.durationInHours?.toFixed(1) ?? el.serviceRequest.durationInHours.toFixed(1)}`,
    },
    {
      header: 'LABOR AMOUNT',
      align: 'center',
      val: el =>
        `${el.serviceRequestOverride?.warrantyInvoiceAmount?.toFixed(2) ?? el.serviceRequest.warrantyInvoiceAmount.toFixed(2)}`,
    },
    {
      header: 'PARTS AMOUNT',
      align: 'center',
      val: el =>
        `$${el.serviceRequestOverride?.partsUnitCost?.toFixed(2) ?? el.serviceRequest?.partsUnitCost?.toFixed(2)}`,
    },
    {
      header: 'TOTAL AMOUNT',
      align: 'center',
      val: el =>
        `$${el.serviceRequestOverride?.invoiceAmount?.toFixed(2) ?? el.serviceRequest.invoiceAmount?.toFixed(2)}`,
    },
  ];

  const handleSelect = useCallback(
    (el: IAssignedServiceRequest) => {
      if (!disabled) {
        setForm(prev => {
          const codeToChange = prev.selectedCodesWithOrder.find(item => item.id === el.id);

          if (codeToChange) {
            if (typeof codeToChange.orderIndex !== 'undefined') {
              const updatedCodes = prev.selectedCodesWithOrder
                .map(code => ({
                  ...code,
                  orderIndex:
                    +code.orderIndex > +codeToChange.orderIndex && +code.orderIndex > 0
                      ? `${+code.orderIndex - 1}`
                      : code.orderIndex,
                }))
                .filter(item => item.id !== el.id);

              return { ...prev, selectedCodesWithOrder: updatedCodes };
            } else {
              const updatedCodes = prev.selectedCodesWithOrder.filter(item => item.id !== el.id);
              return { ...prev, selectedCodesWithOrder: updatedCodes };
            }
          } else {
            const indexes = prev.selectedCodesWithOrder.map(item =>
              item.orderIndex ? +item.orderIndex : 0
            );
            const orderIndex = indexes.length ? String(Math.max(...indexes) + 1) : '0';
            const updatedCodes = [...prev.selectedCodesWithOrder, { id: el.id, orderIndex }];

            return { ...prev, selectedCodesWithOrder: updatedCodes };
          }
        });
      }
    },
    [disabled]
  );

  const preActions = useCallback(
    (el: IAssignedServiceRequest) => {
      return (
        <Checkbox
          color="primary"
          disabled={disabled}
          icon={
            form.selectedCodesWithOrder.find(item => item.id === el.id) ? (
              <CheckBoxOutlined htmlColor="#3855FE" />
            ) : (
              <CheckBoxOutlineBlank htmlColor="#DADADA" />
            )
          }
          checked={!!form.selectedCodesWithOrder.find(item => item.id === el.id)}
          onChange={() => handleSelect(el)}
        />
      );
    },
    [form.selectedCodesWithOrder, handleSelect, disabled]
  );

  return (
    <div className={classes.scrollableTable}>
      <Table<IAssignedServiceRequest>
        data={allAssignedList}
        index="id"
        smallHeaderFont
        startActions={preActions}
        hidePagination
        compact
        rowData={RowData}
        isLoading={assignedLoading}
        count={allAssignedList.length}
      />
    </div>
  );
};
