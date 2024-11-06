import React, {Dispatch, SetStateAction} from 'react';
import {BtnsCell, Cell, Row, SubCell, SubCellFlex, SubCellWrapper, SubText, SubTitle} from "../styles";
import {IconButton, Switch} from "@mui/material";
import {ReactComponent as ArrowDown} from '../../../../../assets/img/dropdown_closed.svg'
import {IScheduleByDate} from "../../../../../store/reducers/schedules/types";
import {SwitcherLabel, SwitcherWrapper} from "../../EmployeeScheduleModal/styles";
import TimeBlock from "../../EmployeeScheduleModal/TimeBlock/TimeBlock";
import {IHOODataForm} from "../../../../../store/reducers/serviceCenters/types";

type TProps = {
    item: IScheduleByDate;
    expandedItem: IScheduleByDate|null;
    idx: number;
    setExpandedItem: Dispatch<SetStateAction<IScheduleByDate|null>>;
    isOpened: boolean;
    disabledDate: boolean;
    handleSwitch: (el: IScheduleByDate) => (e: any, value: boolean) => void;
    onTimeChange: (el: IScheduleByDate, field: "startAt" | "finishAt", value: string) => void;
    schedule: IHOODataForm|undefined;
    formIsChecked: boolean;
}

const EmployeeTableRow: React.FC<TProps> = ({
                                                handleSwitch,
                                                disabledDate,
                                                isOpened,
                                                item,
                                                expandedItem,
                                                idx,
                                                setExpandedItem,
                                                schedule,
                                                onTimeChange,
                                                formIsChecked}) => {
    const onOpenRow = (item: IScheduleByDate) => () => {
        setExpandedItem(item.id === expandedItem?.id ? null : item)
    }

    return <>
        <Row style={{backgroundColor: idx % 2 === 0 ? '#FFFFFF' : "#F2F4FB"}}>
            <Cell>{item.employeeName}</Cell>
            <Cell>{item.role}</Cell>
            <BtnsCell>
                <div>
                    <IconButton
                        style={{padding: 0}}
                        onClick={onOpenRow(item)}>
                        <ArrowDown style={
                            isOpened ? {transform: 'rotate(180deg)', transition: '0.6s ease'}
                                : {transform: 'rotate(360deg)', transition: '0.6s ease'}}
                        />
                    </IconButton>
                </div>
            </BtnsCell>
        </Row>
        {isOpened
            ? <div
                style={{
                    backgroundColor: idx % 2 === 0 ? '#FFFFFF' : "#F2F4FB",
                }}>
                <SubCellWrapper>
                    <SubCell>
                        <SubTitle>Service Book</SubTitle>
                        <SubText>{item.serviceBooks.join(', ')}</SubText>
                    </SubCell>
                </SubCellWrapper>
                <SubCellWrapper>
                    <SubCellFlex>
                        <SubTitle style={{marginBottom: 0}}>On Schedule</SubTitle>
                        <SwitcherWrapper>
                            <SwitcherLabel>NO</SwitcherLabel>
                            <Switch
                                disabled={disabledDate}
                                onChange={handleSwitch(item)}
                                checked={item.isOnSchedule}
                                color="primary"
                            />
                            <SwitcherLabel>YES</SwitcherLabel>
                        </SwitcherWrapper>
                    </SubCellFlex>
                </SubCellWrapper>
                <SubCellWrapper style={{paddingBottom: 36, paddingTop: 12}}>
                    <TimeBlock
                        onTimeChange={onTimeChange}
                        el={item}
                        schedule={schedule}
                        disabledDate={disabledDate}
                        formIsChecked={formIsChecked}/>
                </SubCellWrapper>
            </div>
            : null}
    </>
};

export default EmployeeTableRow;