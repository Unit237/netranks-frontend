import * as React from "react";
import { Box, Typography, Stack, Paper, useTheme, alpha, useColorScheme } from "@mui/material";

export default function ExistingPaymentMethod({ paymentMethod }) {
    const isDarkMode = useColorScheme().colorScheme == "dark";

    return (
        <SimpleCreditCard
            variant={isDarkMode ? "dark" : "light"}
            DisplayBrand={paymentMethod.DisplayBrand}
            Last4={paymentMethod.Last4}
            ExpMonth={paymentMethod.ExpMonth}
            ExpYear={paymentMethod.ExpYear}
        />
    );
}

export interface SimpleCardProps {
    /** e.g., "Visa", "Mastercard", "Amex" — straight from your backend */
    DisplayBrand: string;
    /** object with Last4 available as Last4 */
    Last4: string;
    /** numeric or string month (1-12) */
    ExpMonth: number | string;
    /** 2- or 4-digit year */
    ExpYear: number | string;
    /** width in px (height preserves card ratio) */
    width?: number;
    /** simple color style */
    variant?: "light" | "dark";
}

const formatMonth = (m: number | string) => String(m).padStart(2, "0");
const formatYear = (y: number | string) => {
    const s = String(y);
    return s.length === 2 ? s : s.slice(-2);
};

/**
 * Minimal, dependency-light credit card display for read-only info.
 * Designed for the fields: DisplayBrand, Last4, ExpMonth, ExpYear
 */
function SimpleCreditCard({
    DisplayBrand,
    Last4,
    ExpMonth,
    ExpYear,
    width = 320,
    variant = "dark",
}: SimpleCardProps) {
    const theme = useTheme();
    const height = Math.round(width / 1.586);
    const isDark = variant === "dark";

    const bg = isDark
        ? `linear-gradient(135deg, ${alpha(theme.palette.grey[900], 0.95)} 0%, ${alpha(
            theme.palette.primary.dark,
            0.9
        )} 100%)`
        : `linear-gradient(135deg, ${alpha(theme.palette.common.white, 0.95)} 0%, ${alpha(
            theme.palette.primary.light,
            0.4
        )} 100%)`;

    const color = isDark ? theme.palette.common.white : theme.palette.text.primary;
    const subtle = isDark ? alpha("#fff", 0.75) : alpha(theme.palette.text.primary, 0.6);

    return (
        <Paper
            elevation={6}
            sx={{
                width,
                height,
                borderRadius: 3,
                p: 2.25,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                overflow: "hidden",
                bgcolor: "transparent",
                color,
                backgroundImage: bg,
            }}
        >
            {/* Top: Brand */}
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                <Typography variant="subtitle2" sx={{ opacity: 0.85 }}>
                    {DisplayBrand || "Card"}
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.65 }}>
                    •••• {Last4 || "0000"}
                </Typography>
            </Stack>

            {/* Middle: Number (last 4 only) */}
            <Box>
                <Typography
                    variant="h5"
                    letterSpacing={2}
                    fontFamily="ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace"
                    sx={{ userSelect: "none" }}
                >
                    •••• •••• •••• {Last4 || "0000"}
                </Typography>
            </Box>

            {/* Bottom: Expiry */}
            <Stack direction="row" justifyContent="space-between" alignItems="flex-end">
                <Box />
                <Stack spacing={0.25} alignItems="flex-end">
                    <Typography variant="caption" sx={{ color: subtle }}>VALID THRU</Typography>
                    <Typography variant="subtitle1" fontWeight={700}>
                        {formatMonth(ExpMonth)}/{formatYear(ExpYear)}
                    </Typography>
                </Stack>
            </Stack>
        </Paper>
    );
}
