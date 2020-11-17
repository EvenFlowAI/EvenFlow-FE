import React, {useEffect, useState} from 'react';
import {SquarePaper} from "../../../UI/Paper";
import {PaperTitle, TableContainer} from "../UI";
import {useDispatch, useSelector} from "react-redux";
import {useException, useSCs} from "../../../../utils/hooks";
import {RootState} from "../../../../store/rootReducer";
import {loadSrList, setEligibleRequest} from "../../../../store/reducers/pricingSettings/actions";
import {NoItemsLoading} from "../../../UI/NoItemsLoading";
import {Switch} from "@material-ui/core";

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
        <TableContainer>
            <NoItemsLoading items={srList} loading={loading} />
            {srList.map(el => {
                return <p key={el.id}>
                    {el.serviceRequest.code}
                    <Switch
                        disabled={saving}
                        onChange={handleSwitch(el.id)}
                        checked={el.isEligibility}
                        color="primary"
                    />
                </p>
            })}
        </TableContainer>
    </SquarePaper>
};