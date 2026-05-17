import { AppLoadingScreen } from "@/components/AppLoadingScreen";
import {
  AuthField,
  AuthLinkFooter,
  AuthScreen,
  AuthSubmitButton,
  AuthTextInput,
} from "@/components/AuthScreen";
import { logAuthDebug, logAuthError } from "@/lib/utils";
import { useAuth, useSignUp } from "@clerk/expo";
import { type Href, Redirect, useRouter } from "expo-router";
import React from "react";
import { Pressable, Text, View } from "react-native";

export default function SignUp() {
  const { signUp, errors, fetchStatus } = useSignUp();
  const { isSignedIn } = useAuth();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [code, setCode] = React.useState("");
  const [formError, setFormError] = React.useState<string | undefined>();

  const isCodeEmpty = code.trim().length === 0;

  const handleSubmit = async () => {
    setFormError(undefined);

    try {
      const { error } = await signUp.password({
        emailAddress,
        password,
      });
      if (error) {
        setFormError("Sign-up failed. Check your details and try again.");
        logAuthError("Sign-up password failed", error);
        return;
      }

      try {
        await signUp.verifications.sendEmailCode();
      } catch {
        setFormError("Could not send verification code. Please try again.");
        logAuthError("Sign-up send email code failed");
      }
    } catch {
      setFormError("Something went wrong. Please try again.");
      logAuthError("Sign-up submit failed");
    }
  };

  const handleVerify = async () => {
    const trimmedCode = code.trim();
    if (!trimmedCode) return;

    setFormError(undefined);

    try {
      await signUp.verifications.verifyEmailCode({ code: trimmedCode });

      if (signUp.status === "complete") {
        try {
          await signUp.finalize({
            navigate: ({ session, decorateUrl }) => {
              if (session?.currentTask) {
                logAuthDebug("Sign-up session task pending");
                setFormError("Additional sign-up steps are required. Please try again.");
                return;
              }

              router.replace(decorateUrl("/(tabs)") as Href);
            },
          });
        } catch {
          setFormError("Could not complete sign-up. Please try again.");
          logAuthError("Sign-up finalize failed");
        }
      } else {
        setFormError("Verification incomplete. Check your code and try again.");
        logAuthError("Sign-up verification not complete");
      }
    } catch {
      setFormError("Could not verify code. Please try again.");
      logAuthError("Sign-up verify email code failed");
    }
  };

  const handleSendEmailCode = async () => {
    setFormError(undefined);

    try {
      await signUp.verifications.sendEmailCode();
    } catch {
      setFormError("Could not send a new code. Please try again.");
      logAuthError("Sign-up resend email code failed");
    }
  };

  if (signUp.status === "complete" || isSignedIn) {
    return <Redirect href="/(tabs)" />;
  }

  if (
    signUp.status === "missing_requirements" &&
    signUp.unverifiedFields.includes("email_address") &&
    signUp.missingFields.length === 0
  ) {
    return (
      <AuthScreen
        title="Verify your email"
        subtitle="Enter the code we sent to finish creating your account."
        footer={
          <AuthLinkFooter
            prompt="Already have an account?"
            linkLabel="Sign in"
            href="/(auth)/sign-in"
          />
        }
      >
        <View className="auth-form">
          <AuthField
            label="Verification code"
            error={errors.fields.code?.message ?? formError}
          >
            <AuthTextInput
              value={code}
              placeholder="Enter 6-digit code"
              onChangeText={setCode}
              keyboardType="numeric"
            />
          </AuthField>

          <AuthSubmitButton
            label="Verify"
            loading={fetchStatus === "fetching"}
            disabled={isCodeEmpty}
            onPress={handleVerify}
          />

          <Pressable
            className="auth-secondary-button"
            disabled={fetchStatus === "fetching"}
            onPress={handleSendEmailCode}
          >
            <Text className="auth-secondary-button-text">Send a new code</Text>
          </Pressable>
        </View>
      </AuthScreen>
    );
  }

  return (
    <AuthScreen
      title="Create your account"
      subtitle="Start tracking subscriptions in one warm, simple place."
      footer={
        <AuthLinkFooter
          prompt="Already have an account?"
          linkLabel="Sign in"
          href="/(auth)/sign-in"
        />
      }
    >
      <View className="auth-form">
        <AuthField label="Email address" error={errors.fields.emailAddress?.message}>
          <AuthTextInput
            autoCapitalize="none"
            value={emailAddress}
            placeholder="you@example.com"
            onChangeText={setEmailAddress}
            keyboardType="email-address"
            autoComplete="email"
          />
        </AuthField>

        <AuthField label="Password" error={errors.fields.password?.message}>
          <AuthTextInput
            value={password}
            placeholder="Choose a strong password"
            secureTextEntry
            onChangeText={setPassword}
            autoComplete="new-password"
          />
        </AuthField>

        {formError ? <Text className="auth-error">{formError}</Text> : null}

        <AuthSubmitButton
          label="Create account"
          loading={fetchStatus === "fetching"}
          disabled={!emailAddress || !password}
          onPress={handleSubmit}
        />

        <View nativeID="clerk-captcha" />
      </View>
    </AuthScreen>
  );
}
