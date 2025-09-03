// app/(tabs)/inventaris.tsx
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import {
  FlatList,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Calendar, DateData, LocaleConfig } from "react-native-calendars";

// ===== Types & constants ===== //
type Category =
  | "Semua"
  | "Protein"
  | "Karbohidrat"
  | "Sayur"
  | "Buah"
  | "Produk susu";

interface InventoryItem {
  id: string;
  name: string;
  category: Exclude<Category, "Semua">;
  quantity: number;
  unit: string;
  expiryDate?: string | null; // ISO YYYY-MM-DD
  imageUri?: string | null;
}

const CATEGORY_OPTIONS: { key: Category; label: string; icon: keyof typeof MaterialCommunityIcons.glyphMap }[] = [
  { key: "Semua", label: "Semua", icon: "food" },
  { key: "Protein", label: "Protein", icon: "food-drumstick" },
  { key: "Karbohidrat", label: "Karbohidrat", icon: "rice" },
  { key: "Sayur", label: "Sayur", icon: "leaf" },
  { key: "Buah", label: "Buah", icon: "food-apple" },
  { key: "Produk susu", label: "Produk susu", icon: "cow" },
];

const UNIT_OPTIONS = [
  "ekor",
  "gram (gr)",
  "mililiter (ml)",
  "buah",
  "potong/slice",
  "bungkus",
  "lusin",
] as const;

const GREEN = "#2E7D32";
const GREEN_SOFT = "#EAF4EC";
const GRAY_1 = "#333";
const GRAY_2 = "#555";
const GRAY_3 = "#888";
const BORDER = "#E0E0E0";
const SURFACE = "#F8F8F8";

// Calendar locale (Indonesian)
LocaleConfig.locales["id"] = {
  monthNames: [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ],
  monthNamesShort: [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "Mei",
    "Jun",
    "Jul",
    "Agu",
    "Sep",
    "Okt",
    "Nov",
    "Des",
  ],
  dayNames: ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"],
  dayNamesShort: ["MIN", "SEN", "SEL", "RAB", "KAM", "JUM", "SAB"],
};
LocaleConfig.defaultLocale = "id";

// ===== Utils ===== //
const formatDate = (iso: string) => {
  const [y, m, d] = iso.split("-");
  if (!y || !m || !d) return "";
  return `${d.padStart(2, "0")}/${m.padStart(2, "0")}/${y}`;
};

