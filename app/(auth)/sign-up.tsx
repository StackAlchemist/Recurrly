import { AppLoadingScreen } from "@/components/AppLoadingScreen";
import {
  AuthField,
  AuthLinkFooter,
  AuthScreen,
  AuthSubmitButton,
  AuthTextInput,
} from "@/components/AuthScreen";
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

  const handleSubmit = async () => {
    const { error } = await signUp.password({
      emailAddress,
      password,
    });
    if (error) {
      console.error(JSON.stringify(error, null, 2));
      return;
    }

    await signUp.verifications.sendEmailCode();
  };

  const handleVerify = async () => {
    await signUp.verifications.verifyEmailCode({ code });

    if (signUp.status === "complete") {
      await signUp.finalize({
        navigate: ({ session, decorateUrl }) => {
          if (session?.currentTask) {
            console.log(session.currentTask);
            return;
          }

          router.replace(decorateUrl("/(tabs)") as Href);
        },
      });
    } else {
      console.error("Sign-up attempt not complete:", signUp);
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
          <AuthField label="Verification code" error={errors.fields.code?.message}>
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
            onPress={handleVerify}
          />

          <Pressable
            className="auth-secondary-button"
            onPress={() => signUp.verifications.sendEmailCode()}
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
