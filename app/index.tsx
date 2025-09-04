import { Redirect } from "expo-router";

export default function Index() {
  // ✅ On app start, redirect user to the login screen
  return <Redirect href="/login" />;
}
