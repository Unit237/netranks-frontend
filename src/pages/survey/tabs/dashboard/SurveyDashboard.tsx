import { Box, CircularProgress, Grid, Stack } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { useLoaderData } from "react-router-dom";
import { Toast } from "../../../../components/Toast";
import connection from "../../../../util/connection";
import InitialRun from "./InitialRun";
import SampleAiAnswerSnippet from "./SampleAiAnswerSnippet";
import SurveyStatsOverview from "./SurveyStatsOverview";
import TopBrandsInAiAnswers from "./TopBrandsInAiAnswers";
import VisibilityTablePromptsAndBrandMentions from "./VisibilityTablePromptsAndBrandMentions";
import FilterPanel from "./FilterPanel";
import VisibilityTrendsOverTime from "./VisibilityTrendsOverTime";
import AiVisibilityScoreChooseYourBrandToTrack from "./AiVisibilityScoreChooseYourBrandToTrack";
import TopCitationsInAiAnswers from "./TopCitationsInAiAnswers";

export default function SurveyDashboard({ survey }) {
    const toast = useRef(undefined);
    const [loading, setLoading] = useState(false);
    const [dashboard, setDashboard] = useState(survey.Dashboard);

    useEffect(() => {
        setDashboard(survey.Dashboard);
    }, [survey]);

    const reload = async (filterDto) => {
        if (filterDto) {
            setLoading(true);
        }
        try {
            setDashboard(await connection().post(`api/GetSurveyDashboard/${survey.Id}`, filterDto));
        } catch (error) {
            console.error(error);
            toast.current.show("error", "Failed to load dashboard");
        } finally {
            setLoading(false);
        }
    }

    return (
        <Stack spacing={2} sx={{ alignItems: 'center', mx: { xs: 0, sm: 3 }, pb: 5 }}>
            <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}>
                <InitialRun reload={reload} toast={toast} />
                <Grid container spacing={2} columns={12} sx={{ mb: (theme) => theme.spacing(2) }}>
                    <Grid size={12}>
                        <FilterPanel surveyId={survey.Id} onFilter={reload} />
                    </Grid>
                    {loading ? (
                        <Grid size={12}>
                            <Stack alignItems="center" pt={20}>
                                <CircularProgress />
                            </Stack>
                        </Grid>
                    ) : (
                        <>
                            <Grid size={{ xs: 12, sm: 12, md: 8, lg: 8 }}>
                                <TopBrandsInAiAnswers survey={dashboard} />
                                <TopCitationsInAiAnswers survey={dashboard} />
                                <SampleAiAnswerSnippet survey={dashboard} />
                                <VisibilityTablePromptsAndBrandMentions survey={dashboard} />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 12, md: 4, lg: 4 }} spacing={2}>
                                <SurveyStatsOverview survey={dashboard} />
                                <VisibilityTrendsOverTime survey={dashboard} />
                                <AiVisibilityScoreChooseYourBrandToTrack survey={dashboard} />
                            </Grid>
                        </>
                    )}
                </Grid>
            </Box>
            <Toast ref={toast} />
        </Stack>
    );
}
