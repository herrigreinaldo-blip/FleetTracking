import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface HeaderProps {
  userName?: string;
  activeTab?: string;
  onSelectTab?: (tab: string) => void;
  searchQuery?: string;
  onSearchChange?: (q: string) => void;
  onLogout?: () => void;
  isLoggedIn?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  userName = 'Reinaldo',
  activeTab = 'calendar',
  onSelectTab = () => {},
  searchQuery = '',
  onSearchChange = () => {},
  onLogout,
  isLoggedIn = false,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedEntity, setSelectedEntity] = useState('MS Herrig Ltd');
  const [showAlertModal, setShowAlertModal] = useState(false);

  const navItems = [
    { id: 'calendar', label: 'Roster & Dispatch Matrix', sub: '4-Week Cycle & Driver Allocations', icon: 'calendar-outline' as const },
    { id: 'fleet', label: 'Fleet Telemetry & Escrows', sub: 'Vehicle Compliance & Van Damage Deposits', icon: 'car-outline' as const },
    { id: 'finance', label: 'Multi-Entity Banking & P&L', sub: 'NatWest Accounts & Director Drawings', icon: 'business-outline' as const },
    { id: 'payroll', label: 'Driver 4-Week Remittances', sub: '6% Admin Fee, Van Leases & VAT', icon: 'card-outline' as const },
    { id: 'vat', label: 'HMRC VAT & Carrier Audits', sub: 'Box 1-9 Returns & DPD Discrepancies', icon: 'shield-checkmark-outline' as const },
  ];

  const entities = [
    'MS Herrig Ltd (Primary)',
    'TGB Services and Solutions Ltd',
    'GoConnect Partnership',
    'Consolidated (All 3 Entities)'
  ];

  return (
    <View style={styles.wrapper}>
      {/* Top Bar: Hamburger, Brand & Actions */}
      <View style={styles.topBar}>
        <View style={styles.leftGroup}>
          {/* Hamburger Menu Toggle Button */}
          <TouchableOpacity
            onPress={() => setIsMenuOpen(true)}
            style={styles.hamburgerBtn}
            accessibilityLabel="Open Navigation Menu"
          >
            <Ionicons name="menu-outline" size={20} color="#0f172a" />
          </TouchableOpacity>

          <View style={styles.brandTitleGroup}>
            <Text style={styles.brandTitle}>Delivery Finance</Text>
            <Text style={styles.brandSub}>{selectedEntity.split(' ')[0]} • DPD Fleet</Text>
          </View>
        </View>

        <View style={styles.rightGroup}>
          {/* Compliance Alerts Badge Button */}
          <TouchableOpacity
            onPress={() => setShowAlertModal(true)}
            style={styles.alertBtn}
          >
            <Ionicons name="notifications-outline" size={17} color="#334155" />
            <View style={styles.alertDot}>
              <Text style={styles.alertDotText}>2</Text>
            </View>
          </TouchableOpacity>

          {/* User Avatar Initials */}
          <View style={styles.userAvatar}>
            <Text style={styles.userAvatarText}>{userName.charAt(0).toUpperCase()}</Text>
          </View>
        </View>
      </View>

      {/* Sleek Top Search Bar */}
      <View style={styles.searchBarContainer}>
        <Ionicons name="search-outline" size={15} color="#94a3b8" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search routes, vehicles, drivers, invoices..."
          placeholderTextColor="#94a3b8"
          value={searchQuery}
          onChangeText={onSearchChange}
          returnKeyType="search"
          autoCorrect={false}
        />
        {(searchQuery?.length || 0) > 0 && (
          <TouchableOpacity onPress={() => onSearchChange('')} style={styles.clearBtn}>
            <Ionicons name="close-circle" size={16} color="#94a3b8" />
          </TouchableOpacity>
        )}
      </View>

      {/* Hamburger Drawer Navigation Modal */}
      <Modal visible={isMenuOpen} transparent animationType="slide">
        <View style={styles.drawerOverlay}>
          <View style={styles.drawerCard}>
            {/* Drawer Header */}
            <View style={styles.drawerHeader}>
              <View>
                <Text style={styles.drawerTitle}>Delivery Finance Hub</Text>
                <Text style={styles.drawerUser}>{userName} (Director Admin)</Text>
              </View>
              <TouchableOpacity onPress={() => setIsMenuOpen(false)} style={styles.drawerCloseBtn}>
                <Ionicons name="close" size={20} color="#64748b" />
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.drawerScroll}>
              {/* Company Entity Switcher Section */}
              <View style={styles.drawerSection}>
                <Text style={styles.drawerSectionLabel}>ACTIVE COMPANY ENTITY</Text>
                <View style={styles.entityList}>
                  {entities.map(ent => {
                    const isSel = selectedEntity.startsWith(ent.split(' ')[0]);
                    return (
                      <TouchableOpacity
                        key={ent}
                        onPress={() => setSelectedEntity(ent)}
                        style={[styles.entityItem, isSel && styles.entityItemActive]}
                      >
                        <Ionicons
                          name="business-outline"
                          size={14}
                          color={isSel ? '#0d6942' : '#64748b'}
                        />
                        <Text style={[styles.entityItemText, isSel && styles.entityItemTextActive]}>
                          {ent}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              {/* Navigation Links */}
              <View style={styles.drawerSection}>
                <Text style={styles.drawerSectionLabel}>NAVIGATION MODULES</Text>
                <View style={styles.navLinksList}>
                  {navItems.map(item => {
                    const isActive = activeTab === item.id;
                    return (
                      <TouchableOpacity
                        key={item.id}
                        onPress={() => {
                          onSelectTab(item.id);
                          setIsMenuOpen(false);
                        }}
                        style={[styles.navLinkItem, isActive && styles.navLinkItemActive]}
                      >
                        <View style={[styles.navIconBox, isActive && styles.navIconBoxActive]}>
                          <Ionicons
                            name={item.icon}
                            size={16}
                            color={isActive ? '#ffffff' : '#0d6942'}
                          />
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text style={[styles.navLinkText, isActive && styles.navLinkTextActive]}>
                            {item.label}
                          </Text>
                          <Text style={styles.navLinkSub}>{item.sub}</Text>
                        </View>
                        <Ionicons
                          name="chevron-forward"
                          size={14}
                          color={isActive ? '#0d6942' : '#cbd5e1'}
                        />
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              {/* Compliance Alerts Drawer Banner */}
              <TouchableOpacity
                onPress={() => {
                  setIsMenuOpen(false);
                  setShowAlertModal(true);
                }}
                style={styles.drawerAlertBanner}
              >
                <Ionicons name="warning-outline" size={16} color="#991b1b" />
                <View style={{ flex: 1 }}>
                  <Text style={styles.drawerAlertTitle}>2 Compliance Alerts Pending</Text>
                  <Text style={styles.drawerAlertSub}>VN71 MOT (18 days) • Route 593 Discrepancy</Text>
                </View>
                <Ionicons name="chevron-forward" size={13} color="#991b1b" />
              </TouchableOpacity>

              {/* Logout Option */}
              {isLoggedIn && onLogout && (
                <TouchableOpacity
                  onPress={() => {
                    setIsMenuOpen(false);
                    onLogout();
                  }}
                  style={styles.drawerLogoutBtn}
                >
                  <Ionicons name="log-out-outline" size={16} color="#dc2626" />
                  <Text style={styles.drawerLogoutText}>Sign Out from Fleet Hub</Text>
                </TouchableOpacity>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Compliance Alert Modal */}
      <Modal visible={showAlertModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Active Compliance Notifications</Text>
              <TouchableOpacity onPress={() => setShowAlertModal(false)}>
                <Ionicons name="close" size={18} color="#64748b" />
              </TouchableOpacity>
            </View>

            <View style={styles.alertBox}>
              <Ionicons name="car-outline" size={16} color="#b91c1c" />
              <View style={{ flex: 1 }}>
                <Text style={styles.alertBoxTitle}>VN71 DPD: MOT Due in 18 Days</Text>
                <Text style={styles.alertBoxSub}>Expires 15-Nov-2026. Schedule garage service.</Text>
              </View>
            </View>

            <View style={[styles.alertBox, { backgroundColor: '#fffbeb', borderColor: '#fde68a' }]}>
              <Ionicons name="alert-circle-outline" size={16} color="#b45309" />
              <View style={{ flex: 1 }}>
                <Text style={[styles.alertBoxTitle, { color: '#92400e' }]}>Route 593: -£57.42 DPD Discrepancy</Text>
                <Text style={[styles.alertBoxSub, { color: '#78350f' }]}>Dispute letter drafted for Week 41.</Text>
              </View>
            </View>

            <TouchableOpacity onPress={() => setShowAlertModal(false)} style={styles.dismissBtn}>
              <Text style={styles.dismissBtnText}>Dismiss</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    paddingTop: 44,
    paddingBottom: 8,
    paddingHorizontal: 12,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  leftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  hamburgerBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandTitleGroup: {
    gap: 1,
  },
  brandTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: '#0f172a',
    letterSpacing: -0.2,
  },
  brandSub: {
    fontSize: 9,
    fontWeight: '700',
    color: '#0d6942',
    letterSpacing: 0.3,
  },
  rightGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  alertBtn: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  alertDot: {
    position: 'absolute',
    top: -3,
    right: -3,
    backgroundColor: '#ef4444',
    width: 14,
    height: 14,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  alertDotText: {
    color: '#ffffff',
    fontSize: 8,
    fontWeight: '800',
  },
  userAvatar: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: '#0d6942',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userAvatarText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '800',
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    paddingHorizontal: 8,
    height: 34,
  },
  searchIcon: {
    marginRight: 6,
  },
  searchInput: {
    flex: 1,
    fontSize: 12,
    color: '#0f172a',
    paddingVertical: 0,
  },
  clearBtn: {
    padding: 2,
  },
  drawerOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'flex-start',
  },
  drawerCard: {
    backgroundColor: '#ffffff',
    width: '85%',
    height: '100%',
    paddingTop: 48,
    paddingHorizontal: 16,
    paddingBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 10,
  },
  drawerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    marginBottom: 12,
  },
  drawerTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0f172a',
  },
  drawerUser: {
    fontSize: 11,
    color: '#0d6942',
    fontWeight: '700',
    marginTop: 1,
  },
  drawerCloseBtn: {
    padding: 4,
  },
  drawerScroll: {
    gap: 14,
    paddingBottom: 20,
  },
  drawerSection: {
    gap: 6,
  },
  drawerSectionLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#94a3b8',
    letterSpacing: 0.6,
  },
  entityList: {
    gap: 4,
  },
  entityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 7,
    paddingHorizontal: 8,
    borderRadius: 6,
    backgroundColor: '#f8fafc',
  },
  entityItemActive: {
    backgroundColor: '#ecfdf5',
    borderWidth: 1,
    borderColor: '#bbf7d0',
  },
  entityItemText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#475569',
  },
  entityItemTextActive: {
    color: '#065f46',
    fontWeight: '800',
  },
  navLinksList: {
    gap: 6,
  },
  navLinkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 9,
    paddingHorizontal: 8,
    borderRadius: 8,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  navLinkItemActive: {
    backgroundColor: '#f0fdf4',
    borderColor: '#86efac',
  },
  navIconBox: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: '#ecfdf5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  navIconBoxActive: {
    backgroundColor: '#0d6942',
  },
  navLinkText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1e293b',
  },
  navLinkTextActive: {
    color: '#0d6942',
    fontWeight: '800',
  },
  navLinkSub: {
    fontSize: 9,
    color: '#64748b',
    marginTop: 1,
  },
  drawerAlertBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#fecaca',
    padding: 10,
    borderRadius: 8,
    marginTop: 4,
  },
  drawerAlertTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#991b1b',
  },
  drawerAlertSub: {
    fontSize: 9,
    color: '#7f1d1d',
    marginTop: 1,
  },
  drawerLogoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: '#fff1f2',
    borderWidth: 1,
    borderColor: '#fecaca',
    marginTop: 6,
  },
  drawerLogoutText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#b91c1c',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'center',
    padding: 18,
  },
  modalCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 14,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    paddingBottom: 6,
  },
  modalTitle: { fontSize: 13, fontWeight: '800', color: '#0f172a' },
  alertBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#fecaca',
    padding: 8,
    borderRadius: 6,
    marginBottom: 6,
  },
  alertBoxTitle: { fontSize: 11, fontWeight: '700', color: '#991b1b' },
  alertBoxSub: { fontSize: 9, color: '#64748b', marginTop: 1 },
  dismissBtn: {
    backgroundColor: '#f1f5f9',
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 6,
  },
  dismissBtnText: { fontSize: 11, fontWeight: '700', color: '#475569' },
});
