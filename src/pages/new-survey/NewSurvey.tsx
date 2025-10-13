
import ChecklistIcon from '@mui/icons-material/Checklist';
import EventRepeatIcon from '@mui/icons-material/EventRepeat';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import { Button, CircularProgress, Typography } from '@mui/material';
import Stack from '@mui/material/Stack';
import Step from '@mui/material/Step';
import StepConnector, { stepConnectorClasses } from '@mui/material/StepConnector';
import { StepIconProps } from '@mui/material/StepIcon';
import StepLabel from '@mui/material/StepLabel';
import Stepper from '@mui/material/Stepper';
import { styled } from '@mui/material/styles';
import React, { useEffect, useRef, useState } from 'react';
import keys from '../../util/keys';
import prms from '../../util/prms';
import NewSurveyQuestions from './questions/NewSurveyQuestions';
import NewSurveySchedule from './schedule/NewSurveySchedule';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import NewSurveySummary from './NewSurveySummary';
import CheckIcon from '@mui/icons-material/Check';
import { useNavigate, useParams } from 'react-router-dom';
import { loadUser } from '../../util/user';
import connection from '../../util/connection';
import { Toast } from '../../components/Toast';

//#region styles

const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
    [`&.${stepConnectorClasses.alternativeLabel}`]: {
        top: 22,
    },
    [`&.${stepConnectorClasses.active}`]: {
        [`& .${stepConnectorClasses.line}`]: {
            backgroundColor: prms.Colors.Blue,
        },
    },
    [`&.${stepConnectorClasses.completed}`]: {
        [`& .${stepConnectorClasses.line}`]: {
            backgroundColor: prms.Colors.Blue,
        },
    },
    [`& .${stepConnectorClasses.line}`]: {
        height: 3,
        border: 0,
        backgroundColor: "gray",
        borderRadius: 1,
    },
}));

const ColorlibStepIconRoot = styled('div')<{
    ownerState: { completed?: boolean; active?: boolean };
}>(({ theme }) => ({
    backgroundColor: '#ccc',
    zIndex: 1,
    color: '#fff',
    width: 50,
    height: 50,
    display: 'flex',
    borderRadius: '50%',
    justifyContent: 'center',
    alignItems: 'center',
    variants: [
        {
            style: {
                backgroundColor: theme.palette.grey[700],
            },
        },
        {
            props: ({ ownerState }) => ownerState.active,
            style: {
                backgroundColor: prms.Colors.Blue,
            },
        },
        {
            props: ({ ownerState }) => ownerState.completed,
            style: {
                backgroundColor: prms.Colors.Blue,
            },
        },
    ],
}));

function ColorlibStepIcon(props: StepIconProps) {
    const { active, completed, className } = props;
    return (
        <ColorlibStepIconRoot ownerState={{ completed, active }} className={className}>
            {steps[props.icon - 1].icon}
        </ColorlibStepIconRoot>
    );
}

//#endregion

const newSurveyFromLocalStorage = {
    get: () => {
        try {
            return JSON.parse(localStorage.getItem(keys.localStorage.NEW_SURVEY) ?? "{}");
        } catch (error) {
            console.error("Failed to parse stored new survey");
            return {};
        }
    },
    set: newSurvey => {
        const json = JSON.stringify(newSurvey);
        localStorage.setItem(keys.localStorage.NEW_SURVEY, json);
    },
    clear: () => {
        localStorage.removeItem(keys.localStorage.NEW_SURVEY);
    }
}

const steps = [
    { label: 'Questions', icon: <QuestionAnswerIcon />, component: NewSurveyQuestions },
    // { label: 'Agents', icon: <AssistantIcon />, component: Agents },
    { label: 'Schedule', icon: <EventRepeatIcon />, component: NewSurveySchedule },
    { label: 'Summary', icon: <ChecklistIcon />, component: NewSurveySummary },
];

export default function NewSurvey() {
    const toast = useRef(undefined);
    const navigate = useNavigate();
    const params = useParams();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [activeStep, setActiveStep] = useState(0);
    const isTheLastStep = activeStep == steps.length - 1;

    const changeStep = x => {
        if (x > 0 && !newSurvey.Questions?.length) {
            // prevent advancing steps when there are no questions
            return;
        }
        setActiveStep(x);
    }

    const [newSurvey, setNewSurvey] = useState(newSurveyFromLocalStorage.get());
    useEffect(() => newSurveyFromLocalStorage.set(newSurvey), [newSurvey]);

    const Component = steps[activeStep].component;

    const handleCreate = async () => {
        setIsSubmitting(true);

        try {
            const surveyId = await connection().post("api/CreateSurvey", { ...newSurvey, ProjectId: params.pid });
            await loadUser();
            newSurveyFromLocalStorage.clear();
            navigate(keys.routes.Survey(params.pid, surveyId));
        } catch (error) {
            toast.current.show("error", error.data);
            console.error(error);
            setIsSubmitting(false);
        }
    }

    return (
        <Stack sx={{ width: '100%' }} spacing={10}>
            <Typography variant='h3'>
                Create New Survey
            </Typography>
            <Stepper alternativeLabel activeStep={activeStep} connector={<ColorlibConnector />}>
                {steps.map((x, i) => (
                    <Step key={i} onClick={() => changeStep(i)} sx={{ cursor: "pointer" }}>
                        <StepLabel StepIconComponent={ColorlibStepIcon}>{x.label}</StepLabel>
                    </Step>
                ))}
            </Stepper>

            <Stack spacing={3} sx={{ alignItems: "center" }}>
                <Component
                    newSurvey={newSurvey}
                    setNewSurvey={setNewSurvey}
                    onContinue={() => isTheLastStep
                        ? handleCreate()
                        : setActiveStep(x => x + 1)
                    }
                    isTheLastStep={isTheLastStep}
                    isSubmitting={isSubmitting}
                />
            </Stack>
            <Toast ref={toast} />
        </Stack>
    );
}

export function ContinueButton({ onContinue, isTheLastStep = false, isSubmitting = false }) {
    const handleClick = () => {
        if (isSubmitting) {
            return;
        }
        onContinue();
    }
    return (
        <Button
            onClick={handleClick}
            variant='contained'
            endIcon={isSubmitting
                ? <CircularProgress color='inherit' size={20} />
                : isTheLastStep
                    ? <CheckIcon />
                    : <ChevronRightIcon
                    />
            }
        >
            {isSubmitting
                ? "Creating Survey"
                : isTheLastStep
                    ? "Create Survey"
                    : "Continue"
            }
        </Button>
    );
}
