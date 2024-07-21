import { Redirect, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

import { Loader } from "@/components";
import { useGlobal } from "@/context/global-context";

export default function AuthLayout() {
  const { isLoading, isLogged } = useGlobal();

  if (!isLoading && isLogged) return <Redirect href="/home" />;

  return (
    <>
      <Stack>
        <Stack.Screen
          name="sign-in"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="sign-up"
          options={{
            headerShown: false,
          }}
        />
      </Stack>

      <Loader isLoading={isLoading} />
      <StatusBar backgroundColor="#161622" style="light" />
    </>
  );
}
