import { TReviewOption } from "./types";

type TMap = {
  [key in TReviewOption]: string;
};
export const ReviewStatusMap: TMap = {
  Confirmed: "Confirmed",
  "Not Reviewed": "NotReviewed",
  Override: "Overriden",
};
