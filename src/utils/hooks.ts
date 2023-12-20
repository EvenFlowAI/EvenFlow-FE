import React, {ReactNode, useCallback, useEffect, useMemo, useState} from "react";
import {useSnackbar} from "notistack";
import {IPageRequest, LocalTokens, ValidationKeyPairs} from "../types/types";
import {getAPIException, getTrackerById} from "./utils";
import {RootState} from "../store/rootReducer";
import {useDispatch, useSelector} from "react-redux";
import {closeConfirmModal, openConfirmModal} from "../store/reducers/modals/actions";
import {TConfirmModalPayload} from "../store/reducers/modals/types";
import {ICurrentUser} from "../store/reducers/users/types";
import {defaultRowsPerPage} from "../config/config";
import {IDealershipProfile} from "../store/reducers/dealershipGroups/types";
import {IServiceCenter} from "../store/reducers/serviceCenters/types";
import {selectSC as selectSCAction} from "../store/reducers/serviceCenters/actions";
import {useLocation} from "react-router-dom";
import {options} from "../pages/booking/BookingFlow/BookingFlowPage";
import ReactGA from "react-ga4";
import TagManager from "react-gtm-module";
import {v4 as uuidv4} from "uuid";

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

export function useConfirm() {
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
    }, [dispatch])

    return {selectedSC, scList, selectSC};
}

export const useSelectedPod = () => {
    const selectedPod = useSelector((state: RootState) => state.pods.selectedPod);
    return {selectedPod};
}

export function useException(preventDuplicate?: boolean) {
    const {enqueueSnackbar} = useSnackbar();
    return useCallback((e: any) => {
        if (e && e.response?.data?.errors && e.response.data.errors.length) {
            for (const error of e.response.data.errors.slice(0, 3) as { field: string; message: string }[]) {
                enqueueSnackbar(error.message, {variant: "error"});
            }
        } else if (typeof e === "string") {
            enqueueSnackbar(e, {variant: "error", preventDuplicate: Boolean(preventDuplicate)});
        } else {
            enqueueSnackbar(getAPIException(e), {variant: "error", preventDuplicate: Boolean(preventDuplicate)});
        }
    }, [enqueueSnackbar]);
}

type TVariant = "default" | "warning" | "success" | "error" | "info";

export function useMessage() {
    const {enqueueSnackbar} = useSnackbar();
    return (message: ReactNode, variant?: TVariant) => {
        enqueueSnackbar(message, {variant: variant || "success"})
    }
}

export function useValidation<U>(
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
export type IPageRequestActionCreator = (payload: Partial<IPageRequest>) => void;
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

export const useDebounce = <S = string>(val: S, delay: number = 1000): S => {
    const [state, setState] = useState<S>(val);

    useEffect(() => {
        const handler = setTimeout(() => {
            setState(val);
        }, delay);
        return () => clearTimeout(handler);
    }, [val, delay]);

    return state;
}

export const useSideBar = () => {
    const [isOpened, setOpened] = useState<boolean>(false);
    const onOpen = useCallback(() => {
        setOpened(true);
    }, []);
    const onClose = useCallback(() => {
        setOpened(false);
    }, []);
    const onToggle = useCallback(() => {
        setOpened(s => !s);
    }, []);
    return {isOpened, onClose, onOpen, onToggle};
}

type TLParams = {
    frame?: string
}
export const useLayout = () => {
    const {search} = useLocation<TLParams>();
    return useMemo(() => {
        const isFrame = new URLSearchParams(search).get('frame')?.toLowerCase();
        if (isFrame) {
            return isFrame.includes('true') || isFrame.includes('1')
        }
        return false
    }, [search]);
}

export const useStorage = () => {
    useEffect(() => {
        if (!sessionStorage.getItem(LocalTokens.sessionId)) {
            const uid = uuidv4();
            sessionStorage.setItem(LocalTokens.sessionId, uid);
        }
        window.addEventListener('unload', () => {
            sessionStorage.setItem(LocalTokens.sessionId, '')
        })
    }, [sessionStorage])
}

export const useAnalyticsBySCId = (id: string, trackerCreated: boolean, setTrackerCreated: () => void) => {
    function createTracker(opt_clientId = '', trackerCreated: boolean) {
        const TRACKER = getTrackerById(id);
        if (!trackerCreated) {
            if (opt_clientId) options.clientId = opt_clientId

            ReactGA.initialize(TRACKER, {
                gaOptions: options,
            });
            TagManager.initialize({
                gtmId: TRACKER
            })
            setTrackerCreated();
        }
    }
    useEffect(() => {
        if (!trackerCreated && id) {
            createTracker('', trackerCreated);
        }
    }, [id])

    useEffect(() => {
        trackerCreated && ReactGA.ga('pageview', window.location.pathname + window.location.search);
    }, [trackerCreated])
}
