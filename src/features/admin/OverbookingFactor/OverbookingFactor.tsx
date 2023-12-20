import React, {useCallback, useEffect, useState} from 'react';
import {TableBody, TableHead} from "@material-ui/core";
import {SC_UNDEFINED} from "../../../config/constants";
import {useException, useMessage, useSCs, useSelectedPod} from "../../../utils/hooks";
import {useDispatch, useSelector} from "react-redux";
import moment from "moment";
import {
    loadOverbookingFactor,
    loadWaitListSettings,
    setOverbookingFactor
} from "../../../store/reducers/optimizationWindows/actions";
import {RootState} from "../../../store/rootReducer";
import {EDay} from "../../../store/reducers/demandSegments/types";
import {IOverbookingFactor} from "../../../store/reducers/optimizationWindows/types";
import WaitlistSwitcher from "../WaitlistSwitcher/WaitlistSwitcher";
import {STextField} from "../AncillaryPriceByDistance/styles";
import {initialState, tableHead} from "./constants";
import {TForm} from "./types";
import {SaveEditBlock} from "../../../components/SaveEditBlock/SaveEditBlock";
import {DemandTable} from "../../../components/styled/DemandTable";
import {TableRow} from "../../../components/styled/TableRow";
import {TableCell} from "../../../components/styled/TableCell";

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
            dispatch(loadWaitListSettings(selectedSC.id, selectedPod?.id))
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

    const onSuccess = () => {
        setSaving(false);
        showMessage("Saved");
        setEdit(false);
    }

    const onError = (err: string) => {
        setSaving(false)
        showError(err);
    }

    const handleSave = async () => {
        if (!selectedSC) {
            showError(SC_UNDEFINED);
        } else {
            setSaving(true);
            const data: IOverbookingFactor[] = Object.values(form).map(di => ({
                ...di,
                serviceCenterId: selectedSC.id,
                podId: selectedPod?.id,
                overbookingFactorValue: di.overbookingFactorValue || 0
            }));
            dispatch(setOverbookingFactor(data, onSuccess, onError));
        }
    }

    return <div>
        <WaitlistSwitcher/>
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