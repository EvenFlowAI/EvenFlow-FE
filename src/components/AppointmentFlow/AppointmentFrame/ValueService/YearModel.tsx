import React, {useEffect, useState} from 'react';
import {Autocomplete} from "@material-ui/lab";
import {styled, useMediaQuery, useTheme} from "@material-ui/core";
import {useDispatch, useSelector} from "react-redux";
import {useParams} from "react-router-dom";
import moment from "moment";
import {autocompleteRender} from "../../../UI/AutocompleteRender";
import {StepWrapper} from "../StepWrapper";
import {Actions} from "../Actions";
import {TActionProps} from "../types";
import {IValueService} from "../../../../store/reducers/appointmentFrameReducer/types";
import {loadMakes, setValueService,} from "../../../../store/reducers/appointmentFrameReducer/actions";
import {RootState} from "../../../../store/rootReducer";
import {useException} from "../../../../utils/hooks";
import {decodeSCID} from "../../../../utils/utils";

const mockSeries = ['2x', '3x', '4x'];

const SelectsTitle = styled('div')(({theme}) => ({
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "20px",
    fontSize: 20,
    color: "#FFFFFF",
    backgroundColor: "#828282",
    padding: 20,
}));

const SelectWrapper = styled('div')(({theme}) => ({
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    gap: "20px",
    width: "100%",
    backgroundColor: "#828282",
    padding: 20,
    [theme.breakpoints.down("sm")]: {
        gridTemplateColumns: "1fr"
    },
    '& > input': {
        backgroundColor: "#FFFFFF",
    },
    '& > label': {
        color: "#FFFFFF !important",
    }
}));

let year = moment.utc().year()
if (moment().month() > 9) year = moment.utc().add(1, 'year').year();
const YEARS = 20;
export const yearOptions: string[] = Array(YEARS).fill(0).map((_, idx) => String(year - idx));

type TKey = keyof IValueService;

export const YearModel: React.FC<TActionProps> = ({onNext, onBack}) => {
    const {valueService, makes}= useSelector((state: RootState) => state.appointmentFrame);
    const [currentModels, setCurrentModels] = useState<string[] | []>([]);
    const dispatch = useDispatch();
    const showError = useException();
    const {id} = useParams();
    const theme = useTheme();
    const isXS = useMediaQuery(theme.breakpoints.down("xs"));

    useEffect(() => {
        if (makes.length) {
            const models = makes.find(item => item.name === 'BMW')?.models ?? [];
            setCurrentModels(() => models);
        }
    }, [makes])

    useEffect(() => {
        dispatch(loadMakes(decodeSCID(id)));
    }, [id]);

    const handleChange = (name: TKey) => (e: React.ChangeEvent<{}>, option: string|null) => {
        if (isXS) e.preventDefault();
        if (option) {
           dispatch(setValueService({[name]: option}));
        }
    }

    const handleNext = () => {
        onNext();
    }

    const handleBack = () => {
        onBack();
    }

    return (<StepWrapper>
        <SelectsTitle>SELECT YOUR VEHICLE</SelectsTitle>
        <SelectWrapper>
            <Autocomplete
                key="year"
                options={yearOptions}
                onChange={handleChange("year")}
                fullWidth
                disableClearable
                autoComplete={true}
                renderInput={autocompleteRender({
                    label: "Year",
                    placeholder: "Select Year",
                    required: true
                })}
                value={valueService.year}
            />
            {valueService?.year ? <Autocomplete
                key="series"
                options={mockSeries}
                onChange={handleChange("series")}
                fullWidth
                disableClearable
                autoComplete={true}
                renderInput={autocompleteRender({
                    label: "Series",
                    placeholder: "Select Series",
                    required: true
                })}
                value={valueService.series}
            /> : null}
            {valueService?.year && valueService?.series ? <Autocomplete
                key="model"
                options={currentModels}
                onChange={handleChange("model")}
                fullWidth
                disableClearable
                autoComplete={true}
                renderInput={autocompleteRender({
                    label: "Model",
                    placeholder: "Select Model",
                    required: true
                })}
                value={valueService.model}
            /> : null}
        </SelectWrapper>
        <Actions
            onBack={handleBack}
            onNext={handleNext}
            nextLabel="View Price"
            nextDisabled={!valueService.year || !valueService.model || !valueService.series}
        />
    </StepWrapper>);
};