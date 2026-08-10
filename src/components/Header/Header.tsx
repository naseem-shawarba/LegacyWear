import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import packageJson from "../../../package.json";
import styles from "./Header.module.css";

const { version: appVersion } = packageJson;

const navLinks = [
  { path: "/", label: "Dashboard" },
  { path: "/about", label: "About" },
];

export const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);
  const close = () => setIsOpen(false);

  return (
    <>
      <header className={styles.container}>
        <button className={styles.burgerButton} onClick={toggle}>
          {isOpen ? <FaTimes /> : <FaBars />}
        </button>
      </header>

      <div
        className={`${styles.overlay} ${isOpen ? styles.open : ""}`}
        onClick={close}
      />

      <nav className={`${styles.sideMenu} ${isOpen ? styles.open : ""}`}>
        {navLinks.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            onClick={close}
            className={styles.navLink}
            style={({ isActive }) => ({
              color: isActive ? "#4f7cff" : "#e5e7eb",
            })}
          >
            {link.label}
          </NavLink>
        ))}

        <div className={styles.menuVersion}>version: {appVersion}</div>
      </nav>
    </>
  );
};
