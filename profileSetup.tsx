import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";
import { doc, setDoc } from "firebase/firestore";
import { useState } from "react";
import {
    Alert,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { auth, db } from "../firebaseConfig";

export default function ProfileSetup() {
  const router = useRouter();

  const [dob, setDob] = useState<Date | null>(null);
  const [showPicker, setShowPicker] = useState(false);
  const [gender, setGender] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");

  const isFormValid = dob && gender && height && weight;

  const handleComplete = async () => {
    if (!isFormValid) {
      Alert.alert("Error", "Please fill out all fields.");
      return;
    }

    try {
      const user = auth.currentUser;
      if (!user) throw new Error("User not logged in");

      // ✅ Save profile data under users/{uid}
      await setDoc(doc(db, "users", user.uid), {
        dob: dob?.toISOString(),
        gender,
        height,
        weight,
        email: user.email,
      });

      Alert.alert("Success", "Profile saved!");
      router.push("/"); // Go to home
    } catch (err: any) {
      Alert.alert("Error", err.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ayo Lengkapi Datamu!</Text>

      {/* DOB */}
      <Text style={styles.label}>Tanggal Lahir</Text>
      <TouchableOpacity
        style={styles.input}
        onPress={() => setShowPicker(true)}
      >
        <Text>{dob ? dob.toDateString() : "DD/MM/YYYY"}</Text>
      </TouchableOpacity>
      {showPicker && (
        <DateTimePicker
          value={dob || new Date()}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={(event, selectedDate) => {
            setShowPicker(false);
            if (selectedDate) setDob(selectedDate);
          }}
        />
      )}

      {/* Gender */}
      <Text style={styles.label}>Jenis Kelamin</Text>
      <View style={styles.pickerWrapper}>
        <Picker selectedValue={gender} onValueChange={(val) => setGender(val)}>
          <Picker.Item label="-- Pilih Jenis Kelamin --" value="" />
          <Picker.Item label="Laki-laki" value="male" />
          <Picker.Item label="Perempuan" value="female" />
        </Picker>
      </View>

      {/* Height */}
      <Text style={styles.label}>Tinggi Badan (cm)</Text>
      <TextInput
        style={styles.input}
        placeholder="000"
        keyboardType="numeric"
        value={height}
        onChangeText={setHeight}
      />

      {/* Weight */}
      <Text style={styles.label}>Berat Badan (kg)</Text>
      <TextInput
        style={styles.input}
        placeholder="000"
        keyboardType="numeric"
        value={weight}
        onChangeText={setWeight}
      />

      {/* Submit Button */}
      <TouchableOpacity
        style={[styles.button, isFormValid ? styles.buttonActive : styles.buttonDisabled]}
        disabled={!isFormValid}
        onPress={handleComplete}
      >
        <Text style={styles.buttonText}>Selesai!</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: "#F8F8F8" },
  title: { fontSize: 18, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
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
  pickerWrapper: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 25,
    marginBottom: 16,
    backgroundColor: "#fff",
  },
  button: {
    padding: 14,
    borderRadius: 25,
    alignItems: "center",
    marginTop: 20,
  },
  buttonDisabled: { backgroundColor: "#ccc" },
  buttonActive: { backgroundColor: "#2E7D32" },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
