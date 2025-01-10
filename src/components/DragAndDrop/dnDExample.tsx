import React, { useState } from "react";
import { TItem } from "./types";
import DragAndDrop from "./DragAndDrop";

const style = {
  padding: 12,
  backgroundColor: "#F7F8FB",
  border: "1px solid #DADADA",
  width: 240,
  height: "100%",
};

const mockData: TItem[] = [
  { id: 1, text: "1111111" },
  { id: 2, text: "2222222" },
  { id: 3, text: "3333333" },
  { id: 4, text: "44444444" },
];

const DnDExample = () => {
  const [data, setData] = useState<TItem[]>(mockData);
  return <DragAndDrop data={data} setData={setData} style={style} />;
};

export default DnDExample;
