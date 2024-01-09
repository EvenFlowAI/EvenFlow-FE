import React, {ChangeEvent, Dispatch, SetStateAction, useEffect, useState} from 'react';
import {BaseModal, DialogActions, DialogContent, DialogTitle} from "../../../../components/modals/BaseModal/BaseModal";
import {ICreateUpdateRecall, IRecall} from "../../../../store/reducers/recall/types";
import {DialogProps} from "../../../../components/modals/BaseModal/types";
import {Button} from "@material-ui/core";
import {useDispatch, useSelector} from "react-redux";
import {TextField} from "../../../../components/formControls/TextFieldStyled/TextField";
import {Autocomplete} from "@material-ui/lab";
import {autocompleteRender} from "../../../../utils/autocompleteRenders";
import {RootState} from "../../../../store/rootReducer";
import {IMakeExtended, IModel} from "../../../../api/types";
import {IAssignedServiceRequest} from "../../../../store/reducers/serviceRequests/types";
import {loadMakesForPods} from "../../../../store/reducers/vehicleDetails/actions";
import {createRecall, updateRecall} from "../../../../store/reducers/recall/actions";
import {Textarea, useStyles} from "./styles";
import {TForm} from "./types";
import {getYearOptions} from "../../../../utils/utils";
import {useException} from "../../../../hooks/useException/useException";
import {useSCs} from "../../../../hooks/useSCs/useSCs";
import {checkIsValid} from "./utils";
import {initialForm} from "./constants";

type TAddRecallProps = DialogProps & {
    editingItem: IRecall|null;
    setEditingItem: Dispatch<SetStateAction<IRecall|null>>;
}

const yearOptions = getYearOptions()

const AddRecallModal: React.FC<TAddRecallProps> = ({editingItem, open, onClose, setEditingItem}) => {
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
                yearFrom: editingItem.yearRange?.from?.toString() ?? '',
                yearTo: editingItem.yearRange?.to?.toString() ?? '',
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

    const onSave = () => {
        setFormIsChecked(true);
        const isValid = checkIsValid(form, showError)
        if (isValid && selectedSC) {
            const data: ICreateUpdateRecall = {
                recallCampaignNumber: form.recallCampaignNumber,
                makeId: form.make?.id ?? null,
                modelId: form.model?.id ?? null,
                yearRange: {
                    from: form.yearFrom?.length ? +form.yearFrom : null,
                    to: form.yearTo?.length ? +form.yearTo : null,
                },
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

    const onYearChange = (name: "yearFrom"|"yearTo") => (e: ChangeEvent<{}>, value: string) => {
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
                    label='Recall Campaign Number'
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
                        placeholder: 'Select Chip'
                    })}
                />
                <Autocomplete
                    disableClearable
                    style={{ marginBottom: 10 }}
                    options={yearOptions}
                    getOptionSelected={(option, value) => option === value}
                    value={form?.yearFrom}
                    onChange={onYearChange("yearFrom")}
                    renderInput={autocompleteRender({
                        label: 'Year From',
                        placeholder: 'Select Year From',
                        error: (form.yearFrom && form.yearTo && (form.yearFrom > form.yearTo))
                            || formIsChecked && !form.yearFrom
                    })}
                />
                <Autocomplete
                    disableClearable
                    style={{ marginBottom: 10 }}
                    options={yearOptions}
                    getOptionSelected={(option, value) => option === value}
                    value={form?.yearTo}
                    onChange={onYearChange("yearTo")}
                    renderInput={autocompleteRender({
                        label: 'Year To',
                        placeholder: 'Select Year To',
                        error: (form.yearFrom && form.yearTo && (form.yearFrom > form.yearTo))
                        || formIsChecked && !form.yearTo
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
                    label='Part Lead Time (Days)'
                    id="partLeadDaysCount"
                    name="partLeadDaysCount"
                    placeholder='Type Part Lead Days Count'
                    error={formIsChecked && (!form.partLeadDaysCount || !Number.isInteger(+form.partLeadDaysCount) || +form.partLeadDaysCount < 0) }
                    onChange={onFormChange}
                    value={form.partLeadDaysCount}/>
                <TextField
                    fullWidth
                    type="number"
                    style={{ marginBottom: 10 }}
                    label='Daily Parts'
                    id="dailyPartsCount"
                    name="dailyPartsCount"
                    placeholder='Type Daily Parts'
                    error={formIsChecked && (!form.dailyPartsCount || !Number.isInteger(+form.dailyPartsCount) || +form.dailyPartsCount < 0)}
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

export default AddRecallModal;