import { Grid, ThemeProvider, StyledEngineProvider } from "@mui/material";
import React from "react";
import { LoginSideBar } from "./LoginSideBar/LoginSideBar";
import { loginTheme } from "../../../theme/theme";
import LoginRoutes from "../../../routes/LoginRoutes/LoginRoutes";

export const Login = () => {
  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={loginTheme}>
        <Grid
          container
          alignItems="stretch"
          style={{ height: "100%", background: "#ffffff" }}
        >
          <Grid item xs={12} sm={4}>
            <LoginSideBar />
          </Grid>
          <Grid item xs={12} sm={8} style={{ justifyContent: "center" }}>
            <Grid
              container
              alignItems="center"
              justifyContent="center"
              style={{ height: "100%" }}
            >
              <Grid item xs={10} sm={10} md={6} style={{ padding: "16px 0" }}>
                <LoginRoutes />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </ThemeProvider>
    </StyledEngineProvider>
  );
};
