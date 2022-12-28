import React, {useEffect, useState} from 'react';
import {BaseModal, DialogContent} from "../BaseModal";
import {DialogProps} from "../types";
import {ITimeWindowReservation} from "../../../store/reducers/capacityServiceValet/types";
import {TimeWindowName} from "../../Optimizer/CapacityServiceValet/styledComponents";
import {timeWindowNames} from "../../Optimizer/CapacityServiceValet/ZoneCapacityTable";
import {makeStyles} from "@material-ui/core/styles";
import {Button} from "@material-ui/core";
import {TextField} from "../../UI/TextField";

type TEditReservationsCountProps = DialogProps & {
    zoneId: number|null;
    timeWindow: ITimeWindowReservation|null;
}

const useStyles = makeStyles(() => ({
    wrapper: {
        height: 350,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    editButton: {
        textTransform: "none",
        fontSize: 14
    },
    editSaveButtons: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        '& > button:first-child': {
            marginRight: 10
        }
    },
    contentWrapper: {
        backgroundColor: '#F7F8FB'
    },
    input: {
        width: 88,
        borderRadius: 4,
        backgroundColor: '#FFFFFF'
    }
}))

const EditReservationsCount: React.FC<TEditReservationsCountProps> = ({open, onClose, timeWindow, zoneId}) => {
    const [count, setCount] = useState<number>(0);
    const classes = useStyles();

    useEffect(() => {
        timeWindow && setCount(timeWindow.reservationsCount);
    }, [timeWindow])

    const onCancel = () => {
        timeWindow && setCount(timeWindow.reservationsCount);
        onClose()
    }

    const onSave = () => {
        onClose()
    }

    const onChange = ({target: {value}}: React.ChangeEvent<HTMLInputElement>) => {
        setCount(Number(value));
    }

    return (
        <BaseModal open={open} onClose={onCancel} width={210}>
            <div className={classes.contentWrapper}>
                <div className={classes.editSaveButtons}>
                    <Button
                        className={classes.editButton}
                        color="secondary"
                        onClick={onCancel}>
                        Cancel
                    </Button>
                    <Button
                        className={classes.editButton}
                        color="primary"
                        onClick={onSave}>
                        Save
                    </Button>
                </div>
                <DialogContent>
                    <div className={classes.wrapper}>
                        <TimeWindowName>
                            {timeWindow && timeWindowNames[timeWindow.timeWindowType]}
                        </TimeWindowName>
                        <TextField
                            className={classes.input}
                            type="number"
                            inputProps={{min: 0}}
                            value={count}
                            onChange={onChange}
                        />
                    </div>
                </DialogContent>
            </div>
        </BaseModal>
    );
};

export default EditReservationsCount;