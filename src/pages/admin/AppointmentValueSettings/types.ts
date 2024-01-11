import React from "react";

export type TTab = {
    label: string;
    id: string;
    component: React.ComponentType<{
        onTabChange?: (e: any, tab: string) => void
    }>
}