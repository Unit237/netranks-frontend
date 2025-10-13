import { Box, Container, Tab, Tabs } from "@mui/material";
import React, { useEffect, useState } from "react";
import SurveyQuestions from "./tabs/SurveyQuestions";
import SurveySchedule from "./tabs/SurveySchedule";
import SurveyDashboard from "./tabs/dashboard/SurveyDashboard";
import { useLoaderData } from "react-router-dom";

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function CustomTabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ p: { xs: 0, sm: 3 }, mt: { xs: 2, sm: 0 } }}>{children}</Box>}
        </div>
    );
}
export default function Survey() {

    const data = useLoaderData();
    const [survey, setSurvey] = useState(data);
    const [value, setValue] = React.useState(0);

    useEffect(() => {
        setSurvey(data);
    }, [data]);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    return (
        <Container maxWidth={false}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example" variant="fullWidth">
                    <Tab label="Dashboard" />
                    <Tab label="Questions" />
                    <Tab label="Schedule" />
                </Tabs>
            </Box>
            <CustomTabPanel value={value} index={0}>
                <SurveyDashboard survey={survey} />
            </CustomTabPanel>
            <CustomTabPanel value={value} index={1}>
                <SurveyQuestions survey={survey} setSurvey={setSurvey} />
            </CustomTabPanel>
            <CustomTabPanel value={value} index={2}>
                <SurveySchedule survey={survey} setSurvey={setSurvey} />
            </CustomTabPanel>
        </Container>
    );
}
