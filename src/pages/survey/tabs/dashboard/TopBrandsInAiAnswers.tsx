import { Button, Grid } from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import * as React from 'react';

const colors = [
  'hsl(220, 25%, 65%)',
  'hsl(220, 25%, 45%)',
  'hsl(220, 25%, 30%)',
  'hsl(220, 25%, 20%)',
];

export default function TopBrandsInAiAnswers({ survey }) {
  const defaultLimit = 5;

  const brands = survey.TopBrandsInAiAnswers;
  const [showAll, setShowAll] = React.useState(false);

  return (
    <Card sx={{ display: 'flex', flexDirection: 'column', gap: '8px', flexGrow: 1, mb: 2 }}>
      <CardContent>
        <Typography component="h2" variant="subtitle2">
          Top Brands in AI Answers
        </Typography>
        <Grid container spacing={2} columns={12} sx={{ mb: (theme) => theme.spacing(2), maxHeight: 350, overflowY: "scroll" }}>
          <Grid size={{ xs: 12 }} style={{ paddingTop: 32 }}>
            {brands.slice(0, showAll ? brands.length : defaultLimit).map((x, i) => (
              <Stack
                key={i}
                direction="row"
                sx={{ alignItems: 'center', gap: 2, pb: 2 }}
              >
                <img src="/icon.svg" style={{ width: 24 }} /> {/* TODO: cache icon.svg - index.html no-cache affects this as well  */}

                <Stack sx={{ gap: 1, flexGrow: 1, paddingRight: 2 }}>
                  <Stack
                    direction="row"
                    sx={{
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: 2,
                    }}
                  >
                    <Typography variant="body2" sx={{ fontWeight: '500' }}>
                      {x.Name}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      {Math.round(100 * x.Percentage)}%
                    </Typography>
                  </Stack>
                  <LinearProgress
                    variant="determinate"
                    aria-label="Number of users by country"
                    value={Math.round(100 * x.Percentage)}
                    sx={{
                      [`& .${linearProgressClasses.bar}`]: {
                        backgroundColor: colors[i < colors.length ? i : colors.length - 1],
                      },
                    }}
                  />
                </Stack>
              </Stack>
            ))}
          </Grid>
          <Button sx={{ marginLeft: "auto", mr: 2 }} onClick={() => setShowAll(x => !x)}>
            {showAll ? "Show less" : "Show all"}
          </Button>
        </Grid>
      </CardContent>
    </Card>
  );
}
