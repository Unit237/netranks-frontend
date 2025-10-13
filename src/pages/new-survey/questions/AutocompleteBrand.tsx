import React, { useState, useEffect } from 'react';
import { TextField, CircularProgress, Autocomplete, Typography, Box } from '@mui/material';

export interface BrandOption {
    brandId: string;
    icon: string;
    name: string;
    domain: string;
}

type Props = {
    onSelect: (option: BrandOption) => void;
};

const AutocompleteBrand: React.FC<Props> = ({ onSelect }) => {
    const [input, setInput] = useState('');
    const [options, setOptions] = useState<BrandOption[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!input) {
            setOptions([]);
            return;
        }

        const controller = new AbortController();
        const delayDebounce = setTimeout(() => {
            setLoading(true);

            fetch(`https://api.brandfetch.io/v2/search/${encodeURIComponent(input)}`, {
                signal: controller.signal,
            })
                .then((res) => {
                    if (!res.ok) throw new Error(res.statusText);
                    return res.json();
                })
                .then((data: BrandOption[]) => {
                    if (!data.length) {
                        data.push({ brandId: "_", icon: "", name: input, domain: "" })
                    }
                    setOptions(data);
                })
                .catch((err) => {
                    if (err.name !== 'AbortError') console.error('Fetch error:', err);
                })
                .finally(() => {
                    setLoading(false);
                });
        }, 500); // Debounce delay in ms

        return () => {
            clearTimeout(delayDebounce);      // Cancel debounce
            controller.abort();               // Cancel fetch
        };
    }, [input]);

    return (
        <Autocomplete
            fullWidth
            sx={{ maxWidth: 500 }}
            autoFocus
            filterOptions={(x) => x} // skip MUI filtering
            getOptionLabel={(option) => option.name || ""}
            noOptionsText="Please start typing the brand name..."
            options={options}
            loading={loading}
            onInputChange={(_, value) => setInput(value)}
            onChange={(_, value) => value && onSelect(value)}
            onKeyDown={(e) => {
                if (e.key === 'Enter' && options.length > 0) {
                    e.preventDefault(); // prevent form submission
                    onSelect(options[0]);
                }
            }}
            renderInput={(params) => (
                <TextField
                    {...params}
                    placeholder="Search brands"
                    variant="outlined"
                    sx={{
                        // boxShadow: "0 0 50px 0 rgba(77, 166, 255, 0.25)",
                    }}
                    InputProps={{
                        ...params.InputProps,
                        // style: { borderRadius: 64, paddingLeft: 14 },
                        endAdornment: (
                            <>
                                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                                {/* {params.InputProps.endAdornment} */}
                            </>
                        ),
                    }}
                />
            )}
            renderOption={(props, option) => (
                <li {...props} key={option.brandId} >
                    <RenderBrandItem brand={option} />
                </li>
            )}
        />
    );
};

export function RenderBrandItem({ brand }) {
    return (
        <Box display="flex" flexDirection="row" alignItems="center">
            {brand.icon && (
                <img src={brand.icon} alt="" style={{ width: 36, height: 36, marginRight: 8 }} />
            )}
            <Box display="flex" flexDirection="column" style={{ textAlign: "center" }}>
                <Typography>
                    {brand.name}
                </Typography>
                <Typography variant='caption' style={{ opacity: .5 }}>
                    {brand.domain}
                </Typography>
            </Box>
        </Box>
    );
}

export default AutocompleteBrand;
