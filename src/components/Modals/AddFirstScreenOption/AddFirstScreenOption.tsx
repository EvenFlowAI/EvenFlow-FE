import React, {useCallback, useState} from 'react';
import {BaseModal, DialogActions, DialogContent, DialogTitle} from "../BaseModal";
import {Button} from "@material-ui/core";
import {TextField} from "../../UI/TextField";
import {Autocomplete} from "@material-ui/lab";
import {autocompleteRender} from "../../UI/AutocompleteRender";
import FileInput from "../AddServiceCategory/FileInput";
import {setAssignedFilter} from "../../../store/reducers/serviceRequests/actions";
import {useDispatch} from "react-redux";
import {useException, useSCs} from "../../../utils/hooks";
import {IIconState} from "../AddServiceCategory/AddServiceCategory";
import {DialogProps} from "../types";
import {IServiceType, TNewServiceType, TUpdateServiceTypeData} from "../../../store/reducers/serviceTypes/types";
import {makeStyles} from "@material-ui/core/styles";
import {TOption} from "../../../types/types";
import {serviceTypeNames} from "../../Admin/FirstScreen/FirstScreen";
import {EServiceType} from "../../../store/reducers/appointmentFrameReducer/types";
import {updateServiceTypeIcon} from "../../../store/reducers/serviceTypes/actions";

const initialFileState = {file: null, dataUrl: undefined};

type TAddFirstScreenOptionProps = DialogProps & {
    editingItem: IServiceType | null;
}

const useStyles = makeStyles(() => ({
    inputsWrapper: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr 1fr",
        gridGap: 18,
        marginBottom: 18,
    },
    uploadBtn: {
        width: '100%',
        textTransform: 'none',
        padding: 10,
        border: 'none',
        borderRadius: 4,
        color: 'white',
        fontWeight: 'bold',
        backgroundColor: '#7898FF',
        cursor: 'pointer',
    },
    label: {
        textTransform: "uppercase",
        fontWeight: 'bold',
        marginBottom: 4,
        fontSize: 12,
    },
    buttonWrapper: {
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'stretch',
    },
    inputWrapper: {
        display: 'flex',
        flexDirection: 'column',
    },
    cancelButton: {
        color: '#9FA2B4'
    },
    radioGroup: {
        display: 'flex',
        justifyContent: 'flex-end'
    }
}))

const AddFirstScreenOption: React.FC<TAddFirstScreenOptionProps> = ({editingItem, ...props}) => {
    const [fileState, setFileState] = useState<IIconState>(initialFileState);
    const [serviceTypeName, setServiceTypeName] = useState<string>('');
    const [formIsChecked, setFormIsChecked] = useState<boolean>(false);
    const [orderIndex, setOrderIndex] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [selectedServiceType, setSelectedServiceType] = useState<TOption|null>({value: '0', name: 'Visit Center'});

    const {selectedSC} = useSCs();
    const dispatch = useDispatch();
    const showError = useException();
    const classes = useStyles();

    const onCancel = useCallback(() => {
        setFormIsChecked(false);
        setServiceTypeName('');
        dispatch(setAssignedFilter({searchTerm: ''}));
        setFileState(initialFileState);
        setOrderIndex('');
        setDescription('')
        props.onClose();
    }, [])

    const onDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDescription(e.target.value)
    }

    const onSuccessCreate = useCallback((serviceTypeId: number) => {
        if (fileState.file && selectedSC) dispatch(updateServiceTypeIcon(serviceTypeId, selectedSC.id, fileState.file));
    }, [fileState])


    const onNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>): void  => {
        setFormIsChecked(false);
        setServiceTypeName(e.target.value);
    }, [])

    const onOrderIndexChange = useCallback((e: React.ChangeEvent<{}>, value: string): void => {
        setFormIsChecked(false);
        setOrderIndex(value);
    }, [])

    const onSave = () => {
        if (!selectedServiceType) return showError('"Booking Flow Config" is required');
        if (!orderIndex) return showError('"Order Index" is required');
        if (editingItem) {
        //     const data: TUpdateServiceTypeData = {
        //         name: serviceTypeName,
        //         description,
        //         type: selectedServiceType?.value ? EServiceType[+selectedServiceType.value] : EServiceType.VisitCenter,
        //         orderIndex: +orderIndex,
        //     }
        // } else {
        //     if (selectedSC) {
        //         const data: TNewServiceType = {
        //             name: serviceTypeName,
        //             description,
        //             type: selectedServiceType?.value ? EServiceType[+selectedServiceType.value] : EServiceType.VisitCenter,
        //             orderIndex: +orderIndex,
        //             serviceCenterId: selectedSC.id
        //         }
        //     }
        }
    }

    const getServiceTypeOptions = () => {
        return Object.entries(serviceTypeNames).map(([value, name]) => ({value, name}));
    }

    const onServiceTypeChange = useCallback((e: React.ChangeEvent<{}>, value: TOption|null) => {
        setFormIsChecked(false);
        setSelectedServiceType(value);
    }, [])

    return (
        <BaseModal {...props} width={1128} onClose={onCancel}>
            <DialogTitle onClose={onCancel}>{editingItem ? 'Edit': 'Add'} First Screen Option</DialogTitle>
            <DialogContent>
                <div className={classes.inputsWrapper}>
                    <div>
                        <TextField
                            fullWidth
                            label='Option Name'
                            placeholder='Type Option Name'
                            error={!serviceTypeName && formIsChecked}
                            onChange={onNameChange}
                            value={serviceTypeName}/>
                    </div>
                    <Autocomplete
                        options={getServiceTypeOptions()}
                        getOptionSelected={(option) => option.value === selectedServiceType?.value}
                        getOptionLabel={o => o.name}
                        value={selectedServiceType}
                        onChange={onServiceTypeChange}
                        renderInput={autocompleteRender({
                            label: 'Booking Flow Config',
                            placeholder: 'Select Booking Flow Config',
                        })}
                    />
                    <Autocomplete
                        disableClearable
                        options={['1', '2', '3', "4"]}
                        value={orderIndex}
                        onChange={onOrderIndexChange}
                        renderInput={autocompleteRender({
                            label: 'Order Index for Booking Flow',
                            placeholder: 'Select Order Index',
                            error: !orderIndex && formIsChecked,
                        })}
                    />
                    <FileInput setState={setFileState}/>
                </div>
                <TextField
                    fullWidth
                    multiline
                    rows={4}
                    value={description}
                    label="Option Description"
                    placeholder="Enter Description"
                    onChange={onDescriptionChange}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onCancel} className={classes.cancelButton}>
                    Cancel
                </Button>
                <Button onClick={onSave} color="primary" variant="contained">
                    Save
                </Button>
            </DialogActions>
        </BaseModal>
    );
};

export default AddFirstScreenOption;