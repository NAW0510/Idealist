import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { Text } from "react-native";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false, // Hide header on all screens
        tabBarActiveTintColor: "#2E7D32", // Active tab color
        tabBarInactiveTintColor: "#555", // Inactive tab color
        tabBarStyle: {
          backgroundColor: "#fff", // Bottom navbar background color
          borderTopWidth: 0.5,
          borderTopColor: "#ddd", // Border color for the navbar
          height: 70, // Height of the navbar
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabel: ({ color }) => {
          let label = "";
          if (route.name === "home") label = "Beranda";
          if (route.name === "inventaris") label = "Inventaris";
          if (route.name === "resep") label = "Resep";
          if (route.name === "profil") label = "Profil";

          return <Text style={{ color, fontSize: 12 }}>{label}</Text>;
        },
        tabBarIcon: ({ color }) => {
          let iconName: any;
          if (route.name === "home") iconName = "home"; // Home icon
          if (route.name === "inventaris") iconName = "archive"; // Inventaris icon
          if (route.name === "resep") iconName = "book-open-page-variant"; // Resep icon
          if (route.name === "profil") iconName = "account"; // Profil icon

          return <MaterialCommunityIcons name={iconName} size={24} color={color} />;
        },
      })}
    >
      {/* Explicitly add only the desired screens */}
      <Tabs.Screen name="home" />
      <Tabs.Screen name="inventaris" />
      <Tabs.Screen name="resep" />
      <Tabs.Screen name="profil" />
    </Tabs>
  );
}
