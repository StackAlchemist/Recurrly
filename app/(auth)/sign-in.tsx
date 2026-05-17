import {
  AuthField,
  AuthLinkFooter,
  AuthScreen,
  AuthSubmitButton,
  AuthTextInput,
} from "@/components/AuthScreen";
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

  const finalizeSignIn = async () => {
    await signIn.finalize({
      navigate: ({ session, decorateUrl }) => {
        if (session?.currentTask) {
          console.log(session.currentTask);
          return;
        }

        router.replace(decorateUrl("/(tabs)") as Href);
      },
    });
  };

  const handleSubmit = async () => {
    const { error } = await signIn.password({
      emailAddress,
      password,
    });
    if (error) {
      console.error(JSON.stringify(error, null, 2));
      return;
    }

    if (signIn.status === "complete") {
      await finalizeSignIn();
    } else if (signIn.status === "needs_client_trust") {
      const emailCodeFactor = signIn.supportedSecondFactors.find(
        (factor) => factor.strategy === "email_code",
      );

      if (emailCodeFactor) {
        await signIn.mfa.sendEmailCode();
      }
    } else {
      console.error("Sign-in attempt not complete:", signIn);
    }
  };

  const handleVerify = async () => {
    await signIn.mfa.verifyEmailCode({ code });

    if (signIn.status === "complete") {
      await finalizeSignIn();
    } else {
      console.error("Sign-in attempt not complete:", signIn);
    }
  };

  if (signIn.status === "needs_client_trust") {
    return (
      <AuthScreen
        title="Check your email"
        subtitle="We sent a verification code to confirm it's you."
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
            onPress={() => signIn.mfa.sendEmailCode()}
          >
            <Text className="auth-secondary-button-text">Send a new code</Text>
          </Pressable>

          <Pressable className="auth-secondary-button" onPress={() => signIn.reset()}>
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
