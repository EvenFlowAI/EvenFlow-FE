import React, {ChangeEvent, useEffect, useState} from 'react';
import RecallTable from "./RecallTable/RecallTable";
import {Autocomplete, Button} from "@mui/material";
import AddRecallModal from "./AddRecallModal/AddRecallModal";
import {IRecall} from "../../../store/reducers/recall/types";
import {autocompleteRender} from "../../../utils/autocompleteRenders";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import {loadAllAssignedServiceRequests} from "../../../store/reducers/serviceRequests/actions";
import {IAssignedServiceRequest} from "../../../store/reducers/serviceRequests/types";
import {updateDefaultRecallOpsCode} from "../../../store/reducers/serviceCenters/actions";
import {useModal} from "../../../hooks/useModal/useModal";
import {useException} from "../../../hooks/useException/useException";
import {useSCs} from "../../../hooks/useSCs/useSCs";
import {useStyles} from "./styles";

const RecallParts = () => {
    const [currentItem, setCurrentItem] = useState<IRecall | null>(null);
    const [selectedOpsCode, setSelectedOpsCode] = useState<IAssignedServiceRequest | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const {selectedSC} = useSCs();
    const {allAssignedList} = useSelector((state: RootState) => state.serviceRequests);
    const {isOpen, onOpen, onClose} = useModal();
    const { classes } = useStyles();
    const dispatch = useDispatch();
    const showError = useException();

    useEffect(() => {
        if (selectedSC && allAssignedList) {
            const opsCode = allAssignedList.find(item => item.id === selectedSC.recallServiceRequestId)
            setSelectedOpsCode(opsCode ?? null);
        }
    }, [allAssignedList, selectedSC])

    useEffect(() => {
        if (selectedSC) dispatch(loadAllAssignedServiceRequests(selectedSC.id));
    }, [selectedSC])

    const handleAddRecall = () => {
        onOpen();
    }

    const onSRChange = (e: ChangeEvent<{}>, value: IAssignedServiceRequest|null) => {
        setLoading(true);
        if (selectedSC && value) {
            setSelectedOpsCode(value);
            try {
                dispatch(updateDefaultRecallOpsCode(selectedSC.id, value?.id))
            } catch (err) {
                showError(err)
            }
            finally {
                setLoading(false)
            }
        }
    }

    return <>
        <div className={classes.wrapper}>
            <div className={classes.title}>
                default recall ops code:
            </div>
            <Autocomplete
                style={{width: 335}}
                loading={loading}
                value={selectedOpsCode}
                options={allAssignedList}
                isOptionEqualToValue={(o, v) => o.id === v.id}
                getOptionLabel={o => o.serviceRequest.code}
                onChange={onSRChange}
                renderInput={autocompleteRender({
                    label: "",
                    placeholder: 'Select Ops Code'
                })}
            />
            <Button
                className={classes.button}
                color="primary"
                variant="contained"
                onClick={handleAddRecall}
            >
                Add Recall
            </Button>
        </div>
        <RecallTable onOpenModal={handleAddRecall} currentItem={currentItem} setCurrentItem={setCurrentItem}/>
        <AddRecallModal open={isOpen} editingItem={currentItem} onClose={onClose} setEditingItem={setCurrentItem}/>
    </>;
};

export default RecallParts;