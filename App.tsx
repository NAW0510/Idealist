import { useRouter } from "expo-router";
import { Button, Text, View } from "react-native";

export default function Home() {
  const router = useRouter();
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>Home Screen</Text>
      <Button title="Go to Login" onPress={() => router.push("/login")} />
    </View>
  );
}
