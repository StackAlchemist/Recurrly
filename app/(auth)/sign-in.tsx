import {
  AuthField,
  AuthLinkFooter,
  AuthScreen,
  AuthSubmitButton,
  AuthTextInput,
} from "@/components/AuthScreen";
import { logAuthDebug, logAuthError } from "@/lib/utils";
import { useSignIn } from "@clerk/expo";
import { type Href, useRouter } from "expo-router";
import React from "react";
import { Pressable, Text, View } from "react-native";

export default function SignIn() {
  const { signIn, errors, fetchStatus } = useSignIn();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [code, setCode] = React.useState("");
  const [formError, setFormError] = React.useState<string | undefined>();

  const isCodeEmpty = code.trim().length === 0;

  const finalizeSignIn = async () => {
    try {
      await signIn.finalize({
        navigate: ({ session, decorateUrl }) => {
          if (session?.currentTask) {
            logAuthDebug("Sign-in session task pending");
            setFormError("Additional sign-in steps are required. Please try again.");
            return;
          }

          router.replace(decorateUrl("/(tabs)") as Href);
        },
      });
    } catch {
      setFormError("Could not complete sign-in. Please try again.");
      logAuthError("Sign-in finalize failed");
    }
  };

  const handleSubmit = async () => {
    setFormError(undefined);

    try {
      const { error } = await signIn.password({
        emailAddress,
        password,
      });
      if (error) {
        setFormError("Sign-in failed. Check your email and password.");
        logAuthError("Sign-in password failed", error);
        return;
      }

      if (signIn.status === "complete") {
        await finalizeSignIn();
      } else if (signIn.status === "needs_client_trust") {
        const emailCodeFactor = signIn.supportedSecondFactors.find(
          (factor) => factor.strategy === "email_code",
        );

        if (emailCodeFactor) {
          try {
            await signIn.mfa.sendEmailCode();
          } catch {
            setFormError("Could not send verification code. Please try again.");
            logAuthError("Sign-in send email code failed");
          }
        } else {
          setFormError("Email verification is required but unavailable.");
        }
      } else {
        setFormError("Sign-in could not be completed. Please try again.");
        logAuthError("Sign-in attempt not complete");
      }
    } catch {
      setFormError("Something went wrong. Please try again.");
      logAuthError("Sign-in submit failed");
    }
  };

  const handleVerify = async () => {
    const trimmedCode = code.trim();
    if (!trimmedCode) return;

    setFormError(undefined);

    try {
      await signIn.mfa.verifyEmailCode({ code: trimmedCode });

      if (signIn.status === "complete") {
        await finalizeSignIn();
      } else {
        setFormError("Verification incomplete. Check your code and try again.");
        logAuthError("Sign-in verification not complete");
      }
    } catch {
      setFormError("Could not verify code. Please try again.");
      logAuthError("Sign-in verify email code failed");
    }
  };

  const handleSendEmailCode = async () => {
    setFormError(undefined);

    try {
      await signIn.mfa.sendEmailCode();
    } catch {
      setFormError("Could not send a new code. Please try again.");
      logAuthError("Sign-in resend email code failed");
    }
  };

  const handleReset = async () => {
    setFormError(undefined);
    setCode("");

    try {
      await signIn.reset();
    } catch {
      setFormError("Could not reset sign-in. Please try again.");
      logAuthError("Sign-in reset failed");
    }
  };

  if (signIn.status === "needs_client_trust") {
    return (
      <AuthScreen
        title="Check your email"
        subtitle="We sent a verification code to confirm it's you."
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

          <Pressable
            className="auth-secondary-button"
            disabled={fetchStatus === "fetching"}
            onPress={handleReset}
          >
            <Text className="auth-secondary-button-text">Use a different email</Text>
          </Pressable>
        </View>
      </AuthScreen>
    );
  }

  return (
    <AuthScreen
      title="Welcome back"
      subtitle="Sign in to track renewals and stay on top of your subscriptions."
      footer={
        <AuthLinkFooter
          prompt="Don't have an account?"
          linkLabel="Sign up"
          href="/(auth)/sign-up"
        />
      }
    >
      <View className="auth-form">
        <AuthField label="Email address" error={errors.fields.identifier?.message}>
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
            placeholder="Your password"
            secureTextEntry
            onChangeText={setPassword}
            autoComplete="password"
          />
        </AuthField>

        {formError ? <Text className="auth-error">{formError}</Text> : null}

        <AuthSubmitButton
          label="Continue"
          loading={fetchStatus === "fetching"}
          disabled={!emailAddress || !password}
          onPress={handleSubmit}
        />
      </View>
    </AuthScreen>
  );
}
