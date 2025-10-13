import { Box, CircularProgress, LinearProgress, Typography } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { useLoaderData, useNavigate } from "react-router-dom";
import connection from "../../../../util/connection";
import keys from "../../../../util/keys";
import { useActiveProject } from "../../../../util/user";

export default function InitialRun({ reload, toast }) {
    const navigate = useNavigate();
    const survey = useLoaderData();
    const activeProject = useActiveProject();

    const [isFinished, setIsFinished] = useState(false);
    const timeoutId = useRef<number>(undefined);
    const [buffer, setBuffer] = useState(0);
    const [progress, setProgress] = useState(0);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        tick();
        return () => {
            if (timeoutId.current) {
                clearTimeout(timeoutId.current);
            }
        };
    }, [survey]);

    const tick = async () => {
        setIsFinished(false);
        if (survey.RunCount > 1 || !survey.CurrentlyRunningSurveyRunId) {
            setIsFinished(true);
            return;
        }

        try {
            var surveyRun = await connection().get(`api/GetSurveyRun/${survey.CurrentlyRunningSurveyRunId}/${survey.PasswordOne}/${survey.PasswordTwo}`);

            const p = surveyRun.Progress;
            const total = p.Total - p.Failed;
            setBuffer(100 * (p.Asked / total));
            setProgress(100 * (p.Finished / total))
            setTotal(total);

            if (p.Finished > 0) {
                await reload(); // TODO: fix race condition this reload might reload the previuous survey if the active survey changes meantime
            }

            if (p.Finished < total) {
                timeoutId.current = setTimeout(tick, 1500);
            } else {
                toast.current.show("success", "Initial survey run is complete");
                setIsFinished(true);
                // reload page to update survey CurrentlyRunningSurveyRunId fields
                navigate(keys.routes.Survey(activeProject.Id, survey.Id), { replace: true });
            }
        } catch (error) {
            console.error("Failed to get survey run progress", error);
            timeoutId.current = setTimeout(tick, 3000);
        }
    }


    if (isFinished) {
        return null;
    }

    return (
        <Box display="flex" flexDirection="column" alignItems="center" m={2} my={10} gap={4}>
            <Typography variant="h4" align='center'>
                Please wait for inital run to be complete to see the results
            </Typography>
            {buffer == 0 ? (
                <CircularProgress color="inherit" size={20} />
            ) : (
                <>
                    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                        <CircularProgress variant="determinate" value={progress} />
                        <Box
                            sx={{
                                top: 0,
                                left: 0,
                                bottom: 0,
                                right: 0,
                                position: 'absolute',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <Typography
                                variant="caption"
                                component="div"
                                sx={{ color: 'text.secondary' }}
                            >{`${Math.round(progress)}%`}</Typography>
                        </Box>
                    </Box>

                    <LinearProgress
                        value={progress}
                        valueBuffer={buffer}
                        variant="buffer"
                        style={{ width: "100%", maxWidth: 500, height: 20, borderRadius: 30 }}
                    ></LinearProgress>
                </>
            )}
        </Box>
    );
}