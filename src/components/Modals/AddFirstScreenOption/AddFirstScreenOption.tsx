import React, {useCallback, useEffect, useState} from 'react';
import {BaseModal, DialogActions, DialogContent, DialogTitle} from "../BaseModal";
import {Button} from "@material-ui/core";
import {TextField} from "../../UI/TextField";
import {Autocomplete} from "@material-ui/lab";
import {autocompleteRender} from "../../UI/AutocompleteRender";
import FileInput from "../AddServiceCategory/FileInput";
import {setAssignedFilter} from "../../../store/reducers/serviceRequests/actions";
import {useDispatch, useSelector} from "react-redux";
import {useException, useSCs} from "../../../utils/hooks";
import {IIconState} from "../AddServiceCategory/AddServiceCategory";
import {DialogProps} from "../types";
import {IFirstScreenOption, TNewFirstScreenOption, TUpdateFirstScreenOption} from "../../../store/reducers/serviceTypes/types";
import {makeStyles} from "@material-ui/core/styles";
import {TOption} from "../../../types/types";
import {serviceTypeNames} from "../../Admin/FirstScreen/FirstScreen";
import {EServiceType} from "../../../store/reducers/appointmentFrameReducer/types";
import {
    createFirstScreenOption,
    updateFirstScreenOption,
    updateFirstScreenOptionIcon
} from "../../../store/reducers/serviceTypes/actions";
import {ITransportationOptionFull} from "../../../store/reducers/transportationNeeds/types";
import {RootState} from "../../../store/rootReducer";
import {loadTransportationOptions} from "../../../store/reducers/transportationNeeds/actions";
import {getOptionString} from "../../Admin/TransportationOptions/TransportationOptions";

const initialFileState = {file: null, dataUrl: undefined};

type TAddFirstScreenOptionProps = DialogProps & {
    editingItem: IFirstScreenOption | null;
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
    },
    twoInputsWrapper: {
        width: '100%',
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gridGap: 18,
        marginBottom: 18,
        marginTop: 18,
    },
}))

