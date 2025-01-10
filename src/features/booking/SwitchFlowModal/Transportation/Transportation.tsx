import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import {
  MenuItem,
  Select,
  SelectChangeEvent,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { RootState } from "../../../../store/rootReducer";
import { useStyles } from "../styles";
import { ITransportation } from "../../../../api/types";
import { ETransportationType } from "../../../../store/reducers/transportationNeeds/types";
import useGetTransportationsData from "../../../../hooks/useGetTransportationsData/useGetTransportationsData";
import { Api } from "../../../../api/ApiEndpoints/ApiEndpoints";
import { Loading } from "../../../../components/wrappers/Loading/Loading";

type TProps = {
  selectedTransportation: ITransportation | null;
  setSelectedTransportation: Dispatch<SetStateAction<ITransportation | null>>;
  isTransportationAvailable: boolean;
};

const Transportation: React.FC<TProps> = ({
  selectedTransportation,
  setSelectedTransportation,
  isTransportationAvailable,
}) => {
  const { transportation, isTransportationsLoading, serviceTypeOption } =
    useSelector((state: RootState) => state.appointmentFrame);
  const [transportationsList, setTransportationsList] = useState<
    ITransportation[]
  >([]);
  const [isLoading, setLoading] = useState<boolean>(false);
  const { t } = useTranslation();
  const { classes } = useStyles();
  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.down("mdl"));
  const requestData = useGetTransportationsData();

  useEffect(() => {
    if (requestData) {
      setLoading(true);
      Api.call<ITransportation[]>(
        Api.endpoints.TransportationOptions.GetActive,
        { data: requestData },
      )
        .then(({ data }) => {
          const list = data.filter(
            (el) => el.type !== ETransportationType.PickUpDelivery,
          );
          setTransportationsList(list);
          const currentTransportation = list.find(
            (el) => el.id === transportation?.id,
          );
          if (currentTransportation && !serviceTypeOption?.transportationOption)
            setSelectedTransportation(currentTransportation);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [requestData, transportation, serviceTypeOption]);

  const handleChange = (e: SelectChangeEvent<unknown>) => {
    const selected = transportationsList.find(
      (item) => item.id === e.target.value,
    );
    setSelectedTransportation(selected ?? null);
  };

  return isTransportationAvailable ? (
    isLoading ? (
      <Loading />
    ) : (
      <div style={isSm ? { marginBottom: 4 } : {}}>
        <div className={classes.label}>{t("Transportation")}</div>
        <Select
          value={selectedTransportation?.id ?? ""}
          className={classes.select}
          variant="standard"
          style={{ color: selectedTransportation ? "inherit" : "#858585" }}
          disableUnderline
          displayEmpty
          fullWidth={isSm}
          disabled={isTransportationsLoading}
          onChange={handleChange}
        >
          <MenuItem value="" key="empty" disabled>
            Select Transportation
          </MenuItem>
          {transportationsList.map((item) => (
            <MenuItem value={item.id} key={item.name}>
              {item.description}
            </MenuItem>
          ))}
        </Select>
      </div>
    )
  ) : null;
};

export default Transportation;
