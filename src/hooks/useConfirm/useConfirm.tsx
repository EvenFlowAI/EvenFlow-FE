import { useDispatch } from "react-redux";
import {
  closeConfirmModal,
  openConfirmModal,
} from "../../store/reducers/modals/actions";
import { TConfirmModalPayload } from "../../store/reducers/modals/types";

export function useConfirm() {
  const dispatch = useDispatch();
  return {
    closeConfirm: () => dispatch(closeConfirmModal()),
    askConfirm: (payload: TConfirmModalPayload) =>
      dispatch(openConfirmModal(payload)),
  };
}
