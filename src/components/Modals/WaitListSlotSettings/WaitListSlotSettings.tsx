import React, {useEffect, useState} from 'react';
import {TWaitListRequest} from "../../../store/reducers/optimizationWindows/types";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import {useSCs, useSelectedPod} from "../../../utils/hooks";
import {updateWaitListSettings} from "../../../store/reducers/optimizationWindows/actions";

const WaitListSlotSettings = () => {
    const {waitListSettings} = useSelector((state: RootState) => state.optimizationWindows);
    const [slotText, setSlotText] = useState<string>('');
    const [slotTextHex, setSlotTextHex] = useState<string>('');
    const [slotTextBoxHex, setSlotTextBoxHex] = useState<string>('');
    const [rolloverDescriptionText, setRolloverDescriptionText] = useState<string>('');
    const [isEnabled, setEnabled] = useState<boolean>(false);
    const {selectedSC} = useSCs();
    const {selectedPod} = useSelectedPod();
    const dispatch = useDispatch()

    useEffect(() => {
        if (waitListSettings) {
            setSlotText(waitListSettings.slotSettings?.appointmentSlotText ?? '')
            setSlotTextHex(waitListSettings.slotSettings?.appointmentSlotTextHex ?? '')
            setSlotTextBoxHex(waitListSettings.slotSettings?.appointmentSlotBoxHex ?? '')
            setRolloverDescriptionText(waitListSettings?.slotSettings?.rolloverDescriptionText ?? '')
            setEnabled(waitListSettings?.isEnabled)
        }
    }, [waitListSettings])

    const onSave = () => {
        if (slotText.trim().length && selectedSC) {
            const data: TWaitListRequest = {
                serviceCenterId: selectedSC.id,
                podId: selectedPod?.id ?? null,
                appointmentSlotText: slotText,
                isEnabled,
            }
            if (slotTextHex.trim().length === 6) {
                data.appointmentSlotTextHex = slotTextHex.trim();
            }
            if (slotTextBoxHex.trim().length === 6) {
                data.appointmentSlotBoxHex = slotTextBoxHex.trim();
            }
            if (rolloverDescriptionText.trim().length) {
                data.rolloverDescriptionText = rolloverDescriptionText.trim()
            }
            dispatch(updateWaitListSettings(data))
        }
    }

    return (
        <div>

        </div>
    );
};

export default WaitListSlotSettings;