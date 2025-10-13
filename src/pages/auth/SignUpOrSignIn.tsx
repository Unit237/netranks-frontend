import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import { CircularProgress } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import MuiCard from '@mui/material/Card';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import * as React from 'react';
import { useLoaderData, useNavigate, useSearchParams } from 'react-router-dom';
import SitemarkIcon from '../../components/SitemarkIcon';
import { getSelectedLanguage, useLanguage } from '../../localization/language';
import ColorModeSelect from '../../templates/shared-theme/ColorModeSelect';
import connection from '../../util/connection';
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

export default function SignUpOrSignIn(props: { disableCustomTheme?: boolean }) {
  const visitorSessionToken = useSearchParams()[0].get("vt");
  const navigate = useNavigate();
  const { signUp } = useLoaderData();
  const l = signUp
    ? useLanguage().pages.signUp
    : useLanguage().pages.signIn;

  const [submitting, setSubmitting] = React.useState(false);
  const [emailError, setEmailError] = React.useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = React.useState('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (submitting || emailError) {
      return;
    }
    const data = new FormData(event.currentTarget);
    setSubmitting(true);
    try {
      await connection().post("api/CreateMagicLink", {
        Email: data.get('email'),
        Locale: getSelectedLanguage().locale,
        VisitorSessionToken: visitorSessionToken
      });
      navigate(keys.routes.MagicLinkSent);
    } catch (error) {
      setSubmitting(false);
    }
  };

  const validateInputs = () => {
    const email = document.getElementById('email') as HTMLInputElement;

    let isValid = true;

    if (!email.value || !/\S+@\S+\.\S+/.test(email.value)) {
      setEmailError(true);
      setEmailErrorMessage(l.emailInvalid);
      isValid = false;
    } else {
      setEmailError(false);
      setEmailErrorMessage('');
    }

    return isValid;
  };

  return (
    <Container direction="column" justifyContent="space-between">
      <ColorModeSelect sx={{ position: 'fixed', top: '1rem', right: '1rem' }} />
      <Card variant="outlined">
        <SitemarkIcon />
        <Typography component="h1" variant="h4" sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}>
          {l.title}
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ display: 'flex', flexDirection: 'column', width: '100%', gap: 2 }}>
          <FormControl>
            <FormLabel htmlFor="email">{l.email}</FormLabel>
            <TextField
              error={emailError}
              helperText={emailErrorMessage}
              id="email"
              type="email"
              name="email"
              placeholder="your@email.com"
              autoComplete="email"
              autoFocus
              required
              fullWidth
              variant="outlined"
              color={emailError ? 'error' : 'primary'}
            />
          </FormControl>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            onClick={validateInputs}
            startIcon={<AutoFixHighIcon />}
            endIcon={submitting && <CircularProgress color="inherit" size={20} />}
          >
            {!submitting
              ? l.sendMagicLink
              : l.sendindgMagicLink
            }
          </Button>
        </Box>
        {/* <Divider>{l.or}</Divider> */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {/* <Button
              fullWidth
              variant="outlined"
              onClick={() => alert('TODO: Sign in with Google')}
              startIcon={<GoogleIcon />}
            >
              {l.withGoogle}
            </Button>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => alert('TODO: Sign in with Microsoft')}
              startIcon={<MicrosoftIcon />}
            >
              {l.withMicrosoft}
            </Button> */}
          <Typography sx={{ textAlign: 'center', mt: 5 }}>
            {signUp ? l.alreadyHaveAnAccount : l.dontHaveAnAccount}{' '}
            <Link
              href={signUp ? keys.routes.SignIn : keys.routes.SignUp}
              variant="body2"
              sx={{ alignSelf: 'center' }}
              onClick={e => { e.preventDefault(); navigate(signUp ? keys.routes.SignIn : keys.routes.SignUp) }}
            >
              {signUp ? l.signIn : l.signUp}
            </Link>
          </Typography>
        </Box>
      </Card>
    </Container>
  );
}