const AddFirstScreenOption: React.FC<TAddFirstScreenOptionProps> = ({editingItem, ...props}) => {
    const {options} = useSelector((state: RootState) => state.transportation);
    const [fileState, setFileState] = useState<IIconState>(initialFileState);
    const [firstScreenOptionName, setFirstScreenOptionName] = useState<string>('');
    const [externalLink, setExternalLink] = useState<string>('');
    const [formIsChecked, setFormIsChecked] = useState<boolean>(false);
    const [orderIndex, setOrderIndex] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [note, setNote] = useState<string>('');
    const [selectedServiceType, setSelectedServiceType] = useState<TOption|null>({value: '0', name: 'Visit Center'});
    const [defaultTransportation, setDefaultTransportation] = useState<ITransportationOptionFull|null>(null);
    const [taglineText, setTaglineText] = useState<string>('');
    const [taglineColor, setTaglineColor] = useState<string>('');

    const {selectedSC} = useSCs();
    const dispatch = useDispatch();
    const showError = useException();
    const classes = useStyles();

    useEffect(() => {
        if (selectedSC) dispatch(loadTransportationOptions(selectedSC.id))
    }, [selectedSC])

    useEffect(() => {
        if (props.open && editingItem) {
            setFirstScreenOptionName(editingItem.name);
            setOrderIndex(editingItem.orderIndex?.toString() ?? '');
            setDescription(editingItem.description ?? '');
            setNote(editingItem.note ?? '');
            setExternalLink(editingItem.externalLink ?? '');
            if (editingItem.transportationOption?.id) {
                const transportation = options.find(item => item.id === editingItem.transportationOption?.id)
                transportation && setDefaultTransportation(transportation);
            }
            if (editingItem.type >= 0) {
                const serviceTypeOption = getServiceTypeOptions().find(item => item.value.toString() === editingItem.type.toString());
                serviceTypeOption && setSelectedServiceType(serviceTypeOption);
            }
            if (editingItem.taglineText) setTaglineText(editingItem.taglineText);
            if (editingItem.taglineFontColorHex) setTaglineColor(editingItem.taglineFontColorHex);
        }
    }, [props.open, editingItem, options])

    const onCancel = useCallback(() => {
        setFormIsChecked(false);
        setFirstScreenOptionName('');
        dispatch(setAssignedFilter({searchTerm: ''}));
        setFileState(initialFileState);
        setOrderIndex('');
        setDescription('')
        setExternalLink('')
        setNote('')
        setSelectedServiceType(null)
        setDefaultTransportation(null)
        setTaglineColor('');
        setTaglineText('');
        props.onClose();
    }, [])

    const onDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDescription(e.target.value)
    }
    const onNoteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNote(e.target.value)
    }

    const onSuccessCreate = useCallback((serviceTypeId: number) => {
        if (fileState.file && selectedSC) {
            dispatch(updateFirstScreenOptionIcon(serviceTypeId, selectedSC.id, fileState.file));
        }
        onCancel();
    }, [fileState])


    const onNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>): void  => {
        setFormIsChecked(false);
        setFirstScreenOptionName(e.target.value);
    }, [])

    const onLinkChange = useCallback((e: React.ChangeEvent<HTMLInputElement>): void  => {
        setFormIsChecked(false);
        setExternalLink(e.target.value);
    }, [])

    const onOrderIndexChange = useCallback((e: React.ChangeEvent<{}>, value: string): void => {
        setFormIsChecked(false);
        setOrderIndex(value);
    }, [])

    const onTransportationChange = useCallback((e: React.ChangeEvent<{}>, value: ITransportationOptionFull|null): void => {
        setFormIsChecked(false);
        setDefaultTransportation(value)
    }, [])

    const onSave = () => {
        if (!selectedServiceType) return showError('"Booking Flow Config" is required');
        if (!orderIndex) return showError('"Order Index" is required');
        const data: TUpdateFirstScreenOption = {
            name: firstScreenOptionName,
            description,
            note,
            type: selectedServiceType?.value ?? EServiceType.VisitCenter,
            orderIndex: +orderIndex,
            taglineText: taglineText,
            taglineFontColorHex: taglineColor,
        }
        if (externalLink) data.externalLink = externalLink;
        if (selectedSC) {
            if (defaultTransportation) data.transportationOptionId = defaultTransportation.id;
            if (editingItem) {
                dispatch(updateFirstScreenOption(editingItem.id, selectedSC.id, data, onSuccessCreate, showError))
            } else {
                const newData: TNewFirstScreenOption = {
                    ...data,
                    serviceCenterId: selectedSC.id
                }
                dispatch(createFirstScreenOption(newData, selectedSC.id, onSuccessCreate, showError))
            }
        }
    }

    const getServiceTypeOptions = () => {
        return Object.entries(serviceTypeNames).map(([value, name]) => ({value, name}));
    }

    const onServiceTypeChange = useCallback((e: React.ChangeEvent<{}>, value: TOption|null) => {
        setFormIsChecked(false);
        setSelectedServiceType(value);
    }, [])

    const onTaglineTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormIsChecked(false);
        setTaglineText(e.target.value)
    }

    const onTaglineColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormIsChecked(false);
        setTaglineColor(e.target.value)
    }

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
                            error={formIsChecked && !firstScreenOptionName}
                            onChange={onNameChange}
                            value={firstScreenOptionName}/>
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
                    <FileInput setState={setFileState} label={`${fileState.file || editingItem?.iconPath ? 'Update' : 'Upload' } Service Category Icon`}/>
                    <Autocomplete
                        disableClearable
                        options={['1', '2', '3', '4']}
                        value={orderIndex}
                        onChange={onOrderIndexChange}
                        renderInput={autocompleteRender({
                            label: 'Order Index for Booking Flow',
                            placeholder: 'Select Order Index',
                            error: !orderIndex?.length && formIsChecked,
                        })}
                    />
                    <Autocomplete
                        options={options}
                        getOptionSelected={(option) => option.id === defaultTransportation?.id}
                        getOptionLabel={o => getOptionString(o.type)}
                        value={defaultTransportation}
                        onChange={onTransportationChange}
                        renderInput={autocompleteRender({
                            label: 'Default Transportation Option',
                            placeholder: 'Select Transportation Option',
                        })}
                    />
                    <div>
                        <TextField
                            fullWidth
                            label='External Link'
                            placeholder='Type External Link'
                            disabled={selectedServiceType?.value !== EServiceType.General.toString()}
                            onChange={onLinkChange}
                            value={externalLink}/>
                    </div>
                </div>
                <TextField
                    fullWidth
                    multiline
                    rows={4}
                    value={description}
                    style={{marginBottom: 20}}
                    label="Option Description"
                    placeholder="Enter Description"
                    onChange={onDescriptionChange}
                />
                <TextField
                    fullWidth
                    multiline
                    rows={1}
                    value={note}
                    label="Option Note for Confirmation Screen"
                    placeholder="Enter Note"
                    onChange={onNoteChange}
                />
                <div className={classes.twoInputsWrapper}>
                    <div>
                        <TextField
                            fullWidth
                            value={taglineText}
                            label="Tagline Text"
                            placeholder="Enter Tagline Text"
                            onChange={onTaglineTextChange}
                        />
                    </div>
                    <div>
                        <TextField
                            fullWidth
                            value={taglineColor}
                            inputProps={{maxLength: 6}}
                            label="Tagline Font Color hex #"
                            placeholder="Enter Tagline Font Color (6 symbols)"
                            onChange={onTaglineColorChange}
                        />
                    </div>
                </div>
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