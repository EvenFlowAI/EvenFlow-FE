import { styled, TableCell, TableRow } from "@mui/material";

export const StyledScheduleCell = styled(TableCell)({
  borderBottom: "none",
  fontSize: 16,
});

export const Wrapper = styled("div")({
  padding: 16,
});

export const ScheduleEmployeeTitleWrapper = styled("div")({
  padding: 16,
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
});

export const ScheduleEmployeeFiltersWrapper = styled("div")({
  display: "flex",
  alignItems: "flex-end",
  justifyContent: "space-between",
  width: "65%",
  "& > div": {
    width: "100%",
  },
  "& > div:not(:last-child)": {
    marginRight: 20,
  },
});

export const ScheduleTableTitle = styled("h4")({
  fontWeight: 400,
  margin: 0,
  fontSize: 18,
});

export const ScheduleTableHeaderRow = styled(TableRow)({
  borderBottom: "1px solid #DADADA",
  borderTop: "1px solid #DADADA",
});

export const ScheduleTableFooterRow = styled(TableRow)({
  borderTop: "1px solid #858585",
});

export const ScheduleTableTotalCell = styled(StyledScheduleCell)({
  fontWeight: "bold",
  color: "#252733",
});

export const ScheduleTableHeaderCell = styled(StyledScheduleCell)({
  color: "#252733",
  fontSize: 12,
  textTransform: "uppercase",
  fontWeight: "bold",
});

export const ScheduleDayNameCell = styled(StyledScheduleCell)({
  color: "#858585",
  textTransform: "uppercase",
  fontWeight: "bold",
  fontSize: 12,
});

export const ScheduleDataCell = styled(StyledScheduleCell)({
  color: "#7898FF",
  cursor: "pointer",
});

export const DisabledDataCell = styled(StyledScheduleCell)({
  color: "#858585",
});
