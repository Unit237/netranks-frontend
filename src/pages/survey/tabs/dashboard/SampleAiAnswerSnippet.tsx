import { CircularProgress, Pagination, Paper, Slide, Stack } from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import React, { useEffect, useRef, useState } from 'react';
import Markdown from '../../../../util/Markdown';
import dayjs from 'dayjs';

const cache = {};
export default function SampleAiAnswerSnippet({ survey }) {

    const snippets = survey.SampleAiAnswerSnippets;
    const [index, setIndex] = useState(0);
    const snippet = snippets[Math.min(index, snippets.length - 1)];
    const [answer, setAnswer] = useState(null);
    const [slideDirection, setSlideDirection] = useState<"left" | "right">("left");

    useEffect(() => {
        setIndex(Math.min(index, snippets.length - 1));
    }, [snippets]);

    useEffect(() => {
        if (!snippet) {
            return;
        }
        (async () => {
            setAnswer(null);
            if (!cache[snippet.AnswerUrl]) {
                const response = await fetch(snippet.AnswerUrl, { mode: "cors" })
                cache[snippet.AnswerUrl] = await response.text();
            }
            setAnswer(cache[snippet.AnswerUrl]);
        })();
    }, [snippet]);

    const pageChange = x => {
        setIndex(x);
        setSlideDirection(index < x ? "left" : "right");
    }

    if (!snippet) {
        return null;
    }

    return (
        <Card sx={{ display: 'flex', flexDirection: 'column', gap: '8px', flexGrow: 1, mb: 2 }}>
            <CardContent>
                <Typography component="h2" variant="subtitle2" mb={2}>
                    Actual AI Answers for Survey
                </Typography>
                <Slide key={index} in direction={slideDirection} >
                    <Paper sx={{ height: 300, overflowY: answer ? "scroll" : "hidden", pr: 2 }}>
                        <Stack direction="row" justifyContent="space-between">
                            <Typography variant='h4' >
                                {snippet.Question}
                            </Typography>
                            <Stack alignItems="flex-end" sx={{ minWidth: 90 }}>
                                <Typography variant='caption'>
                                    {dayjs(snippet.Date).format("DD MMM YYYY")}
                                </Typography>
                                <Typography variant='caption' sx={{ opacity: 0.2 }}>
                                    #{snippet.Id}
                                </Typography>
                            </Stack>
                        </Stack>
                        {answer ? (
                            <Markdown content={answer} />
                        ) : (
                            <CircularProgress />
                        )}
                    </Paper>
                </Slide>
                <Stack alignItems="center" mt={2}>
                    <Pagination
                        count={snippets.length}
                        page={index + 1}
                        onChange={(e, x) => pageChange(x - 1)}
                        showFirstButton
                        showLastButton
                    />
                </Stack>
            </CardContent>
        </Card>
    );
}
