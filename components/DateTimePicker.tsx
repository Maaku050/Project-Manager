// DateTimePicker.tsx
import React, { useState } from "react";
import {
  Platform,
  View,
  Text,
  Pressable,
  Modal,
  StyleSheet,
  GestureResponderEvent,
} from "react-native";
import RNDateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { Spinner } from "./ui/spinner";

type Mode = "date" | "time" | "datetime";

type Props = {
  value: Date | null;
  onChange: (date: Date | null) => void;
  mode?: Mode;
  label?: string;
  minimumDate?: Date;
  maximumDate?: Date;
  placeholder?: string;
  loading?: boolean;
};

function formatLocalInputValue(d: Date | null, mode: Mode) {
  if (!d) return "";
  // datetime-local expects 'YYYY-MM-DDTHH:MM'
  const pad = (n: number) => n.toString().padStart(2, "0");
  const Y = d.getFullYear();
  const M = pad(d.getMonth() + 1);
  const D = pad(d.getDate());
  const hh = pad(d.getHours());
  const mm = pad(d.getMinutes());
  if (mode === "date") return `${Y}-${M}-${D}`;
  if (mode === "time") return `${hh}:${mm}`;
  return `${Y}-${M}-${D}T${hh}:${mm}`;
}

export default function DateTimePicker({
  value,
  onChange,
  mode = "datetime",
  label,
  minimumDate,
  maximumDate,
  placeholder = "Select...",
  loading,
}: Props) {
  const [show, setShow] = useState(false);

  // ---- WEB ----
  if (Platform.OS === "web") {
    // decide input type
    const inputType =
      mode === "date" ? "date" : mode === "time" ? "time" : "datetime-local";

    const handleWebChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const v = e.target.value;
      if (!v) {
        onChange(null);
        return;
      }
      // For datetime-local the format is "YYYY-MM-DDTHH:MM" (local)
      const parsed =
        inputType === "time"
          ? (() => {
              // only time -> combine with today's date
              const [hh, mm] = v.split(":").map(Number);
              const d = value ? new Date(value) : new Date();
              d.setHours(hh, mm, 0, 0);
              return d;
            })()
          : new Date(v);
      if (isNaN(parsed.getTime())) {
        onChange(null);
      } else {
        onChange(parsed);
      }
    };

    return (
      <View style={[styles.container, { position: "relative" }]}>
        {label ? <Text style={styles.label}>{label}</Text> : null}
        <View
          style={{
            position: "relative",
            display: "contents",
            alignItems: "center",
          }}
        >
          <input
            aria-label={label ?? "date-time"}
            type={inputType}
            value={formatLocalInputValue(value, mode)}
            onChange={handleWebChange}
            min={
              minimumDate ? formatLocalInputValue(minimumDate, mode) : undefined
            }
            max={
              maximumDate ? formatLocalInputValue(maximumDate, mode) : undefined
            }
            disabled={loading} // disable while saving
            style={{
              padding: 10,
              borderRadius: 6,
              borderWidth: 1,
              borderColor: "#ccc",
              outline: "none",
              opacity: loading ? 0.6 : 1,
            }}
          />
          {loading && (
            <View
              style={{
                position: "absolute",
                right: 0,
                left: 0,
                marginTop: 6,
              }}
            >
              <Spinner size="large" color="gray" />
            </View>
          )}
        </View>
      </View>
    );
  }

  // ---- MOBILE (iOS / Android) ----
  const onChangeMobile = (event: DateTimePickerEvent, selected?: Date) => {
    // On Android the event might be 'dismissed' (type === 'dismissed')
    // the community picker wraps event.nativeEvent?.timestamp in some versions
    // We use selected value when available.
    if (event.type === "dismissed") {
      setShow(false);
      return;
    }

    const current = selected ?? value ?? new Date();
    onChange(current);
    // on iOS you may want to keep showing (inline) but here we hide after pick.
    setShow(false);
  };

  const open = (e?: GestureResponderEvent) => setShow(true);

  return (
    <View style={styles.container}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <Pressable onPress={!loading ? open : undefined} style={styles.button}>
        {loading ? (
          <Spinner size="small" color="gray" />
        ) : (
          <Text style={styles.buttonText}>
            {value ? value.toLocaleString() : placeholder}
          </Text>
        )}
      </Pressable>

      {/* Show platform picker */}
      {show && (
        <>
          {/* For iOS the RNDateTimePicker is often shown inline or in a modal. */}
          <Modal
            visible
            transparent
            animationType="fade"
            onRequestClose={() => setShow(false)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <RNDateTimePicker
                  value={value ?? new Date()}
                  mode={mode === "datetime" ? "date" : (mode as any)} // we'll handle datetime by sequence on Android
                  display={Platform.OS === "ios" ? "spinner" : "default"}
                  onChange={onChangeMobile}
                  minimumDate={minimumDate}
                  maximumDate={maximumDate}
                />
                <Pressable onPress={() => setShow(false)} style={styles.close}>
                  <Text style={styles.closeText}>Close</Text>
                </Pressable>
              </View>
            </View>
          </Modal>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginVertical: 8 },
  label: { marginBottom: 6, fontSize: 14 },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
  },
  buttonText: { fontSize: 15 },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 16,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  close: {
    marginTop: 12,
    padding: 10,
    alignSelf: "flex-end",
  },
  closeText: {
    fontSize: 16,
    color: "#007AFF",
  },
});
