import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { Button, Chip, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import * as React from 'react';

export default function VisibilityTablePromptsAndBrandMentions({ survey }) {
    const defaultTopicLimit = 5;
    const defaultBrandLimit = 5;

    const data = survey.VisibilityTable;
    const [showAll, setShowAll] = React.useState(false);

    return (
        <Card sx={{ display: 'flex', flexDirection: 'column', gap: '8px', flexGrow: 1, mb: 2 }}>
            <CardContent>
                <Typography component="h2" variant="subtitle2" mb={2}>
                    Visibility Table - Prompts & Brand Mentions
                </Typography>
                <Grid container spacing={2} columns={12} sx={{ mb: (theme) => theme.spacing(2), maxHeight: 500, overflowY: "scroll" }}>
                    <div style={{ width: "100%", position: "relative" }}>
                        <TableContainer component={Paper}  >
                            <Table aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Topic</TableCell>
                                        <TableCell>Brands Mentioned</TableCell>
                                        {survey.FilteredBrand && (
                                            <>
                                                <TableCell style={{ textAlign: "center", minWidth: "130px" }}>Your Brand Mentioned</TableCell>
                                                <TableCell style={{ textAlign: "center", minWidth: "130px" }}>Position</TableCell>
                                            </>
                                        )}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {data.slice(0, showAll ? data.length : defaultTopicLimit).map((x, i) => (
                                        <TableRow
                                            key={i}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            <TableCell style={{ verticalAlign: "top" }}>
                                                <Typography>
                                                    {x.Prompt}
                                                </Typography>
                                            </TableCell>
                                            <TableCell component="th" scope="row">
                                                {x.BrandsMentioned.slice(0, showAll ? x.BrandsMentioned.length : defaultBrandLimit).map((b, j) => (
                                                    <Chip key={j} label={b.Name} variant="outlined" title={b.Name} style={{ maxWidth: "100px" }} />
                                                ))}
                                            </TableCell>
                                            {survey.FilteredBrand && (
                                                <>
                                                    <TableCell style={{ verticalAlign: "top", textAlign: "center" }}>
                                                        <Chip
                                                            variant='filled'
                                                            label={x.YourBrandMentioned ? "Yes" : "No"}
                                                            icon={x.YourBrandMentioned ? <CheckCircleOutlineIcon /> : <HighlightOffIcon />}
                                                            color={x.YourBrandMentioned ? "success" : "error"}
                                                        />
                                                    </TableCell>
                                                    <TableCell style={{ verticalAlign: "top", textAlign: "center" }}>
                                                        <Typography>
                                                            {x.Position || "-"}
                                                        </Typography>
                                                    </TableCell>
                                                </>
                                            )}
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </div>
                    <Button sx={{ marginLeft: "auto", mr: 2 }} onClick={() => setShowAll(x => !x)}>
                        {showAll ? "Show less" : "Show all"}
                    </Button>
                </Grid>
            </CardContent>
        </Card>
    );
}
