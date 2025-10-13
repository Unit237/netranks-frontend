import DeleteIcon from '@mui/icons-material/Delete';
import { CircularProgress, IconButton, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import React, { useRef, useState } from "react";
import { useLoaderData, useParams } from "react-router-dom";
import connection from "../../util/connection";
import { HubType, useHub } from '../../util/Hub';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import { Toast } from '../../components/Toast';

export default function MembersTable() {
    const toast = useRef(undefined);
    const pid = useParams().pid;
    const [members, setMembers] = useState(useLoaderData());
    const [isDeletingId, setIsDeletingId] = useState(0); // TODO: maybe allow deleting multiple members 

    useHub(HubType.MemberAdded, async () => {
        setMembers(await connection().get(`api/GetMembers/${pid}`));
    });

    const handleDelete = async x => {
        if (isDeletingId) {
            return;
        }

        setIsDeletingId(x.Id);

        try {
            await connection().delete(x.Id, "api/DeleteMember");
            setMembers(members.filter(m => m.Id != x.Id));
        } catch (error) {
            toast.current.show("error", "Failed to delete member" + "<br /><br />" + error.data);
        } finally {
            setIsDeletingId(0);
        }
    }

    return (
        <Stack sx={{ width: '90%' }} spacing={10}>
            <Typography variant='h3'>
                Members
            </Typography>

            <TableContainer>
                <Table aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>&nbsp;</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>EMail</TableCell>
                            <TableCell>Role</TableCell>
                            <TableCell>&nbsp;</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {members.map(x => (
                            <TableRow
                                key={x.Id}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}

                            >
                                <TableCell component="th" scope="row">
                                    {!x.IsActive && (
                                        <HourglassEmptyIcon titleAccess="Waiting for reply" />
                                    )}
                                </TableCell>
                                <TableCell component="th" scope="row">
                                    {x.FullName}
                                </TableCell>
                                <TableCell component="th" scope="row">
                                    {x.Email}
                                </TableCell>
                                <TableCell component="th" scope="row">
                                    {x.IsOwner ? "Owner" : x.IsEditor ? "Editor" : "Viewer"}
                                </TableCell>
                                <TableCell align="right">
                                    <IconButton title="Delete User" onClick={() => handleDelete(x)} edge="end" aria-label="delete">
                                        {isDeletingId == x.Id ? (
                                            <CircularProgress color="inherit" size={20} />
                                        ) : (
                                            <DeleteIcon />
                                        )}
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Toast ref={toast} />
        </Stack>
    );
}