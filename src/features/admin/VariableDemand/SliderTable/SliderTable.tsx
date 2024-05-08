import React, {useEffect, useState} from 'react';
import {Box, TableBody, TableCell, TableHead, TableRow, useMediaQuery, useTheme,} from "@mui/material";
import {
    dayDemands,
    EDayDemand,
    EDemandCategory,
    EDemandType,
    yearDemands
} from "../../../../store/reducers/pricingSettings/types";
import {EditButton} from "../../../../components/buttons/EditButton/EditButton";
import {SC_UNDEFINED} from "../../../../utils/constants";
import {setPricingDemand} from "../../../../store/reducers/pricingSettings/actions";
import {useDispatch} from "react-redux";
import {TMappedDemands} from "../../../../store/reducers/pricingSettings/selectors";
import {InvertedSlider, ColorfulSlider} from "./styles";
import {initialForm, sliderMarks, sliderRange} from "./constants";
import {TForm} from "./types";
import {DenseTableWithPadding} from "../../../../components/styled/DemandTable";
import {useConfirm} from "../../../../hooks/useConfirm/useConfirm";

import {useMessage} from "../../../../hooks/useMessage/useMessage";
import {useException} from "../../../../hooks/useException/useException";
import {useSCs} from "../../../../hooks/useSCs/useSCs";

type TProps = {
    demand: TMappedDemands,
    type: EDemandType
}

export const SliderTable: React.FC<React.PropsWithChildren<React.PropsWithChildren<TProps>>> = ({demand, type}) => {
    const [form, setForm] = useState<TForm>(initialForm);
    const [edit, setEdit] = useState<EDayDemand|null>(null);

    const {selectedSC} = useSCs();
    const {askConfirm} = useConfirm();
    const showMessage = useMessage();
    const showError = useException();
    const dispatch = useDispatch();

    const theme = useTheme();
    const isXS = useMediaQuery(theme.breakpoints.down('sm'));
    const demands = type === EDemandType.DayOfWeek ? dayDemands : yearDemands;

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
                title: "Please confirm you want to save this value",
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
                showMessage("Pricing Settings updated");
            } catch (e) {
                showError(e);
            }
        }
    }

    return <DenseTableWithPadding>
        <TableHead>
            <TableRow>
                {!isXS ? <TableCell>Value</TableCell> : null}
                <TableCell width={!isXS ? "50%" : "80%"}>Pricing Settings</TableCell>
                <TableCell width="20%" />
            </TableRow>
        </TableHead>
        <TableBody>
            {demands.map(d => {
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
                                : <ColorfulSlider
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
                                    onClick={handleEdit(null)}>CANCEL</EditButton>
                                <EditButton
                                    color="primary"
                                    onClick={askSave(d.id)}>SAVE</EditButton>
                            </>
                            : <EditButton
                                color="primary"
                                onClick={handleEdit(d.id)}>EDIT</EditButton>}
                    </TableCell>
                </TableRow>
            })}
        </TableBody>
    </DenseTableWithPadding>
};