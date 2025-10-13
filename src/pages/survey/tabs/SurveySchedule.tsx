import { Box, Divider, Stack, Typography } from "@mui/material";
import dayjs from 'dayjs';
import React, { useState } from "react";
import connection from "../../../util/connection";
import NewSurveySchedule from "../../new-survey/schedule/NewSurveySchedule";

export default function SurveySchedule({ survey, setSurvey }) {

    const [changing, setChanging] = useState(false);

    const handleChange = async x => {
        const NextRunAt = await connection(setChanging).patch(survey.Id, "api/ChangeSurveySchedule", x);
        setSurvey(oldSurvey => ({ ...oldSurvey, NextRunAt }));
    }

    return (
        <Stack spacing={3} sx={{ alignItems: "center" }}>
            <NewSurveySchedule
                newSurvey={survey}
                setNewSurvey={setSurvey}
                onChange={handleChange}
            />
            {!changing && survey.NextRunAt && (
                <Box justifyContent="center" alignItems="center">
                    <Typography variant="caption" align="center" sx={{ color: "gray" }}>
                        Survey is scheduled to run next at
                    </Typography>
                    <Divider />
                    <Typography variant="h6" align="center">
                        {dayjs(survey.NextRunAt).format("DD MMMM YYYY")}
                        <br />
                        {dayjs(survey.NextRunAt).format("dddd")}
                        <br />
                        {dayjs(survey.NextRunAt).format("HH:mm")}
                    </Typography>
                </Box>
            )}
        </Stack>
    );
}