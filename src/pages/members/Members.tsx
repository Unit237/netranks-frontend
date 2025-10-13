import { Box } from "@mui/material";
import React from "react";
import AddMember from "./AddMember";
import MembersTable from "./MembersTable";

export default function Members() {
    return (
        <>
            <MembersTable />

            <Box sx={{ p: 2 }} />

            <AddMember />
        </>
    );
}

