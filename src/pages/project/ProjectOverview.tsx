import EditIcon from '@mui/icons-material/Edit';
import { Box, CircularProgress, Divider, Grid, IconButton, Stack, Typography } from "@mui/material";
import React, { useRef } from "react";
import { useActiveProject } from "../../util/user";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import CardActionArea from '@mui/material/CardActionArea';
import { useNavigate, useNavigation } from 'react-router-dom';
import keys from '../../util/keys';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import { RenameProjectDialog } from './RenameProjectDialog';

export default function ProjectOverview() {
    return (
        <Stack spacing={5} sx={{ alignSelf: "stretch", justifyContent: "flex-end" }}>
            <ProjectName />
            <Surveys />
        </Stack>

    );
}

function SectionHeader({ title }) {
    return (
        <>
            <Divider />
            <Typography variant="h3" sx={{ my: 5 }}>
                {title}
            </Typography>
        </>
    );
}

function ProjectName() {
    const renameProjectDialog = useRef(undefined);
    const activeProject = useActiveProject();

    const handleClick = () => {
        renameProjectDialog.current.open();
    }

    return (
        <>
            <RenameProjectDialog ref={renameProjectDialog} />
            <Stack spacing={5}>
                <Stack direction="row" spacing={3}>
                    <Typography variant="h3">
                        {activeProject.Name || "Default Project"}
                    </Typography>
                    {activeProject.IsOwner && (
                        <IconButton title="Rename Project" size="small" onClick={handleClick}>
                            <EditIcon />
                        </IconButton>
                    )}
                </Stack>
                <Typography variant="caption">
                    Role: {activeProject.IsOwner ? "Owner" : activeProject.IsEditor ? "Editor" : "Viewer"}
                </Typography>
            </Stack>
        </>
    );
}

function Surveys() {
    const pendingPathName = useNavigation().location?.pathname;

    const navigate = useNavigate();
    const activeProject = useActiveProject();
    const cardWidth = { xs: 121, sm: 200 };

    return (
        <Stack>
            <SectionHeader title="Surveys" />
            <Grid container gap={5}>
                {(activeProject.IsOwner || activeProject.IsEditor) && (
                    <Card sx={{ p: 0, display: "flex" }}>
                        <CardActionArea sx={{ p: 3, display: "flex", flexDirection: "row", flexGrow: 1, alignItems: "stretch" }} onClick={() => navigate(keys.routes.NewSurvey(activeProject.Id))}>
                            <CardContent sx={{ width: cardWidth, aspectRatio: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-between", flexGrow: 1 }}>
                                <Typography gutterBottom variant="h5">
                                    Create New Survey
                                </Typography>
                                <AddRoundedIcon sx={{ fontSize: 90 }} />
                                <Box />
                            </CardContent>
                        </CardActionArea>
                    </Card>
                )}
                {activeProject.Surveys.map((x, i) => (
                    <Card key={x.Id} sx={{ p: 0, display: "flex" }}>
                        <CardActionArea sx={{ p: 3, display: "flex", flexDirection: "row", flexGrow: 1, alignItems: "stretch" }} onClick={() => navigate(keys.routes.Survey(activeProject.Id, x.Id))}>
                            <Typography variant="caption" sx={{ position: "absolute", top: 3, right: 6, opacity: 0.2 }}>
                                #{x.Id}
                            </Typography>

                            {pendingPathName == keys.routes.Survey(activeProject.Id, x.Id) && (
                                <Box sx={{ position: "absolute", top: 0, left: 0, bottom: 0, right: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    <CircularProgress color='inherit' size={50} />
                                </Box>
                            )}
                            <CardContent sx={{ width: cardWidth, aspectRatio: 1, display: "flex", flexDirection: "column", alignItems: "stretch", justifyContent: "space-between", flexGrow: 1 }}>
                                <Stack sx={{ alignItems: "stretch" }}>
                                    <Typography gutterBottom variant="h5" component="div" sx={{ display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                                        {x.Name || `Survey ${i + 1}`}
                                    </Typography>
                                    <Box sx={{ flex: 1, overflow: "hidden" }}>
                                        <Typography variant="body2" sx={{ color: 'text.secondary', display: "-webkit-box", WebkitLineClamp: 4, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                                            {x.Name ?? x.DescriptionShort ?? x.Description}
                                        </Typography>
                                    </Box>
                                </Stack>
                                <Stack direction="row" sx={{ justifyContent: "space-between" }}>
                                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                        {x.SchedulePeriodHours == 24 ? "Daily" : x.SchedulePeriodHours == 24 * 7 ? "Weekly" : "Single Run"}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                        {x.SchedulePeriodHours == 24 ? "$1200 / pm" : x.SchedulePeriodHours == 24 * 7 ? "$200 / pm" : "Free"}
                                    </Typography>
                                </Stack>
                            </CardContent>
                        </CardActionArea>
                    </Card>
                ))}
            </Grid>
        </Stack>
    );
}