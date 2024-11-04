import {useSnackbar} from "notistack";
import {useCallback} from "react";
import {getAPIException} from "../../utils/utils";

export function useException(preventDuplicate?: boolean) {
    const {enqueueSnackbar} = useSnackbar();
    return useCallback((e: any) => {
        if (e && e.response?.data?.errors && e.response.data.errors.length) {
            for (const error of e.response.data.errors.slice(0, 3) as { field: string; message: string, id: string }[]) {
                enqueueSnackbar(error.id ? `${error.message} Error Identifier: ${error.id}` : error.message, {variant: "error"});
            }
        } else if (typeof e === "string") {
            enqueueSnackbar(e, {variant: "error", preventDuplicate: Boolean(preventDuplicate)});
        } else {
            enqueueSnackbar(getAPIException(e), {variant: "error", preventDuplicate: Boolean(preventDuplicate)});
        }
    }, [enqueueSnackbar]);
}