import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface InvItem {
  id: string;
  num: string;
  client: string;
  amount: string;
  due: string;
  status: 'Paid' | 'Pending' | 'Overdue';
}

const INVOICES: InvItem[] = [
  { id: '1', num: 'INV-2025-081', client: 'Dribbble Design', amount: '$89,345.23', due: '25 Jun 2025', status: 'Paid' },
  { id: '2', num: 'INV-2025-082', client: 'Google Pay Ops', amount: '$12,345.89', due: '27 Jun 2025', status: 'Paid' },
  { id: '3', num: 'INV-2025-083', client: 'Amazon Shopping', amount: '$32,123.67', due: '29 Jun 2025', status: 'Paid' },
  { id: '4', num: 'INV-2025-084', client: 'FreshFarm Chain', amount: '$18,450.00', due: '05 Jul 2025', status: 'Pending' },
  { id: '5', num: 'INV-2025-085', client: 'Supreme Apparel', amount: '$9,280.50', due: '16 Jun 2025', status: 'Overdue' },
];

export const InvoicesScreen: React.FC = () => {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Invoices & Billing</Text>
        <Text style={styles.subtitle}>Corporate settlements & receivables</Text>
      </View>

      {/* Overview Cards */}
      <View style={styles.metricsRow}>
        <View style={styles.metricCard}>
          <Text style={styles.metricVal}>$161.5k</Text>
          <Text style={styles.metricLbl}>Total Billed</Text>
        </View>
        <View style={styles.metricCard}>
          <Text style={[styles.metricVal, { color: '#0d6942' }]}>$133.8k</Text>
          <Text style={styles.metricLbl}>Collected</Text>
        </View>
        <View style={styles.metricCard}>
          <Text style={[styles.metricVal, { color: '#d97706' }]}>$27.7k</Text>
          <Text style={styles.metricLbl}>Pending</Text>
        </View>
      </View>

      {/* Invoice list */}
      <View style={{ gap: 12 }}>
        {INVOICES.map(inv => (
          <View key={inv.id} style={styles.card}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Ionicons name="document-text-outline" size={16} color="#0d6942" />
                <Text style={styles.invNum}>{inv.num}</Text>
              </View>
              <Text style={styles.amount}>{inv.amount}</Text>
            </View>

            <View style={{ marginTop: 6 }}>
              <Text style={styles.client}>{inv.client}</Text>
              <Text style={styles.due}>Due: {inv.due}</Text>
            </View>

            <View style={styles.bottomRow}>
              <View style={[
                styles.badge,
                inv.status === 'Paid' && { backgroundColor: '#d1fae5' },
                inv.status === 'Pending' && { backgroundColor: '#fef3c7' },
                inv.status === 'Overdue' && { backgroundColor: '#fee2e2' },
              ]}>
                <Text style={[
                  styles.badgeText,
                  inv.status === 'Paid' && { color: '#065f46' },
                  inv.status === 'Pending' && { color: '#92400e' },
                  inv.status === 'Overdue' && { color: '#b91c1c' },
                ]}>
                  {inv.status}
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
  metricsRow: { flexDirection: 'row', gap: 8 },
  metricCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#eef2f6',
    alignItems: 'center',
  },
  metricVal: { fontSize: 17, fontWeight: '800', color: '#121826' },
  metricLbl: { fontSize: 10, color: '#64748b', marginTop: 2 },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#eef2f6',
  },
  invNum: { fontSize: 14, fontWeight: '800', color: '#121826' },
  amount: { fontSize: 14, fontWeight: '800', color: '#0d6942' },
  client: { fontSize: 13, fontWeight: '700', color: '#1e293b' },
  due: { fontSize: 11, color: '#64748b', marginTop: 2 },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
  },
  badge: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 12 },
  badgeText: { fontSize: 10, fontWeight: '700' },
});
