import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export const SalesScreen: React.FC = () => {
  const zones = [
    { name: 'Downtown Commercial', revenue: '$98,450.00', orders: '4,920', growth: '+24.5%', pct: '38%' },
    { name: 'Financial District', revenue: '$76,120.00', orders: '3,800', growth: '+18.2%', pct: '29%' },
    { name: 'Airport Cargo Hub', revenue: '$52,340.00', orders: '2,610', growth: '+15.7%', pct: '20%' },
    { name: 'Midtown Tech Center', revenue: '$34,180.00', orders: '1,710', growth: '+12.1%', pct: '13%' },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Sales Velocity</Text>
        <Text style={styles.subtitle}>Regional order density and GMV</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardSub}>Gross Merchandise Value</Text>
        <Text style={styles.gmvVal}>$261,090.00</Text>
        <View style={styles.badgeMint}>
          <Text style={styles.badgeMintText}>+22.4% vs last period</Text>
        </View>
      </View>

      <View style={styles.row}>
        <View style={[styles.card, { flex: 1 }]}>
          <Text style={styles.cardSub}>Total Orders</Text>
          <Text style={[styles.val, { color: '#0d6942' }]}>13,040</Text>
          <Text style={styles.subLbl}>99.2% on-time</Text>
        </View>

        <View style={[styles.card, { flex: 1 }]}>
          <Text style={styles.cardSub}>Avg Ticket</Text>
          <Text style={styles.val}>$20.02</Text>
          <Text style={styles.subLbl}>+$1.45 growth</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={[styles.title, { fontSize: 16, marginBottom: 12 }]}>Zone Performance</Text>

        {zones.map((z, idx) => (
          <View key={idx} style={styles.zoneItem}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <Ionicons name="location-sharp" size={12} color="#0d6942" />
                <Text style={styles.zoneName}>{z.name}</Text>
              </View>
              <Text style={styles.zoneGrowth}>{z.growth}</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
              <Text style={styles.zoneOrders}>{z.orders} orders</Text>
              <Text style={styles.zoneRev}>{z.revenue}</Text>
            </View>
            <View style={styles.barBg}>
              <View style={[styles.barFill, { width: z.pct as unknown as number }]} />
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#eff2f6' },
  content: { padding: 16, paddingBottom: 30, gap: 14 },
  header: { marginBottom: 2 },
  title: { fontSize: 22, fontWeight: '800', color: '#121826' },
  subtitle: { fontSize: 12, color: '#64748b', marginTop: 2 },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#eef2f6',
  },
  row: { flexDirection: 'row', gap: 12 },
  cardSub: { fontSize: 11, color: '#64748b' },
  gmvVal: { fontSize: 28, fontWeight: '800', color: '#121826', marginVertical: 6 },
  val: { fontSize: 22, fontWeight: '800', color: '#121826', marginVertical: 4 },
  subLbl: { fontSize: 10, color: '#94a3b8' },
  badgeMint: {
    backgroundColor: '#d1fae5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  badgeMintText: { color: '#065f46', fontSize: 10, fontWeight: '700' },
  zoneItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f8fafc',
  },
  zoneName: { fontSize: 13, fontWeight: '700', color: '#1e293b' },
  zoneGrowth: { fontSize: 11, fontWeight: '700', color: '#0d6942' },
  zoneOrders: { fontSize: 11, color: '#64748b' },
  zoneRev: { fontSize: 12, fontWeight: '800', color: '#121826' },
  barBg: {
    height: 6,
    backgroundColor: '#f1f5f9',
    borderRadius: 3,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    backgroundColor: '#0d6942',
    borderRadius: 3,
  },
});
