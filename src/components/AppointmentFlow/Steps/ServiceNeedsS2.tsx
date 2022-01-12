import React, {useEffect, useRef, useState} from 'react';
import {
    Checkbox,
    CircularProgress,
    FormControlLabel, FormGroup,
    FormLabel,
    IconButton
} from "@material-ui/core";
import {
    InputLoading,
    NextPrevBlock,
    ScrollableContainer,
    StepContainer,
    StepContentContainer,
    TextField,
    TStepProps
} from "../UI";
import {ArrowDropDownCircleOutlined, Search} from "@material-ui/icons";
import {makeStyles} from "@material-ui/core/styles";
import clsx from "clsx";
import {handleSearch, loadSRs, selectAppointment} from "../../../store/reducers/appointment/actions";
import {useDispatch, useSelector} from "react-redux";
import { useParams } from 'react-router-dom';
import {RootState} from "../../../store/rootReducer";
import {useDebounce} from "../../../utils/hooks";
import {decodeSCID} from "../../../utils/utils";

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

export const ServiceNeedsS2: React.FC<TStepProps> = ({prev, next, isCompleted}) => {
    const [openedCode, setOpened] = useState<number|null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [searchInput, setSearch] = useState<string>("");

    const {id} = useParams();
    const [selectedCode, srList, search] = useSelector((state: RootState) => [
        state.appointment.selectedSR,
        state.appointment.serviceRequests,
        state.appointment.search
    ]);
    const dispatch = useDispatch();
    const isInit = useRef(true);
    const debouncedSearch = useDebounce(searchInput);

    useEffect(() => {
        if (!isInit.current) {
            dispatch(handleSearch(debouncedSearch));
        }
    }, [debouncedSearch, dispatch]);
    useEffect(() => {
        if (isInit.current) {
            setSearch(search);
        }
    }, [search]);
    useEffect(() => {isInit.current = false}, []);

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            try {
                await dispatch(loadSRs(decodeSCID(id)));
            } finally {
                setLoading(false);
            }
        }
        fetchData().finally();
    }, [id, dispatch, search]);

    const handleOpen = (id: number) => () => {
        if (openedCode === id) {
            setOpened(null);
        } else {
            setOpened(id);
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    }

    const handleSelectCode = ({target: {value}}: React.ChangeEvent<HTMLInputElement>) => {
        // dispatch(selectSR(value ? Number(value) : null));
        dispatch(selectAppointment(null));
    }

    const classes = useStyles();
    return (
        <StepContainer>
            <StepContentContainer>
                <h4 className={classes.title}>What Does Your Car Need?</h4>
                <FormLabel className={classes.label} htmlFor="search">Search</FormLabel>
                <TextField
                    placeholder="Type here"
                    value={searchInput}
                    onChange={handleChange}
                    style={{flexShrink: 0}}
                    className={classes.search}
                    InputProps={{
                        startAdornment: <IconButton
                            className={classes.btnIcon}
                            size="small">
                            <Search />
                        </IconButton>,
                        endAdornment: loading ?
                            <InputLoading />
                            : undefined
                    }}
                />
                <ScrollableContainer>
                    <FormGroup className={classes.radioGroup}>
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
                                    <Checkbox
                                        onChange={handleSelectCode}
                                        value={s.id}
                                        checked={selectedCode.includes(s.id)}
                                        color="primary"
                                    />
                                }
                            />
                        })}
                    </FormGroup>
                    {loading ? <div style={{textAlign: "center"}}><CircularProgress/></div> : null}
                </ScrollableContainer>
                <NextPrevBlock next={next} prev={prev} isCompleted={isCompleted} />
            </StepContentContainer>
        </StepContainer>
    );
};