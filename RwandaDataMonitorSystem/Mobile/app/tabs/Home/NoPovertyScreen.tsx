/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Modal,
  Dimensions,
  Image,
  Platform,
} from "react-native";

import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import { LineChart, BarChart } from "react-native-chart-kit";

/* =========================
   MAPS (SAFE FOR WEB)
========================= */
let MapView: any = null;
let Marker: any = null;
let Callout: any = null;
let Circle: any = null;

if (Platform.OS !== "web") {
  const Maps = require("react-native-maps");
  MapView = Maps.default;
  Marker = Maps.Marker;
  Callout = Maps.Callout;
  Circle = Maps.Circle;
}

/* =========================
   DIMENSIONS
========================= */
const { width, height } = Dimensions.get("window");

/* =========================
   MAIN COMPONENT
========================= */
export default function NoPovertyScreen() {
  const [selectedTarget, setSelectedTarget] = useState<string | null>(null);
  const [showMap, setShowMap] = useState(false);
  const [showTrends, setShowTrends] = useState(false);
  const [mapTarget, setMapTarget] = useState<string | null>(null);
  const [trendsTarget, setTrendsTarget] = useState<string | null>(null);

  /* =========================
     TARGETS SUMMARY
  ========================= */
  const targets = [
    { id: "1.1", title: "Extreme Poverty Eradication", progress: 34, icon: "attach-money" },
    { id: "1.2", title: "National Poverty Reduction", progress: 63, icon: "groups" },
    { id: "1.3", title: "Social Protection Systems", progress: 78, icon: "security" },
    { id: "1.4", title: "Equal Rights & Resources", progress: 27, icon: "home" },
    { id: "1.5", title: "Climate Resilience", progress: 52, icon: "eco" },
    { id: "1.a", title: "Resource Mobilization", progress: 45, icon: "account-balance" },
    { id: "1.b", title: "Policy Frameworks", progress: 20, icon: "policy" },
  ];

  /* =========================
     TARGET DETAILS (SHORTENED)
     (You can keep all your
      existing data here)
  ========================= */
  const targetDetails: any = {
    "1.1": {
      color: "#FF6B6B",
      icon: "attach-money",
      source: "NISR 2023",
      lastUpdated: "2023",
      region: {
        latitude: -1.9403,
        longitude: 29.8739,
        latitudeDelta: 3,
        longitudeDelta: 3,
      },
      locations: [
        { latitude: -1.9403, longitude: 29.8739, value: 34, title: "Kigali", description: "34% extreme poverty" },
      ],
      trends: [
        { year: "2017", value: 34 },
        { year: "2020", value: 30 },
        { year: "2023", value: 26 },
      ],
    },
  };

  /* =========================
     ICON HELPER
  ========================= */
  const getIcon = (name: string, size = 22, color = "white") => {
    const map: any = {
      "attach-money": <MaterialIcons name="attach-money" size={size} color={color} />,
      groups: <MaterialIcons name="groups" size={size} color={color} />,
      security: <MaterialIcons name="security" size={size} color={color} />,
      home: <MaterialIcons name="home" size={size} color={color} />,
      eco: <MaterialIcons name="eco" size={size} color={color} />,
      "account-balance": <MaterialIcons name="account-balance" size={size} color={color} />,
      policy: <MaterialIcons name="policy" size={size} color={color} />,
    };
    return map[name] || <Ionicons name="help" size={size} color={color} />;
  };

  /* =========================
     MAP MODAL (SAFE)
  ========================= */
  const renderMapModal = () => {
    if (!showMap || !mapTarget) return null;

    if (Platform.OS === "web") {
      return (
        <Modal visible transparent animationType="slide">
          <View style={styles.webMapFallback}>
            <Text style={styles.webMapText}>
              Map view is available on mobile devices only
            </Text>
            <TouchableOpacity onPress={() => setShowMap(false)}>
              <Text style={styles.closeWeb}>Close</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      );
    }

    const target = targetDetails[mapTarget];

    return (
      <Modal visible animationType="slide">
        <View style={{ flex: 1 }}>
          <MapView style={{ flex: 1 }} region={target.region}>
            {target.locations.map((loc: any, i: number) => (
              <Marker key={i} coordinate={loc}>
                <Callout>
                  <Text>{loc.description}</Text>
                </Callout>
              </Marker>
            ))}
          </MapView>

          <TouchableOpacity style={styles.closeBtn} onPress={() => setShowMap(false)}>
            <Ionicons name="close" size={28} color="white" />
          </TouchableOpacity>
        </View>
      </Modal>
    );
  };

  /* =========================
     TRENDS MODAL
  ========================= */
  const renderTrendsModal = () => {
    if (!showTrends || !trendsTarget) return null;

    const target = targetDetails[trendsTarget];

    return (
      <Modal visible animationType="slide">
        <ScrollView style={{ flex: 1, padding: 20 }}>
          <Text style={styles.sectionHeader}>Trends</Text>

          <LineChart
            data={{
              labels: target.trends.map((t: any) => t.year),
              datasets: [{ data: target.trends.map((t: any) => t.value) }],
            }}
            width={width - 40}
            height={220}
            chartConfig={{
              backgroundColor: "#fff",
              backgroundGradientFrom: "#fff",
              backgroundGradientTo: "#fff",
              color: () => target.color,
            }}
          />

          <TouchableOpacity style={styles.closeBtnDark} onPress={() => setShowTrends(false)}>
            <Text style={{ color: "white" }}>Close</Text>
          </TouchableOpacity>
        </ScrollView>
      </Modal>
    );
  };

  /* =========================
     MAIN UI
  ========================= */
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView>
        <View style={styles.header}>
          <Image
            source={require("../../../Assets/Images/nopoverty.png")}
            style={{ width: 120, height: 60 }}
            resizeMode="contain"
          />
          <Text style={styles.headerTitle}>No Poverty</Text>
        </View>

        {targets.map((t) => (
          <TouchableOpacity
            key={t.id}
            style={styles.card}
            onPress={() => setSelectedTarget(t.id)}
          >
            {getIcon(t.icon)}
            <Text style={styles.cardText}>{t.title}</Text>

            <AnimatedCircularProgress
              size={50}
              width={6}
              fill={t.progress}
              tintColor="#E5243B"
              backgroundColor="#eee"
            >
              {() => <Text>{t.progress}%</Text>}
            </AnimatedCircularProgress>

            <TouchableOpacity onPress={() => { setMapTarget(t.id); setShowMap(true); }}>
              <MaterialIcons name="map" size={20} />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => { setTrendsTarget(t.id); setShowTrends(true); }}>
              <MaterialIcons name="trending-up" size={20} />
            </TouchableOpacity>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {renderMapModal()}
      {renderTrendsModal()}
    </SafeAreaView>
  );
}

/* =========================
   STYLES
========================= */
const styles = StyleSheet.create({
  header: {
    backgroundColor: "#E5243B",
    padding: 20,
    alignItems: "center",
  },
  headerTitle: {
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 10,
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    margin: 10,
    backgroundColor: "#fff",
    borderRadius: 12,
    elevation: 2,
  },
  cardText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
  },
  closeBtn: {
    position: "absolute",
    top: 40,
    right: 20,
    backgroundColor: "#000",
    padding: 8,
    borderRadius: 20,
  },
  closeBtnDark: {
    backgroundColor: "#E5243B",
    padding: 15,
    marginTop: 30,
    borderRadius: 10,
    alignItems: "center",
  },
  webMapFallback: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  webMapText: {
    fontSize: 16,
    marginBottom: 20,
  },
  closeWeb: {
    color: "#E5243B",
    fontWeight: "bold",
  },
});
