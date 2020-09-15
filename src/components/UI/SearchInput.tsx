import React, {useEffect, useRef} from "react";
import {TextField, TextInputProps} from "./TextField";
import {Search} from "@material-ui/icons";
import {useDebounce} from "../../utils/hooks";

export type TSearchInputProps = TextInputProps & {
    onSearch: () => void;
    delay?: number;
    value?: string;
};
export const SearchInput: React.FC<TSearchInputProps> = ({onSearch, value, delay = 1000, ...props}) => {
    const isInit = useRef(true);
    const debouncedSearch = useDebounce(value, delay);
    useEffect(() => {
        if (!isInit.current && onSearch) {
            onSearch();
        }
    }, [debouncedSearch, onSearch]);
    useEffect(() => {isInit.current = false}, []);

    return <TextField
        placeholder="Search..."
        endAdornment={<Search />}
        value={value}
        {...props}
    />
}