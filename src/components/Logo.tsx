import React from "react";
import { useColorScheme } from "@mui/material";

export default function Logo({ height = 65 }) {
    const src = useColorScheme().colorScheme == "dark"
        ? "/logo-dark.svg"
        : "/logo-light.svg";

    return (
        <img src={src} style={{ height }} />
    );
}