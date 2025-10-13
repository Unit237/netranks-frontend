import { Box, Stack, TextField, Typography } from "@mui/material";
import React from "react";
import { money } from "../../util/stringUtils";
import { ContinueButton } from "./NewSurvey";
import { QuestionsTable } from "./questions/EditQuestions";

const width = { xs: "100%", sm: 600 };

export default function NewSurveySummary({ newSurvey, setNewSurvey, onContinue, isTheLastStep, isSubmitting }) {

    return (
        <Stack sx={{ width, pb: 20 }}>

            <Header text="Survey Name" />
            <TextField
                value={newSurvey.Name}
                onChange={e => setNewSurvey(oldSurvey => ({ ...oldSurvey, Name: e.target.value }))}
                fullWidth
            />

            <Box sx={{ my: 5 }} />

            <Header text="Questions" />
            <QuestionsTable
                questions={newSurvey.Questions}
                setQuestions={undefined}
            />

            <Box sx={{ my: 5 }} />

            <Header text="Schedule" />
            <Typography>
                {newSurvey.ScheduleName}
            </Typography>

            <Box sx={{ my: 5 }} />

            <Header text="Cost" />
            <Typography>
                {money(newSurvey.MontlyCost)} {newSurvey.MontlyCost ? "per month" : ""}
            </Typography>

            <Box sx={{ my: 5 }} />

            <ContinueButton
                isTheLastStep={isTheLastStep}
                isSubmitting={isSubmitting}
                onContinue={onContinue}
            />
        </Stack>
    );
}

function Header({ text }) {
    return (
        <Typography variant="h4" sx={{ mb: 3, borderBottomWidth: 0, borderBottomColor: "gray", borderBottomStyle: "outset" }}>
            {text}
        </Typography>
    );
}