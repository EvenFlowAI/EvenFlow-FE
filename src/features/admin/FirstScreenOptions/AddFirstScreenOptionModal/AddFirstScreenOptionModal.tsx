import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {BaseModal, DialogActions, DialogContent, DialogTitle} from "../../../../components/modals/BaseModal/BaseModal";
import {Button} from "@mui/material";
import {TextField} from "../../../../components/formControls/TextFieldStyled/TextField";
import { Autocomplete } from '@mui/material';
import {autocompleteRender} from "../../../../utils/autocompleteRenders";
import {FileInput} from "../../../../components/formControls/FileInput/FileInput";
import {setAssignedFilter} from "../../../../store/reducers/serviceRequests/actions";
import {useDispatch, useSelector} from "react-redux";
import {IIconState} from "../../ServiceCategories/AddServiceCategoryModal/types";
import {DialogProps} from "../../../../components/modals/BaseModal/types";
import {IFirstScreenOption, TNewFirstScreenOption, TUpdateFirstScreenOption} from "../../../../store/reducers/serviceTypes/types";
import {TOption} from "../../../../types/types";
import {EServiceType} from "../../../../store/reducers/appointmentFrameReducer/types";
import {
    createFirstScreenOption,
    updateFirstScreenOption,
    updateFirstScreenOptionIcon
} from "../../../../store/reducers/serviceTypes/actions";
import {ITransportationOptionFull} from "../../../../store/reducers/transportationNeeds/types";
import {RootState} from "../../../../store/rootReducer";
import {loadTransportationOptions} from "../../../../store/reducers/transportationNeeds/actions";
import {useStyles} from "./styles";
import {getTransportationOptionString} from "../../../../utils/utils";
import {serviceTypeNames} from "../constants";
import {useException} from "../../../../hooks/useException/useException";
import {useSCs} from "../../../../hooks/useSCs/useSCs";

const initialFileState = {file: null, dataUrl: undefined};

type TAddFirstScreenOptionProps = DialogProps & {
    editingItem: IFirstScreenOption | null;
}

export const AddFirstScreenOptionModal: React.FC<TAddFirstScreenOptionProps> = ({editingItem, ...props}) => {
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

    const enabledTransportationOptions = useMemo(() => options.filter(op => op.state), [options]);
    const isTransportationDisabled = useMemo(() => !enabledTransportationOptions.length ||
            selectedServiceType?.value === EServiceType.MobileService.toString(),
        [selectedServiceType, EServiceType, enabledTransportationOptions])

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

    const checkIsValid = (): boolean => {
        let isValid = true;
        if (!selectedServiceType) {
            showError('"Booking Flow Config" is required');
            isValid = false;
        }
        if (!orderIndex) {
            showError('"Order Index" is required');
            isValid = false;
        }
        return isValid;
    }

    const onSave = () => {
        if (checkIsValid()) {
            const data: TUpdateFirstScreenOption = {
                name: firstScreenOptionName,
                description,
                note,
                type: selectedServiceType?.value ?? EServiceType.VisitCenter,
                orderIndex: +orderIndex,
                taglineText: taglineText.trim().length ? taglineText.trim() : null,
                taglineFontColorHex: taglineColor.length ? taglineColor : null,
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
    }

    const getServiceTypeOptions = () => {
        return Object.entries(serviceTypeNames).map(([value, name]) => ({value, name}));
    }

    const onServiceTypeChange = useCallback((e: React.ChangeEvent<{}>, value: TOption|null) => {
        setFormIsChecked(false);
        setSelectedServiceType(value);
        if (value && defaultTransportation) {
            if (value?.value === EServiceType.MobileService.toString()
            || value?.value === EServiceType.PickUpDropOff.toString()) {
                setDefaultTransportation(null);
            }
        }
    }, [showError, defaultTransportation])

    const onTaglineTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormIsChecked(false);
        if (e.target.value.length > 30) {
            showError('Tagline Text must not include more than 30 symbols')
        } else {
            setTaglineText(e.target.value)
        }
    }

    const onTaglineColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormIsChecked(false);
        if (e.target.value.match(/^[a-zA-Z0-9]*$/)) {
            setTaglineColor(e.target.value.trim())
        } else {
            showError('Tagline Font Color Hex must consist letters and digits only')
        }
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
                        isOptionEqualToValue={(option) => option.value === selectedServiceType?.value}
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
                        options={enabledTransportationOptions}
                        isOptionEqualToValue={(option) => option.id === defaultTransportation?.id}
                        getOptionLabel={o => getTransportationOptionString(o.type)}
                        value={defaultTransportation}
                        onChange={onTransportationChange}
                        disabled={isTransportationDisabled}
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