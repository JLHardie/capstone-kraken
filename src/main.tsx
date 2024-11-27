import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { Amplify } from "aws-amplify";
import outputs from "../amplify_outputs.json";
import { Authenticator } from '@aws-amplify/ui-react'
import { signUp, SignUpInput } from "aws-amplify/auth";
import { generateClient } from "aws-amplify/data";
import { Schema } from "../amplify/data/resource.ts";

Amplify.configure(outputs);
const client = generateClient<Schema>();

const services = {
  async handleSignUp(input: SignUpInput) {
    console.log(input);
    await client.models.User.create({
      id: input.username,
      username: input.options?.userAttributes.preferred_username,
    })
    // custom username and email
    return signUp(input);
  }
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Authenticator services={services} signUpAttributes={['preferred_username']}>
      <App />
    </Authenticator>
  </React.StrictMode>
);
