import React, {useEffect, useState} from 'react';
import {DialogProps} from "../../../Modals/types";
import {BaseModal, DialogActions, DialogContent, DialogTitle} from "../../../Modals/BaseModal";
import {Box, Button} from "@material-ui/core";
import {LoadingButton, SwitchButtons, TSwitchButton} from "../../../UI/Button";
import {useException, useMessage, useSCs} from "../../../../utils/hooks";
import {useDispatch, useSelector} from "react-redux";
import moment from "moment";
import {EDay, EDemandCategory, IDayOfWeekSetting} from "../../../../store/reducers/pricingSettings/types";
import {SC_UNDEFINED} from "../../../../config/constants";
import {loadDayOfWeekPricing, setWorkWeekPricing} from "../../../../store/reducers/pricingSettings/actions";
import {mappedDWeekPricingSelector} from "../../../../store/reducers/pricingSettings/selectors";

const buttons: TSwitchButton<number>[] = [
    {type: EDemandCategory.Low, label: "Low"},
    {type: EDemandCategory.Average, label: "Average"},
    {type: EDemandCategory.High, label: "High"},
];

type TForm = {
    [k in EDay]: EDemandCategory
};
const initialDay: EDemandCategory = EDemandCategory.Average;
const initialForm: TForm = Object.values(EDay).reduce((acc, item) => {
    acc[item as EDay] = initialDay;
    return acc;
}, {} as TForm);

export const WorkWeekDialog: React.FC<DialogProps> = ({onAction, payload, ...props}) => {
    const [form, setForm] = useState<TForm>(initialForm);
    const [saving, setSaving] = useState<boolean>(false);
    const showError = useException();
    const showMessage = useMessage();
    const dispatch = useDispatch();
    const {selectedSC} = useSCs();
    const demand = useSelector(mappedDWeekPricingSelector);

    useEffect(() => {
        if (props.open) {
            if (selectedSC) {
                dispatch(loadDayOfWeekPricing(selectedSC.id));
            } else {
                setForm(initialForm);
            }
        }
    }, [props.open, dispatch, selectedSC]);

    useEffect(() => {
        setForm({
            ...initialForm,
            ...demand
        })
    }, [demand]);

    const handleSwitch = (idx: EDay) => (t: EDemandCategory) => () => {
        setForm({...form, [idx]: t});
    }

    const handleSave = async () => {
        if (!selectedSC) {
            showError(SC_UNDEFINED);
        } else {
            try {
                setSaving(true);
                await dispatch(setWorkWeekPricing(
                    Object.entries(form).filter(([k, v]) => !isNaN(Number(k))).map(([k, v]) => {
                        return {
                            demandCategory: v,
                            dayOfWeek: Number(k) as EDay,
                            serviceCenterId: selectedSC.id
                        } as IDayOfWeekSetting;
                    }))
                )
                showMessage("Saved");
                setSaving(false);
                props.onClose();
            } catch (e) {
                setSaving(false);
                showError(e);
            }
        }
    }

    const getContent = () => {
        const days = moment.weekdays().map((wd, idx) => {
            return <React.Fragment key={wd}>
                <Box component="span" fontWeight="bold">{wd}</Box>
                <Box>
                    <SwitchButtons<number>
                        onClick={handleSwitch(idx as EDay)}
                        active={form[idx as EDay]}
                        buttons={buttons} />
                </Box>
            </React.Fragment>
        });
        const sunday = days[0]
        days.shift();
        days.push(sunday)
        return days;
    }
    return <BaseModal {...props} width={400}>
        <DialogTitle onClose={props.onClose}>Work Week Settings</DialogTitle>
        <DialogContent>
            <Box display="grid" gridGap={10} gridTemplateColumns="1fr 220px">
                <Box component="span" fontWeight="bold" color={"text.disabled"}>Day</Box>
                <Box component="span" fontWeight="bold" color={"text.disabled"}>Demand Category</Box>
                {getContent()}
            </Box>
        </DialogContent>
        <DialogActions>
            <Button onClick={props.onClose}>Close</Button>
            <LoadingButton
                loading={saving}
                onClick={handleSave}
                color="primary"
                variant="contained">
                Save
            </LoadingButton>
        </DialogActions>
    </BaseModal>
};