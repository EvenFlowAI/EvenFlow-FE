import React, { useMemo } from "react";
import { useMediaQuery, useTheme } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { RootState } from "../../../store/rootReducer";
import { ServiceCenterSwitcher } from "../ServiceCenterSwitcher/ServiceCenterSwitcher";
import {
  frameSmStyles,
  frameStyles,
  MainWrapper,
  nonFrameStyles,
  Title,
  Wrapper,
} from "./styles";
import { useLayout } from "../../../hooks/useLayout/useLayout";

export const FrameWelcomeLayout: React.FC<
  React.PropsWithChildren<React.PropsWithChildren<{}>>
> = ({ children }) => {
  const { scProfile, isTopAligning: isTop } = useSelector(
    (state: RootState) => state.appointment,
  );
  const { welcomeScreenView } = useSelector(
    (state: RootState) => state.appointmentFrame,
  );
  const { t } = useTranslation();
  const isFrame = useLayout();
  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.down("mdl"));
  const isTopAligning = useMemo(
    () => isTop || welcomeScreenView === "serviceCenterSelect" || isSm,
    [isSm, scProfile, welcomeScreenView],
  );

  return (
    <MainWrapper style={{ height: isTopAligning ? "100%" : "100vh" }}>
      <div style={{ width: "70%" }}>
        <ServiceCenterSwitcher />
      </div>
      <div
        style={!isFrame ? nonFrameStyles : isSm ? frameSmStyles : frameStyles}
      >
        <Wrapper
          style={{
            paddingTop: isTopAligning ? 20 : "unset",
            width:
              isSm && welcomeScreenView === "serviceSelect" ? "90%" : "80%",
          }}
        >
          <div>
            <Title>
              {welcomeScreenView === "serviceCenterSelect"
                ? `${scProfile?.dealershipName} Network Service Centers`
                : t("Schedule your service")}
            </Title>
          </div>
          <div>{children}</div>
        </Wrapper>
      </div>
    </MainWrapper>
  );
};
