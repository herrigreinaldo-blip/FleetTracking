import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface PkgItem {
  id: string;
  tracking: string;
  recipient: string;
  address: string;
  rider: string;
  fee: string;
  status: 'In Transit' | 'Delivered' | 'Pending';
}

const PKGS: PkgItem[] = [
  { id: '1', tracking: 'QX-98214', recipient: 'Sarah Jenkins', address: '128 W 82nd St', rider: 'Marcus Vance', fee: '$28.50', status: 'In Transit' },
  { id: '2', tracking: 'QX-98215', recipient: 'Alexander Wright', address: '245 Park Ave', rider: 'Elena Rostova', fee: '$45.00', status: 'In Transit' },
  { id: '3', tracking: 'QX-98216', recipient: 'Michael Chang', address: '310 Riverside Dr', rider: 'David Kim', fee: '$18.00', status: 'Delivered' },
  { id: '4', tracking: 'QX-98217', recipient: 'Olivia Martinez', address: '55 Wall St', rider: 'Tariq Al-Mansoor', fee: '$32.00', status: 'Pending' },
];

export const PackagesScreen: React.FC = () => {
  const [filter, setFilter] = useState('All');

  const filtered = PKGS.filter(p => filter === 'All' ? true : p.status === filter);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Packages & Dispatches</Text>
        <Text style={styles.subtitle}>Real-time delivery routing</Text>
      </View>

      <View style={styles.filterRow}>
        {['All', 'In Transit', 'Delivered', 'Pending'].map(f => (
          <TouchableOpacity
            key={f}
            onPress={() => setFilter(f)}
            style={[styles.filterChip, filter === f && styles.filterChipActive]}
          >
            <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>{f}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={{ gap: 12 }}>
        {filtered.map(item => (
          <View key={item.id} style={styles.card}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <View style={styles.iconCircle}>
                  <Ionicons name="cube-outline" size={16} color="#0d6942" />
                </View>
                <Text style={styles.tracking}>{item.tracking}</Text>
              </View>
              <Text style={styles.fee}>{item.fee}</Text>
            </View>

            <View style={{ marginTop: 8 }}>
              <Text style={styles.recipient}>To: {item.recipient}</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 }}>
                <Ionicons name="location-sharp" size={12} color="#0d6942" />
                <Text style={styles.address}>{item.address}</Text>
              </View>
            </View>

            <View style={styles.cardBottom}>
              <Text style={styles.riderText}>Courier: {item.rider}</Text>
              <View style={[
                styles.badge,
                item.status === 'In Transit' && { backgroundColor: '#e0f2fe' },
                item.status === 'Delivered' && { backgroundColor: '#d1fae5' },
                item.status === 'Pending' && { backgroundColor: '#fef3c7' },
              ]}>
                <Text style={[
                  styles.badgeText,
                  item.status === 'In Transit' && { color: '#0369a1' },
                  item.status === 'Delivered' && { color: '#065f46' },
                  item.status === 'Pending' && { color: '#92400e' },
                ]}>
                  {item.status}
                </Text>
              </View>
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
  filterRow: { flexDirection: 'row', gap: 8 },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  filterChipActive: { backgroundColor: '#0d6942', borderColor: '#0d6942' },
  filterText: { fontSize: 11, fontWeight: '600', color: '#64748b' },
  filterTextActive: { color: '#ffffff' },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#eef2f6',
  },
  iconCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tracking: { fontSize: 14, fontWeight: '800', color: '#121826' },
  fee: { fontSize: 14, fontWeight: '800', color: '#0d6942' },
  recipient: { fontSize: 13, fontWeight: '700', color: '#1e293b' },
  address: { fontSize: 11, color: '#64748b', marginTop: 2 },
  cardBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f8fafc',
  },
  riderText: { fontSize: 11, color: '#475569', fontWeight: '500' },
  badge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10 },
  badgeText: { fontSize: 10, fontWeight: '700' },
});
