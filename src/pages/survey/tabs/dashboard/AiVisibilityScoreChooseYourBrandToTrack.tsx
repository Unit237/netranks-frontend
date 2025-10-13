import { Grid, LinearProgress, linearProgressClasses } from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import * as React from 'react';
import prms from '../../../../util/prms';


export default function AiVisibilityScoreChooseYourBrandToTrack({ survey }) {

    const visibilityScore = survey.VisibilityScore;

    return (
        <Card sx={{ display: 'flex', flexDirection: 'column', gap: '8px', flexGrow: 1, mb: 2 }}>
            <CardContent>
                <Typography component="h2" variant="subtitle2" mb={2}>
                    AI Visibility Score
                </Typography>
                <Grid container spacing={2} columns={12} sx={{ mb: (theme) => theme.spacing(2) }}>
                    {visibilityScore == null ? (
                        <Typography variant='caption' style={{ opacity: 0.5 }}>
                            Choose a brand from the filter panel above this page to track
                        </Typography>
                    ) : (
                        <>
                            <Typography variant='h1' sx={{ color: prms.Colors.Blue }}>
                                {parseInt(visibilityScore * 100)}%
                            </Typography>
                            <br />
                            <Typography variant='caption' style={{ opacity: 0.5 }}>
                                Your average AI visibility score based on the recent surveys.
                            </Typography>
                        </>
                    )}
                </Grid>
            </CardContent>
        </Card>
    );
}
