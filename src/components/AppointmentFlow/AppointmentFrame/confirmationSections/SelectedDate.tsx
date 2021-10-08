import React from 'react';
import {ConfirmationTitle} from "../Title";
import moment from "moment";
import {Edit} from "@material-ui/icons";
import {styled} from "@material-ui/core";
import {useSelector} from "react-redux";
import {RootState} from "../../../../store/rootReducer";
import {TCallback} from "../../../../types/types";

const TitleWrapper = styled('div')({
    display: "flex",
    alignItems: "center",
    gap: "8px",
    margin: '8px 0',
    "& svg": {
        color: "#757575"
    }
})
type TProps = {
    onChangeSlot: TCallback;
}
export const SelectedDate: React.FC<TProps> = ({onChangeSlot}) => {
    const appointment = useSelector((state: RootState) => state.appointment.appointment);
    const handleChangeSlot = () => {
        onChangeSlot();
    }
    return <div>
        <TitleWrapper>
            <ConfirmationTitle>Selected Date & Time</ConfirmationTitle>
            <Edit fontSize="small" onClick={handleChangeSlot} />
        </TitleWrapper>
        {moment.utc(appointment?.date).format('MMMM D, h:mm A')}
    </div>
};