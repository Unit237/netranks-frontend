import ForwardToInboxIcon from '@mui/icons-material/ForwardToInbox';
import MuiCard from '@mui/material/Card';
import CssBaseline from '@mui/material/CssBaseline';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import SitemarkIcon from '../../components/SitemarkIcon';
import { useLanguage } from '../../localization/language';
import AppTheme from '../../templates/shared-theme/AppTheme';
import ColorModeSelect from '../../templates/shared-theme/ColorModeSelect';
import keys from '../../util/keys';

const Card = styled(MuiCard)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignSelf: 'center',
    width: '100%',
    padding: theme.spacing(4),
    gap: theme.spacing(2),
    margin: 'auto',
    [theme.breakpoints.up('sm')]: {
        maxWidth: '450px',
    },
    boxShadow:
        'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
    ...theme.applyStyles('dark', {
        boxShadow:
            'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
    }),
}));

const Container = styled(Stack)(({ theme }) => ({
    height: 'calc((1 - var(--template-frame-height, 0)) * 100dvh)',
    minHeight: '100%',
    padding: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
        padding: theme.spacing(4),
    },
    '&::before': {
        content: '""',
        display: 'block',
        position: 'absolute',
        zIndex: -1,
        inset: 0,
        backgroundImage:
            'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
        backgroundRepeat: 'no-repeat',
        ...theme.applyStyles('dark', {
            backgroundImage:
                'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))',
        }),
    },
}));

export default function MagicLinkSent(props: { disableCustomTheme?: boolean }) {
    const navigate = useNavigate();
    const l = useLanguage().pages.magicLinkSent;

    return (
        <AppTheme {...props}>
            <CssBaseline enableColorScheme />
            <ColorModeSelect sx={{ position: 'fixed', top: '1rem', right: '1rem' }} />
            <Container direction="column" justifyContent="space-between">
                <Card variant="outlined">
                    <SitemarkIcon />
                    <center>
                        <ForwardToInboxIcon sx={{ fontSize: 60 }} />
                        <Typography variant="h4" sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)', mt: 2 }}>
                            {l.title}
                        </Typography>
                        <Typography variant="caption" sx={{ my: 2, display: "block" }}>
                            {l.description1}
                            <br />
                            {l.description2}
                        </Typography>
                    </center>
                    <Typography sx={{ textAlign: 'center' }}>
                        <Link
                            href={keys.routes.SignIn}
                            variant="body2"
                            sx={{ alignSelf: 'center' }}
                            onClick={e => { e.preventDefault(); navigate(keys.routes.SignIn) }}
                        >
                            {l.goBack}
                        </Link>
                    </Typography>
                </Card>
            </Container>
        </AppTheme>
    );
}
