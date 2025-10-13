import { CircularProgress, Radio, Typography } from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import React, { useEffect, useRef, useState } from 'react';
import { money } from '../../../util/stringUtils';
import { ContinueButton } from '../NewSurvey';
import { Toast } from '../../../components/Toast';
import { Confirm } from '../../../components/Confirm';

// TODO: make schedule table dynamic
const rows = [
    { period: 24 * 0, name: 'One Time', cost: 0 },
    { period: 24 * 7, name: 'Weekly', cost: 200, default: true },
    { period: 24 * 1, name: 'Daily', cost: 1200 },
];

const width = { xs: "100%", sm: 600 };

export default function NewSurveySchedule({ newSurvey, setNewSurvey, onContinue = null, onChange = null }) {

    const toast = useRef(undefined);
    const confirm = useRef(undefined);
    const [changing, setChanging] = useState(false);

    useEffect(() => {
        if (newSurvey.SchedulePeriodHours == null) {
            const def = rows.filter(x => x.default)[0];
            handleSelect(def);
        }
    }, [newSurvey]);

    const handleSelect = async x => {

        if (!onChange) {
            select(x);
            return;
        }
        confirm.current.show(
            "Change Survey Schedule",
            "Are you sure you want to change the survey schedule?",
            async () => {
                setChanging(true);
                try {
                    await onChange(x.period);
                    select(x);
                    toast.current.show("success", "Successfully changed the survey schedule");
                } catch (error) {
                    toast.current.show("error", "Failed to change the survey schedule. " + "<br />" + error?.data);
                    return;
                } finally {
                    setChanging(false);
                }
            }
        );
    }

    const select = x => {
        setNewSurvey(oldSurvey => ({
            ...oldSurvey,
            SchedulePeriodHours: x.period,
            ScheduleName: x.name,
            MontlyCost: x.cost,
        }));
    }

    return (
        <>
            {changing ? (
                <>
                    <CircularProgress color='inherit' size={40} />
                    <Typography variant='h6'>
                        Changing the survey schedule
                    </Typography>
                </>
            ) : (
                <>
                    <TableContainer sx={{ width }}>
                        <Table aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>&nbsp;</TableCell>
                                    <TableCell>Schedule</TableCell>
                                    <TableCell align="right">Montly Cost</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {rows.map(x => (
                                    <TableRow
                                        hover
                                        key={x.period}
                                        sx={{ cursor: "pointer", '&:last-child td, &:last-child th': { border: 0 } }}
                                        onClick={() => handleSelect(x)}
                                    >
                                        <TableCell align="right">
                                            <Radio checked={newSurvey.SchedulePeriodHours == x.period} />
                                        </TableCell>
                                        <TableCell component="th" scope="row">
                                            {x.name}
                                        </TableCell>
                                        <TableCell align="right">
                                            {money(x.cost)}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    {onContinue && (
                        <ContinueButton onContinue={onContinue} />
                    )}
                </>
            )}

            <Toast ref={toast} />
            <Confirm ref={confirm} />
        </>
    );
}
