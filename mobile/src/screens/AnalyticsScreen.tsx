import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface AnalyticsScreenProps {
  userName?: string;
  onOpenWallet?: () => void;
}

export const AnalyticsScreen: React.FC<AnalyticsScreenProps> = ({
  userName = 'Reinaldo',
  onOpenWallet,
}) => {
  const [period, setPeriod] = useState<'monthly' | 'weekly'>('monthly');

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Welcome Greeting & Date Filter */}
      <View style={styles.headerBlock}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Text style={styles.welcomeText}>
            Welcome Back, <Text style={styles.userName}>{userName}</Text>
          </Text>
          <View style={styles.adminBadge}>
            <Ionicons name="shield-checkmark" size={12} color="#15803d" />
            <Text style={styles.adminBadgeText}>Admin</Text>
          </View>
        </View>
        <Text style={styles.subGreeting}>Fleet Telemetry & Logistics Operations</Text>

        <View style={styles.filterRow}>
          <View style={styles.datePill}>
            <Ionicons name="calendar-outline" size={14} color="#64748b" />
            <Text style={styles.dateText}>29 Jun, 2025 - 29 August</Text>
          </View>

          <TouchableOpacity onPress={onOpenWallet} style={styles.addWalletBtn}>
            <Ionicons name="add" size={16} color="#0d6942" />
            <Text style={styles.addWalletText}>Fuel Card</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Card 1: Green VISA Fleet Fuel Card */}
      <View style={styles.cardContainer}>
        <View style={styles.cardHeader}>
          <View>
            <Text style={styles.cardGoalTitle}>Fleet Fuel & Ops Budget</Text>
            <Text style={styles.cardGoalSub}>Operational expenditure balance</Text>
          </View>
          <TouchableOpacity style={styles.arrowCircle}>
            <Ionicons name="arrow-up-outline" size={16} color="#64748b" style={{ transform: [{ rotate: '45deg' }] }} />
          </TouchableOpacity>
        </View>

        {/* Emerald VISA Card */}
        <View style={styles.visaCard}>
          <View style={styles.visaTopRow}>
            <Text style={styles.visaLogo}>VISA</Text>
            <Ionicons name="wifi" size={18} color="#a7f3d0" style={{ transform: [{ rotate: '90deg' }] }} />
          </View>
          <Text style={styles.cardType}>FLEET CORPORATE EXPENSE</Text>
          <Text style={styles.cardBalance}>$ 78,989.09</Text>

          <View style={styles.visaBottomRow}>
            <Text style={styles.cardNumber}>•••• 909090</Text>
            <Text style={styles.cardExpiry}>EXP 09/26</Text>
          </View>
        </View>

        {/* Weekly Revenue */}
        <View style={styles.weeklyRow}>
          <View>
            <Text style={styles.weeklySub}>Weekly Fuel & Payouts</Text>
            <Text style={styles.weeklyAmount}>+3,945 USD</Text>
          </View>
          <View style={styles.badgeMint}>
            <Text style={styles.badgeMintText}>+12.8%</Text>
          </View>
        </View>
      </View>

      {/* Card 2: Packages Delivered Chart */}
      <View style={styles.cardContainer}>
        <View style={styles.cardHeader}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <View style={styles.chartIconBox}>
              <Ionicons name="cube-outline" size={16} color="#15803d" />
            </View>
            <View>
              <Text style={styles.cardGoalTitle}>Packages Delivered</Text>
              <Text style={styles.cardGoalSub}>14,820 parcels fulfilled</Text>
            </View>
          </View>

          {/* Switcher */}
          <View style={styles.periodSwitcher}>
            <TouchableOpacity
              onPress={() => setPeriod('monthly')}
              style={[styles.periodBtn, period === 'monthly' && styles.periodBtnActive]}
            >
              <Text style={[styles.periodText, period === 'monthly' && styles.periodTextActive]}>Monthly</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setPeriod('weekly')}
              style={[styles.periodBtn, period === 'weekly' && styles.periodBtnActive]}
            >
              <Text style={[styles.periodText, period === 'weekly' && styles.periodTextActive]}>Weekly</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Peak Badge */}
        <View style={{ alignItems: 'center', marginVertical: 6 }}>
          <View style={styles.peakBadge}>
            <View style={styles.peakDot} />
            <Text style={styles.peakText}>+17.8% Peak</Text>
          </View>
        </View>

        {/* Bar Chart Bars */}
        <View style={styles.chartArea}>
          <View style={styles.barItem}>
            <View style={[styles.barStriped, { height: 60 }]} />
            <Text style={styles.barLabel}>JAN</Text>
          </View>
          <View style={styles.barItem}>
            <View style={[styles.barStriped, { height: 110 }]} />
            <Text style={styles.barLabel}>FEB</Text>
          </View>
          <View style={styles.barItem}>
            <View style={[styles.barStriped, { height: 95 }]} />
            <Text style={styles.barLabel}>MAR</Text>
          </View>
          <View style={styles.barItem}>
            <View style={[styles.barActive, { height: 140 }]} />
            <Text style={[styles.barLabel, { color: '#0d6942', fontWeight: '700' }]}>APR</Text>
          </View>
          <View style={styles.barItem}>
            <View style={[styles.barStriped, { height: 105 }]} />
            <Text style={styles.barLabel}>MAY</Text>
          </View>
          <View style={styles.barItem}>
            <View style={[styles.barStriped, { height: 125 }]} />
            <Text style={styles.barLabel}>JUN</Text>
          </View>
        </View>
      </View>

      {/* Card 3: Delivery Success Rate */}
      <View style={styles.cardContainer}>
        <View style={styles.cardHeader}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <View style={[styles.chartIconBox, { backgroundColor: '#ecfdf5' }]}>
              <Ionicons name="checkmark-circle-outline" size={16} color="#10b981" />
            </View>
            <View>
              <Text style={styles.cardGoalTitle}>Delivery Success Rate</Text>
              <Text style={styles.cardGoalSub}>First-attempt completion</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.arrowCircle}>
            <Ionicons name="arrow-up-outline" size={16} color="#64748b" style={{ transform: [{ rotate: '45deg' }] }} />
          </TouchableOpacity>
        </View>

        <View style={{ alignItems: 'center', marginVertical: 12 }}>
          <Text style={{ fontSize: 11, color: '#64748b' }}>Fulfillment Efficiency</Text>
          <Text style={{ fontSize: 32, fontWeight: '800', color: '#0d6942', marginTop: 2 }}>
            98.6%
          </Text>
          <Text style={{ fontSize: 12, color: '#10b981', fontWeight: '600', marginTop: 2 }}>
            Target: 95.0% (+3.6% above goal)
          </Text>
        </View>

        {/* Buttons Row */}
        <View style={styles.actionBtnRow}>
          <TouchableOpacity style={styles.sendBtn}>
            <Text style={styles.sendText}>Dispatch</Text>
            <Ionicons name="navigate-outline" size={14} color="#ffffff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.receiveBtn}>
            <Text style={styles.receiveText}>Live Map</Text>
            <Ionicons name="map-outline" size={14} color="#121826" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Card 4: Recent Fleet Dispatch & Deliveries */}
      <View style={styles.cardContainer}>
        <View style={styles.cardHeader}>
          <View>
            <Text style={styles.cardGoalTitle}>Recent Fleet Dispatch Log</Text>
            <Text style={styles.cardGoalSub}>Live consignment tracking</Text>
          </View>
          <TouchableOpacity style={styles.arrowCircle}>
            <Ionicons name="arrow-up-outline" size={16} color="#64748b" style={{ transform: [{ rotate: '45deg' }] }} />
          </TouchableOpacity>
        </View>

        {/* Rows */}
        <View style={styles.historyList}>
          {/* Dispatch 1 */}
          <View style={styles.historyItem}>
            <View style={[styles.itemIcon, { backgroundColor: '#ecfdf5' }]}>
              <Ionicons name="cube" size={16} color="#0d6942" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.itemName}>Amazon Logistics Hub</Text>
              <Text style={styles.itemDate}>TRK-9821 • Carlos Ramos (Bike #12)</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.itemAmount}>+$185.00</Text>
              <Text style={styles.statusSuccess}>• Delivered</Text>
            </View>
          </View>

          {/* Dispatch 2 */}
          <View style={styles.historyItem}>
            <View style={[styles.itemIcon, { backgroundColor: '#e0f2fe' }]}>
              <Ionicons name="car" size={16} color="#0284c7" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.itemName}>MediCare Cold-Chain Cargo</Text>
              <Text style={styles.itemDate}>TRK-9784 • David Kim (Van #04)</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.itemAmount}>+$420.50</Text>
              <Text style={styles.statusSuccess}>• Delivered</Text>
            </View>
          </View>

          {/* Dispatch 3 */}
          <View style={styles.historyItem}>
            <View style={[styles.itemIcon, { backgroundColor: '#fef3c7' }]}>
              <Ionicons name="bicycle" size={16} color="#d97706" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.itemName}>FreshMart Express</Text>
              <Text style={styles.itemDate}>TRK-9750 • Sofia Patel (Scooter #09)</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.itemAmount}>+$312.20</Text>
              <Text style={{ fontSize: 11, color: '#d97706', fontWeight: '600' }}>• In Transit</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Card 5: Active Riders on Duty (Replaces Amount of Credit) */}
      <View style={styles.cardContainer}>
        <View style={styles.cardHeader}>
          <View>
            <Text style={styles.cardGoalTitle}>Active Riders on Duty</Text>
            <Text style={styles.cardGoalSub}>Riders dispatched & tracking live</Text>
          </View>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginVertical: 12 }}>
          <Text style={{ fontSize: 28, fontWeight: '800', color: '#121826' }}>142 Riders</Text>
          <View style={styles.badgeMint}>
            <Text style={styles.badgeMintText}>+14 on shift</Text>
          </View>
        </View>

        {/* Fleet Composition Chips */}
        <View style={{ flexDirection: 'row', gap: 6, marginBottom: 12 }}>
          <View style={styles.chipPill}><Text style={styles.chipText}>89 Bikes</Text></View>
          <View style={styles.chipPill}><Text style={styles.chipText}>34 Vans</Text></View>
          <View style={styles.chipPill}><Text style={styles.chipText}>19 Trucks</Text></View>
        </View>

        <View style={{ paddingTop: 14, borderTopWidth: 1, borderTopColor: '#f1f5f9' }}>
          <Text style={{ fontSize: 13, fontWeight: '700', color: '#1e293b', marginBottom: 10 }}>
            Top Shift Riders
          </Text>

          {/* Avatar stack */}
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <View style={{ flexDirection: 'row' }}>
              {['#0d6942', '#0284c7', '#d97706', '#7c3aed'].map((bg, idx) => (
                <View
                  key={idx}
                  style={[
                    styles.avatarBubble,
                    { marginLeft: idx === 0 ? 0 : -8, backgroundColor: bg },
                  ]}
                >
                  <Ionicons name="person" size={13} color="#ffffff" />
                </View>
              ))}
            </View>
            <View style={styles.avatarPlus}>
              <Text style={styles.avatarPlusText}>+138</Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eff2f6',
  },
  content: {
    padding: 16,
    paddingBottom: 30,
    gap: 16,
  },
  headerBlock: {
    marginBottom: 4,
  },
  welcomeText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#121826',
    letterSpacing: -0.3,
  },
  userName: {
    fontWeight: '400',
    color: '#0d6942',
  },
  adminBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#dcfce7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  adminBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#15803d',
  },
  subGreeting: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
    marginBottom: 10,
  },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  datePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#ffffff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  dateText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#334155',
  },
  addWalletBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#ffffff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  addWalletText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0d6942',
  },
  cardContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 22,
    padding: 16,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    shadowColor: '#121826',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  cardGoalTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#171c26',
  },
  cardGoalSub: {
    fontSize: 11,
    color: '#94a3b8',
    marginTop: 2,
  },
  arrowCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  visaCard: {
    backgroundColor: '#0d6942',
    borderRadius: 18,
    padding: 16,
    shadowColor: '#0d6942',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 4,
  },
  visaTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  visaLogo: {
    fontSize: 18,
    fontWeight: '900',
    fontStyle: 'italic',
    color: '#ffffff',
    letterSpacing: 1,
  },
  cardType: {
    fontSize: 10,
    fontWeight: '700',
    color: '#a7f3d0',
    letterSpacing: 0.5,
  },
  cardBalance: {
    fontSize: 22,
    fontWeight: '800',
    color: '#ffffff',
    marginVertical: 8,
  },
  visaBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardNumber: {
    fontSize: 12,
    color: '#d1fae5',
    letterSpacing: 2,
  },
  cardExpiry: {
    fontSize: 11,
    color: '#d1fae5',
  },
  weeklyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  weeklySub: {
    fontSize: 11,
    color: '#64748b',
  },
  weeklyAmount: {
    fontSize: 17,
    fontWeight: '800',
    color: '#111827',
    marginTop: 2,
  },
  badgeMint: {
    backgroundColor: '#d1fae5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  badgeMintText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#065f46',
  },
  chipPill: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  chipText: {
    fontSize: 11,
    color: '#475569',
    fontWeight: '600',
  },
  chartIconBox: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: '#f0fdf4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  periodSwitcher: {
    flexDirection: 'row',
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 20,
    padding: 2,
  },
  periodBtn: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
  },
  periodBtnActive: {
    backgroundColor: '#0d6942',
  },
  periodText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#64748b',
  },
  periodTextActive: {
    color: '#ffffff',
  },
  peakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#0d6942',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  peakDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#34d399',
  },
  peakText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#ffffff',
  },
  chartArea: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 150,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    paddingBottom: 6,
    paddingHorizontal: 6,
  },
  barItem: {
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  barStriped: {
    width: 14,
    backgroundColor: '#cbd5e1',
    borderRadius: 6,
  },
  barActive: {
    width: 14,
    backgroundColor: '#0d6942',
    borderRadius: 6,
  },
  barLabel: {
    fontSize: 10,
    color: '#64748b',
    fontWeight: '600',
  },
  actionBtnRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },
  sendBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#0d6942',
    paddingVertical: 10,
    borderRadius: 20,
  },
  sendText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  receiveBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#f1f5f9',
    paddingVertical: 10,
    borderRadius: 20,
  },
  receiveText: {
    color: '#121826',
    fontSize: 12,
    fontWeight: '700',
  },
  historyList: {
    gap: 12,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  itemIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1e293b',
  },
  itemDate: {
    fontSize: 10,
    color: '#64748b',
    marginTop: 2,
  },
  itemAmount: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1e293b',
  },
  statusSuccess: {
    fontSize: 10,
    color: '#0d6942',
    fontWeight: '600',
    marginTop: 2,
  },
  avatarBubble: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarPlus: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#0d6942',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarPlusText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#ffffff',
  },
});
