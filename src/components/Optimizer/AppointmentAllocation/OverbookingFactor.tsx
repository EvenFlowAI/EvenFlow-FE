import React, {useCallback, useEffect, useState} from 'react';
import {styled, TableBody, TableHead} from "@material-ui/core";
import {SC_UNDEFINED} from "../../../config/constants";
import {useException, useMessage, useSCs, useSelectedPod} from "../../../utils/hooks";
import {useDispatch, useSelector} from "react-redux";
import {DemandTable, SaveEditBlock, TableCell, TableRow} from "./UI";
import moment from "moment";
import {TextField} from "../../UI/TextField";
import {loadOverbookingFactor, setOverbookingFactor} from "../../../store/reducers/optimizationWindows/actions";
import {RootState} from "../../../store/rootReducer";
import {EDay} from "../../../store/reducers/demandSegments/types";
import {IOverbookingFactor} from "../../../store/reducers/optimizationWindows/types";

const tableHead: string[] = [
    "Day", "No Show Rate (%)", "Day of Cancelations (%)", "Combined (%)", "Overbooking Factor"
];

const STextField = styled(TextField)({
    maxWidth: 100
});

type TForm = {
    [D in EDay]: IOverbookingFactor
}
const initialDay = {} as IOverbookingFactor;
const initialState = {
    [EDay.Sunday]: {...initialDay, day: EDay.Sunday},
    [EDay.Monday]: {...initialDay, day: EDay.Monday},
    [EDay.Tuesday]: {...initialDay, day: EDay.Tuesday},
    [EDay.Wednesday]: {...initialDay, day: EDay.Wednesday},
    [EDay.Thursday]: {...initialDay, day: EDay.Thursday},
    [EDay.Friday]: {...initialDay, day: EDay.Friday},
    [EDay.Saturday]: {...initialDay, day: EDay.Saturday},
}

export const OverbookingFactor = () => {
    const [saving, setSaving] = useState<boolean>(false);
    const [isEdit, setEdit] = useState<boolean>(false);
    const [form, setForm] = useState<TForm>(initialState);
    const {selectedSC} = useSCs();
    const {selectedPod} = useSelectedPod()
    const overbookingList = useSelector((state: RootState) => state.optimizationWindows.overbookingFactor);

    const showMessage = useMessage();
    const showError = useException();
    const dispatch = useDispatch();

    useEffect(() => {
        if (selectedSC) {
            dispatch(loadOverbookingFactor(selectedSC.id, selectedPod?.id));
        }
    }, [selectedSC, selectedPod, dispatch]);

    const setInitialData = useCallback(() => {
        const nForm = {} as TForm;
        if (overbookingList.length) {
            for (let overbookingItem of overbookingList) {
                nForm[overbookingItem.day] = overbookingItem;
            }
            setForm(nForm);
        } else {
            setForm(initialState);
        }
    }, [overbookingList])

    useEffect(() => {
        setInitialData();
    }, [overbookingList]);

    const handleCancel = () => {
        setInitialData();
        setEdit(false);
    }

    const handleChange = (day: EDay) => ({target: {name, value}}: React.ChangeEvent<HTMLInputElement>) => {
        setForm({...form, [day]: {...form[day], [name]: Number(value)}});
    }

    const handleSave = async () => {
        if (!selectedSC) {
            showError(SC_UNDEFINED);
        } else {
            try {
                setSaving(true);
                const data: IOverbookingFactor[] = Object.values(form).map(di => ({
                    ...di,
                    serviceCenterId: selectedSC.id,
                    podId: selectedPod?.id,
                    overbookingFactorValue: di.overbookingFactorValue || 0
                }));
                await dispatch(setOverbookingFactor(data));
                setSaving(false);
                showMessage("Saved");
            } catch (e) {
                setSaving(false)
                showError(e);
            }
        }
    }

    return <div>
            <DemandTable>
                <TableHead>
                    <TableRow>
                        {tableHead.map(h =>
                            <TableCell key={h}>{h}</TableCell>
                        )}
                        <TableCell width='15%' style={{textAlign: "right"}}>
                            <SaveEditBlock
                                onSave={handleSave}
                                onEdit={() => setEdit(true)}
                                onCancel={handleCancel}
                                isEdit={isEdit}
                                isSaving={saving}
                            />
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {moment.weekdays().map((wd, idx) =>
                        <TableRow key={wd}>
                            <TableCell>{wd}</TableCell>
                            <TableCell>
                                {form[idx as EDay].noShowRate ?? "-"}
                            </TableCell>
                            <TableCell>
                                {form[idx as EDay].dayOfCancellations ?? "-"}
                            </TableCell>
                            <TableCell>
                                {form[idx as EDay].combined ?? "-"}
                            </TableCell>
                            <TableCell>
                                {!isEdit
                                    ? form[idx as EDay].overbookingFactorValue ?? ""
                                : <STextField
                                        type="number"
                                        inputProps={{
                                            min: 0
                                        }}
                                        name="overbookingFactorValue"
                                        id="overbookingFactorValue"
                                        value={form[idx as EDay].overbookingFactorValue ?? ""}
                                        onChange={handleChange(idx as EDay)}
                                    />}
                            </TableCell>
                            <TableCell/>
                        </TableRow>
                    )}
                </TableBody>
            </DemandTable>

</div>
};