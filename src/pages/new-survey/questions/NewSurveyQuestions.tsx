
import React from 'react';
import GenerateQuestions from './GenerateQuestions';
import EditQuestions from './EditQuestions';


export default function NewSurveyQuestions({ newSurvey, setNewSurvey, onContinue }) {
    if (!newSurvey.Questions?.length) {
        return (
            <GenerateQuestions
                onQuestionsGenerated={newSurveyDto => {
                    setNewSurvey(oldSurvey => ({
                        ...oldSurvey,
                        ...newSurveyDto,
                        Name: newSurveyDto.DescriptionOfTheQuestionShort ?? newSurveyDto.DescriptionOfTheBrandShort
                    }));
                }}
            />
        );
    }

    return (
        <EditQuestions
            newSurvey={newSurvey}
            setNewSurvey={setNewSurvey}
            onContinue={onContinue}
        />
    )
}

