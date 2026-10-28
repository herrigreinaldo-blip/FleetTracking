import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export interface RouteItem {
  id: string;
  routeCode: string;
  depot: string;
  driver: string;
  driverCode: string;
  van: string;
  stops: number;
  rate: number;
  status: 'Active' | 'Covered' | 'Sickness';
  week: string;
  day: string;
}

const INITIAL_ROUTES: RouteItem[] = [
  {
    id: 'R-593',
    routeCode: 'Route 593',
    depot: 'FD 12354 (Birmingham)',
    driver: 'Ronaldo Luiz Silva',
    driverCode: 'DR 85899',
    van: 'KR23 XYZ (Sprinter)',
    stops: 142,
    rate: 200.00,
    status: 'Active',
    week: 'Week 41',
    day: 'Mon 12 Oct'
  },
  {
    id: 'R-104',
    routeCode: 'Route 104',
    depot: 'FD 14902 (Solihull)',
    driver: 'Douglas Santos',
    driverCode: 'DR 85901',
    van: 'VN71 DPD (Transit)',
    stops: 156,
    rate: 220.00,
    status: 'Active',
    week: 'Week 41',
    day: 'Mon 12 Oct'
  },
  {
    id: 'R-214',
    routeCode: 'Route 214',
    depot: 'FD 12354 (Birmingham)',
    driver: 'Alex Moreira',
    driverCode: 'DR 85902',
    van: 'BW22 VNZ (Vivaro)',
    stops: 138,
    rate: 200.00,
    status: 'Active',
    week: 'Week 41',
    day: 'Mon 12 Oct'
  },
  {
    id: 'R-302',
    routeCode: 'Route 302',
    depot: 'FD 16031 (Coventry)',
    driver: 'Tiago Fernandes (Cover)',
    driverCode: 'DR 85904',
    van: 'LO70 DPD (Sprinter)',
    stops: 145,
    rate: 200.00,
    status: 'Covered',
    week: 'Week 41',
    day: 'Mon 12 Oct'
  },
  {
    id: 'R-410',
    routeCode: 'Route 410',
    depot: 'FD 12354 (Birmingham)',
    driver: 'Eduardo Martins',
    driverCode: 'DR 85905',
    van: 'Own Van (Custom)',
    stops: 160,
    rate: 220.00,
    status: 'Active',
    week: 'Week 41',
    day: 'Mon 12 Oct'
  }
];

interface CalendarScreenProps {
  searchQuery?: string;
}

