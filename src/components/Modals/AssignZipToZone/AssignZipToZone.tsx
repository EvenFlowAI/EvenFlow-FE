import React, {useEffect, useState} from 'react';
import {makeStyles} from "@material-ui/core/styles";
import {useSCs} from "../../../utils/hooks";
import {useDispatch} from "react-redux";
import {DialogProps} from "../types";
import {BaseModal, DialogActions, DialogContent, DialogTitle} from "../BaseModal";
import {Button, Divider, MenuItem, Select} from "@material-ui/core";
import {TZone} from "../../../store/reducers/mobileService/types";
import {TextField} from "../../UI/TextField";
import {mockZones} from "../../Optimizer/MobileService/Zones/Zones";
import {assignZipToZone} from "../../../store/reducers/mobileService/actions";

const useStyles = makeStyles(() => ({
    text: {
        display: 'flex',
        justifyContent: 'center',
        padding: '16px 0 36px 0',
        fontWeight: 'bold'
    },
    wrapper: {
        display: 'flex',
        justifyContent: 'flex-end',
        paddingTop: 14,
    },
    buttonsWrapper: {
        display: 'flex',
        justifyContent: "space-between",
        alignItems: 'center',
    },
    cancelButton: {
        color: '#9FA2B4',
        marginRight: 20,
        border: 'none',
        outline: 'none',
    },
    saveButton: {
        background: '#7898FF',
        color: 'white',
        border: '1px solid #7898FF',
        outline: 'none',
        '&:hover': {
            color: '#7898FF'
        }
    },
}))

type TAssignZipToZoneProps = DialogProps & {
    zip?: string;
    zone?: TZone|null;
}

const AssignZipToZone:React.FC<TAssignZipToZoneProps> = (props) => {
    const [selectedZone, setSelectedZone] = useState<TZone|null>(null);
    const classes = useStyles();
    const {selectedSC} = useSCs();
    const dispatch = useDispatch();

    useEffect(() => {
        if (typeof props.zone !== 'undefined') setSelectedZone(props.zone);
    }, [props.zone])

    const onCancel = () => props.onClose();

    const onAssign = () => {
        if (selectedSC && selectedZone && props.zip) {
            dispatch(assignZipToZone(selectedSC.id, selectedZone.id, props.zip));
            props.onClose();
        }
    }
    const onChange = (e: React.ChangeEvent<{value: unknown}>) => {
        const selected = mockZones.find(item => item.id === e.target.value as number);
        if (selected) setSelectedZone(selected);
    }

    return (
        <BaseModal {...props} width={540} onClose={onCancel}>
            <DialogTitle onClose={onCancel}>Assign ZIP to Another Zone</DialogTitle>
            <DialogContent>
                <Select
                    fullWidth
                    input={<TextField label="Choose zone From the list" placeholder="Zone name"/>}
                    id="zone"
                    placeholder="Zone name"
                    name="zone"
                    value={selectedZone?.id}
                    onChange={onChange}
                >
                    {mockZones.map(item => <MenuItem value={item.id}>{item.name}</MenuItem>)}
                </Select>
            </DialogContent>
            <Divider style={{ margin: 0 }}/>
            <DialogActions>
                <div className={classes.wrapper}>
                    <div className={classes.buttonsWrapper}>
                        <Button
                            onClick={onCancel}
                            className={classes.cancelButton}>
                            Cancel
                        </Button>
                        <Button
                            onClick={onAssign}
                            className={classes.saveButton}>
                            Assign
                        </Button>
                    </div>
                </div>
            </DialogActions>
        </BaseModal>
    );
};

export default AssignZipToZone;