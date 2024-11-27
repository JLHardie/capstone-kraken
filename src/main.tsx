import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { Amplify } from "aws-amplify";
import outputs from "../amplify_outputs.json";
import { Authenticator } from '@aws-amplify/ui-react'
import { signUp, SignUpInput } from "aws-amplify/auth";

Amplify.configure(outputs);

const services = {
  async handleSignUp(input: SignUpInput) {
    console.log(input);
    // custom username and email
    return signUp(input);
  }
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Authenticator services={services}>
      <App />
    </Authenticator>
  </React.StrictMode>
);
