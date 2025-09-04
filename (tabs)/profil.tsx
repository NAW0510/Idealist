import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Profile() {
  return (
    <View style={styles.container}>
      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <Image
          source={{ uri: 'https://www.example.com/path_to_profile_picture.jpg' }} // Replace with dynamic image or static placeholder
          style={styles.profileImage}
        />
      </View>

      {/* Profile Name and Email */}
      <Text style={styles.profileName}>Jane Doe</Text>
      <Text style={styles.profileEmail}>janedoe@gmail.com</Text>

      {/* Profile Options */}
      <View style={styles.optionsWrapper}>
        <TouchableOpacity style={styles.option}>
          <MaterialCommunityIcons name="pencil" size={22} color="#333" />
          <Text style={styles.optionText}>Edit Profil</Text>
          <MaterialCommunityIcons name="chevron-right" size={20} color="#B7B7B7" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.option}>
          <MaterialCommunityIcons name="cogs" size={22} color="#333" />
          <Text style={styles.optionText}>Pengaturan Akun</Text>
          <MaterialCommunityIcons name="chevron-right" size={20} color="#B7B7B7" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.option}>
          <MaterialCommunityIcons name="bell" size={22} color="#333" />
          <Text style={styles.optionText}>Notifikasi</Text>
          <MaterialCommunityIcons name="chevron-right" size={20} color="#B7B7B7" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.option}>
          <MaterialCommunityIcons name="translate" size={22} color="#333" />
          <Text style={styles.optionText}>Bahasa</Text>
          <MaterialCommunityIcons name="chevron-right" size={20} color="#B7B7B7" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.option}>
          <MaterialCommunityIcons name="delete" size={22} color="#D32F2F" />
          <Text style={[styles.optionText, { color: "#D32F2F" }]}>Hapus Akun</Text>
          <MaterialCommunityIcons name="chevron-right" size={20} color="#B7B7B7" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8F8",
    padding: 16,
    justifyContent: "center",  // Vertically center the content
  },

  // Profile Header
  profileHeader: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,  // Circular profile image
    borderColor: "#B7B7B7",  // Border color around the image to match the reference
    borderWidth: 2,  // Border width for the image
  },

  // Profile Name and Email
  profileName: {
    fontSize: 22,
    fontWeight: "600",
    color: "#333",
    textAlign: "center",
    marginBottom: 10,  // Space between the name and email
  },
  profileEmail: {
    fontSize: 14,
    color: "#B7B7B7",  // Grey color for email
    textAlign: "center",
    marginBottom: 30,  // Space between email and options
  },

  // Options
  optionsWrapper: {
    marginBottom: 50,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
    backgroundColor: "#fff",
  },
  optionText: {
    fontSize: 16,
    color: "#333",
  },
});
