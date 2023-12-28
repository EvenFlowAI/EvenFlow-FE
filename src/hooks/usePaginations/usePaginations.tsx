import React, {useCallback, useState} from "react";
import {IPageRequest} from "../../types/types";
import {defaultRowsPerPage} from "../../config/config";
import {RootState} from "../../store/rootReducer";
import {useDispatch, useSelector} from "react-redux";

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