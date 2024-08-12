import React, {ChangeEvent} from 'react';
import {Grid} from "@mui/material";
import {ServiceBook, StyledGrid} from "./styles";
import {EAssignmentLevel, IEmployeeAssignmentSetting} from "../../../../store/reducers/employees/types";
import {TOption} from "../../ServiceBookModal/types";

type TProps = {
    isAdvisorSecondaryEnabled: boolean;
    isTechSecondaryEnabled: boolean;
    data: IEmployeeAssignmentSetting[];
    onMethodChange: (item: IEmployeeAssignmentSetting, level: EAssignmentLevel, role: "Advisor"|"Technician") =>
        (e: ChangeEvent<{}>, value: TOption|null) => void;
}

const EmployeeAssignmentMobile: React.FC<TProps> = ({
                                      isAdvisorSecondaryEnabled,
                                      data,
                                      onMethodChange,
                                      isTechSecondaryEnabled
                                  }) => {
    return (
        <Grid container>
            <StyledGrid item xs={12}>Service Book</StyledGrid>
            {data.map(item => {
                return <ServiceBook item xs={12} mdl={4}>
                    <div>{item.serviceBookName}</div>
                </ServiceBook>
            })}
        </Grid>
    );
};

export default EmployeeAssignmentMobile;