export const CalendarScreen: React.FC<CalendarScreenProps> = ({ searchQuery = '' }) => {
  const [routes, setRoutes] = useState<RouteItem[]>(INITIAL_ROUTES);
  const [selectedRoute, setSelectedRoute] = useState<RouteItem | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form states for Add / Edit
  const [formRouteCode, setFormRouteCode] = useState('');
  const [formDepot, setFormDepot] = useState('FD 12354 (Birmingham)');
  const [formDriver, setFormDriver] = useState('Ronaldo Luiz Silva');
  const [formVan, setFormVan] = useState('KR23 XYZ (Sprinter)');
  const [formStops, setFormStops] = useState('140');
  const [formRate, setFormRate] = useState('200.00');
  const [formStatus, setFormStatus] = useState<'Active' | 'Covered' | 'Sickness'>('Active');

  const [selectedFilter, setSelectedFilter] = useState<'All' | 'Active' | 'Covered'>('All');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleOpenAdd = () => {
    setFormRouteCode(`Route ${Math.floor(500 + Math.random() * 400)}`);
    setFormDepot('FD 12354 (Birmingham)');
    setFormDriver('Ronaldo Luiz Silva');
    setFormVan('KR23 XYZ (Sprinter)');
    setFormStops('140');
    setFormRate('200.00');
    setFormStatus('Active');
    setIsAddModalOpen(true);
  };

  const handleCreateRoute = () => {
    if (!formRouteCode.trim()) return;

    const newRoute: RouteItem = {
      id: `R-${Math.floor(1000 + Math.random() * 9000)}`,
      routeCode: formRouteCode.trim(),
      depot: formDepot,
      driver: formDriver,
      driverCode: 'DR ' + Math.floor(85800 + Math.random() * 200),
      van: formVan,
      stops: parseInt(formStops, 10) || 120,
      rate: parseFloat(formRate) || 200.00,
      status: formStatus,
      week: 'Week 41',
      day: 'Mon 12 Oct'
    };

    setRoutes([newRoute, ...routes]);
    setIsAddModalOpen(false);
    showToast(`${newRoute.routeCode} created successfully`);
  };

  const handleOpenEdit = (route: RouteItem) => {
    setFormRouteCode(route.routeCode);
    setFormDepot(route.depot);
    setFormDriver(route.driver);
    setFormVan(route.van);
    setFormStops(route.stops.toString());
    setFormRate(route.rate.toFixed(2));
    setFormStatus(route.status);
    setIsEditModalOpen(true);
  };

  const handleUpdateRoute = () => {
    if (!selectedRoute) return;

    const updated: RouteItem = {
      ...selectedRoute,
      routeCode: formRouteCode.trim(),
      depot: formDepot,
      driver: formDriver,
      van: formVan,
      stops: parseInt(formStops, 10) || selectedRoute.stops,
      rate: parseFloat(formRate) || selectedRoute.rate,
      status: formStatus,
    };

    setRoutes(routes.map(r => r.id === selectedRoute.id ? updated : r));
    setSelectedRoute(updated);
    setIsEditModalOpen(false);
    showToast(`${updated.routeCode} updated`);
  };

  const handleDeleteRoute = (routeId: string) => {
    const routeToDelete = routes.find(r => r.id === routeId);
    setRoutes(routes.filter(r => r.id !== routeId));
    setSelectedRoute(null);
    showToast(`${routeToDelete?.routeCode || 'Route'} deleted`);
  };

  const filtered = routes.filter(r => {
    const matchesFilter = selectedFilter === 'All' || r.status === selectedFilter;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      r.routeCode.toLowerCase().includes(q) ||
      r.driver.toLowerCase().includes(q) ||
      r.depot.toLowerCase().includes(q) ||
      r.van.toLowerCase().includes(q);
    return matchesFilter && matchesSearch;
  });

  const totalStops = routes.reduce((acc, r) => acc + r.stops, 0);
  const totalDayRate = routes.reduce((acc, r) => acc + r.rate, 0);

  return (
    <View style={styles.container}>
      {/* Toast Notification */}
      {toastMessage && (
        <View style={styles.toast}>
          <Ionicons name="checkmark-circle" size={14} color="#ffffff" />
          <Text style={styles.toastText}>{toastMessage}</Text>
        </View>
      )}

      {/* Summary Metrics Bar */}
      <View style={styles.metricRow}>
        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>ACTIVE ROUTES</Text>
          <Text style={styles.metricVal}>{routes.length} allocated</Text>
          <Text style={styles.metricSub}>Week 41 roster</Text>
        </View>
        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>TOTAL STOPS</Text>
          <Text style={[styles.metricVal, { color: '#0d6942' }]}>{totalStops}</Text>
          <Text style={styles.metricSub}>Avg {Math.round(totalStops / routes.length)}/route</Text>
        </View>
        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>DISBURSED RATE</Text>
          <Text style={[styles.metricVal, { color: '#1d4ed8' }]}>£{totalDayRate.toFixed(2)}</Text>
          <Text style={styles.metricSub}>Scheduled day</Text>
        </View>
      </View>

      {/* Subheader Toolbar with Add Button */}
      <View style={styles.actionHeader}>
        <View>
          <Text style={styles.headerTitle}>Roster Allocations</Text>
          <Text style={styles.headerSub}>{filtered.length} routes active in 4-week matrix</Text>
        </View>
        <TouchableOpacity onPress={handleOpenAdd} style={styles.createBtn} activeOpacity={0.8}>
          <Ionicons name="add" size={15} color="#ffffff" />
          <Text style={styles.createBtnText}>Add Route</Text>
        </TouchableOpacity>
      </View>

      {/* Filter Chips */}
      <View style={styles.filterBar}>
        {(['All', 'Active', 'Covered'] as const).map(f => {
          const isSel = selectedFilter === f;
          return (
            <TouchableOpacity
              key={f}
              onPress={() => setSelectedFilter(f)}
              style={[styles.filterChip, isSel && styles.filterChipActive]}
            >
              <Text style={[styles.filterChipText, isSel && styles.filterChipTextActive]}>
                {f === 'Covered' ? 'Cover Drivers' : f}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Feed of Minimal Navigation Cards */}
      <ScrollView contentContainerStyle={styles.list}>
        {filtered.map(item => (
          <TouchableOpacity
            key={item.id}
            onPress={() => setSelectedRoute(item)}
            style={styles.card}
            activeOpacity={0.7}
          >
            <View style={styles.cardContent}>
              <View style={[
                styles.iconBox,
                item.status === 'Covered' ? styles.iconBoxAmber : styles.iconBoxGreen
              ]}>
                <Ionicons
                  name={item.status === 'Covered' ? 'swap-horizontal' : 'navigate-outline'}
                  size={15}
                  color={item.status === 'Covered' ? '#b45309' : '#0d6942'}
                />
              </View>
              <View style={styles.infoCol}>
                <Text style={styles.titleText}>{item.routeCode}</Text>
                <Text style={styles.subText}>{item.depot} • {item.driver}</Text>
              </View>
            </View>

            <View style={styles.cardRight}>
              <View style={[
                styles.badge,
                item.status === 'Covered' ? styles.badgeWarning : styles.badgeSuccess
              ]}>
                <Text style={[
                  styles.badgeText,
                  item.status === 'Covered' ? { color: '#b45309' } : { color: '#15803d' }
                ]}>
                  {item.status}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={14} color="#94a3b8" />
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Redirection / Dedicated Route Detail View Modal */}
      <Modal visible={!!selectedRoute} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            {/* Header */}
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>{selectedRoute?.routeCode}</Text>
                <Text style={styles.modalSub}>{selectedRoute?.depot}</Text>
              </View>
              <TouchableOpacity onPress={() => setSelectedRoute(null)} style={styles.closeBtn}>
                <Ionicons name="close" size={20} color="#64748b" />
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.sheetContent}>
              {/* Status Callout */}
              <View style={styles.calloutRow}>
                <Text style={styles.calloutLabel}>DISPATCH STATUS</Text>
                <View style={[
                  styles.badge,
                  selectedRoute?.status === 'Covered' ? styles.badgeWarning : styles.badgeSuccess
                ]}>
                  <Text style={[
                    styles.badgeText,
                    selectedRoute?.status === 'Covered' ? { color: '#b45309' } : { color: '#15803d' }
                  ]}>
                    {selectedRoute?.status === 'Covered' ? 'Cover Driver Deployed' : 'Active Regular Coverage'}
                  </Text>
                </View>
              </View>

              {/* Detail Items */}
              <View style={styles.detailCard}>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Assigned Subcontractor</Text>
                  <Text style={styles.detailValue}>{selectedRoute?.driver}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Driver Code</Text>
                  <Text style={styles.detailValue}>{selectedRoute?.driverCode}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Fleet Vehicle</Text>
                  <Text style={styles.detailValue}>{selectedRoute?.van}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Operating Period</Text>
                  <Text style={styles.detailValue}>{selectedRoute?.week} • {selectedRoute?.day}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Scheduled Stops</Text>
                  <Text style={styles.detailValue}>{selectedRoute?.stops} Stops Confirmed</Text>
                </View>
                <View style={[styles.detailRow, { borderBottomWidth: 0 }]}>
                  <Text style={styles.detailLabel}>Agreed Day Rate</Text>
                  <Text style={[styles.detailValue, { color: '#0d6942', fontWeight: '900' }]}>
                    £{selectedRoute?.rate.toFixed(2)}
                  </Text>
                </View>
              </View>

              {/* Action Buttons: UPDATE & DELETE */}
              <View style={styles.modalActionRow}>
                <TouchableOpacity
                  onPress={() => handleOpenEdit(selectedRoute!)}
                  style={styles.editBtn}
                  activeOpacity={0.8}
                >
                  <Ionicons name="create-outline" size={15} color="#0d6942" />
                  <Text style={styles.editBtnText}>Edit Route</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => handleDeleteRoute(selectedRoute!.id)}
                  style={styles.deleteBtn}
                  activeOpacity={0.8}
                >
                  <Ionicons name="trash-outline" size={15} color="#dc2626" />
                  <Text style={styles.deleteBtnText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Modal: ADD ROUTE */}
      <Modal visible={isAddModalOpen} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add New Route Allocation</Text>
              <TouchableOpacity onPress={() => setIsAddModalOpen(false)}>
                <Ionicons name="close" size={20} color="#64748b" />
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.sheetContent}>
              <Text style={styles.inputTitle}>Route Identifier</Text>
              <TextInput
                style={styles.input}
                value={formRouteCode}
                onChangeText={setFormRouteCode}
                placeholder="e.g. Route 595"
                placeholderTextColor="#94a3b8"
              />

              <Text style={styles.inputTitle}>Depot Franchise</Text>
              <TextInput
                style={styles.input}
                value={formDepot}
                onChangeText={setFormDepot}
                placeholder="e.g. FD 12354 (Birmingham)"
                placeholderTextColor="#94a3b8"
              />

              <Text style={styles.inputTitle}>Assigned Driver</Text>
              <TextInput
                style={styles.input}
                value={formDriver}
                onChangeText={setFormDriver}
                placeholder="Driver full name"
                placeholderTextColor="#94a3b8"
              />

              <Text style={styles.inputTitle}>Assigned Vehicle</Text>
              <TextInput
                style={styles.input}
                value={formVan}
                onChangeText={setFormVan}
                placeholder="e.g. KR23 XYZ (Sprinter)"
                placeholderTextColor="#94a3b8"
              />

              <View style={styles.formRow2}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.inputTitle}>Stops Scheduled</Text>
                  <TextInput
                    style={styles.input}
                    value={formStops}
                    onChangeText={setFormStops}
                    keyboardType="numeric"
                    placeholder="140"
                    placeholderTextColor="#94a3b8"
                  />
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={styles.inputTitle}>Day Rate (£)</Text>
                  <TextInput
                    style={styles.input}
                    value={formRate}
                    onChangeText={setFormRate}
                    keyboardType="numeric"
                    placeholder="200.00"
                    placeholderTextColor="#94a3b8"
                  />
                </View>
              </View>

              <TouchableOpacity onPress={handleCreateRoute} style={styles.saveSubmitBtn} activeOpacity={0.8}>
                <Ionicons name="checkmark" size={16} color="#ffffff" />
                <Text style={styles.saveSubmitBtnText}>Create Route</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Modal: EDIT ROUTE */}
      <Modal visible={isEditModalOpen} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Route Allocation</Text>
              <TouchableOpacity onPress={() => setIsEditModalOpen(false)}>
                <Ionicons name="close" size={20} color="#64748b" />
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.sheetContent}>
              <Text style={styles.inputTitle}>Route Identifier</Text>
              <TextInput
                style={styles.input}
                value={formRouteCode}
                onChangeText={setFormRouteCode}
              />

              <Text style={styles.inputTitle}>Assigned Driver</Text>
              <TextInput
                style={styles.input}
                value={formDriver}
                onChangeText={setFormDriver}
              />

              <Text style={styles.inputTitle}>Assigned Vehicle</Text>
              <TextInput
                style={styles.input}
                value={formVan}
                onChangeText={setFormVan}
              />

              <View style={styles.formRow2}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.inputTitle}>Stops</Text>
                  <TextInput
                    style={styles.input}
                    value={formStops}
                    onChangeText={setFormStops}
                    keyboardType="numeric"
                  />
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={styles.inputTitle}>Rate (£)</Text>
                  <TextInput
                    style={styles.input}
                    value={formRate}
                    onChangeText={setFormRate}
                    keyboardType="numeric"
                  />
                </View>
              </View>

              <Text style={styles.inputTitle}>Status</Text>
              <View style={styles.statusSelectRow}>
                {(['Active', 'Covered', 'Sickness'] as const).map(st => (
                  <TouchableOpacity
                    key={st}
                    onPress={() => setFormStatus(st)}
                    style={[styles.statusOption, formStatus === st && styles.statusOptionActive]}
                  >
                    <Text style={[styles.statusOptionText, formStatus === st && styles.statusOptionTextActive]}>
                      {st}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <TouchableOpacity onPress={handleUpdateRoute} style={styles.saveSubmitBtn} activeOpacity={0.8}>
                <Ionicons name="checkmark-done" size={16} color="#ffffff" />
                <Text style={styles.saveSubmitBtnText}>Save Changes</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eff2f6',
  },
  toast: {
    position: 'absolute',
    top: 10,
    left: 16,
    right: 16,
    backgroundColor: '#0d6942',
    paddingVertical: 9,
    paddingHorizontal: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    zIndex: 999,
    elevation: 8,
  },
  toastText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '700',
  },
  metricRow: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingTop: 10,
    gap: 8,
  },
  metricCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  metricLabel: {
    fontSize: 8.5,
    fontWeight: '800',
    color: '#64748b',
    letterSpacing: 0.4,
  },
  metricVal: {
    fontSize: 13,
    fontWeight: '900',
    color: '#0f172a',
    marginTop: 2,
  },
  metricSub: {
    fontSize: 9.5,
    color: '#94a3b8',
    marginTop: 1,
  },
  filterBar: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 6,
  },
  filterChip: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 14,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  filterChipActive: {
    backgroundColor: '#0d6942',
    borderColor: '#0d6942',
  },
  filterChipText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748b',
  },
  filterChipTextActive: {
    color: '#ffffff',
  },
  actionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: 6,
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0f172a',
  },
  headerSub: {
    fontSize: 10,
    color: '#64748b',
    marginTop: 1,
  },
  createBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#0d6942',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  createBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#ffffff',
  },
  list: {
    padding: 12,
    gap: 8,
    paddingBottom: 24,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  iconBox: {
    width: 30,
    height: 30,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBoxGreen: { backgroundColor: '#ecfdf5' },
  iconBoxAmber: { backgroundColor: '#fffbeb' },
  infoCol: {
    gap: 1,
    flex: 1,
  },
  titleText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0f172a',
  },
  subText: {
    fontSize: 11,
    color: '#64748b',
  },
  cardRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  badge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeSuccess: { backgroundColor: '#dcfce7' },
  badgeWarning: { backgroundColor: '#fef3c7' },
  badgeText: { fontSize: 10, fontWeight: '700' },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: '85%',
    padding: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: '#0f172a',
  },
  modalSub: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 1,
  },
  closeBtn: {
    padding: 2,
  },
  sheetContent: {
    gap: 10,
    paddingBottom: 20,
  },
  calloutRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 2,
  },
  calloutLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#94a3b8',
    letterSpacing: 0.5,
  },
  detailCard: {
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    paddingHorizontal: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  detailLabel: {
    fontSize: 11,
    color: '#64748b',
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0f172a',
  },
  modalActionRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 6,
  },
  editBtn: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    backgroundColor: '#ecfdf5',
    borderWidth: 1,
    borderColor: '#a7f3d0',
    paddingVertical: 10,
    borderRadius: 8,
  },
  editBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0d6942',
  },
  deleteBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#fecaca',
    paddingVertical: 10,
    borderRadius: 8,
  },
  deleteBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#dc2626',
  },
  inputTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#334155',
    marginTop: 2,
  },
  input: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 7,
    fontSize: 12,
    color: '#0f172a',
    backgroundColor: '#ffffff',
  },
  formRow2: {
    flexDirection: 'row',
    gap: 8,
  },
  statusSelectRow: {
    flexDirection: 'row',
    gap: 6,
  },
  statusOption: {
    flex: 1,
    paddingVertical: 7,
    borderRadius: 6,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
  },
  statusOptionActive: {
    backgroundColor: '#0d6942',
  },
  statusOptionText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#475569',
  },
  statusOptionTextActive: {
    color: '#ffffff',
    fontWeight: '700',
  },
  saveSubmitBtn: {
    backgroundColor: '#0d6942',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 8,
  },
  saveSubmitBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#ffffff',
  },
});
