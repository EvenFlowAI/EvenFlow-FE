import React, {useCallback, useState} from "react";
import {useSnackbar} from "notistack";
import {IPageRequest, ValidationKeyPairs} from "../types/types";
import {getAPIException} from "./utils";
import {RootState} from "../store/rootReducer";
import {useDispatch, useSelector} from "react-redux";
import {closeConfirmModal, openConfirmModal} from "../store/reducers/modals/actions";
import {TConfirmModalPayload} from "../store/reducers/modals/types";
import {ICurrentUser} from "../store/reducers/users/types";
import {defaultRowsPerPage} from "../config/config";
import {IDealershipProfile} from "../store/reducers/dealershipGroups/types";
import {IServiceCenter} from "../store/reducers/serviceCenters/types";
import {selectSC as selectSCAction} from "../store/reducers/serviceCenters/actions";

export const useModal = () => {
    const [isOpen, setOpen] = useState(false);
    const onClose = () => {
        setOpen(false);
    };
    const onOpen = () => {
        setOpen(true);
    };
    const onToggleOpen = () => {
        setOpen(!isOpen);
    };
    return {isOpen, onClose, onOpen, onToggleOpen};
}

export function useConfirm () {
    const dispatch = useDispatch();
    return {
        closeConfirm: () => dispatch(closeConfirmModal()),
        askConfirm: (payload: TConfirmModalPayload) => dispatch(openConfirmModal(payload))
    };
}

export const useCurrentUser = (): ICurrentUser | undefined => {
    return useSelector((state: RootState) => state.users.currentUser);
}

export const useDealershipProfile = (): IDealershipProfile | undefined => {
    return useSelector((state: RootState) => state.dealershipGroups.profile);
}

export const useSCs = () => {
    const [
        selectedSC, scList
    ] = useSelector((state: RootState) => [
        state.serviceCenters.selectedSC,
        state.serviceCenters.fullSCList
    ]);
    const dispatch = useDispatch();
    const selectSC = useCallback((sc: IServiceCenter) => {
        dispatch(selectSCAction(sc));
    },[dispatch])

    return {selectedSC, scList, selectSC};
}

export function useException() {
    const {enqueueSnackbar} = useSnackbar();
    return (e: any) => {
        if (e && e.response?.data?.errors && e.response.data.errors.length) {
            for (const error of e.response.data.errors.slice(0, 3) as {field: string; message: string}[]) {
                enqueueSnackbar(error.message, {variant: "error"});
            }
        } else if (typeof e === "string") {
            enqueueSnackbar(e, {variant: "error"});
        } else {
            enqueueSnackbar(getAPIException(e), {variant: "error"});
        }
    };
}
type TVariant = "default" | "warning" | "success" | "error" | "info";
export function useMessage() {
    const {enqueueSnackbar} = useSnackbar();
    return (message: string, variant?: TVariant) => {
        enqueueSnackbar(message, {variant: variant || "success"})
    }
}

export function useValidation<U> (
    fields: ValidationKeyPairs<U>[],
    data: U
) {
    const {enqueueSnackbar} = useSnackbar();

    return () => {
        const errors: ValidationKeyPairs<U>[] = [];
        for (const field of fields) {
            if (!data[field.field]) {
                enqueueSnackbar(
                    field.message,
                    {variant: "error"}
                );
                errors.push(field);
            }
        }
        return errors;
    };
}
type TPageCallback = (state: RootState) => IPageRequest
type IPageRequestActionCreator = (payload: Partial<IPageRequest>) => void;
export const usePagination = (cb: TPageCallback, changePageData: IPageRequestActionCreator) => {
    const {pageIndex, pageSize} = useSelector(cb);
    const dispatch = useDispatch();
    const changePage =
        (e: React.MouseEvent<Element, MouseEvent> | null, pageNumber: number) => {
            dispatch(changePageData({pageIndex: pageNumber}));
    }
    const changeRowsPerPage:
        React.ChangeEventHandler<HTMLInputElement> = e => {
        dispatch(changePageData({pageSize: +e.target.value, pageIndex: 0}));
    }
    return {pageSize, pageIndex, changePage, changeRowsPerPage};
}
export const useStatePagination = () => {
    const [pageData, setPageData] = useState<IPageRequest>({
        pageIndex: 0, pageSize: defaultRowsPerPage
    });
    const onChangePage = useCallback((e: React.MouseEvent<Element, MouseEvent> | null, pageIndex: number): void => {
        setPageData(s => ({...s, pageIndex}));
    }, [setPageData]);
    const onChangeRowsPerPage = useCallback((e: React.ChangeEvent<HTMLInputElement>): void => {
        setPageData({pageIndex: 0, pageSize: Number(e.target.value)});
    }, [setPageData])

    return {pageData, onChangePage, onChangeRowsPerPage};
}