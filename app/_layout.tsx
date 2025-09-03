import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* All screens inside app/ will now have no headers */}
    </Stack>
  );
}
