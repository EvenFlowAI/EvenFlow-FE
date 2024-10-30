import React, {useState} from 'react';
import {IScheduleByDate} from "../../../../store/reducers/schedules/types";
import {TitleRow} from "../../Employees/EmployeesTableMobile/styles";
import {Wrapper} from "./styles";
import {IHOODataForm} from "../../../../store/reducers/serviceCenters/types";
import EmployeeTableRow from "./EmployeeTableRow/EmployeeTableRow";

type TProps = {
    disabledDate: boolean;
    handleSwitch: (el: IScheduleByDate) => (e: any, value: boolean) => void;
    onTimeChange: (el: IScheduleByDate, field: "startAt" | "finishAt", value: string) => void;
    schedule: IHOODataForm|undefined;
    formIsChecked: boolean;
    currentSchedule: IScheduleByDate[];
}

const EmployeeScheduleTableMobile: React.FC<TProps> = ({
                                                           currentSchedule,
                                                           disabledDate,
                                                           handleSwitch,
                                                           onTimeChange,
                                                           schedule,
                                                           formIsChecked
                                                       }) => {
    const [expandedItem, setExpandedItem] = useState<IScheduleByDate|null>(null)
    return (
        <Wrapper>
            <TitleRow>
                <div>Employee</div>
                <div>Role</div>
            </TitleRow>
            {currentSchedule.map((item, idx) => {
                const isOpened = item.id === expandedItem?.id;
                return <EmployeeTableRow
                    item={item}
                    expandedItem={expandedItem}
                    idx={idx}
                    setExpandedItem={setExpandedItem}
                    isOpened={isOpened}
                    disabledDate={disabledDate}
                    handleSwitch={handleSwitch}
                    onTimeChange={onTimeChange}
                    schedule={schedule}
                    formIsChecked={formIsChecked}/>
            })}
        </Wrapper>
    );
};

export default EmployeeScheduleTableMobile;