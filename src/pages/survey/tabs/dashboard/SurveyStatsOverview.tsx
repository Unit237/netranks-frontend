import { Grid, LinearProgress, Tooltip } from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import * as React from 'react';
import prms from '../../../../util/prms';

export default function SurveyStatsOverview({ survey }) {

  const {
    QueriesRun,
    PromptVariations,
    BrandsIdentified,
    SurveyDepth
  } = survey.SurveyStatsOverview;

  const surveyDepth = Math.round(100 * SurveyDepth);

  const data = [
    { title: "QUERIES RUN", value: QueriesRun },
    { title: "PROMPT VARIATIONS", value: PromptVariations },
    { title: "BRANDS IDENTIFIED", value: BrandsIdentified },
    { title: "SURVEY DEPTH", value: surveyDepth + "%", progress: surveyDepth, tooltip: "Survey’s depth is defined by the number of questions asked per prompt, number of search engines scanned, the deeper the survey, the less noise the rankings have." },
  ]

  return (
    <Card sx={{ display: 'flex', flexDirection: 'column', gap: '8px', flexGrow: 1, mb: 2 }}>
      <CardContent>
        <Typography component="h2" variant="subtitle2" mb={2}>
          Survey Stats Overview
        </Typography>
        <Grid container spacing={2} columns={12} sx={{ mb: (theme) => theme.spacing(2) }}>
          {data.map((x, i) => (
            <Grid key={i} size={{ xs: 6 }}>
              <Tooltip arrow title={x.tooltip}>
                <Card variant='outlined'>
                  <CardContent>
                    <Typography variant='h6' style={{ color: prms.Colors.Blue }}>
                      {x.value}
                    </Typography>
                    <Typography variant='caption' style={{ opacity: 0.5 }}>
                      {x.title}
                    </Typography>
                    {x.progress && (
                      <LinearProgress value={x.progress} valueBuffer={100} variant='buffer' />
                    )}
                  </CardContent>
                </Card>
              </Tooltip>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
}