// ===== Component ===== //
export default function Inventaris() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<Category>("Semua");

  // Add form state
  const [addVisible, setAddVisible] = useState(false);
  const [name, setName] = useState("");
  const [category, setCategory] = useState<Exclude<Category, "Semua"> | "">("");
  const [quantity, setQuantity] = useState("0.00");
  const [unit, setUnit] = useState<(typeof UNIT_OPTIONS)[number] | "">("");
  const [expiry, setExpiry] = useState(""); // ISO
  const [noExpiry, setNoExpiry] = useState(false);
  const [imageUri] = useState<string | null>(null);

  // Pickers
  const [picker, setPicker] = useState<null | { type: "category" | "unit" }>(null);

  // Calendar picker
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [tempDate, setTempDate] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((it) => {
      const byCategory = activeCategory === "Semua" || it.category === activeCategory;
      const byQuery = !q || it.name.toLowerCase().includes(q);
      return byCategory && byQuery;
    });
  }, [items, query, activeCategory]);

  const resetForm = () => {
    setName("");
    setCategory("");
    setQuantity("0.00");
    setUnit("");
    setExpiry("");
    setNoExpiry(false);
  };

  const valid = name.trim() && category && Number(quantity) > 0 && unit;

  const handleAdd = () => {
    if (!valid) return;
    setItems((prev) => [
      ...prev,
      {
        id: `${Date.now()}`,
        name: name.trim(),
        category: category as Exclude<Category, "Semua">,
        quantity: Number(quantity),
        unit: unit as string,
        expiryDate: noExpiry ? null : expiry || null,
        imageUri,
      },
    ]);
    setAddVisible(false);
    resetForm();
  };

  const renderItem = ({ item }: { item: InventoryItem }) => (
    <View style={styles.card}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
        <MaterialCommunityIcons name="package-variant" size={22} color={GRAY_2} />
        <Text style={styles.cardTitle}>{item.name}</Text>
      </View>
      <View style={styles.cardRight}>
        <Text style={styles.cardQty}>
          {item.quantity} {item.unit}
        </Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{item.category}</Text>
        </View>
      </View>
    </View>
  );

  const EmptyState = () => (
    <View style={styles.emptyWrap}>
      <View style={styles.emptyIconWrap}>
        <MaterialCommunityIcons name="package-variant" size={80} color="#8C6A3B" />
        <View style={styles.sadDot}>
          <MaterialCommunityIcons name="emoticon-sad-outline" size={28} color="#fff" />
        </View>
      </View>
      <Text style={styles.emptyTitle}>Bahan Masak Belum Ada :(</Text>
      <Text style={styles.emptyDesc}>
        Belum ada bahan makanan yang ditambahkan.{""}
        Silakan tambahkan bahan untuk mulai.
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <Text style={styles.header}>Inventaris</Text>

      {/* Search */}
      <View style={styles.searchWrap}>
        <MaterialCommunityIcons name="magnify" size={20} color={GRAY_3} style={{ marginLeft: 12 }} />
        <TextInput
          placeholder="Cari"
          placeholderTextColor={GRAY_3}
          value={query}
          onChangeText={setQuery}
          style={styles.searchInput}
          returnKeyType="search"
        />
      </View>

      {/* Category chips */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingRight: 6 }} style={{ marginTop: 12 }}>
        <View style={styles.chipsRow}>
          {CATEGORY_OPTIONS.map((opt) => (
            <TouchableOpacity
              key={opt.key}
              onPress={() => setActiveCategory(opt.key)}
              style={[styles.chip, activeCategory === opt.key && styles.chipActive]}
            >
              <MaterialCommunityIcons name={opt.icon} size={16} color={activeCategory === opt.key ? "#fff" : GREEN} style={{ marginRight: 6 }} />
              <Text style={[styles.chipText, activeCategory === opt.key && styles.chipTextActive]}>{opt.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Content */}
      {filtered.length === 0 ? (
        <EmptyState />
      ) : (
        <FlatList data={filtered} keyExtractor={(it) => it.id} renderItem={renderItem} contentContainerStyle={{ paddingBottom: 140, paddingTop: 8 }} />
      )}

      {/* FAB */}
      <TouchableOpacity style={styles.fab} onPress={() => setAddVisible(true)}>
        <MaterialCommunityIcons name="plus" size={28} color="#fff" />
      </TouchableOpacity>

      {/* Add Modal */}
      <Modal transparent visible={addVisible} onRequestClose={() => setAddVisible(false)}>
        <Pressable style={styles.backdrop} onPress={() => setAddVisible(false)} />
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.sheet}>
          <View style={styles.sheetHandle} />
          <Text style={styles.sheetTitle}>Tambah Inventaris</Text>

          {/* Icon placeholder */}
          <View style={styles.iconUploadWrap}>
            <View style={styles.iconUploadBox}>
              {imageUri ? (
                <Image source={{ uri: imageUri }} style={{ width: 56, height: 56, borderRadius: 12 }} />
              ) : (
                <MaterialCommunityIcons name="plus" size={28} color={GREEN} />
              )}
            </View>
            <Text style={styles.iconUploadText}>Tambah Ikon</Text>
          </View>

          {/* Nama Bahan */}
          <Text style={styles.label}>Nama Bahan</Text>
          <View style={styles.inputWrap}>
            <TextInput value={name} onChangeText={setName} placeholder="cth: Telur Ayam" placeholderTextColor="#B7B7B7" style={styles.inputRound} />
          </View>

          {/* Kategori dropdown */}
          <Text style={styles.label}>Kategori</Text>
          <TouchableOpacity onPress={() => setPicker({ type: "category" })} style={styles.selectRound} activeOpacity={0.7}>
            <Text style={[styles.selectText, !category && { color: "#B7B7B7" }]}>{category || "-- Pilih Kategori --"}</Text>
            <MaterialCommunityIcons name="chevron-down" size={22} color={GRAY_2} />
          </TouchableOpacity>

          {/* Jumlah + Satuan */}
          <Text style={styles.label}>Jumlah</Text>
          <View style={styles.rowH}>
            <View style={{ flex: 1 }}>
              <View style={styles.inputRoundSmallWrap}>
                <TextInput keyboardType="decimal-pad" value={quantity} onChangeText={setQuantity} placeholder="0.00" placeholderTextColor="#B7B7B7" style={styles.inputRoundSmall} />
              </View>
            </View>
            <View style={{ width: 12 }} />
            <TouchableOpacity onPress={() => setPicker({ type: "unit" })} style={[styles.selectRound, { flex: 1 }]} activeOpacity={0.7}>
              <Text style={[styles.selectText, !unit && { color: "#B7B7B7" }]}>{unit || "Satuan"}</Text>
              <MaterialCommunityIcons name="chevron-down" size={22} color={GRAY_2} />
            </TouchableOpacity>
          </View>

          {/* Tanggal Kedaluwarsa */}
          <Text style={styles.label}>Tanggal Kedaluwarsa</Text>
          <TouchableOpacity
            disabled={noExpiry}
            onPress={() => {
              setTempDate(expiry || null);
              setCalendarVisible(true);
            }}
            style={[styles.selectRound, { justifyContent: "flex-start", opacity: noExpiry ? 0.5 : 1 }]}
            activeOpacity={0.7}
          >
            <MaterialCommunityIcons name="calendar-blank" size={18} color={noExpiry ? "#B7B7B7" : GRAY_2} />
            <Text style={[styles.selectText, { marginLeft: 8 }]}>{expiry ? formatDate(expiry) : "DD/MM/YYYY"}</Text>
          </TouchableOpacity>

          {/* No expiry radio */}
          <TouchableOpacity style={styles.radioRow} onPress={() => setNoExpiry((v) => !v)}>
            <View style={[styles.radioOuter, noExpiry && { borderColor: GREEN }]}>{noExpiry ? <View style={styles.radioInner} /> : null}</View>
            <Text style={styles.radioLabel}>Tidak ada tanggal kedaluwarsa</Text>
          </TouchableOpacity>

          {/* Footer Buttons */}
          <View style={styles.footerRow}>
            <TouchableOpacity style={styles.btnOutline} onPress={() => { setAddVisible(false); resetForm(); }}>
              <Text style={styles.btnOutlineText}>Batal</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleAdd} disabled={!valid} style={[styles.btnPrimary, !valid && styles.btnPrimaryDisabled]}>
              <Text style={styles.btnPrimaryText}>Tambah</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Option Picker */}
      <Modal transparent visible={!!picker} onRequestClose={() => setPicker(null)}>
        <Pressable style={styles.backdrop} onPress={() => setPicker(null)} />
        <View style={styles.pickerSheet}>
          <View style={styles.sheetHandle} />
          <Text style={styles.pickerTitle}>{picker?.type === "category" ? "Pilih Kategori" : "Pilih Satuan"}</Text>
          <ScrollView contentContainerStyle={{ paddingVertical: 8 }}>
            {(picker?.type === "category"
              ? (CATEGORY_OPTIONS.filter((c) => c.key !== "Semua").map((c) => c.label) as Exclude<Category, "Semua">[])
              : (UNIT_OPTIONS as readonly string[])
            ).map((opt) => (
              <TouchableOpacity
                key={String(opt)}
                style={styles.pickerItem}
                onPress={() => {
                  if (picker?.type === "category") setCategory(opt as Exclude<Category, "Semua">);
                  else setUnit(opt as (typeof UNIT_OPTIONS)[number]);
                  setPicker(null);
                }}
              >
                <Text style={styles.pickerText}>{String(opt)}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </Modal>

      {/* Calendar Picker */}
      <Modal transparent visible={calendarVisible} onRequestClose={() => setCalendarVisible(false)}>
        <Pressable style={styles.backdrop} onPress={() => setCalendarVisible(false)} />
        <View style={styles.calendarSheet}>
          <Calendar
            current={tempDate || new Date().toISOString().slice(0, 10)}
            onDayPress={(d: DateData) => setTempDate(d.dateString)}
            markedDates={tempDate ? { [tempDate]: { selected: true, selectedColor: GREEN, selectedTextColor: "#fff" } } : {}}
            firstDay={1}
            theme={{
              calendarBackground: "#fff",
              textSectionTitleColor: GRAY_2,
              monthTextColor: GRAY_1,
              arrowColor: GRAY_1,
              selectedDayBackgroundColor: GREEN,
              selectedDayTextColor: "#fff",
              todayTextColor: GREEN,
              textDayFontSize: 16,
              textMonthFontSize: 18,
              textDayHeaderFontSize: 12,
            }}
            enableSwipeMonths
          />
          <View style={styles.footerRowCalendar}>
            <TouchableOpacity style={styles.btnOutline} onPress={() => { setCalendarVisible(false); setTempDate(null); }}>
              <Text style={styles.btnOutlineText}>Batal</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.btnPrimary, !tempDate && styles.btnPrimaryDisabled]}
              disabled={!tempDate}
              onPress={() => { if (tempDate) setExpiry(tempDate); setCalendarVisible(false); }}
            >
              <Text style={styles.btnPrimaryText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// ===== Styles ===== //
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: SURFACE, paddingHorizontal: 16, paddingTop: 12 },
  header: { fontSize: 20, fontWeight: "700", color: GRAY_1, textAlign: "center", marginTop: 8, marginBottom: 16 },
  searchWrap: { flexDirection: "row", alignItems: "center", backgroundColor: "#fff", borderRadius: 24, borderWidth: 1, borderColor: BORDER, height: 44 },
  searchInput: { flex: 1, paddingHorizontal: 12, fontSize: 14, color: GRAY_1 },

  chipsRow: { flexDirection: "row", gap: 8, paddingRight: 8 },
  chip: { flexDirection: "row", alignItems: "center", paddingHorizontal: 12, height: 32, borderRadius: 999, borderWidth: 1, borderColor: GREEN, backgroundColor: "#fff" },
  chipActive: { backgroundColor: GREEN },
  chipText: { color: GREEN, fontSize: 13, fontWeight: "600" },
  chipTextActive: { color: "#fff" },

  emptyWrap: { flex: 1, alignItems: "center", justifyContent: "center" },
  emptyIconWrap: { width: 120, height: 110, alignItems: "center", justifyContent: "center" },
  sadDot: { position: "absolute", right: 10, bottom: 6, width: 40, height: 40, borderRadius: 20, backgroundColor: "#DE4B4B", alignItems: "center", justifyContent: "center" },
  emptyTitle: { marginTop: 12, fontSize: 18, fontWeight: "700", color: GRAY_1 },
  emptyDesc: { marginTop: 6, fontSize: 13, color: GRAY_2, textAlign: "center", lineHeight: 18 },

  fab: { position: "absolute", right: 20, bottom: 96, width: 60, height: 60, borderRadius: 30, backgroundColor: GREEN, alignItems: "center", justifyContent: "center", elevation: 4, shadowColor: "#000", shadowOpacity: 0.15, shadowRadius: 8, shadowOffset: { width: 0, height: 4 } },

  // list card
  card: { backgroundColor: "#fff", borderRadius: 14, padding: 14, marginVertical: 6, borderWidth: 1, borderColor: "#eee", flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  cardTitle: { fontSize: 16, fontWeight: "600", color: GRAY_1 },
  cardRight: { flexDirection: "row", alignItems: "center", gap: 8 },
  cardQty: { fontSize: 14, color: GRAY_2 },
  badge: { backgroundColor: "#E8F5E9", borderColor: GREEN, borderWidth: 1, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 999 },
  badgeText: { color: GREEN, fontSize: 12, fontWeight: "600" },

  // modal base
  backdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.2)" },
  sheet: { position: "absolute", left: 0, right: 0, bottom: 0, backgroundColor: "#fff", borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 16, paddingBottom: 28 },
  sheetHandle: { alignSelf: "center", width: 50, height: 5, borderRadius: 3, backgroundColor: "#ddd", marginBottom: 10 },
  sheetTitle: { fontSize: 18, fontWeight: "700", textAlign: "center", color: GRAY_1, marginBottom: 16 },

  iconUploadWrap: { alignItems: "center", marginBottom: 16 },
  iconUploadBox: { width: 72, height: 72, borderRadius: 16, backgroundColor: GREEN_SOFT, alignItems: "center", justifyContent: "center" },
  iconUploadText: { marginTop: 8, color: GRAY_2 },

  label: { fontSize: 13, color: GRAY_2, marginBottom: 6, marginLeft: 4 },
  inputWrap: {},
  inputRound: { height: 44, borderRadius: 24, borderWidth: 1, borderColor: BORDER, paddingHorizontal: 14, backgroundColor: "#fff", fontSize: 14 },
  selectRound: { height: 44, borderRadius: 24, borderWidth: 1, borderColor: BORDER, paddingHorizontal: 14, backgroundColor: "#fff", flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  selectText: { fontSize: 14, color: GRAY_1 },

  rowH: { flexDirection: "row", alignItems: "center" },
  inputRoundSmallWrap: {},
  inputRoundSmall: { height: 44, borderRadius: 24, borderWidth: 1, borderColor: BORDER, paddingHorizontal: 14, backgroundColor: "#fff", fontSize: 14 },

  radioRow: { flexDirection: "row", alignItems: "center", gap: 10, marginTop: 10 },
  radioOuter: { width: 18, height: 18, borderRadius: 9, borderWidth: 2, borderColor: GRAY_3, alignItems: "center", justifyContent: "center" },
  radioInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: GREEN },
  radioLabel: { color: GRAY_1 },

  footerRow: { flexDirection: "row", alignItems: "center", gap: 12, marginTop: 18 },
  footerRowCalendar: { flexDirection: "row", alignItems: "center", gap: 12, marginTop: 12 },
  btnOutline: { flex: 1, height: 48, borderRadius: 24, borderWidth: 2, borderColor: GREEN, alignItems: "center", justifyContent: "center", backgroundColor: "#fff" },
  btnOutlineText: { color: GREEN, fontSize: 16, fontWeight: "700" },
  btnPrimary: { flex: 1, height: 48, borderRadius: 24, alignItems: "center", justifyContent: "center", backgroundColor: GREEN },
  btnPrimaryDisabled: { backgroundColor: "#CFCFCF" },
  btnPrimaryText: { color: "#fff", fontSize: 16, fontWeight: "700" },

  // picker modal
  pickerSheet: { position: "absolute", left: 0, right: 0, bottom: 0, backgroundColor: "#fff", borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 16, maxHeight: "60%" },
  pickerTitle: { textAlign: "center", fontWeight: "700", color: GRAY_1, marginBottom: 10 },
  pickerItem: { paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: BORDER },
  pickerText: { fontSize: 16, color: GRAY_1 },

  // calendar modal
  calendarSheet: { position: "absolute", left: 0, right: 0, bottom: 0, backgroundColor: "#fff", borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 16 },
});
