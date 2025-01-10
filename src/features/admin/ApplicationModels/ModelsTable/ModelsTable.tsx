import React, { Dispatch, SetStateAction } from "react";
import {
  IOrder,
  IPageRequest,
  TableRowDataType,
} from "../../../../types/types";
import {
  EReviewStatus,
  IGlobalModel,
} from "../../../../store/reducers/globalVehicles/types";
import { useSelector } from "react-redux";
import { RootState } from "../../../../store/rootReducer";
import { Autocomplete } from "@mui/material";
import { autocompleteRender } from "../../../../utils/autocompleteRenders";
import { Table } from "../../../../components/tables/Table/Table";
import { useAutocompleteStyles } from "../styles";
import { reviewOptions } from "../../../../utils/constants";
import { useException } from "../../../../hooks/useException/useException";

type TProps = {
  isEdit: boolean;
  pageData: IPageRequest;
  onChangePage: (
    e: React.MouseEvent<Element, MouseEvent> | null,
    pageIndex: number,
  ) => void;
  onChangeRowsPerPage: (e: React.ChangeEvent<HTMLInputElement>) => void;
  data: IGlobalModel[];
  setData: Dispatch<SetStateAction<IGlobalModel[]>>;
  order: IOrder<IGlobalModel>;
  setOrder: Dispatch<SetStateAction<IOrder<IGlobalModel>>>;
};

const ModelsTable: React.FC<TProps> = ({
  isEdit,
  pageData,
  onChangeRowsPerPage,
  onChangePage,
  data,
  setData,
  order,
  setOrder,
}) => {
  const { isLoading, allModelsOptions, modelsPagination } = useSelector(
    (state: RootState) => state.globalVehicles,
  );
  const { classes } = useAutocompleteStyles();
  const showError = useException();

  const onReviewChange =
    (el: IGlobalModel) => (e: React.ChangeEvent<{}>, option: string) => {
      setData((prev) => {
        const itemToChange = prev.find((item) => item.id === el.id);
        if (itemToChange) {
          const status =
            option === "Confirmed"
              ? EReviewStatus.Confirmed
              : option === "Override"
                ? EReviewStatus.Override
                : EReviewStatus.NotReviewed;
          const updated = {
            ...itemToChange,
            accepted: option !== "Not Reviewed",
            status,
            parent:
              status === EReviewStatus.Override
                ? itemToChange.parent
                : undefined,
          };
          const filtered = prev.filter((item) => item.id !== el.id);
          return [...filtered, updated].sort((a, b) => a.localId - b.localId);
        }
        return prev;
      });
    };

  const onModelChange =
    (el: IGlobalModel) =>
    (e: React.ChangeEvent<{}>, option: IGlobalModel | null) => {
      setData((prev) => {
        const itemToChange = prev.find((item) => item.id === el.id);
        if (itemToChange) {
          const updated = { ...itemToChange, parent: option ?? undefined };
          const filtered = prev.filter((item) => item.id !== el.id);
          return [...filtered, updated].sort((a, b) => a.localId - b.localId);
        }
        return prev;
      });
    };

  const RowData: TableRowDataType<IGlobalModel>[] = [
    {
      header: "VIN Make",
      width: 185,
      val: (el) => el.make?.vinMake ?? "",
      align: "left",
    },
    {
      header: "VIN Model",
      width: 185,
      val: (el) => el.vinModel,
      orderId: "VinName",
      align: "left",
    },
    {
      header: "Count",
      val: (el) => el.vehiclesCount.toString(),
      orderId: "VehiclesCount",
      align: "left",
    },
    {
      header: "% of Total",
      val: (el) =>
        `${(Math.round(el.vehiclesPercentage * 100) / 100).toFixed(2)}%`,
      orderId: "VehiclesPercentage",
      align: "left",
    },
    {
      header: "Review",
      width: 180,
      val: (el) =>
        !isEdit ? (
          el.accepted ? (
            el.parent ? (
              "Override"
            ) : (
              "Confirmed"
            )
          ) : (
            "Not Reviewed"
          )
        ) : (
          <Autocomplete
            renderInput={autocompleteRender({
              label: "",
              placeholder: "",
            })}
            style={{ margin: "-8.5px -4px", height: 40 }}
            fullWidth
            classes={classes}
            options={reviewOptions}
            disabled={el.isReadOnly}
            value={
              el.status === EReviewStatus.Override
                ? "Override"
                : el.status === EReviewStatus.Confirmed
                  ? "Confirmed"
                  : "Not Reviewed"
            }
            disableClearable
            onChange={onReviewChange(el)}
          />
        ),
      align: "left",
    },
    {
      header: "Override Assignment",
      val: (el) =>
        !isEdit ? (
          el.accepted && el.parent?.vinModel ? (
            el.parent?.vinModel
          ) : (
            " "
          )
        ) : el.accepted && el.status === EReviewStatus.Override ? (
          <Autocomplete
            renderInput={autocompleteRender({
              label: "",
              placeholder: "Not selected",
            })}
            fullWidth
            classes={classes}
            disabled={el.isReadOnly}
            style={{ margin: "-6px -4px", height: 40 }}
            options={allModelsOptions.filter(
              (item) => item.make.id === el.make.id,
            )}
            value={allModelsOptions.find((item) => item.id === el.parent?.id)}
            getOptionLabel={(o) => o.vinModel}
            onChange={onModelChange(el)}
          />
        ) : (
          " "
        ),
      align: "left",
    },
    {
      header: "Evenflow Model",
      width: 184,
      val: (el) => el.parent?.vinModel ?? el.vinModel,
      align: "left",
    },
  ];

  const handleSort = (data: IOrder<IGlobalModel>) => () => {
    if (!isEdit) {
      setOrder((prev) => ({ ...data, isAscending: !prev.isAscending }));
      onChangePage(null, 0);
    } else {
      showError("Sorting is not possible in the EDIT mode");
    }
  };

  return (
    <Table<IGlobalModel>
      index="localId"
      noDataTitle="No models"
      data={data}
      order={order.orderBy}
      isAscending={order.isAscending}
      rowData={RowData}
      rowsPerPage={pageData.pageSize}
      page={pageData.pageIndex}
      count={modelsPagination.numberOfRecords}
      onChangeRowsPerPage={onChangeRowsPerPage}
      onChangePage={onChangePage}
      onSort={handleSort}
      hidePagination={modelsPagination.numberOfRecords < 10}
      isLoading={isLoading}
    />
  );
};

export default ModelsTable;
