import React, {useEffect, useState} from 'react';
import {DenseTable} from "../../AppointmentAllocation/UI";
import {
    Box,
    Mark,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    useMediaQuery,
    useTheme,
    withStyles
} from "@material-ui/core";
import {dayDemands, EDayDemand, EDemandCategory, EDemandType} from "../../../../store/reducers/pricingSettings/types";
import {ValueSlider} from "../../AppointmentValue/UI";
import {EditButton} from "../../../UI/Button";
import {TableContainer} from "../UI";
import {SC_UNDEFINED} from "../../../../config/constants";
import {setPricingDemand} from "../../../../store/reducers/pricingSettings/actions";
import {useConfirm, useException, useMessage, useSCs} from "../../../../utils/hooks";
import {useDispatch} from "react-redux";
import {TMappedDemands} from "../../../../store/reducers/pricingSettings/selectors";


const Slider = withStyles({
    rail: {
        background: "linear-gradient(90deg, green 0%, green 20%, orange 20%, orange 40%, red 40%)",
        opacity: 1
    },
    track: {
        background: "transparent"
    }
})(ValueSlider);
const InvertedSlider = withStyles({
    rail: {
        background: "linear-gradient(-90deg, green 0%, green 20%, orange 20%, orange 40%, red 40%)",
        opacity: 1
    },
    track: {
        background: "transparent"
    }
})(ValueSlider);

type TZone = "orange" | "red";

type ESliderRange = {
    Min: number;
    Zones: [string, TZone, number][]
    Max: number;
    Default: number;
    Step: number;
    Inverted: boolean;
}
const sliderRange: {[k in EDayDemand]: ESliderRange} = {
    [EDayDemand.Low]: {Min: -10, Max: 0, Default: 0, Step: .1, Inverted: true, Zones: [["-2", "orange", -2], ["-4", "red", -4]]},
    [EDayDemand.High]: {Min: 0, Max: 10, Default: 0, Step: .1, Inverted: false, Zones: [["2", "orange", 2], ["4", "red", 4]]},
}

const sliderMarks = (t: EDayDemand): Mark[] => [
    {label: sliderRange[t].Min, value: sliderRange[t].Min},
    ...sliderRange[t].Zones.map(z => ({label: z[0], value: z[2]})),
    {label: sliderRange[t].Max, value: sliderRange[t].Max},
];

type TForm = {
    [k in EDayDemand]: number;
}
const initialForm: TForm = {
    [EDayDemand.Low]: 0,
    [EDayDemand.High]: 0,
}

type TProps = {
    demand: TMappedDemands,
    type: EDemandType
}

export const SliderTable: React.FC<TProps> = ({demand, type}) => {
    const [form, setForm] = useState<TForm>(initialForm);
    const [edit, setEdit] = useState<EDayDemand|null>(null);

    const {selectedSC} = useSCs();
    const {askConfirm} = useConfirm();
    const showMessage = useMessage();
    const showError = useException();
    const dispatch = useDispatch();

    const theme = useTheme();
    const isXS = useMediaQuery(theme.breakpoints.down("xs"));

    useEffect(() => {
        setForm({
            ...{
                [EDayDemand.High]: demand[EDayDemand.High]?.point || initialForm[EDayDemand.High],
                [EDayDemand.Low]: demand[EDayDemand.Low]?.point || initialForm[EDayDemand.Low],
            }
        });
    }, [demand]);

    const handleSlide = (t: EDayDemand) => (e: any, value: number|number[]) => {
        setForm({...form, [t]: value as number});
    }

    const handleEdit = (t: EDayDemand|null) => () => {
        setEdit(t);
        if (t === null) {
            // Clear form
            setForm({...initialForm, ...{
                [EDayDemand.High]: demand[EDayDemand.High]?.point || initialForm[EDayDemand.High],
                [EDayDemand.Low]: demand[EDayDemand.Low]?.point || initialForm[EDayDemand.Low],
            }});
        }
    }

    const askSave = (t: EDayDemand) => async () => {
        const val = form[t];
        if (val <= -4 || val >= 4) {
            await askConfirm({
                isRemove: true,
                title: "Are you sure you want to save this value?",
                onConfirm: () => handleSave(t),
                onCancel: handleEdit(null),
                confirmContent: "Confirm"
            })
        } else {
            await handleSave(t);
        }
    }

    const handleSave = async (t: EDayDemand) => {
        if (!selectedSC) {
            showError(SC_UNDEFINED);
        } else {
            try {
                await dispatch(setPricingDemand({
                    serviceCenterId: selectedSC.id,
                    point: form[t],
                    demandCategory: EDemandCategory[String(t) as keyof typeof EDemandCategory],
                    type
                }));
                setEdit(null);
                showMessage("Saved");
            } catch (e) {
                showError(e);
            }
        }
    }

    return <TableContainer>
        <DenseTable>
            <TableHead>
                <TableRow>
                    {!isXS ? <TableCell>Value</TableCell> : null}
                    <TableCell width={!isXS ? "50%" : "80%"}>Pricing Settings</TableCell>
                    <TableCell width="20%" />
                </TableRow>
            </TableHead>
            <TableBody>
                {dayDemands.map(d => {
                    return <TableRow key={d.id}>
                        {!isXS ? <TableCell>{d.label}</TableCell> : null}
                        <TableCell>
                            {isXS ? <Box mt={2}>{d.label}</Box> : null}
                            <Box ml={2} mr={2}>
                                {sliderRange[d.id].Inverted ?
                                    <InvertedSlider
                                        min={sliderRange[d.id].Min}
                                        max={sliderRange[d.id].Max}
                                        disabled={edit !== d.id}
                                        valueLabelDisplay="on"
                                        step={sliderRange[d.id].Step}
                                        value={form[d.id]}
                                        marks={sliderMarks(d.id)}
                                        onChange={handleSlide(d.id)}
                                    />
                                    : <Slider
                                        min={sliderRange[d.id].Min}
                                        max={sliderRange[d.id].Max}
                                        disabled={edit !== d.id}
                                        valueLabelDisplay="on"
                                        step={sliderRange[d.id].Step}
                                        value={form[d.id]}
                                        marks={sliderMarks(d.id)}
                                        onChange={handleSlide(d.id)}
                                    />
                                }
                            </Box>
                        </TableCell>
                        <TableCell align="right">
                            {(edit === d.id) ?
                                <>
                                    <EditButton
                                        color="secondary"
                                        onClick={handleEdit(null)}>Cancel</EditButton>
                                    <EditButton
                                        color="primary"
                                        onClick={askSave(d.id)}>Save</EditButton>
                                </>
                                : <EditButton
                                    color="primary"
                                    onClick={handleEdit(d.id)}
                                >Edit</EditButton>}
                        </TableCell>
                    </TableRow>
                })}
            </TableBody>
        </DenseTable>
    </TableContainer>
};