"use client";
import React from "react";
import styles from "./page.module.scss";
import { IconButton } from "@/app/components/button";

function Login() {
  return (
    <IconButton
      type="primary"
      text="Login"
      className={styles["login-button"]}
      onClick={() => {
        window.location.href = "/api/auth/login";
      }}
    />
  );
}

export default Login;
