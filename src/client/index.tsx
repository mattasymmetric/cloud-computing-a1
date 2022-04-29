import React from "react";
import Brruuhh from "../app/App";
import { hydrateRoot } from "react-dom/client";
import "../assets/styles.scss";

const container = document.getElementById("app");
hydrateRoot(
    container,
    <React.StrictMode>
        <Brruuhh />
    </React.StrictMode>
);
