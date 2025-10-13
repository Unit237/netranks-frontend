import React from "react";
import M from "react-markdown";
import remarkGfm from 'remark-gfm';
import { Box } from "@mui/material";

export default function Markdown({ content }) {

    // TODO: add light mode support for markdown table border color, currently it's always #ccc

    return (
        <Box sx={{
            "& table": { borderCollapse: "collapse" },
            "& th, & td": { border: "1px solid #ccc", padding: "6px 13px" }
        }}
        >
            <M remarkPlugins={[remarkGfm]}>
                {content}
            </M>
        </Box>
    );

}