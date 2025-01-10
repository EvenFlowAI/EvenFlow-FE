import React from "react";
import { LoadingButton } from "../LoadingButton/LoadingButton";
import { useException } from "../../../hooks/useException/useException";
import { useMessage } from "../../../hooks/useMessage/useMessage";
import { recalculateCapacity } from "../../../store/reducers/demandSegments/actions";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store/rootReducer";
import { useSCs } from "../../../hooks/useSCs/useSCs";

const RecalculateCapacity = () => {
  const { isRecalculationLoading } = useSelector(
    (state: RootState) => state.demandSegments,
  );
  const { selectedSC } = useSCs();
  const dispatch = useDispatch();
  const showError = useException();
  const showMessage = useMessage();

  const onSuccess = () => {
    showMessage("Capacity recalculated");
  };

  const recalculate = () => {
    if (selectedSC)
      dispatch(recalculateCapacity(selectedSC.id, onSuccess, showError));
  };

  return (
    <LoadingButton
      loading={isRecalculationLoading}
      variant="outlined"
      onClick={recalculate}
    >
      Recalculate Capacity
    </LoadingButton>
  );
};

export default RecalculateCapacity;
