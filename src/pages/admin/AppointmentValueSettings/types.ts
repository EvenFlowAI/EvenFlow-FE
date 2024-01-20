import React from "react";

export type TTab = {
    label: string;
    id: string;
    component: React.ComponentType<React.PropsWithChildren<{
        onTabChange?: (e: any, tab: string) => void
    }>>
}