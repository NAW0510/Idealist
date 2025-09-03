// inventaris.tsx
import React from "react";
import { StyleSheet, Text, View } from "react-native";

const resep = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Inventaris</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default resep;
