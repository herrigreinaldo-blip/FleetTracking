import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export const FinanceScreen: React.FC = () => {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Finance & Payouts</Text>
        <Text style={styles.subtitle}>Fleet earnings and treasury distribution</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardSub}>Platform Net Liquidity</Text>
        <Text style={styles.balance}>$112,480.20</Text>
        <View style={styles.badgeMint}>
          <Text style={styles.badgeMintText}>+18.4% monthly growth</Text>
        </View>
      </View>

      <View style={styles.row}>
        <View style={[styles.card, { flex: 1 }]}>
          <Text style={styles.cardSub}>Disbursed Payouts</Text>
          <Text style={[styles.val, { color: '#0d6942' }]}>$68,910</Text>
          <Text style={styles.subLbl}>42 partners</Text>
        </View>

        <View style={[styles.card, { flex: 1 }]}>
          <Text style={styles.cardSub}>Operating Margin</Text>
          <Text style={styles.val}>24.6%</Text>
          <Text style={styles.subLbl}>+2.1% efficiency</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={[styles.title, { fontSize: 16, marginBottom: 8 }]}>Recent Rider Payouts</Text>

        {[
          { rider: 'Marcus Vance', period: 'Jun 1 - Jun 15', amount: '$3,732.00', status: 'Transferred' },
          { rider: 'Elena Rostova', period: 'Jun 1 - Jun 15', amount: '$2,866.00', status: 'Transferred' },
          { rider: 'Tariq Al-Mansoor', period: 'Jun 1 - Jun 15', amount: '$4,720.00', status: 'Transferred' },
          { rider: 'David Kim', period: 'Jun 16 - Jun 30', amount: '$2,400.00', status: 'Processing' },
        ].map((item, idx) => (
          <View key={idx} style={styles.payoutRow}>
            <View>
              <Text style={styles.riderName}>{item.rider}</Text>
              <Text style={styles.periodText}>{item.period}</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.payoutAmount}>{item.amount}</Text>
              <Text style={[
                styles.statusText,
                item.status === 'Transferred' ? { color: '#065f46' } : { color: '#d97706' },
              ]}>
                • {item.status}
              </Text>
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
  balance: { fontSize: 28, fontWeight: '800', color: '#121826', marginVertical: 6 },
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
  payoutRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f8fafc',
  },
  riderName: { fontSize: 13, fontWeight: '700', color: '#1e293b' },
  periodText: { fontSize: 10, color: '#94a3b8', marginTop: 2 },
  payoutAmount: { fontSize: 13, fontWeight: '700', color: '#0d6942' },
  statusText: { fontSize: 10, fontWeight: '600', marginTop: 2 },
});
