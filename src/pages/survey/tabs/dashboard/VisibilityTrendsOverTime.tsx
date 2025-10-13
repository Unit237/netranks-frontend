import { Box } from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { LineChart } from '@mui/x-charts/LineChart';
import dayjs from 'dayjs';
import * as React from 'react';

function AreaGradient({ color, id }: { color: string; id: string }) {
    return (
        <defs>
            <linearGradient id={id} x1="50%" y1="0%" x2="50%" y2="100%">
                <stop offset="0%" stopColor={color} stopOpacity={0.5} />
                <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
        </defs>
    );
}

export default function VisibilityTrendsOverTime({ survey }) {
    const theme = useTheme();

    const colorPalette = [
        theme.palette.primary.light,
        theme.palette.primary.main,
        theme.palette.primary.dark,
    ];

    return (
        <Card sx={{ width: '100%', mb: 2 }}>
            <CardContent>
                <Typography component="h2" variant="subtitle2" gutterBottom>
                    Visibility Trends Over Time
                </Typography>
                {(!survey.FilteredBrand || !survey.VisibilityTrendsOverTime) ? (
                    <Typography variant='caption' style={{ opacity: 0.5 }}>
                        Choose a brand from the filter panel above this page to track
                    </Typography>
                ) : (
                    <>
                        <LineChart
                            colors={colorPalette}
                            xAxis={[
                                {
                                    scaleType: 'point',
                                    data: survey.VisibilityTrendsOverTime.map(x => dayjs(x.Date).format("DD MMM YYYY")),
                                    tickInterval: (index, i) => (i + 1) % 5 === 0,
                                    height: 24,
                                },
                            ]}
                            yAxis={[{ width: 50 }]}

                            series={[
                                {
                                    id: 'organic',
                                    label: survey.FilteredBrand.Name,
                                    showMark: true,
                                    curve: 'linear',
                                    stack: 'total',
                                    stackOrder: 'ascending',
                                    data: survey.VisibilityTrendsOverTime.map(x => parseInt(100 * x.NumberOfAnswersMentioningThisBrand / x.TotalNumberOfAnswers)),
                                    area: true,
                                },
                            ]}
                            height={250}
                            margin={{ left: 0, right: 20, top: 20, bottom: 0 }}
                            grid={{ horizontal: true }}
                            sx={{
                                '& .MuiAreaElement-series-organic': {
                                    fill: "url('#organic')",
                                },
                            }}
                            hideLegend
                        >
                            <AreaGradient color={theme.palette.primary.dark} id="organic" />
                        </LineChart>
                        <Box sx={{ m: 2 }}>
                            <Typography variant='caption' style={{ opacity: 0.5 }}>
                                This chart displays time series visibility score percentages for <b><u>{survey.FilteredBrand.Name}</u></b> showing in this survey.
                            </Typography>
                        </Box>
                    </>
                )}
            </CardContent>
        </Card>
    );
}
