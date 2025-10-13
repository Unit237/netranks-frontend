import React, { useState, useImperativeHandle } from "react";
import { useLanguage } from "../localization/language";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";

export const Confirm = React.forwardRef(({ }, ref) => {

    const l = useLanguage();

    const [isOpen, setIsOpen] = useState(false);
    const [title, setTitle] = useState();
    const [body, setBody] = useState();
    const [onConfirmed, setOnConfirmed] = useState();

    useImperativeHandle(ref, () => ({
        show: (title, body, onConfirmed) => {
            setTitle(title);
            setBody(body);
            setOnConfirmed(() => onConfirmed);
            setIsOpen(true);
        },
    }));

    return (
        <div>
            <Dialog
                open={isOpen}
                onClose={() => setIsOpen(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {title}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {body}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setIsOpen(false)}>
                        {l.general.no}
                    </Button>
                    <Button onClick={() => { setIsOpen(false); onConfirmed?.(); }} autoFocus>
                        {l.general.yes}
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
});