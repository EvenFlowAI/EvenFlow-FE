import React, {useEffect, useRef} from "react";
import {TextField} from "../TextFieldStyled/TextField";
import {Search} from "@material-ui/icons";
import {useDebounce} from "../../../utils/hooks";
import {TSearchInputProps} from "../../../types/types";

export const SearchInput: React.FC<TSearchInputProps> = ({placeholder, onSearch, value, delay = 1000, ...props}) => {
    const isInit = useRef(true);
    const debouncedSearch = useDebounce(value, delay);
    useEffect(() => {
        if (!isInit.current && onSearch) {
            onSearch();
        }
    }, [debouncedSearch, onSearch]);
    useEffect(() => {isInit.current = false}, []);

    return <TextField
        placeholder={placeholder ?? "Search..."}
        endAdornment={<Search />}
        value={value}
        {...props}
    />
}

