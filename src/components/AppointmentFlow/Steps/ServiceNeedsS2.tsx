import React, {useEffect, useState} from 'react';
import {CircularProgress, FormControlLabel, FormLabel, IconButton, Radio, RadioGroup} from "@material-ui/core";
import {TextField} from "../UI";
import {ArrowDropDownCircleOutlined, Search} from "@material-ui/icons";
import {makeStyles} from "@material-ui/core/styles";
import clsx from "clsx";
import {loadSRs, selectSR} from "../../../store/reducers/appointment/actions";
import {useDispatch, useSelector} from "react-redux";
import { useParams } from 'react-router-dom';
import {RootState} from "../../../store/rootReducer";

const useStyles = makeStyles(theme => ({
    label: {
        textTransform: "uppercase",
        fontWeight: "bold"
    },
    btnIcon: {
        marginLeft: 8
    },
    title: {
        textAlign: "center"
    },
    search: {
        marginBottom: 22
    },
    radioGroup: {

    },
    openIcon: {
        marginRight: 12,
        transition: theme.transitions.create(['transform'])
    },
    opened: {
        transform: "rotate(180deg)"
    },
    item: {
        justifyContent: "space-between",
        margin: "12px 0 0 0",
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: 2,
        paddingLeft: 6,
    }
}));

export const ServiceNeedsS2 = () => {
    const [openedCode, setOpened] = useState<number|null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const {id} = useParams();
    const [selectedCode, srList] = useSelector((state: RootState) => [
        state.appointment.selectedSR,
        state.appointment.serviceRequests
    ]);
    const dispatch = useDispatch();

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            try {
                await dispatch(loadSRs(id));
            } finally {
                setLoading(false);
            }
        }
        fetchData().finally();
    }, [id, dispatch])

    const handleOpen = (id: number) => () => {
        if (openedCode === id) {
            setOpened(null);
        } else {
            setOpened(id);
        }
    }

    const handleSelectCode = (e: any, value: string) => {
        dispatch(selectSR(value ? Number(value) : null));
    }

    const classes = useStyles();
    return (
        <div style={{width: "80%"}}>
            <h4 className={classes.title}>What Does Your Car Need?</h4>
            <FormLabel className={classes.label} htmlFor="search">Search</FormLabel>
            <TextField
                placeholder="Type here"
                className={classes.search}
                InputProps={{
                    startAdornment: <IconButton
                        className={classes.btnIcon}
                        size="small">
                        <Search />
                    </IconButton>
                }}
            />
            <RadioGroup className={classes.radioGroup} value={selectedCode} onChange={handleSelectCode}>
                {srList.map(s => {
                    return <FormControlLabel
                        key={s.id}
                        className={classes.item}
                        label={<span>
                            <IconButton
                                onClick={handleOpen(s.id)}
                                size="small"
                                color="primary"
                                className={clsx(...[classes.openIcon, s.id === openedCode ? classes.opened : undefined])}>
                                <ArrowDropDownCircleOutlined />
                            </IconButton> {s?.description || s.code}
                        </span>}
                        labelPlacement={"start"}
                        value={s.id}
                        control={
                            <Radio
                                color="primary"
                            />
                        }
                    />
                })}
            </RadioGroup>
            {loading ? <div style={{textAlign: "center"}}><CircularProgress/></div> : null}
        </div>
    );
};