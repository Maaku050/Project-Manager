// app/_layout.tsx
import { useRouter, Stack } from "expo-router";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import "@/global.css";

export default function RootLayout() {
  return (
    <GluestackUIProvider mode="light">
      <Stack>
        <Stack.Screen
          name="index"
          options={{ title: "Login", headerShown: true }}
        />
        <Stack.Screen
          name="register"
          options={{ title: "Register", headerShown: false }}
        />
        <Stack.Screen name="(screens)" options={{ headerShown: false }} />
      </Stack>
    </GluestackUIProvider>
  );
}
