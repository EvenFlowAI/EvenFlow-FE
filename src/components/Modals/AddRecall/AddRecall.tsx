import React, {ChangeEvent, Dispatch, SetStateAction, useEffect, useState} from 'react';
import {BaseModal, DialogActions, DialogContent, DialogTitle} from "../BaseModal";
import {ICreateUpdateRecall, IRecall} from "../../../store/reducers/recall/types";
import {DialogProps} from "../types";
import {Button, styled} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import {useDispatch, useSelector} from "react-redux";
import {useException, useSCs} from "../../../utils/hooks";
import {TextField} from "../../UI/TextField";
import {Autocomplete} from "@material-ui/lab";
import {autocompleteRender} from "../../UI/AutocompleteRender";
import {RootState} from "../../../store/rootReducer";
import {IMakeExtended, IModel} from "../../../api/types";
import {IAssignedServiceRequest} from "../../../store/reducers/serviceRequests/types";
import {loadMakesForPods} from "../../../store/reducers/vehicleDetails/actions";
import {createRecall, updateRecall} from "../../../store/reducers/recall/actions";
import {yearOptions} from "../../AppointmentFlow/AppointmentFrame/MaintenanceDetails";

const Textarea = styled(TextField)({
    "& textarea": {
        padding: "8px 11px"
    },
});

type TAddRecallProps = DialogProps & {
    editingItem: IRecall|null;
    setEditingItem: Dispatch<SetStateAction<IRecall|null>>;
}

type TForm = {
    recallCampaignNumber: string;
    make: IMakeExtended|null;
    model: IModel|null;
    year: string;
    recallComponent: string;
    recallSummary: string;
    partLeadDaysCount: string;
    dailyPartsCount: string;
    serviceRequest: IAssignedServiceRequest|null;
}

const initialForm: TForm = {
    recallCampaignNumber: '',
    make: null,
    model: null,
    year: '',
    recallComponent: '',
    recallSummary: '',
    partLeadDaysCount: '',
    dailyPartsCount: '',
    serviceRequest: null,
}

const useStyles = makeStyles(() => ({
    actionsWrapper: {
        display: 'flex',
        justifyContent: 'flex-end',
        paddingTop: 14,
    },
    buttonsWrapper: {
        display: 'flex',
        justifyContent: "space-between",
        alignItems: 'center',
    },
    cancelButton: {
        color: '#9FA2B4',
        marginRight: 20,
        border: 'none',
        outline: 'none',
    },
    saveButton: {
        background: '#7898FF',
        color: 'white',
        border: '1px solid #7898FF',
        outline: 'none',
        '&:hover': {
            color: '#7898FF'
        }
    },
}))

