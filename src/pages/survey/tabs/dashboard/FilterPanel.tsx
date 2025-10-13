import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
    Accordion,
    AccordionActions,
    AccordionDetails,
    AccordionSummary,
    Autocomplete,
    Box,
    Button,
    Checkbox,
    CircularProgress,
    FormControl,
    InputLabel,
    ListItemText,
    MenuItem,
    OutlinedInput,
    Select,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from "dayjs";
import React, { useEffect, useState } from "react";
import connection from "../../../../util/connection";


export default function FilterPanel({ surveyId, onFilter }) {

    const [fields, setFields] = useState(null);

    const [expanded, setExpanded] = useState(false);

    const [startDate, setStartDate] = useState<Dayjs | null>(null);
    const [endDate, setEndDate] = useState<Dayjs | null>(null);
    const [questions, setQuestions] = useState([]);
    const [brand, setBrand] = useState(null);
    const [models, setModels] = useState([]);

    useEffect(() => {
        clearSelections();
        setFields(null);
        (async () => {
            setFields(await connection().get(`api/GetDashboardFilterFields/${surveyId}`));
        })();
    }, [surveyId]);

    const clearSelections = () => {
        setStartDate(null);
        setEndDate(null);
        setQuestions([]);
        setBrand(null);
        setModels([]);

        setExpanded(false);
    }

    const clearFilter = () => {
        clearSelections();
        onFilter(null);
    }

    const applyFilter = () => {
        // setExpanded(false);

        onFilter({
            StartDate: startDate?.toDate(),
            EndDate: endDate?.toDate(),
            QuestionIds: questions.map(x => x.Id),
            BrandId: brand?.Id,
            ModelIds: models.map(x => x.Id),
        });
    }

    const handleDateShortcut = (range: "28days" | "7days" | "beginning") => {
        if (range === "28days") {
            setStartDate(dayjs().subtract(4, "weeks"));
            setEndDate(null);
        } else if (range === "7days") {
            setStartDate(dayjs().subtract(1, "week"));
            setEndDate(null);
        } else {
            setStartDate(null);
            setEndDate(null);
        }
    };

    return (
        <Accordion expanded={expanded} onChange={(_, x) => setExpanded(x)}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>Filters</Typography>
            </AccordionSummary>
            <AccordionDetails>
                {!fields ? (
                    <Stack alignItems="center" py={10}>
                        <CircularProgress />
                    </Stack>
                ) : (
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <Stack spacing={3}>
                            {/* Date Range */}
                            <Stack direction="row" spacing={2} alignItems="center">
                                <DatePicker
                                    label="Start Date"
                                    value={startDate}
                                    onChange={(newValue) => setStartDate(newValue)}
                                    renderInput={(params) => <TextField {...params} fullWidth />}
                                />
                                <DatePicker
                                    label="End Date"
                                    value={endDate}
                                    onChange={(newValue) => setEndDate(newValue)}
                                    renderInput={(params) => <TextField {...params} fullWidth />}
                                />
                                <Button variant="text" onClick={() => handleDateShortcut("28days")}>
                                    Last 28 Days
                                </Button>
                                <Button variant="text" onClick={() => handleDateShortcut("7days")}>
                                    Last 7 Days
                                </Button>
                                <Button variant="text" onClick={() => handleDateShortcut("beginning")}>
                                    Since Beginning
                                </Button>
                            </Stack>

                            {/* Questions Asked */}
                            <FormControl fullWidth>
                                <InputLabel>Questions Asked</InputLabel>
                                <Select
                                    multiple
                                    value={questions}
                                    onChange={(e) => setQuestions(e.target.value)}
                                    input={<OutlinedInput label="Questions Asked" />}
                                    // renderValue={(selected) => `${selected.length} questions selected: ${selected.map(x => `#${x}`).join(", ")}`}
                                    renderValue={(selected) => `${selected.length} questions selected`}
                                >
                                    {fields.Questions.map((q) => (
                                        <MenuItem key={q.Id} value={q}>
                                            <Checkbox checked={questions.findIndex(x => x.Id == q.Id) > -1} />
                                            <ListItemText primary={q.Text} />
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            {/* Brand */}
                            <FormControl fullWidth>
                                <Autocomplete
                                    options={fields.Brands}
                                    getOptionLabel={x => x.Name}
                                    groupBy={x => x[0]}
                                    autoHighlight
                                    value={brand}
                                    onChange={(_, x) => setBrand(x)}
                                    renderInput={(params) => <TextField {...params} label="Brand" />}
                                />
                            </FormControl>

                            {/* Search Engine */}
                            <FormControl fullWidth>
                                <InputLabel>Search Engine</InputLabel>
                                <Select
                                    multiple
                                    value={models}
                                    onChange={(e) => setModels(e.target.value)}
                                    input={<OutlinedInput label="Search Engine" />}
                                    renderValue={(selected) => `${selected.length} selected: (${selected.map(x => x.Model).join(", ")})`}
                                >
                                    {fields.Models.map(m => (
                                        <MenuItem key={m.Id} value={m}>
                                            <Checkbox checked={models.findIndex(x => x.Id == m.Id) > -1} />
                                            <ListItemText primary={`${m.AiAgent} (${m.Model})`} />
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Stack>
                    </LocalizationProvider>
                )}
            </AccordionDetails>
            {!!fields && (
                <AccordionActions>
                    <Button variant="text" onClick={clearFilter}>Clear Filter</Button>
                    <Button variant="contained" onClick={applyFilter}>Apply Filter</Button>
                </AccordionActions>
            )}
        </Accordion>
    );
};
