import React, {useCallback, useState} from 'react';
import {BaseModal, DialogActions, DialogContent, DialogTitle} from "../BaseModal";
import {DialogProps} from "../types";
import {ICategory} from "../../../store/reducers/categories/types";
import {makeStyles} from "@material-ui/core/styles";
import {Divider, Button} from "@material-ui/core";
import {TextField} from "../../UI/TextField";
import {autocompleteRender} from "../../UI/AutocompleteRender";
import {Autocomplete} from "@material-ui/lab";
import {SearchInput} from "../../UI/SearchInput";

type TAddServiceCategoryProps = DialogProps & {
    isEditing?: boolean;
    editingItem: ICategory | null;
}

const useStyles = makeStyles(() => ({
    inputsWrapper: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr 1fr",
        gap: 18,
    },
    uploadBtn: {
        width: '100%',
        textTransform: 'none'
    }
}))

type TOption = {
    value: number;
    name: string;
}

const pageOptions = [{name: 'Owned By Booking Flow (Page 1)', value: 0}, {name: 'Owned By Booking Flow (Page 2)', value: 1}];

const AddServiceCategory: React.FC<TAddServiceCategoryProps> = (props) => {
    const [categoryName, setCategoryName] = useState<string>('');
    const [definedPage, setDefinedPage] = useState<TOption | null>(null);
    const [formIsChecked, setFormIsChecked] = useState<boolean>(false);
    const classes = useStyles();
    let searchTerm = '';

    const onCancel = () => {
        setFormIsChecked(false);
        setCategoryName('');
        props.onClose();
    }

    const onSave = () => {
        setFormIsChecked(true);
        onCancel();
    }

    const onNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>): void  => {
        setFormIsChecked(false);
        setCategoryName(e.target.value);
    }, [])

    const onDefinedPageChange = (e: React.ChangeEvent<{}>, value: TOption | null): void => {
        setFormIsChecked(false);
        setDefinedPage(value);
    }

    const handleSearch = () => {}

    const handleSearchChange = () => {}

    const onUploadClick = () => {}

    return (
        <BaseModal {...props} width={1000} onClose={onCancel}>
            <DialogTitle onClose={onCancel}>{props.isEditing ? 'Edit': 'Add'} Service Category</DialogTitle>
            <DialogContent>
                <div className={classes.inputsWrapper}>
                <TextField
                    fullWidth
                    label='Service Category Name'
                    placeholder='Type Service Category Name'
                    error={!categoryName && formIsChecked}
                    onChange={onNameChange}
                    value={categoryName}/>
                    <Autocomplete
                        disableClearable
                        options={pageOptions}
                        disableCloseOnSelect
                        getOptionSelected={(option) => option.value === definedPage?.value}
                        getOptionLabel={option => option.name}
                        value={definedPage || undefined}
                        onChange={onDefinedPageChange}
                        renderInput={autocompleteRender({
                            label: 'Define Page',
                            placeholder: 'Select a page',
                        })}
                    />
                    <Button className={classes.uploadBtn} onClick={onUploadClick} color="primary">
                        Upload Service Category Icon
                    </Button>
                    <SearchInput onSearch={handleSearch} onChange={handleSearchChange} value={searchTerm} />
                </div>
                <Divider/>
            </DialogContent>
            <DialogActions>

            </DialogActions>
        </BaseModal>
    );
};

export default AddServiceCategory;