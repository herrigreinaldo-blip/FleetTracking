import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export interface VehicleCardItem {
  id: string;
  plate: string;
  model: string;
  driver: string;
  status: 'Compliant' | 'MOT Warning';
  motDays: number;
  odometer: number;
  serviceDays: number;
  loanBal?: number;
  escrowBal?: number;
  escrowCap?: number;
}

const INITIAL_FLEET: VehicleCardItem[] = [
  {
    id: 'V-1',
    plate: 'KR23 XYZ',
    model: 'Mercedes-Benz Sprinter 314',
    driver: 'Ronaldo Luiz Silva (DR 85899)',
    status: 'Compliant',
    motDays: 142,
    odometer: 42100,
    serviceDays: 14,
    loanBal: 19100.00,
    escrowBal: 600.00,
    escrowCap: 1000.00,
  },
  {
    id: 'V-2',
    plate: 'VN71 DPD',
    model: 'Ford Transit Custom 300',
    driver: 'Douglas Santos (DR 85901)',
    status: 'MOT Warning',
    motDays: 18,
    odometer: 68450,
    serviceDays: 45,
    escrowBal: 0.00,
    escrowCap: 0.00,
  },
  {
    id: 'V-3',
    plate: 'BW22 VNZ',
    model: 'Vauxhall Vivaro 2.0 Turbo D',
    driver: 'Alex Moreira (DR 85902)',
    status: 'Compliant',
    motDays: 210,
    odometer: 38900,
    serviceDays: 80,
    escrowBal: 400.00,
    escrowCap: 1000.00,
  },
  {
    id: 'V-4',
    plate: 'LO70 DPD',
    model: 'Mercedes-Benz Sprinter 315',
    driver: 'Claudio Oliveira (DR 85903)',
    status: 'Compliant',
    motDays: 165,
    odometer: 55200,
    serviceDays: 60,
    escrowBal: 800.00,
    escrowCap: 1000.00,
  }
];

interface FleetScreenProps {
  searchQuery?: string;
}

