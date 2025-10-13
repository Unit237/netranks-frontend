import React, { useEffect, useRef } from 'react';
import { ScrollRestoration, useLocation, useNavigationType } from 'react-router-dom';

export default function ScrollFix() {
    const location = useLocation();
    const navType = useNavigationType();
    const lastHash = useRef('');

    useEffect(() => {
        if (navType == "POP") {
            return;
        }

        if (location.hash) {
            lastHash.current = location.hash.slice(1);
        }

        setTimeout(() => {
            if (lastHash.current && document.getElementById(lastHash.current)) {
                document
                    .getElementById(lastHash.current)
                    ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                lastHash.current = '';
            } else {
                window.scrollTo(0, 0);
            }
        }, 100);
    }, [location, navType]);

    return <ScrollRestoration />;
}