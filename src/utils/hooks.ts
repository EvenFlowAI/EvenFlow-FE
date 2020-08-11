import {useState} from "react";
import {useSnackbar} from "notistack";
import {ValidationKeyPairs} from "../types/types";
import {getAPIException} from "./utils";

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

export function useException() {
    const {enqueueSnackbar} = useSnackbar();
    const handler = (e: any) => {
        if (e && e.response?.data?.errors && e.response.data.errors.length) {
            for (const error of e.response.data.errors as {field: string; message: string}[]) {
                enqueueSnackbar(error.message, {variant: "error"});
            }
        } else {
            enqueueSnackbar(getAPIException(e), {variant: "error"})
        }
    };
    return handler;
}

export function useValidation<U> (
    fields: ValidationKeyPairs<U>[],
    data: U
) {
    const {enqueueSnackbar} = useSnackbar();

    const validate = () => {
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

    return validate;
}