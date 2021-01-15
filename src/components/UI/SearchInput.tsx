import React, {useEffect, useRef, useState} from "react";
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
type TProps = TextInputProps & {
    onSearch: (s: string) => void;
    search: string;
};
export const SearchDB: React.FC<TProps> = ({onSearch, search, ...props}) => {
    const isInit = useRef(true);
    const [innerSearch, setInner] = useState<string>(search);
    const dbSearch = useDebounce<string>(innerSearch, 1000);
    useEffect(() => {
        if (!isInit.current && onSearch) {
            onSearch(dbSearch);
        }
    }, [dbSearch, onSearch]);
    useEffect(() => {isInit.current = false}, []);
    const handleChange: React.ChangeEventHandler<HTMLInputElement> = ({target: {value}}) => {
        setInner(value);
    }

    return <TextField
        placeholder="Search..."
        endAdornment={<Search />}
        value={innerSearch}
        onChange={handleChange}
        {...props}
    />
}