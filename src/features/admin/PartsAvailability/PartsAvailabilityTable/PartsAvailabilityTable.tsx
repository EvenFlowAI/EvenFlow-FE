import React, { Dispatch, SetStateAction, useState } from "react";
import { IOrder, TableRowDataType } from "../../../../types/types";
import { IRecall } from "../../../../store/reducers/recall/types";
import { EditableTableCell } from "../../CapacityAdvisors/EditableTableCell";
import { Table } from "../../../../components/tables/Table/Table";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../store/rootReducer";
import {
  setRecallOrder,
  setRecallPageData,
} from "../../../../store/reducers/recall/actions";
import { usePagination } from "../../../../hooks/usePaginations/usePaginations";
import { Box, Button } from "@mui/material";
import { StyledSwitch, SwitcherLabel } from "../styles";
import { useModal } from "../../../../hooks/useModal/useModal";
import RolloverIconModal from "../RolloverIconModal/RolloverIconModal";

type TProps = {
  isEdit: boolean;
  data: IRecall[];
  setData: Dispatch<SetStateAction<IRecall[]>>;
  checked: boolean;
  setChecked: Dispatch<SetStateAction<boolean>>;
};

const PartsAvailabilityTable: React.FC<TProps> = ({
  isEdit,
  data,
  setData,
  checked,
  setChecked,
}) => {
  const { recallsCount, order, isLoading } = useSelector(
    (state: RootState) => state.recalls,
  );
  const [editingItem, setEditingItem] = useState<IRecall | null>(null);
  const { onOpen, onClose, isOpen } = useModal();
  const { changeRowsPerPage, changePage, pageIndex, pageSize } = usePagination(
    (s: RootState) => s.recalls.recallPageData,
    setRecallPageData,
  );
  const dispatch = useDispatch();

  const onChange = ({
    target: { name, value },
  }: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(false);
    const [field, id] = name.split("-");
    setData((prev) => {
      const item = prev.find((el) => el.id === +id);
      if (item) {
        const filtered = prev.filter((el) => el.id !== +id);
        const updated = { ...item, [field]: value };
        return [...filtered, updated].sort(
          (a, b) => a.localIndex - b.localIndex,
        );
      }
      return prev;
    });
  };

  const onCheck =
    (id: number) =>
    (e: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
      setChecked(false);
      setData((prev) => {
        const item = prev.find((el) => el.id === id);
        if (item) {
          const filtered = prev.filter((el) => el.id !== +id);
          const updated = { ...item, isRemedyAvailable: checked };
          return [...filtered, updated].sort(
            (a, b) => a.localIndex - b.localIndex,
          );
        }
        return prev;
      });
    };

  const onRolloverIconClick = (el: IRecall) => {
    setEditingItem(el);
    onOpen();
  };

  const onCloseModal = () => {
    setEditingItem(null);
    onClose();
  };

  const rowData: TableRowDataType<IRecall>[] = [
    {
      header: "Op Code",
      width: 120,
      val: (el) => el.serviceRequest?.name ?? "",
      orderId: "OpCode",
    },
    {
      header: "NHTSA Campaign",
      val: (el) => el.recallCampaignNumber,
      orderId: "CampaignNumber",
    },
    {
      header: "OEM Program",
      val: (el) => el.oemProgram,
      orderId: "OemProgram",
    },
    {
      header: "Recall Component",
      val: (el) => el.recallComponent,
      orderId: "RecallComponent",
    },
    {
      header: "Part Lead Time (Days)",
      width: 145,
      val: (el) => (
        <EditableTableCell
          value={el.partLeadDaysCount?.toString() ?? "0"}
          name={`partLeadDaysCount-${el.id}`}
          onChange={onChange}
          error={
            (el.partLeadDaysCount < 0 || el.partLeadDaysCount > 99) && checked
          }
          isEdit={isEdit}
          keepDefaultStyling
          defaultValue={"0"}
          min={0}
          max={99}
          disabled={isLoading}
          width={80}
        />
      ),
      orderId: "PartLeadDays",
    },
    {
      header: "Daily Parts",
      val: (el) => (
        <EditableTableCell
          value={el.dailyPartsCount?.toString() ?? "0"}
          name={`dailyPartsCount-${el.id}`}
          onChange={onChange}
          isEdit={isEdit}
          error={(el.dailyPartsCount < 1 || el.dailyPartsCount > 99) && checked}
          defaultValue={"0"}
          type="number"
          min={1}
          max={99}
          keepDefaultStyling
          disabled={isLoading}
          width={80}
        />
      ),
      orderId: "DailyParts",
    },
    {
      header: "Remedy Available",
      width: 127,
      val: (el) =>
        !isEdit ? (
          el.isRemedyAvailable ? (
            <SwitcherLabel>YES</SwitcherLabel>
          ) : (
            <SwitcherLabel>NO</SwitcherLabel>
          )
        ) : (
          <Box p={0} alignItems="center" display="flex">
            <SwitcherLabel>NO</SwitcherLabel>
            <StyledSwitch
              onChange={onCheck(el.id)}
              checked={el.isRemedyAvailable}
              color="primary"
            />
            <SwitcherLabel>YES</SwitcherLabel>
          </Box>
        ),
      orderId: "RemedyAvailable",
    },
    {
      header: "Rollover Icon",
      width: 114,
      val: (el) =>
        isEdit ? (
          <Button
            variant="text"
            color="primary"
            onClick={() => onRolloverIconClick(el)}
            style={{ marginLeft: -16 }}
          >
            {el.rolloverMessage?.length ? "Update" : "Add"}
          </Button>
        ) : el.rolloverMessage?.length ? (
          <SwitcherLabel>YES</SwitcherLabel>
        ) : (
          <SwitcherLabel>NO</SwitcherLabel>
        ),
    },
  ];

  const onSort = (o: IOrder<IRecall>) => () => {
    dispatch(setRecallOrder(o));
  };

  return (
    <div>
      <Table<IRecall>
        data={data}
        index={"id"}
        verticalPadding={isEdit ? 22 : 32}
        isAscending={order.isAscending}
        order={order?.orderBy}
        onSort={onSort}
        rowData={rowData}
        rowsPerPage={pageSize}
        page={pageIndex}
        onChangePage={changePage}
        onChangeRowsPerPage={changeRowsPerPage}
        count={recallsCount}
        hidePagination={recallsCount < 11}
      />
      <RolloverIconModal
        open={isOpen}
        onClose={onCloseModal}
        editingItem={editingItem}
        setData={setData}
      />
    </div>
  );
};

export default PartsAvailabilityTable;
