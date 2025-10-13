import { Alert, Snackbar } from "@mui/material";
import React, { useImperativeHandle, useState, useEffect } from "react";

export const Toast = React.forwardRef(({ }, ref) => {
    const [queue, setQueue] = useState([]);
    const [item, setItem] = useState();

    useImperativeHandle(ref, () => ({
        show: (type, message, duration) => {
            setQueue((prev) => [...prev, {
                key: new Date().getTime(),
                message,
                type,
                duration: duration || 6000,
            }]);
        },
        hide: () => {
            setItem(null);
        }
    }));

    useEffect(() => {
        if (queue.length) {
            if (item) {
                setItem(null);
            } else {
                setItem({ ...queue[0] });
                setQueue((prev) => prev.slice(1));
            }
        }
    }, [queue, item]);

    return (
        <Snackbar
            key={item?.key}
            open={!!item}
            anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
            autoHideDuration={item?.duration}
            TransitionProps={{ onExited: () => setItem(null) }}
            onClose={(e, r) => r !== "clickaway" && setItem(null)}
        >
            {item && (
                <Alert elevation={6} severity={item.type} variant="filled" sx={{ width: '100%' }} onClose={(e, r) => r !== "clickaway" && setItem(null)}>
                    <div dangerouslySetInnerHTML={{ __html: item.message }} />
                </Alert>
            )}
        </Snackbar>
    )
});

