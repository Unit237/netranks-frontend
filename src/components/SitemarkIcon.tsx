import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from './Logo';

export default function SitemarkIcon() {
  const navigate = useNavigate();

  return (
    <a href="/" onClick={e => { e.preventDefault(); navigate("/"); }} style={{ cursor: "pointer", width: 125, display: "flex" }}>
      <Logo height={21} />
    </a>
  );
}