const AddRecall: React.FC<TAddRecallProps> = ({editingItem, open, onClose, setEditingItem}) => {
    const {makesModels} = useSelector((state: RootState) => state.vehicleDetails);
    const {allAssignedList} = useSelector((state: RootState) => state.serviceRequests);
    const [form, setForm] = useState<TForm>(initialForm);
    const [formIsChecked, setFormIsChecked] = useState<boolean>(false);

    const dispatch = useDispatch();
    const showError = useException();
    const {selectedSC} = useSCs();
    const classes = useStyles();

    useEffect(() => {
        if (open && selectedSC) {
            dispatch(loadMakesForPods(selectedSC.id));
        }
    }, [selectedSC, open])

    useEffect(() => {
        if (open && editingItem) {
            const make = makesModels.find(el => el.id === editingItem.make?.id);
            const model = make?.models.find(el => el.id === editingItem.model?.id);
            const sr = allAssignedList.find(item => item.id === editingItem.serviceRequest?.id);
            setForm(() => ({
                recallCampaignNumber: editingItem.recallCampaignNumber,
                make: make ?? null,
                model: model ?? null,
                year: editingItem.year.toString(),
                recallComponent: editingItem.recallComponent,
                recallSummary: editingItem.recallSummary,
                partLeadDaysCount: editingItem.partLeadDaysCount.toString(),
                dailyPartsCount: editingItem.dailyPartsCount.toString(),
                serviceRequest: sr ?? null,
            }))
        }
    }, [open, editingItem, makesModels, allAssignedList])

    const onCancel = () => {
        setForm(initialForm);
        setFormIsChecked(false);
        setEditingItem(null);
        onClose();
    }

    const isValid = () => {
        if (!form.recallCampaignNumber.length) showError('"Recall Campaign Number" must not be empty')
        if (!form.make) showError('"Make" must not be empty')
        if (!form.model) showError('"Model" must not be empty')
        if (!form.year.length) showError('"Year" must not be empty')
        if (!form.recallComponent.length) showError('"Recall Component" must not be empty')
        if (!form.recallSummary) showError('"Recall Summary" must not be empty')
        if (!form.partLeadDaysCount.length) showError('"Part Lead Dais Count" must not be empty')
        if (+form.partLeadDaysCount < 0) showError('"Part Lead Dais Count" must not be more than "0"')
        if (!form.dailyPartsCount.length) showError('"Daily Parts" must not be empty')
        if (+form.dailyPartsCount < 0) showError('"Daily Parts" must not be more than "0"')
        if (!form.serviceRequest) showError('"Ops Code Assignment" must not be empty')

        return form.recallCampaignNumber.length
            && form.make
            && form.model
            && Number.isInteger(+form.year)
            && form.recallComponent.length
            && form.recallSummary.length
            && Number.isInteger(+form.partLeadDaysCount)
            && +form.partLeadDaysCount >= 0
            && Number.isInteger(+form.dailyPartsCount)
            && +form.dailyPartsCount >= 0
            && form.serviceRequest;
    }

    const onSave = () => {
        setFormIsChecked(true);
        if (isValid() && selectedSC) {
            const data: ICreateUpdateRecall = {
                recallCampaignNumber: form.recallCampaignNumber,
                makeId: form.make?.id ?? null,
                modelId: form.model?.id ?? null,
                year: +form.year,
                recallComponent: form.recallComponent,
                recallSummary: form.recallSummary,
                partLeadDaysCount: +form.partLeadDaysCount,
                dailyPartsCount: +form.dailyPartsCount,
                serviceRequestId: form.serviceRequest?.id ?? null,
                serviceCenterId: selectedSC.id,
            }
            if (editingItem) {
                dispatch(updateRecall(data, editingItem.id, showError, onCancel))
            } else {
                dispatch(createRecall(data, showError, onCancel))
            }
        }
    }

    const onFormChange: React.ChangeEventHandler<HTMLInputElement> = ({target: {name, value}}) => {
        setFormIsChecked(false);
        setForm((form) => ({...form, [name]: value}))
    }

    const onSummaryChange: React.ChangeEventHandler<HTMLTextAreaElement> = ({target: {value}}) => {
        setFormIsChecked(false);
        setForm((form) => ({...form, recallSummary: value}))
    }

    const onMakeChange = (e: ChangeEvent<{}>, value: IMakeExtended|null) => {
        setFormIsChecked(false);
        setForm(prev => ({...prev, make: value, model: null}))
    }

    const onModelChange = (e: ChangeEvent<{}>, value: IModel|null) => {
        setFormIsChecked(false);
        setForm(prev => ({...prev, model: value}))
    }

    const onYearChange = (e: ChangeEvent<{}>, value: string|null) => {
        setFormIsChecked(false);
        setForm(prev => ({...prev, year: value ?? ""}))
    }

    const onSRChange = (e: ChangeEvent<{}>, value: IAssignedServiceRequest|null) => {
        setFormIsChecked(false);
        setForm(prev => ({...prev, serviceRequest: value}));
    }

    return (
        <BaseModal open={open} onClose={onCancel} width={500}>
            <DialogTitle onClose={onCancel}>
                {editingItem ? 'Edit' : 'Add'} Recall
            </DialogTitle>
            <DialogContent>
                <TextField
                    style={{ marginBottom: 10 }}
                    fullWidth
                    label='Description'
                    id="recallCampaignNumber"
                    name="recallCampaignNumber"
                    placeholder='Type Recall Campaign Number'
                    error={formIsChecked && !form.recallCampaignNumber.length}
                    onChange={onFormChange}
                    value={form.recallCampaignNumber}/>
                <Autocomplete
                    style={{ marginBottom: 10 }}
                    options={makesModels}
                    value={form.make}
                    getOptionSelected={(o, v) => o.id === v.id}
                    getOptionLabel={o => o.name}
                    onChange={onMakeChange}
                    renderInput={autocompleteRender({
                        label: "Make",
                        error: formIsChecked && !form.make,
                        placeholder: 'Select Make'
                    })}
                />
                <Autocomplete
                    style={{ marginBottom: 10 }}
                    disabled={!form.make}
                    options={form.make?.models ?? []}
                    getOptionSelected={(o, v) => o.id === v.id}
                    getOptionLabel={o => o.name}
                    value={form.model}
                    onChange={onModelChange}
                    renderInput={autocompleteRender({
                        label: "Model",
                        error: formIsChecked && !form.model,
                        placeholder: 'Select Model'
                    })}
                />
                <Autocomplete
                    style={{ marginBottom: 10 }}
                    options={yearOptions}
                    value={form.year}
                    onChange={onYearChange}
                    renderInput={autocompleteRender({
                        label: "Year",
                        error: formIsChecked && !form.year,
                        placeholder: 'Select Year'
                    })}
                />
                <TextField
                    fullWidth
                    style={{ marginBottom: 10 }}
                    label='Recall Component'
                    id="recallComponent"
                    name="recallComponent"
                    placeholder='Type Recall Component'
                    error={formIsChecked && !form.recallComponent.length}
                    onChange={onFormChange}
                    value={form.recallComponent}/>
                <Textarea
                    fullWidth
                    multiline
                    style={{ marginBottom: 10 }}
                    error={formIsChecked && !form.recallSummary.length}
                    placeholder="Type Recall Summary"
                    label="Recall Summary"
                    onChange={onSummaryChange}
                    value={form.recallSummary}
                    rows={5}
                />
                <Autocomplete
                    style={{ marginBottom: 10 }}
                    options={allAssignedList}
                    getOptionSelected={(o, v) => o.id === v.id}
                    getOptionLabel={o => o.serviceRequest.code}
                    value={form.serviceRequest}
                    onChange={onSRChange}
                    renderInput={autocompleteRender({
                        label: "Ops Code Assignment",
                        error: formIsChecked && !form.serviceRequest,
                        placeholder: 'Select Ops Code Assignment'
                    })}
                />
                <TextField
                    fullWidth
                    type="number"
                    style={{ marginBottom: 10 }}
                    label='Part Lead Days Count'
                    id="partLeadDaysCount"
                    name="partLeadDaysCount"
                    placeholder='Type Part Lead Days Count'
                    error={formIsChecked && (!Number.isInteger(+form.partLeadDaysCount) || +form.partLeadDaysCount < 0) }
                    onChange={onFormChange}
                    value={form.partLeadDaysCount}/>
                <TextField
                    fullWidth
                    type="number"
                    style={{ marginBottom: 10 }}
                    label='Daily Part'
                    id="dailyPartsCount"
                    name="dailyPartsCount"
                    placeholder='Type Daily Parts'
                    error={formIsChecked && (!Number.isInteger(+form.dailyPartsCount) || +form.dailyPartsCount < 0)}
                    onChange={onFormChange}
                    value={form.dailyPartsCount}/>
            </DialogContent>
            <DialogActions>
                <div className={classes.actionsWrapper}>
                    <div className={classes.buttonsWrapper}>
                        <Button
                            onClick={onCancel}
                            className={classes.cancelButton}>
                            Cancel
                        </Button>
                        <Button
                            onClick={onSave}
                            className={classes.saveButton}>
                            Save
                        </Button>
                    </div>
                </div>
            </DialogActions>
        </BaseModal>
    );
};

export default AddRecall;