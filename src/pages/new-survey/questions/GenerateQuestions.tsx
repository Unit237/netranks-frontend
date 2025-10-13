
import { Link } from '@mui/material';
import React, { useState } from 'react';
import GenerateQuestionsFromBrand from './GenerateQuestionsFromBrand';
import GenerateQuestionsFromQuery from './GenerateQuestionsFromQuery';

export default function GenerateQuestions({ onQuestionsGenerated }) {
    const [isFromQuery, setIsFromQuery] = useState(true); // false -> from brand

    const Component = isFromQuery
        ? GenerateQuestionsFromQuery
        : GenerateQuestionsFromBrand;

    return (
        <Component
            onQuestionsGenerated={onQuestionsGenerated}
            handleSwitch={() => setIsFromQuery(x => !x)}
        />
    );
}