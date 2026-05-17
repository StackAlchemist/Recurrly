import { colors } from "@/constants/theme";
import clsx from "clsx";
import { Link, type Href } from "expo-router";
import { styled } from "nativewind";
import type { ReactNode } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
  type PressableProps,
  type TextInputProps,
} from "react-native";
import {
  SafeAreaView as RNSSafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

export const AUTH_PLACEHOLDER_COLOR = "rgba(0, 0, 0, 0.4)";

const SafeAreaView = styled(RNSSafeAreaView);
const StyledKeyboardAvoidingView = styled(KeyboardAvoidingView);
const StyledScrollView = styled(ScrollView);

type AuthScreenProps = {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer?: ReactNode;
};

export function AuthBrand() {
  return (
    <View className="auth-brand-block">
      <View className="auth-logo-wrap">
        <View className="auth-logo-mark">
          <Text className="auth-logo-mark-text">R</Text>
        </View>
        <View>
          <Text className="auth-wordmark">Recurrly</Text>
          <Text className="auth-wordmark-sub">Subscriptions, simplified</Text>
        </View>
      </View>
    </View>
  );
}

export function AuthTextInput({ style, ...props }: TextInputProps) {
  return (
    <TextInput
      className="auth-input"
      placeholderTextColor={AUTH_PLACEHOLDER_COLOR}
      textAlignVertical="center"
      includeFontPadding={false}
      style={[
        {
          minHeight: 52,
          fontSize: 16,
          lineHeight: 22,
          paddingVertical: Platform.OS === "android" ? 12 : 14,
        },
        style,
      ]}
      {...props}
    />
  );
}

export function AuthScreen({ title, subtitle, children, footer }: AuthScreenProps) {
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView className="auth-safe-area">
      <StyledKeyboardAvoidingView
        className="auth-screen"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={insets.top}
      >
        <StyledScrollView
          className="auth-scroll"
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          automaticallyAdjustKeyboardInsets
          contentContainerClassName="auth-content"
          showsVerticalScrollIndicator={false}
        >
          <AuthBrand />
          <View className="w-full items-center">
            <View className="w-[90%] max-w-md">
              <Text className="auth-title">{title}</Text>
              <Text className="auth-subtitle">{subtitle}</Text>
            </View>
          </View>
     
          <View className="auth-card">{children}</View>
          {footer}
        </StyledScrollView>
      </StyledKeyboardAvoidingView>
    </SafeAreaView>
  );
}

type AuthFieldProps = {
  label: string;
  error?: string;
  children: ReactNode;
};

export function AuthField({ label, error, children }: AuthFieldProps) {
  return (
    <View className="auth-field">
      <Text className="auth-label">{label}</Text>
      {children}
      {error ? <Text className="auth-error">{error}</Text> : null}
    </View>
  );
}

type AuthSubmitButtonProps = PressableProps & {
  label: string;
  loading?: boolean;
  disabled?: boolean;
};

export function AuthSubmitButton({
  label,
  loading,
  disabled,
  ...pressableProps
}: AuthSubmitButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <Pressable
      className={clsx("auth-button", isDisabled && "auth-button-disabled")}
      disabled={isDisabled}
      style={({ pressed }) => [pressed && !isDisabled && { opacity: 0.88 }]}
      {...pressableProps}
    >
      {loading ? (
        <ActivityIndicator color={colors.primary} />
      ) : (
        <Text className="auth-button-text">{label}</Text>
      )}
    </Pressable>
  );
}

type AuthLinkFooterProps = {
  prompt: string;
  linkLabel: string;
  href: Href;
};

export function AuthLinkFooter({ prompt, linkLabel, href }: AuthLinkFooterProps) {
  return (
    <View className="auth-link-row">
      <Text className="auth-link-copy">{prompt}</Text>
      <Link href={href}>
        <Text className="auth-link">{linkLabel}</Text>
      </Link>
    </View>
  );
}
