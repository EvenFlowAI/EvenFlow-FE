import React, {useEffect, useRef, useState} from "react";
import {TextField} from "../TextFieldStyled/TextField";
import {Search} from "@material-ui/icons";
import {TextInputProps} from "../types";
import {useDebounce} from "../../../hooks/useDebounce/useDebounce";

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
    useEffect(() => {
        isInit.current = false
    }, []);
    const handleChange: React.ChangeEventHandler<HTMLInputElement> = ({target: {value}}) => {
        setInner(value);
    }

    return <TextField
        placeholder="Search..."
        endAdornment={<Search/>}
        value={innerSearch}
        onChange={handleChange}
        {...props}
    />
}