export const FleetScreen: React.FC<FleetScreenProps> = ({ searchQuery = '' }) => {
  const [vehicles, setVehicles] = useState<VehicleCardItem[]>(INITIAL_FLEET);
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleCardItem | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form state
  const [formPlate, setFormPlate] = useState('');
  const [formModel, setFormModel] = useState('');
  const [formDriver, setFormDriver] = useState('');
  const [formOdometer, setFormOdometer] = useState('40000');
  const [formMotDays, setFormMotDays] = useState('180');
  const [formServiceDays, setFormServiceDays] = useState('30');
  const [formLoanBal, setFormLoanBal] = useState('0.00');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleOpenAdd = () => {
    setFormPlate('KR24 ' + String.fromCharCode(65 + Math.floor(Math.random() * 26)) + String.fromCharCode(65 + Math.floor(Math.random() * 26)) + String.fromCharCode(65 + Math.floor(Math.random() * 26)));
    setFormModel('Mercedes-Benz Sprinter 314');
    setFormDriver('Unassigned Driver');
    setFormOdometer('15000');
    setFormMotDays('365');
    setFormServiceDays('60');
    setFormLoanBal('18500.00');
    setIsAddModalOpen(true);
  };

  const handleCreateVehicle = () => {
    if (!formPlate.trim()) return;

    const motD = parseInt(formMotDays, 10) || 180;
    const newVeh: VehicleCardItem = {
      id: `V-${Math.floor(100 + Math.random() * 900)}`,
      plate: formPlate.trim().toUpperCase(),
      model: formModel.trim() || 'Ford Transit Custom',
      driver: formDriver.trim() || 'Pool Vehicle',
      status: motD < 30 ? 'MOT Warning' : 'Compliant',
      motDays: motD,
      odometer: parseInt(formOdometer, 10) || 20000,
      serviceDays: parseInt(formServiceDays, 10) || 60,
      loanBal: parseFloat(formLoanBal) || undefined,
      escrowBal: 0,
      escrowCap: 1000,
    };

    setVehicles([newVeh, ...vehicles]);
    setIsAddModalOpen(false);
    showToast(`${newVeh.plate} added to fleet`);
  };

  const handleOpenEdit = (v: VehicleCardItem) => {
    setFormPlate(v.plate);
    setFormModel(v.model);
    setFormDriver(v.driver);
    setFormOdometer(v.odometer.toString());
    setFormMotDays(v.motDays.toString());
    setFormServiceDays(v.serviceDays.toString());
    setFormLoanBal(v.loanBal ? v.loanBal.toString() : '0.00');
    setIsEditModalOpen(true);
  };

  const handleUpdateVehicle = () => {
    if (!selectedVehicle) return;

    const motD = parseInt(formMotDays, 10) || selectedVehicle.motDays;
    const updated: VehicleCardItem = {
      ...selectedVehicle,
      plate: formPlate.trim().toUpperCase(),
      model: formModel.trim(),
      driver: formDriver.trim(),
      odometer: parseInt(formOdometer, 10) || selectedVehicle.odometer,
      motDays: motD,
      serviceDays: parseInt(formServiceDays, 10) || selectedVehicle.serviceDays,
      loanBal: parseFloat(formLoanBal) || undefined,
      status: motD < 30 ? 'MOT Warning' : 'Compliant',
    };

    setVehicles(vehicles.map(v => v.id === selectedVehicle.id ? updated : v));
    setSelectedVehicle(updated);
    setIsEditModalOpen(false);
    showToast(`${updated.plate} updated`);
  };

  const [selectedFilter, setSelectedFilter] = useState<'All' | 'Compliant' | 'MOT Warning'>('All');

  const handleDeleteVehicle = (vehId: string) => {
    const toDelete = vehicles.find(v => v.id === vehId);
    setVehicles(vehicles.filter(v => v.id !== vehId));
    setSelectedVehicle(null);
    showToast(`${toDelete?.plate || 'Vehicle'} deleted`);
  };

  const filtered = vehicles.filter(v => {
    const matchesFilter = selectedFilter === 'All' || v.status === selectedFilter;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      v.plate.toLowerCase().includes(q) ||
      v.model.toLowerCase().includes(q) ||
      v.driver.toLowerCase().includes(q);
    return matchesFilter && matchesSearch;
  });

  const motWarnings = vehicles.filter(v => v.status === 'MOT Warning').length;
  const totalEscrow = vehicles.reduce((acc, v) => acc + (v.escrowBal || 0), 0);

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
          <Text style={styles.metricLabel}>ACTIVE FLEET</Text>
          <Text style={styles.metricVal}>{vehicles.length} vans</Text>
          <Text style={styles.metricSub}>Commercial fleet</Text>
        </View>
        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>MOT WARNINGS</Text>
          <Text style={[styles.metricVal, motWarnings > 0 ? { color: '#dc2626' } : { color: '#0d6942' }]}>
            {motWarnings} {motWarnings === 1 ? 'urgent' : 'urgent'}
          </Text>
          <Text style={styles.metricSub}>Action within 30d</Text>
        </View>
        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>ESCROW VAULT</Text>
          <Text style={[styles.metricVal, { color: '#0d6942' }]}>£{totalEscrow.toFixed(2)}</Text>
          <Text style={styles.metricSub}>Damage deposits</Text>
        </View>
      </View>

      {/* Subheader Toolbar with Add Button */}
      <View style={styles.actionHeader}>
        <View>
          <Text style={styles.headerTitle}>Fleet Telemetry & Vans</Text>
          <Text style={styles.headerSub}>{filtered.length} vehicles registered in fleet</Text>
        </View>
        <TouchableOpacity onPress={handleOpenAdd} style={styles.createBtn} activeOpacity={0.8}>
          <Ionicons name="add" size={15} color="#ffffff" />
          <Text style={styles.createBtnText}>Add Van</Text>
        </TouchableOpacity>
      </View>

      {/* Filter Chips */}
      <View style={styles.filterBar}>
        {(['All', 'Compliant', 'MOT Warning'] as const).map(f => {
          const isSel = selectedFilter === f;
          return (
            <TouchableOpacity
              key={f}
              onPress={() => setSelectedFilter(f)}
              style={[styles.filterChip, isSel && styles.filterChipActive]}
            >
              <Text style={[styles.filterChipText, isSel && styles.filterChipTextActive]}>
                {f === 'MOT Warning' ? 'MOT Warnings' : f}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Minimal Navigation Cards Feed */}
      <ScrollView contentContainerStyle={styles.list}>
        {filtered.map(veh => (
          <TouchableOpacity
            key={veh.id}
            onPress={() => setSelectedVehicle(veh)}
            style={styles.card}
            activeOpacity={0.7}
          >
            <View style={styles.cardContent}>
              <View style={[styles.iconBox, veh.status === 'MOT Warning' && styles.iconBoxWarn]}>
                <Ionicons
                  name="car-outline"
                  size={15}
                  color={veh.status === 'MOT Warning' ? '#b91c1c' : '#0d6942'}
                />
              </View>
              <View style={styles.infoCol}>
                <Text style={styles.titleText}>{veh.plate}</Text>
                <Text style={styles.subText}>{veh.model}</Text>
              </View>
            </View>

            <View style={styles.cardRight}>
              <View style={[
                styles.badge,
                veh.status === 'MOT Warning' ? styles.badgeWarning : styles.badgeSuccess
              ]}>
                <Text style={[
                  styles.badgeText,
                  veh.status === 'MOT Warning' ? { color: '#b91c1c' } : { color: '#15803d' }
                ]}>
                  {veh.status === 'MOT Warning' ? 'MOT Due' : 'Compliant'}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={14} color="#94a3b8" />
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Dedicated Vehicle Inspector Modal */}
      <Modal visible={!!selectedVehicle} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>{selectedVehicle?.plate}</Text>
                <Text style={styles.modalSub}>{selectedVehicle?.model}</Text>
              </View>
              <TouchableOpacity onPress={() => setSelectedVehicle(null)} style={styles.closeBtn}>
                <Ionicons name="close" size={20} color="#64748b" />
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.sheetContent}>
              <View style={styles.calloutRow}>
                <Text style={styles.calloutLabel}>COMPLIANCE HEALTH</Text>
                <View style={[
                  styles.badge,
                  selectedVehicle?.status === 'MOT Warning' ? styles.badgeWarning : styles.badgeSuccess
                ]}>
                  <Text style={[
                    styles.badgeText,
                    selectedVehicle?.status === 'MOT Warning' ? { color: '#b91c1c' } : { color: '#15803d' }
                  ]}>
                    {selectedVehicle?.status === 'MOT Warning' ? 'MOT Expiring in 18 Days' : 'Fully Compliant'}
                  </Text>
                </View>
              </View>

              <View style={styles.detailCard}>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Assigned Subcontractor</Text>
                  <Text style={styles.detailValue}>{selectedVehicle?.driver}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Odometer Mileage</Text>
                  <Text style={styles.detailValue}>{selectedVehicle?.odometer.toLocaleString()} mi</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>MOT Expiry Countdown</Text>
                  <Text style={[
                    styles.detailValue,
                    selectedVehicle?.motDays! < 30 && { color: '#dc2626', fontWeight: '900' }
                  ]}>
                    {selectedVehicle?.motDays} days remaining
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Next Scheduled Service</Text>
                  <Text style={styles.detailValue}>{selectedVehicle?.serviceDays} days</Text>
                </View>
                {selectedVehicle?.loanBal ? (
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Commercial Loan Balance</Text>
                    <Text style={[styles.detailValue, { color: '#1d4ed8', fontWeight: '800' }]}>
                      £{selectedVehicle.loanBal.toLocaleString('en-GB', { minimumFractionDigits: 2 })}
                    </Text>
                  </View>
                ) : null}
                {selectedVehicle?.escrowCap! > 0 ? (
                  <View style={[styles.detailRow, { borderBottomWidth: 0 }]}>
                    <Text style={styles.detailLabel}>Van Damage Escrow Balance</Text>
                    <Text style={[styles.detailValue, { color: '#0d6942', fontWeight: '900' }]}>
                      £{selectedVehicle?.escrowBal?.toFixed(2)} / £{selectedVehicle?.escrowCap?.toFixed(2)}
                    </Text>
                  </View>
                ) : null}
              </View>

              {/* Action Buttons: UPDATE & DELETE */}
              <View style={styles.modalActionRow}>
                <TouchableOpacity
                  onPress={() => handleOpenEdit(selectedVehicle!)}
                  style={styles.editBtn}
                  activeOpacity={0.8}
                >
                  <Ionicons name="create-outline" size={15} color="#0d6942" />
                  <Text style={styles.editBtnText}>Edit Vehicle</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => handleDeleteVehicle(selectedVehicle!.id)}
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

      {/* Modal: ADD VEHICLE */}
      <Modal visible={isAddModalOpen} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Register New Fleet Van</Text>
              <TouchableOpacity onPress={() => setIsAddModalOpen(false)}>
                <Ionicons name="close" size={20} color="#64748b" />
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.sheetContent}>
              <Text style={styles.inputTitle}>Registration Plate</Text>
              <TextInput
                style={styles.input}
                value={formPlate}
                onChangeText={setFormPlate}
                placeholder="e.g. KR24 XYZ"
                placeholderTextColor="#94a3b8"
                autoCapitalize="characters"
              />

              <Text style={styles.inputTitle}>Vehicle Model</Text>
              <TextInput
                style={styles.input}
                value={formModel}
                onChangeText={setFormModel}
                placeholder="e.g. Mercedes Sprinter 314"
                placeholderTextColor="#94a3b8"
              />

              <Text style={styles.inputTitle}>Assigned Driver</Text>
              <TextInput
                style={styles.input}
                value={formDriver}
                onChangeText={setFormDriver}
                placeholder="Assigned driver name"
                placeholderTextColor="#94a3b8"
              />

              <View style={styles.formRow2}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.inputTitle}>Odometer (mi)</Text>
                  <TextInput
                    style={styles.input}
                    value={formOdometer}
                    onChangeText={setFormOdometer}
                    keyboardType="numeric"
                  />
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={styles.inputTitle}>MOT Valid Days</Text>
                  <TextInput
                    style={styles.input}
                    value={formMotDays}
                    onChangeText={setFormMotDays}
                    keyboardType="numeric"
                  />
                </View>
              </View>

              <Text style={styles.inputTitle}>Commercial Loan Balance (£)</Text>
              <TextInput
                style={styles.input}
                value={formLoanBal}
                onChangeText={setFormLoanBal}
                keyboardType="numeric"
                placeholder="0.00"
                placeholderTextColor="#94a3b8"
              />

              <TouchableOpacity onPress={handleCreateVehicle} style={styles.saveSubmitBtn} activeOpacity={0.8}>
                <Ionicons name="checkmark" size={16} color="#ffffff" />
                <Text style={styles.saveSubmitBtnText}>Add Vehicle to Fleet</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Modal: EDIT VEHICLE */}
      <Modal visible={isEditModalOpen} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Vehicle Details</Text>
              <TouchableOpacity onPress={() => setIsEditModalOpen(false)}>
                <Ionicons name="close" size={20} color="#64748b" />
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.sheetContent}>
              <Text style={styles.inputTitle}>Registration Plate</Text>
              <TextInput
                style={styles.input}
                value={formPlate}
                onChangeText={setFormPlate}
                autoCapitalize="characters"
              />

              <Text style={styles.inputTitle}>Vehicle Model</Text>
              <TextInput
                style={styles.input}
                value={formModel}
                onChangeText={setFormModel}
              />

              <Text style={styles.inputTitle}>Assigned Driver</Text>
              <TextInput
                style={styles.input}
                value={formDriver}
                onChangeText={setFormDriver}
              />

              <View style={styles.formRow2}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.inputTitle}>Odometer</Text>
                  <TextInput
                    style={styles.input}
                    value={formOdometer}
                    onChangeText={setFormOdometer}
                    keyboardType="numeric"
                  />
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={styles.inputTitle}>MOT Days</Text>
                  <TextInput
                    style={styles.input}
                    value={formMotDays}
                    onChangeText={setFormMotDays}
                    keyboardType="numeric"
                  />
                </View>
              </View>

              <Text style={styles.inputTitle}>Loan Balance (£)</Text>
              <TextInput
                style={styles.input}
                value={formLoanBal}
                onChangeText={setFormLoanBal}
                keyboardType="numeric"
              />

              <TouchableOpacity onPress={handleUpdateVehicle} style={styles.saveSubmitBtn} activeOpacity={0.8}>
                <Ionicons name="checkmark-done" size={16} color="#ffffff" />
                <Text style={styles.saveSubmitBtnText}>Save Vehicle Changes</Text>
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
    backgroundColor: '#ecfdf5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBoxWarn: {
    backgroundColor: '#fef2f2',
  },
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
  badgeWarning: { backgroundColor: '#fee2e2' },
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
