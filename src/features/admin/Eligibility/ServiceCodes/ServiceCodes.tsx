import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../store/rootReducer";
import {
  changeSRPrisingDisplayType,
  loadSrList,
} from "../../../../store/reducers/pricingSettings/actions";
import { NoItemsLoading } from "../../../../components/wrappers/NoItemsLoading/NoItemsLoading";
import { TableBody, TableHead, Radio } from "@mui/material";
import { EPricingDisplayType } from "../../../../store/reducers/pricingSettings/types";
import { headCellStyles, leftAlign } from "../styles";
import { DenseTableWithPadding } from "../../../../components/styled/DemandTable";
import { TableRow } from "../../../../components/styled/TableRow";
import { useException } from "../../../../hooks/useException/useException";
import { useSCs } from "../../../../hooks/useSCs/useSCs";
import {
  PricesCell,
  RadioBtn,
  RadioGroupStyled,
  StyledTableCell,
  SubHeaderCell,
  SubHeaderTitle,
} from "../EligibilityStatuses/styles";

export const ServiceCodes = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const srList = useSelector(
    (state: RootState) => state.pricingSettings.srList,
  );

  const showError = useException();
  const { selectedSC } = useSCs();
  const dispatch = useDispatch();

  useEffect(() => {
    if (selectedSC) {
      try {
        setLoading(true);
        dispatch(loadSrList(selectedSC.id));
      } finally {
        setLoading(false);
      }
    }
  }, [dispatch, selectedSC]);

  const handlePricingDisplayType =
    (id: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.value && selectedSC) {
        dispatch(
          changeSRPrisingDisplayType(id, +e.target.value, selectedSC.id, (e) =>
            showError(e),
          ),
        );
      }
    };

  return (
    <div>
      <NoItemsLoading items={srList} loading={loading} />
      {srList.length ? (
        <DenseTableWithPadding>
          <TableHead style={{ borderBottom: "none" }}>
            <TableRow>
              <StyledTableCell
                width={230}
                style={{
                  ...headCellStyles,
                  ...leftAlign,
                  textTransform: "capitalize",
                }}
              >
                Op Code
              </StyledTableCell>
              <StyledTableCell
                style={{
                  ...headCellStyles,
                  ...leftAlign,
                  textTransform: "capitalize",
                }}
              >
                Description
              </StyledTableCell>
              <PricesCell
                style={{ ...headCellStyles, textTransform: "capitalize" }}
                width={335}
              >
                <SubHeaderTitle>
                  Pricing optimization configuration
                </SubHeaderTitle>
                <SubHeaderCell>
                  <span>Suppressed</span>
                  <span>Static</span>
                  <span>Dynamic</span>
                </SubHeaderCell>
              </PricesCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {srList.map((el) => {
              return (
                <TableRow key={el.id}>
                  <StyledTableCell style={leftAlign}>
                    {el.serviceRequest.code}
                  </StyledTableCell>
                  <StyledTableCell style={leftAlign}>
                    {el.serviceRequestOverride?.description ||
                      el.serviceRequest.description}
                  </StyledTableCell>
                  <PricesCell>
                    <RadioGroupStyled
                      row
                      value={el.pricingDisplayType}
                      onChange={handlePricingDisplayType(el.id)}
                      aria-labelledby="demo-controlled-radio-buttons-group"
                      name="controlled-radio-buttons-group"
                    >
                      <RadioBtn
                        value={EPricingDisplayType.Suppressed}
                        control={<Radio color="primary" size="small" />}
                        label=""
                      />
                      <RadioBtn
                        value={EPricingDisplayType.Static}
                        control={<Radio color="primary" size="small" />}
                        label=""
                      />
                      <RadioBtn
                        value={EPricingDisplayType.Dynamic}
                        control={<Radio color="primary" size="small" />}
                        label=""
                      />
                    </RadioGroupStyled>
                  </PricesCell>
                </TableRow>
              );
            })}
          </TableBody>
        </DenseTableWithPadding>
      ) : null}
    </div>
  );
};
