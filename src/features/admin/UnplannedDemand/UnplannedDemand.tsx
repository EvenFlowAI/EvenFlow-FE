import React, { useEffect, useMemo, useState } from "react";
import { TableBody, TableHead, Button } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  loadUnplannedDemand,
  loadUnplannedSlots,
} from "../../../store/reducers/demandSegments/actions";
import { RootState } from "../../../store/rootReducer";
import {
  EDay,
  IUnplannedDemand,
  IUnplannedDemandSlotsRequest,
} from "../../../store/reducers/demandSegments/types";
import UnplannedDemandEditing from "./UnplannedDemandEditing/UnplannedDemandEditing";
import { remapSegments } from "./utils";
import { DemandTable } from "../../../components/styled/DemandTable";
import { TableRow } from "../../../components/styled/TableRow";
import { TableCell } from "../../../components/styled/TableCell";
import { useSCs } from "../../../hooks/useSCs/useSCs";
import { useSelectedPod } from "../../../hooks/useSelectedPod/useSelectedPod";
import dayjs from "dayjs";
import { UnplannedTableCell } from "./UnplannedDemandSlots/styles";

export const UnplannedDemand = () => {
  const [isEdit, setEdit] = useState<boolean>(false);
  const [editingElement, setEditingElement] = useState<IUnplannedDemand | null>(
    null,
  );
  const { selectedSC } = useSCs();
  const { selectedPod } = useSelectedPod();
  const dispatch = useDispatch();
  const unplannedSegments = useSelector(
    (state: RootState) => state.demandSegments.unplannedDemands,
  );
  const segments: IUnplannedDemand[] = useMemo(() => {
    return remapSegments(unplannedSegments);
  }, [unplannedSegments]);

  useEffect(() => {
    if (selectedSC) {
      dispatch(loadUnplannedDemand(selectedSC.id, selectedPod?.id));
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
    const el = unplannedSegments.find((item) => item.day === (d as EDay));
    if (el) {
      setEditingElement(el);
      setEdit(true);
    }
  };

  return (
    <div style={{ overflowX: "auto" }}>
      {!isEdit ? (
        <DemandTable>
          <TableHead>
            <TableRow>
              <TableCell>Day</TableCell>
              <TableCell>Historical Walk-in Schedule Blocks</TableCell>
              <TableCell>Optimizer Setting</TableCell>
              <TableCell width={200} style={{ textAlign: "right" }} />
            </TableRow>
          </TableHead>
          <TableBody>
            {dayjs.weekdays().map((d, idx) => {
              return (
                <TableRow key={d}>
                  <UnplannedTableCell>{d}</UnplannedTableCell>
                  <UnplannedTableCell>
                    {segments[idx].historicalWalkInScheduleBlocks}
                  </UnplannedTableCell>
                  <UnplannedTableCell>
                    {segments[idx].optimizerSetting || 0}
                  </UnplannedTableCell>
                  <UnplannedTableCell>
                    <Button
                      variant="text"
                      color="primary"
                      onClick={() => onEdit(idx)}
                    >
                      Edit
                    </Button>
                  </UnplannedTableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </DemandTable>
      ) : (
        <UnplannedDemandEditing
          setEdit={setEdit}
          isEdit={isEdit}
          editingElement={editingElement}
        />
      )}
    </div>
  );
};
