import React from "react";

export type TTab = {
    id: string;
    label: string;
    component: React.ComponentType<React.PropsWithChildren<unknown>>
}