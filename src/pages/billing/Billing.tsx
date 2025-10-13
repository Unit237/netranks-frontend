import { Button, Container, Stack, Typography } from '@mui/material';
import React, { useRef, useState } from "react";
import { useLoaderData } from "react-router-dom";
import { Toast } from '../../components/Toast';
import AddNewPaymentMethod from './AddNewPaymentMethod';
import ExistingPaymentMethod from './ExistingPaymentMethod';

export default function Billing() {
    const toast = useRef(undefined);
    const [paymentMethod, setPaymentMethod] = useState(useLoaderData());
    const [isEditMode, setIsEditMode] = useState(!paymentMethod);

    const handleOnSaved = x => {
        setPaymentMethod(x);
        setIsEditMode(false);
        toast.current.show("success", "Payment method is saved");
    }

    return (
        <Stack spacing={10} sx={{ alignSelf: "stretch", alignItems: "center" }}>
            <Container>
                {/* <Typography variant='h6' sx={{ mb: 2 }}>
                    Billing Address
                </Typography>
                <AddressElement options={{ mode: "billing" }} /> */}

                <Typography variant='h6' sx={{ mt: 10, mb: 2 }}>
                    Payment Info
                </Typography>

                {isEditMode
                    ? <AddNewPaymentMethod onSaved={handleOnSaved} />
                    : <ExistingPaymentMethod paymentMethod={paymentMethod} />
                }

                {(paymentMethod || !isEditMode) && (
                    <Button variant='text' sx={{ mt: 3 }} onClick={() => setIsEditMode(x => !x)}>
                        {isEditMode
                            ? "Cancel"
                            : "Change payment method"
                        }
                    </Button>
                )}
            </Container>
            <Toast ref={toast} />
        </Stack>
    );
}
