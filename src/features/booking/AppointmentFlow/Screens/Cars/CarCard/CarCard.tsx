import React from "react";
import { ILoadedVehicle } from "../../../../../../api/types";
import { useDispatch, useSelector } from "react-redux";
import { setVehicle } from "../../../../../../store/reducers/appointmentFrameReducer/actions";
import { TArgCallback } from "../../../../../../types/types";
import { RootState } from "../../../../../../store/rootReducer";
import {
  CarDataWithBtn,
  CardBtnWrapper,
  CarInfo,
  StyledButton,
  Wrapper,
} from "./styles";
import { Button, useMediaQuery, useTheme } from "@mui/material";

type TProps = {
  car: ILoadedVehicle;
  clearData: () => void;
  onSelectCar: TArgCallback<ILoadedVehicle>;
  onScheduleNewAppointment: TArgCallback<ILoadedVehicle>;
};

export const CarCard: React.FC<
  React.PropsWithChildren<React.PropsWithChildren<TProps>>
> = ({ car, clearData, onSelectCar, onScheduleNewAppointment }) => {
  const { mileage } = useSelector((state: RootState) => state.vehicleDetails);
  const dispatch = useDispatch();
  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.down("sm"));

  const onButtonClick = () => {
    clearData();
    const selectedMileage = mileage.find(
      (el) => el.value.toString() === car?.mileage?.toString(),
    );
    dispatch(setVehicle({ ...car, mileage: selectedMileage?.value ?? null }));
    onSelectCar(car);
  };

  const onSchedule = () => {
    car.appointmentHashKeys?.length
      ? onScheduleNewAppointment(car)
      : onButtonClick();
  };

  return (
    <Wrapper>
      <CarDataWithBtn>
        <CarInfo>
          {car.year} {car.make} {car.model} {car?.modelDetails ?? ""}
        </CarInfo>
      </CarDataWithBtn>
      <CardBtnWrapper>
        <Button color="info" variant="contained" onClick={onSchedule}>
          Schedule {isSm ? "Appointment" : null}
        </Button>
        <StyledButton
          onClick={onButtonClick}
          disabled={!car.appointmentHashKeys.length}
        >
          Manage {isSm ? "Appointment" : null}
        </StyledButton>
      </CardBtnWrapper>
    </Wrapper>
  );
};
