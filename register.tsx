import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { auth } from "../firebaseConfig"; // ✅ make sure this exports your Firebase `auth`

export default function Register() {
  const router = useRouter();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const isFormValid =
    firstName &&
    lastName &&
    email &&
    password.length >= 8 &&
    password === confirmPassword;

  const handleRegister = async () => {
    if (!isFormValid) return;

    try {
      setLoading(true);

      // ✅ Create Firebase user
      await createUserWithEmailAndPassword(auth, email, password);

      console.log("User registered:", email);

      // ✅ After successful signup → redirect to Profile Setup
      router.push("/profileSetup");
    } catch (error: any) {
      Alert.alert("Registration Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* 🔲 Logo placeholder */}
      <View style={styles.logoBox}>
        <Image
          source={require("../assets/images/idealisLogo.png")}
          style={styles.logo}
        />
      </View>

      {/* Full Name */}
      <Text style={styles.label}>Nama Lengkap</Text>
      <View style={styles.row}>
        <TextInput
          placeholder="Nama depan"
          value={firstName}
          onChangeText={setFirstName}
          style={[styles.input, styles.halfInput]}
        />
        <TextInput
          placeholder="Nama belakang"
          value={lastName}
          onChangeText={setLastName}
          style={[styles.input, styles.halfInput]}
        />
      </View>

      {/* Email */}
      <Text style={styles.label}>Email</Text>
      <TextInput
        placeholder="xxx@gmail.com"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      {/* Password */}
      <Text style={styles.label}>Buat Password</Text>
      <View style={styles.passwordContainer}>
        <TextInput
          placeholder="min. 8 karakter"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
          style={styles.passwordInput}
        />
        <TouchableOpacity
          onPress={() => setShowPassword(!showPassword)}
          style={styles.eyeButton}
        >
          <MaterialCommunityIcons
            name={showPassword ? "eye-off-outline" : "eye-outline"}
            size={20}
            color="#555"
          />
        </TouchableOpacity>
      </View>

      {/* Confirm Password */}
      <Text style={styles.label}>Konfirmasi Password</Text>
      <View style={styles.passwordContainer}>
        <TextInput
          placeholder="min. 8 karakter"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry={!showConfirmPassword}
          style={styles.passwordInput}
        />
        <TouchableOpacity
          onPress={() => setShowConfirmPassword(!showConfirmPassword)}
          style={styles.eyeButton}
        >
          <MaterialCommunityIcons
            name={showConfirmPassword ? "eye-off-outline" : "eye-outline"}
            size={20}
            color="#555"
          />
        </TouchableOpacity>
      </View>

      {/* Register Button */}
      <TouchableOpacity
        style={[
          styles.button,
          isFormValid ? styles.buttonActive : styles.buttonDisabled,
        ]}
        disabled={!isFormValid || loading}
        onPress={handleRegister}
      >
        <Text style={styles.buttonText}>
          {loading ? "Loading..." : "Selanjutnya"}
        </Text>
      </TouchableOpacity>

      {/* Link to Login */}
      <TouchableOpacity onPress={() => router.push("/login")}>
        <Text style={styles.link}>
          Sudah memiliki akun? <Text style={styles.linkHighlight}>Login</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: "#F8F8F8", justifyContent: "center" },
  logoBox: { alignItems: "center", marginBottom: 30 },
  logo: { width: 180, height: 80, resizeMode: "contain" },
  label: { fontSize: 14, color: "#333", marginBottom: 4, marginLeft: 4 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 25,
    padding: 12,
    backgroundColor: "#fff",
    marginBottom: 16,
    fontSize: 14,
  },
  row: { flexDirection: "row", justifyContent: "space-between", marginBottom: 16 },
  halfInput: { flex: 0.48 },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 25,
    backgroundColor: "#fff",
    marginBottom: 16,
  },
  passwordInput: { flex: 1, padding: 12, fontSize: 14 },
  eyeButton: { paddingHorizontal: 12 },
  button: {
    padding: 14,
    borderRadius: 25,
    alignItems: "center",
    marginBottom: 20,
  },
  buttonDisabled: { backgroundColor: "#ccc" },
  buttonActive: { backgroundColor: "#2E7D32" },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  link: { textAlign: "center", fontSize: 14, color: "#333" },
  linkHighlight: { color: "#2E7D32", fontWeight: "bold" },
});
