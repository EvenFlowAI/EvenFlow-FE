import React, {useEffect, useState} from 'react';
import {SquarePaper} from "../../../UI/Paper";
import {PaperTitle, TableContainer} from "../UI";
import {useDispatch, useSelector} from "react-redux";
import {useException, useSCs} from "../../../../utils/hooks";
import {RootState} from "../../../../store/rootReducer";
import {loadSrList, setEligibleRequest} from "../../../../store/reducers/pricingSettings/actions";
import {NoItemsLoading} from "../../../UI/NoItemsLoading";
import {Divider, Switch, TableBody, TableHead} from "@material-ui/core";
import {DemandTable, TableCell, TableRow} from "../../AppointmentAllocation/UI";

const headCellStyles = {
    fontSize: 12,
    lineHeight: "16px",
    color: "#9FA2B4"
}
const leftAlign = {
    textAlign: "left" as const
}

export const ServiceCodes = () => {
    const [saving, setSaving] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const srList = useSelector((state: RootState) => state.pricingSettings.srList);

    const showError = useException();
    const {selectedSC} = useSCs();
    const dispatch = useDispatch();

    useEffect(() => {
        if (selectedSC) {
            try {
                setLoading(true);
                dispatch(loadSrList(selectedSC.id));
            } finally {
                setLoading(false);
            }
        }
    }, [dispatch, selectedSC]);

    const handleSwitch = (id: number) => async (e: any, value: boolean) => {
        if (selectedSC) {
            try {
                setSaving(true);
                await dispatch(setEligibleRequest(id, value, selectedSC.id));
            }catch (e) {
                showError(e);
            } finally {
                setSaving(false);
            }
        }
    }

    return <SquarePaper variant="outlined">
        <PaperTitle>Service codes eligibility status</PaperTitle>
        <Divider />
        <TableContainer>
            <NoItemsLoading items={srList} loading={loading} />
            {srList.length ? <DemandTable>
                <TableHead>
                    <TableRow>
                        <TableCell
                            style={{...headCellStyles, ...leftAlign}}>
                            Service Ops Code
                        </TableCell>
                        <TableCell
                            width={330}
                            style={{...headCellStyles, ...leftAlign}}>
                            Description
                        </TableCell>
                        <TableCell style={headCellStyles}>Duration (hours)</TableCell>
                        <TableCell style={headCellStyles}>Number of technicians</TableCell>
                        <TableCell style={headCellStyles}>Skill level of technicians</TableCell>
                        <TableCell style={headCellStyles}>Pricing optimization status (Off/ON)</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {srList.map(el => {
                        return <TableRow key={el.id}>
                            <TableCell style={leftAlign}>{el.serviceRequest.code}</TableCell>
                            <TableCell style={leftAlign}>
                                {el.serviceRequestOverride?.description
                                || el.serviceRequest.description}
                            </TableCell>
                            <TableCell>
                                {el.serviceRequestOverride?.durationInHours
                                || el.serviceRequest.durationInHours}
                            </TableCell>
                            <TableCell>
                                {el.serviceRequestOverride?.countOfTechnicians
                                || el.serviceRequest.countOfTechnicians}
                            </TableCell>
                            <TableCell>
                                {el.serviceRequestOverride?.skillLevelOfTechnicians
                                || el.serviceRequest.skillLevelOfTechnicians}
                            </TableCell>

                            <TableCell>
                                <Switch
                                    disabled={saving}
                                    onChange={handleSwitch(el.id)}
                                    checked={el.isEligibility}
                                    color="primary"
                                />
                            </TableCell>
                        </TableRow>
                    })}
                </TableBody>
            </DemandTable> : null}
        </TableContainer>
    </SquarePaper>
};