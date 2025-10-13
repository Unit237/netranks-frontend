import { Button, CircularProgress, Link, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import connection from "../../../util/connection";

const placeholders = [
    "Rank top 100 AI tools...",
    "Which are the best running shoes?",
    "Top cybersecurity startups...",
    "What is the best pub in Oxford?",
    "Most valuable SaaS companies...",
    "Which mountain bike can fold?",
    "What's the best VPN for privacy?",
    "Kid-friendly cafés in Edinburgh...",
    "Best 3D printer under $500...",
    "Places to buy artisan bread in Shoreditch...",
];

export default function GenerateQuestionsFromQuery({ onQuestionsGenerated, handleSwitch }) {
    const [placeholder, setPlaceholder] = useState(placeholders[0]);
    const [query, setQuery] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (query) {
            return;
        }

        const interval = setInterval(() => {
            setPlaceholder(prev => placeholders[(placeholders.indexOf(prev) + 1) % placeholders.length]);
        }, 1500);

        return () => clearInterval(interval);
    }, [query]);

    const handleSubmit = async () => {
        if (isSubmitting) {
            return;
        }

        onQuestionsGenerated(await connection(setIsSubmitting).post("api/GenerateQuestionsFromQuery", query));
    }

    return (
        <>
            <TextField
                fullWidth
                sx={{
                    maxWidth: 500,
                    '.MuiInputBase-input': { fontSize: '1.25rem' }
                }}
                autoFocus
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder={placeholder}
                variant="outlined"
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        e.preventDefault(); // prevent form submission
                        handleSubmit();
                    }
                }}
            />

            {query ? (
                <Button variant="contained" onClick={handleSubmit} endIcon={isSubmitting && <CircularProgress color="inherit" size={20} />}>
                    {isSubmitting
                        ? "Generating questions"
                        : "Generate questions"
                    }
                </Button>
            ) : (
                <>
                    <Typography color="text.secondary" align='center'>
                        Type a question or brand name to generate similar questions.
                    </Typography>
                    <Link onClick={handleSwitch} underline="hover" sx={{ mt: 2, cursor: "pointer", fontSize: 14 }}>
                        Prefer choosing from brands? Try that instead →
                    </Link>
                </>
            )}
        </>
    );
}