import { Button, CircularProgress, Link, Typography } from "@mui/material";
import React, { useState } from "react";
import AutocompleteBrand, { RenderBrandItem } from "./AutocompleteBrand";
import connection from "../../../util/connection";

export default function GenerateQuestionsFromBrand({ onQuestionsGenerated, handleSwitch }) {

    const [brand, setBrand] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (isSubmitting) {
            return;
        }

        onQuestionsGenerated(await connection(setIsSubmitting).post("api/GenerateQuestionsFromBrand", brand));
    }

    return (
        <>
            {brand ? (
                <>
                    <Typography color="text.secondary" align='center'>
                        You've chosen your brand
                    </Typography>

                    <RenderBrandItem brand={brand} />

                    <Button variant="contained" onClick={handleSubmit} endIcon={isSubmitting && <CircularProgress color="inherit" size={20} />}>
                        {isSubmitting
                            ? "Generating questions"
                            : "Generate questions"
                        }
                    </Button>

                    <Link onClick={() => setBrand(null)} underline="hover" sx={{ mb: 2, cursor: "pointer", fontSize: 14 }}>
                        ← or choose another brand
                    </Link>
                </>
            ) : (
                <>
                    <AutocompleteBrand onSelect={setBrand} />

                    <Typography color="text.secondary" align='center'>
                        Choose a brand to generate questions customers would ask an AI assistant
                    </Typography>
                    <Link onClick={handleSwitch} underline="hover" sx={{ mt: 2, cursor: "pointer", fontSize: 14 }}>
                        You already know what your customers might ask? Try that instead →
                    </Link>
                </>
            )}
        </>
    );
}