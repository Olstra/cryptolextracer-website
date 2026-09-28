import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import logo from "../../assets/logo-cryptolextracer-white.png";
import styles from "./Header.module.sass";

const makeClass = (isActive: boolean) =>
  `${styles.switch} ${isActive ? styles.activeTab : ""}`.trim();

const tabs = [
  { id: "tabFour", label: "Home", path: "/" },
  { id: "tabTwo", label: "Lex", path: "/lex" },
  { id: "tabOne", label: "Monitoring", path: "/monitoring" },
  { id: "tabThree", label: "Tracer", path: "/tracer" },
];

export const Header: React.FC = () => {
  const [open, setOpen] = useState(false);

  return (
    <header className={styles.siteHeader}>
      <div className={styles.brand}>
        <img src={logo} alt="CryptoLexTracer logo" className={styles.navLogo} />
        <p className={styles.brand}>CryptoLexTracer</p>
      </div>

      <div className={styles.hamburgerContainer}>
        <button className={styles.hamburger} onClick={() => setOpen((s) => !s)}>
          <span className={styles.hamburgerBar} />
          <span className={styles.hamburgerBar} />
          <span className={styles.hamburgerBar} />
        </button>
      </div>

      <div className={`${styles.wrapper} ${open ? styles.open : ""}`}>
        <ul className={styles.tabs}>
          {tabs.map((t) => (
            <li key={t.id}>
              <NavLink
                to={t.path}
                end={t.path === "/"}
                className={({ isActive }) => makeClass(isActive)}
                id={`btn-${t.id}`}
                onClick={() => setOpen(false)}
              >
                {t.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
};
