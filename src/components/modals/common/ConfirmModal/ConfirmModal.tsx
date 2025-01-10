import React, { useCallback, useState } from "react";
import { Divider, Grid } from "@mui/material";
import {
  BaseModal,
  DialogContent,
  DialogTitle,
} from "../../BaseModal/BaseModal";
import { useSelector } from "react-redux";
import { RootState } from "../../../../store/rootReducer";
import { ReportProblemOutlined } from "@mui/icons-material";
import { LoadingButton } from "../../../buttons/LoadingButton/LoadingButton";
import { useConfirm } from "../../../../hooks/useConfirm/useConfirm";
import { MainButtons } from "./MainButtons/MainButtons";
import { ButtonsWrapper, useStyles } from "./styles";

export const ConfirmModal: React.FC<
  React.PropsWithChildren<React.PropsWithChildren<unknown>>
> = () => {
  const { open, payload } = useSelector(
    (state: RootState) => state.modals.confirm,
  );
  const [loading, setLoading] = useState<boolean>(false);
  const { closeConfirm } = useConfirm();
  const { classes } = useStyles();

  const onClose = useCallback(async () => {
    if (payload?.onCancel) {
      setLoading(true);
      try {
        await payload.onCancel();
      } catch (e) {
        console.log("on cancel error", e);
      } finally {
        setLoading(false);
      }
    }
    closeConfirm();
  }, [payload, closeConfirm]);

  const onConfirm = useCallback(async () => {
    if (payload?.onConfirm) {
      setLoading(true);
      try {
        await payload.onConfirm();
      } catch (e) {
        console.log("on confirm error", e);
      } finally {
        setLoading(false);
      }
    }
    closeConfirm();
  }, [payload, closeConfirm]);

  if (!payload) return null;

  return (
    <BaseModal width={payload?.width ?? 400} open={open} onClose={closeConfirm}>
      <DialogTitle onClose={closeConfirm}>
        {payload.icon || payload.isRemove ? (
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={2}>
              {payload.icon || (
                <ReportProblemOutlined
                  fontSize="large"
                  color={payload.isBooking ? "error" : "secondary"}
                />
              )}
            </Grid>
            <Grid
              item
              xs={10}
              className={
                payload.isBooking ? classes.titleBooking : classes.titleAdmin
              }
            >
              {payload.title}
            </Grid>
          </Grid>
        ) : (
          payload.title
        )}
      </DialogTitle>
      {payload.content ? (
        <DialogContent>{payload.content}</DialogContent>
      ) : null}
      {payload.isRemove && !payload.isBooking ? (
        <Divider style={{ margin: "0 0 10px" }} />
      ) : null}
      <ButtonsWrapper
        style={{
          justifyContent:
            payload.additionalContent && payload.onAdditional
              ? "space-between"
              : "flex-end",
        }}
      >
        {payload.additionalContent && payload.onAdditional ? (
          <LoadingButton
            loading={loading}
            onClick={payload.onAdditional}
            color={payload.isBooking ? "error" : "secondary"}
            style={payload.isBooking ? { borderRadius: 0 } : {}}
            variant="text"
          >
            {payload.additionalContent}
          </LoadingButton>
        ) : null}

        {payload.additionalContent && payload.onAdditional ? (
          <div className={classes.buttonsWrapper}>
            <MainButtons
              loading={loading}
              onClose={onClose}
              onConfirm={onConfirm}
              isRemove={payload.isRemove}
              onCancel={payload.onCancel}
              confirmContent={payload.confirmContent}
              cancelContent={payload.cancelContent}
              isBooking={payload.isBooking}
              cancelBtnVariant={payload.cancelBtnVariant}
            />
          </div>
        ) : (
          <MainButtons
            loading={loading}
            onClose={onClose}
            onConfirm={onConfirm}
            isRemove={payload.isRemove}
            onCancel={payload.onCancel}
            isBooking={payload.isBooking}
            confirmContent={payload.confirmContent}
            cancelContent={payload.cancelContent}
          />
        )}
      </ButtonsWrapper>
    </BaseModal>
  );
};
