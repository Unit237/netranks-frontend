import { Button, CircularProgress, Container, Stack, Typography, useColorScheme } from '@mui/material';
import { Elements, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import React, { useEffect, useRef, useState } from "react";
import { Toast } from '../../components/Toast';
import connection from '../../util/connection';
import prms from '../../util/prms';
import { useActiveProject } from '../../util/user';

const stripePromise = loadStripe(prms.stripePublishableKey);

export default function AddNewPaymentMethod({ onSaved }) {
    const isDarkMode = useColorScheme().colorScheme == "dark";
    const pid = useActiveProject().Id;
    const [clientSecret, setClientSecret] = useState();

    useEffect(() => {
        loadClientSecret();
    }, []);

    const loadClientSecret = async () => {
        const x = await connection().get(`api/CreateSetupIntent/${pid}`)
        setClientSecret(x);
    }

    if (!clientSecret) {
        return (
            <Stack alignItems="center" spacing={5}>
                <Typography variant='body2'>
                    Loading Stripe...
                </Typography>
                <CircularProgress color='inherit' size={20} />
            </Stack>
        );

    }

    return (
        <Elements
            stripe={stripePromise}
            options={{
                clientSecret: clientSecret,
                appearance: { theme: isDarkMode ? "night" : "stripe" }
            }}>
            <PaymentForm onSaved={onSaved} />
        </Elements>
    );
}

function PaymentForm({ onSaved }) {
    const toast = useRef(undefined);
    const stripe = useStripe();
    const elements = useElements();
    const [isSaving, setIsSaving] = useState(false);
    const pid = useActiveProject().Id;

    const handleSubmit = async (event) => {
        if (!stripe || !elements || isSaving) {
            return;
        }

        setIsSaving(true);

        try {
            const { error, setupIntent } = await stripe.confirmSetup({
                elements,
                redirect: 'if_required',
            });

            if (error) {
                toast.current.show("error", error.message);
                return;
            }

            const newPaymentMethod = await connection().post(`api/SetPaymentMethod/${pid}`, setupIntent.payment_method);
            onSaved(newPaymentMethod);

        } catch (error) {
            console.error(error);
            toast.current.show("error", "Failed to save payment method");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Stack spacing={3}>
            <PaymentElement />
            <Button variant="contained" color="primary" onClick={handleSubmit} endIcon={isSaving && <CircularProgress color='inherit' size={20} />}>
                {isSaving
                    ? "Saving Payment Method"
                    : "Save Payment Method"
                }
            </Button>
            <Toast ref={toast} />
        </Stack>
    );
}
