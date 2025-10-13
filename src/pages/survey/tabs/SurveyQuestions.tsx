import { Stack } from "@mui/material";
import React from "react";
import { AddNewQuestion, QuestionsTable } from "../../new-survey/questions/EditQuestions";

export default function SurveyQuestions({ survey, setSurvey }) {

    const questions = survey.Questions;
    const setQuestions = Questions => setSurvey(oldSurvey => ({ ...oldSurvey, Questions }))

    return (
        <Stack spacing={3} sx={{ alignItems: "center" }}>
            <QuestionsTable
                questions={questions}
                setQuestions={setQuestions}
                showClearAllQuestionsButton={false}
            />
            <AddNewQuestion
                surveyId={survey.Id}
                questions={questions}
                setQuestions={setQuestions}
            />
        </Stack>
    );
}