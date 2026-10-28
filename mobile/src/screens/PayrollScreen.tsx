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

export interface DriverRemittance {
  id: string;
  driverCode: string;
  name: string;
  bank: string;
  vanType: 'Company Van' | 'Own Van';
  grossAgreed: number;
  adminFee: number;
  vanRent: number;
  fuelCard: number;
  vanDeposit: number;
  cashAdvance: number;
  netExVat: number;
  vatAmount: number;
  totalNet: number;
  operatingPeriod: string;
}

const INITIAL_DRIVERS_DATA: DriverRemittance[] = [
  {
    id: 'DRV-1',
    driverCode: 'DR 85899',
    name: 'Ronaldo Luiz Silva',
    bank: 'Monzo • 04-00-04 • ••••8912',
    vanType: 'Company Van',
    grossAgreed: 4180.00,
    adminFee: 158.87,
    vanRent: 1300.00,
    fuelCard: 220.00,
    vanDeposit: 200.00,
    cashAdvance: 0.00,
    netExVat: 2488.97,
    vatAmount: 497.79,
    totalNet: 2986.76,
    operatingPeriod: 'Weeks 41-44 (12-Oct to 08-Nov)'
  },
  {
    id: 'DRV-2',
    driverCode: 'DR 85901',
    name: 'Douglas Santos',
    bank: 'Lloyds • 30-98-97 • ••••3419',
    vanType: 'Own Van',
    grossAgreed: 4400.00,
    adminFee: 264.00,
    vanRent: 0.00,
    fuelCard: 310.00,
    vanDeposit: 0.00,
    cashAdvance: 0.00,
    netExVat: 3826.00,
    vatAmount: 765.20,
    totalNet: 4591.20,
    operatingPeriod: 'Weeks 41-44 (12-Oct to 08-Nov)'
  },
  {
    id: 'DRV-3',
    driverCode: 'DR 85902',
    name: 'Alex Moreira',
    bank: 'Barclays • 20-00-00 • ••••1102',
    vanType: 'Company Van',
    grossAgreed: 3960.00,
    adminFee: 148.20,
    vanRent: 1300.00,
    fuelCard: 195.00,
    vanDeposit: 200.00,
    cashAdvance: 250.00,
    netExVat: 1866.80,
    vatAmount: 373.36,
    totalNet: 2240.16,
    operatingPeriod: 'Weeks 41-44 (12-Oct to 08-Nov)'
  },
  {
    id: 'DRV-4',
    driverCode: 'DR 85903',
    name: 'Claudio Oliveira',
    bank: 'Santander • 09-01-28 • ••••9931',
    vanType: 'Company Van',
    grossAgreed: 4180.00,
    adminFee: 162.50,
    vanRent: 1300.00,
    fuelCard: 210.00,
    vanDeposit: 200.00,
    cashAdvance: 0.00,
    netExVat: 2307.50,
    vatAmount: 461.50,
    totalNet: 2769.00,
    operatingPeriod: 'Weeks 41-44 (12-Oct to 08-Nov)'
  }
];

interface PayrollScreenProps {
  searchQuery?: string;
}

export const PayrollScreen: React.FC<PayrollScreenProps> = ({ searchQuery = '' }) => {
  const [drivers, setDrivers] = useState<DriverRemittance[]>(INITIAL_DRIVERS_DATA);
  const [selectedFilter, setSelectedFilter] = useState<'All' | 'Company Van' | 'Own Van'>('All');
  const [selectedDriver, setSelectedDriver] = useState<DriverRemittance | null>(null);

  // Modals & Feedback
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form State
  const [formName, setFormName] = useState('');
  const [formDriverCode, setFormDriverCode] = useState('');
  const [formBank, setFormBank] = useState('');
  const [formVanType, setFormVanType] = useState<'Company Van' | 'Own Van'>('Company Van');
  const [formGross, setFormGross] = useState('4180.00');
  const [formVanRent, setFormVanRent] = useState('1300.00');
  const [formFuel, setFormFuel] = useState('200.00');
  const [formDeposit, setFormDeposit] = useState('200.00');
  const [formAdvance, setFormAdvance] = useState('0.00');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleOpenAdd = () => {
    setFormName('');
    setFormDriverCode('DR ' + Math.floor(85900 + Math.random() * 90));
    setFormBank('Monzo • 04-00-04 • ••••' + Math.floor(1000 + Math.random() * 9000));
    setFormVanType('Company Van');
    setFormGross('4180.00');
    setFormVanRent('1300.00');
    setFormFuel('220.00');
    setFormDeposit('200.00');
    setFormAdvance('0.00');
    setIsAddModalOpen(true);
  };

  const handleCreateRemittance = () => {
    if (!formName.trim()) {
      Alert.alert('Required Field', 'Please enter the driver full name.');
      return;
    }

    const gross = parseFloat(formGross) || 0;
    const vanRent = formVanType === 'Company Van' ? (parseFloat(formVanRent) || 0) : 0;
    const fuel = parseFloat(formFuel) || 0;
    const deposit = formVanType === 'Company Van' ? (parseFloat(formDeposit) || 0) : 0;
    const advance = parseFloat(formAdvance) || 0;
    const adminFee = parseFloat((gross * 0.038).toFixed(2)); // ~£158.87
    const netExVat = Math.max(0, gross - adminFee - vanRent - fuel - deposit - advance);
    const vat = parseFloat((netExVat * 0.20).toFixed(2));
    const totalNet = parseFloat((netExVat + vat).toFixed(2));

    const newDriver: DriverRemittance = {
      id: `DRV-${Date.now()}`,
      name: formName.trim(),
      driverCode: formDriverCode.trim(),
      bank: formBank.trim() || 'Barclays • ••••9921',
      vanType: formVanType,
      grossAgreed: gross,
      adminFee,
      vanRent,
      fuelCard: fuel,
      vanDeposit: deposit,
      cashAdvance: advance,
      netExVat,
      vatAmount: vat,
      totalNet,
      operatingPeriod: 'Weeks 41-44 (12-Oct to 08-Nov)'
    };

    setDrivers([newDriver, ...drivers]);
    setIsAddModalOpen(false);
    showToast(`Remittance created for ${newDriver.name}`);
  };

  const handleOpenEdit = (d: DriverRemittance) => {
    setFormName(d.name);
    setFormDriverCode(d.driverCode);
    setFormBank(d.bank);
    setFormVanType(d.vanType);
    setFormGross(d.grossAgreed.toFixed(2));
    setFormVanRent(d.vanRent.toFixed(2));
    setFormFuel(d.fuelCard.toFixed(2));
    setFormDeposit(d.vanDeposit.toFixed(2));
    setFormAdvance(d.cashAdvance.toFixed(2));
    setIsEditModalOpen(true);
  };

  const handleUpdateRemittance = () => {
    if (!selectedDriver) return;

    const gross = parseFloat(formGross) || selectedDriver.grossAgreed;
    const vanRent = formVanType === 'Company Van' ? (parseFloat(formVanRent) || 0) : 0;
    const fuel = parseFloat(formFuel) || 0;
    const deposit = formVanType === 'Company Van' ? (parseFloat(formDeposit) || 0) : 0;
    const advance = parseFloat(formAdvance) || 0;
    const adminFee = parseFloat((gross * 0.038).toFixed(2));
    const netExVat = Math.max(0, gross - adminFee - vanRent - fuel - deposit - advance);
    const vat = parseFloat((netExVat * 0.20).toFixed(2));
    const totalNet = parseFloat((netExVat + vat).toFixed(2));

    const updated: DriverRemittance = {
      ...selectedDriver,
      name: formName.trim() || selectedDriver.name,
      driverCode: formDriverCode.trim() || selectedDriver.driverCode,
      vanType: formVanType,
      grossAgreed: gross,
      adminFee,
      vanRent,
      fuelCard: fuel,
      vanDeposit: deposit,
      cashAdvance: advance,
      netExVat,
      vatAmount: vat,
      totalNet,
    };

    setDrivers(drivers.map(d => d.id === selectedDriver.id ? updated : d));
    setSelectedDriver(updated);
    setIsEditModalOpen(false);
    showToast(`Updated remittance for ${updated.name}`);
  };

  const handleDeleteRemittance = (id: string) => {
    const toDelete = drivers.find(d => d.id === id);
    setDrivers(drivers.filter(d => d.id !== id));
    setSelectedDriver(null);
    showToast(`Deleted: Remittance for ${toDelete?.name || 'Driver'}`);
  };

  // Filter & Search
  const filtered = drivers.filter(d => {
    const matchesFilter = selectedFilter === 'All' || d.vanType === selectedFilter;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      d.name.toLowerCase().includes(q) ||
      d.driverCode.toLowerCase().includes(q) ||
      d.bank.toLowerCase().includes(q) ||
      d.vanType.toLowerCase().includes(q);
    return matchesFilter && matchesSearch;
  });

  const totalGross = drivers.reduce((acc, d) => acc + d.grossAgreed, 0);
  const totalNetDisbursed = drivers.reduce((acc, d) => acc + d.totalNet, 0);
  const totalVanRent = drivers.reduce((acc, d) => acc + d.vanRent, 0);

  return (
    <View style={styles.container}>
      {/* Toast Feedback */}
      {toastMessage && (
        <View style={styles.toast}>
          <Ionicons name="checkmark-circle" size={14} color="#ffffff" />
          <Text style={styles.toastText}>{toastMessage}</Text>
        </View>
      )}

      {/* Summary Metrics Bar */}
      <View style={styles.metricRow}>
        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>GROSS AGREED</Text>
          <Text style={styles.metricVal}>£{totalGross.toLocaleString('en-GB', { minimumFractionDigits: 2 })}</Text>
          <Text style={styles.metricSub}>{drivers.length} active drivers</Text>
        </View>
        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>NET DISBURSED</Text>
          <Text style={[styles.metricVal, { color: '#0d6942' }]}>£{totalNetDisbursed.toLocaleString('en-GB', { minimumFractionDigits: 2 })}</Text>
          <Text style={styles.metricSub}>Due 13-Nov-2026</Text>
        </View>
        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>VAN RENT RECLAIM</Text>
          <Text style={[styles.metricVal, { color: '#1d4ed8' }]}>£{totalVanRent.toLocaleString('en-GB', { minimumFractionDigits: 2 })}</Text>
          <Text style={styles.metricSub}>£325 / wk offset</Text>
        </View>
      </View>

      {/* Subheader Toolbar with Add Button */}
      <View style={styles.actionHeader}>
        <View>
          <Text style={styles.headerTitle}>Driver Remittances</Text>
          <Text style={styles.headerSub}>4-week cycle • Cycle settlement</Text>
        </View>
        <TouchableOpacity onPress={handleOpenAdd} style={styles.createBtn} activeOpacity={0.8}>
          <Ionicons name="add" size={15} color="#ffffff" />
          <Text style={styles.createBtnText}>Add Driver Pay</Text>
        </TouchableOpacity>
      </View>

      {/* Filter Chips */}
      <View style={styles.filterBar}>
        {(['All', 'Company Van', 'Own Van'] as const).map(f => {
          const isSel = selectedFilter === f;
          return (
            <TouchableOpacity
              key={f}
              onPress={() => setSelectedFilter(f)}
              style={[styles.filterChip, isSel && styles.filterChipActive]}
            >
              <Text style={[styles.filterChipText, isSel && styles.filterChipTextActive]}>
                {f}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Minimal Navigation Cards Feed */}
      <ScrollView contentContainerStyle={styles.list}>
        {filtered.map(item => (
          <TouchableOpacity
            key={item.id}
            onPress={() => setSelectedDriver(item)}
            style={styles.card}
            activeOpacity={0.7}
          >
            <View style={styles.cardContent}>
              <View style={[
                styles.iconBox,
                item.vanType === 'Own Van' ? styles.iconBlue : styles.iconGreen
              ]}>
                <Ionicons
                  name="person-outline"
                  size={15}
                  color={item.vanType === 'Own Van' ? '#1d4ed8' : '#0d6942'}
                />
              </View>
              <View style={styles.infoCol}>
                <Text style={styles.titleText}>{item.name}</Text>
                <Text style={styles.subText}>{item.driverCode} • {item.vanType}</Text>
              </View>
            </View>

            <View style={styles.cardRight}>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={styles.netAmount}>£{item.totalNet.toFixed(2)}</Text>
                <Text style={styles.subPayDate}>Due 13-Nov</Text>
              </View>
              <Ionicons name="chevron-forward" size={14} color="#94a3b8" />
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Redirection / Dedicated DPD Remittance Advice Modal */}
      <Modal visible={!!selectedDriver} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <View style={{ flex: 1 }}>
                <Text style={styles.modalTitle}>DPD Remittance Advice</Text>
                <Text style={styles.modalSub}>{selectedDriver?.name} ({selectedDriver?.driverCode})</Text>
              </View>
              <TouchableOpacity onPress={() => setSelectedDriver(null)} style={styles.closeBtn}>
                <Ionicons name="close" size={20} color="#64748b" />
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.sheetContent}>
              {/* Official Period Callout */}
              <View style={styles.periodBanner}>
                <Ionicons name="calendar-outline" size={13} color="#0d6942" />
                <Text style={styles.periodBannerText}>{selectedDriver?.operatingPeriod}</Text>
              </View>

              {/* Remittance Breakdown Table (Exact match to RONALDO sheet) */}
              <View style={styles.remittanceCard}>
                <View style={styles.remittanceRow}>
                  <Text style={styles.itemLabel}>Agreed Gross Driver Pay</Text>
                  <Text style={[styles.itemVal, { fontWeight: '800' }]}>
                    £{selectedDriver?.grossAgreed.toFixed(2)}
                  </Text>
                </View>

                <View style={styles.remittanceRow}>
                  <Text style={styles.itemLabel}>Less: Admin Management Fee (6%)</Text>
                  <Text style={[styles.itemVal, { color: '#dc2626' }]}>
                    -£{selectedDriver?.adminFee.toFixed(2)}
                  </Text>
                </View>

                {selectedDriver?.vanRent! > 0 && (
                  <View style={styles.remittanceRow}>
                    <Text style={styles.itemLabel}>Less: Company Van Rent (4 wks @ £325)</Text>
                    <Text style={[styles.itemVal, { color: '#dc2626' }]}>
                      -£{selectedDriver?.vanRent.toFixed(2)}
                    </Text>
                  </View>
                )}

                {selectedDriver?.fuelCard! > 0 && (
                  <View style={styles.remittanceRow}>
                    <Text style={styles.itemLabel}>Less: Allstar Fuel Card Invoices</Text>
                    <Text style={[styles.itemVal, { color: '#dc2626' }]}>
                      -£{selectedDriver?.fuelCard.toFixed(2)}
                    </Text>
                  </View>
                )}

                {selectedDriver?.vanDeposit! > 0 && (
                  <View style={styles.remittanceRow}>
                    <Text style={styles.itemLabel}>Less: Van Damage Deposit Escrow</Text>
                    <Text style={[styles.itemVal, { color: '#dc2626' }]}>
                      -£{selectedDriver?.vanDeposit.toFixed(2)}
                    </Text>
                  </View>
                )}

                {selectedDriver?.cashAdvance! > 0 && (
                  <View style={styles.remittanceRow}>
                    <Text style={styles.itemLabel}>Less: Mid-Month Cash Advance</Text>
                    <Text style={[styles.itemVal, { color: '#dc2626' }]}>
                      -£{selectedDriver?.cashAdvance.toFixed(2)}
                    </Text>
                  </View>
                )}

                <View style={[styles.remittanceRow, styles.subtotalRow]}>
                  <Text style={styles.subtotalLabel}>Net Subcontractor Fee Ex VAT</Text>
                  <Text style={styles.subtotalVal}>£{selectedDriver?.netExVat.toFixed(2)}</Text>
                </View>

                <View style={styles.remittanceRow}>
                  <Text style={styles.itemLabel}>Add: 20% Subcontractor VAT</Text>
                  <Text style={[styles.itemVal, { color: '#0d6942' }]}>
                    +£{selectedDriver?.vatAmount.toFixed(2)}
                  </Text>
                </View>

                <View style={[styles.remittanceRow, styles.totalRow]}>
                  <Text style={styles.totalLabel}>TOTAL NET DUE (Bank Transfer)</Text>
                  <Text style={styles.totalVal}>£{selectedDriver?.totalNet.toFixed(2)}</Text>
                </View>
              </View>

              {/* Bank Transfer Notice */}
              <View style={styles.bankNotice}>
                <Ionicons name="information-circle-outline" size={13} color="#64748b" />
                <Text style={styles.bankNoticeText}>
                  Disbursement target: {selectedDriver?.bank}
                </Text>
              </View>

              {/* Action Buttons: UPDATE & DELETE */}
              <View style={styles.modalActionRow}>
                <TouchableOpacity
                  onPress={() => handleOpenEdit(selectedDriver!)}
                  style={styles.editBtn}
                  activeOpacity={0.8}
                >
                  <Ionicons name="create-outline" size={15} color="#0d6942" />
                  <Text style={styles.editBtnText}>Edit Remittance</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => handleDeleteRemittance(selectedDriver!.id)}
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

      {/* Add Remittance Modal */}
      <Modal visible={isAddModalOpen} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>New Driver Remittance</Text>
                <Text style={styles.modalSub}>4-week cycle payment schedule</Text>
              </View>
              <TouchableOpacity onPress={() => setIsAddModalOpen(false)} style={styles.closeBtn}>
                <Ionicons name="close" size={20} color="#64748b" />
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.sheetContent}>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>DRIVER FULL NAME</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="e.g. Marcos Souza"
                  placeholderTextColor="#94a3b8"
                  value={formName}
                  onChangeText={setFormName}
                />
              </View>

              <View style={styles.formRow}>
                <View style={[styles.formGroup, { flex: 1 }]}>
                  <Text style={styles.formLabel}>DRIVER CODE</Text>
                  <TextInput
                    style={styles.formInput}
                    value={formDriverCode}
                    onChangeText={setFormDriverCode}
                  />
                </View>
                <View style={[styles.formGroup, { flex: 1 }]}>
                  <Text style={styles.formLabel}>VAN ALLOCATION</Text>
                  <View style={styles.vanToggleRow}>
                    <TouchableOpacity
                      onPress={() => setFormVanType('Company Van')}
                      style={[styles.vanBtn, formVanType === 'Company Van' && styles.vanBtnActive]}
                    >
                      <Text style={[styles.vanBtnText, formVanType === 'Company Van' && styles.vanBtnTextActive]}>
                        Company
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => setFormVanType('Own Van')}
                      style={[styles.vanBtn, formVanType === 'Own Van' && styles.vanBtnActive]}
                    >
                      <Text style={[styles.vanBtnText, formVanType === 'Own Van' && styles.vanBtnTextActive]}>
                        Own Van
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>BANK ACCOUNT / SORT CODE</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="Monzo • 04-00-04 • ••••4910"
                  placeholderTextColor="#94a3b8"
                  value={formBank}
                  onChangeText={setFormBank}
                />
              </View>

              <View style={styles.formRow}>
                <View style={[styles.formGroup, { flex: 1 }]}>
                  <Text style={styles.formLabel}>GROSS AGREED (£)</Text>
                  <TextInput
                    style={styles.formInput}
                    keyboardType="numeric"
                    value={formGross}
                    onChangeText={setFormGross}
                  />
                </View>
                <View style={[styles.formGroup, { flex: 1 }]}>
                  <Text style={styles.formLabel}>VAN RENT (£)</Text>
                  <TextInput
                    style={styles.formInput}
                    keyboardType="numeric"
                    editable={formVanType === 'Company Van'}
                    value={formVanType === 'Company Van' ? formVanRent : '0.00'}
                    onChangeText={setFormVanRent}
                  />
                </View>
              </View>

              <View style={styles.formRow}>
                <View style={[styles.formGroup, { flex: 1 }]}>
                  <Text style={styles.formLabel}>FUEL CARD (£)</Text>
                  <TextInput
                    style={styles.formInput}
                    keyboardType="numeric"
                    value={formFuel}
                    onChangeText={setFormFuel}
                  />
                </View>
                <View style={[styles.formGroup, { flex: 1 }]}>
                  <Text style={styles.formLabel}>DAMAGE ESCROW (£)</Text>
                  <TextInput
                    style={styles.formInput}
                    keyboardType="numeric"
                    editable={formVanType === 'Company Van'}
                    value={formVanType === 'Company Van' ? formDeposit : '0.00'}
                    onChangeText={setFormDeposit}
                  />
                </View>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>MID-MONTH CASH ADVANCE (£)</Text>
                <TextInput
                  style={styles.formInput}
                  keyboardType="numeric"
                  value={formAdvance}
                  onChangeText={setFormAdvance}
                />
              </View>

              <View style={styles.formActionRow}>
                <TouchableOpacity
                  onPress={() => setIsAddModalOpen(false)}
                  style={styles.cancelBtn}
                >
                  <Text style={styles.cancelBtnText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleCreateRemittance}
                  style={styles.submitBtn}
                >
                  <Text style={styles.submitBtnText}>Create Remittance</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Edit Remittance Modal */}
      <Modal visible={isEditModalOpen} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>Edit Remittance Deductions</Text>
                <Text style={styles.modalSub}>{selectedDriver?.name}</Text>
              </View>
              <TouchableOpacity onPress={() => setIsEditModalOpen(false)} style={styles.closeBtn}>
                <Ionicons name="close" size={20} color="#64748b" />
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.sheetContent}>
              <View style={styles.formRow}>
                <View style={[styles.formGroup, { flex: 1 }]}>
                  <Text style={styles.formLabel}>AGREED GROSS (£)</Text>
                  <TextInput
                    style={styles.formInput}
                    keyboardType="numeric"
                    value={formGross}
                    onChangeText={setFormGross}
                  />
                </View>
                <View style={[styles.formGroup, { flex: 1 }]}>
                  <Text style={styles.formLabel}>VAN RENT (£)</Text>
                  <TextInput
                    style={styles.formInput}
                    keyboardType="numeric"
                    value={formVanRent}
                    onChangeText={setFormVanRent}
                  />
                </View>
              </View>

              <View style={styles.formRow}>
                <View style={[styles.formGroup, { flex: 1 }]}>
                  <Text style={styles.formLabel}>FUEL CARD (£)</Text>
                  <TextInput
                    style={styles.formInput}
                    keyboardType="numeric"
                    value={formFuel}
                    onChangeText={setFormFuel}
                  />
                </View>
                <View style={[styles.formGroup, { flex: 1 }]}>
                  <Text style={styles.formLabel}>DAMAGE ESCROW (£)</Text>
                  <TextInput
                    style={styles.formInput}
                    keyboardType="numeric"
                    value={formDeposit}
                    onChangeText={setFormDeposit}
                  />
                </View>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>CASH ADVANCE DEDUCTION (£)</Text>
                <TextInput
                  style={styles.formInput}
                  keyboardType="numeric"
                  value={formAdvance}
                  onChangeText={setFormAdvance}
                />
              </View>

              <View style={styles.formActionRow}>
                <TouchableOpacity
                  onPress={() => setIsEditModalOpen(false)}
                  style={styles.cancelBtn}
                >
                  <Text style={styles.cancelBtnText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleUpdateRemittance}
                  style={styles.submitBtn}
                >
                  <Text style={styles.submitBtnText}>Recalculate & Save</Text>
                </TouchableOpacity>
              </View>
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
    top: 8,
    left: 14,
    right: 14,
    backgroundColor: '#0d6942',
    paddingVertical: 9,
    paddingHorizontal: 14,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    zIndex: 99,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 4,
  },
  toastText: {
    color: '#ffffff',
    fontSize: 12,
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
  actionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 6,
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: '#0f172a',
  },
  headerSub: {
    fontSize: 11,
    color: '#64748b',
  },
  createBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0d6942',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 7,
    gap: 4,
  },
  createBtnText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '800',
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
  list: {
    padding: 12,
    gap: 8,
    paddingBottom: 28,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 9,
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
    width: 32,
    height: 32,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconGreen: { backgroundColor: '#ecfdf5' },
  iconBlue: { backgroundColor: '#eff6ff' },
  infoCol: {
    gap: 1,
    flex: 1,
  },
  titleText: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#0f172a',
  },
  subText: {
    fontSize: 10.5,
    color: '#64748b',
  },
  cardRight: {
    alignItems: 'flex-end',
    flexDirection: 'row',
    gap: 6,
  },
  netAmount: {
    fontSize: 12.5,
    fontWeight: '900',
    color: '#0d6942',
  },
  subPayDate: {
    fontSize: 9.5,
    color: '#94a3b8',
    marginTop: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    maxHeight: '88%',
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
    padding: 3,
  },
  sheetContent: {
    gap: 10,
    paddingBottom: 24,
  },
  periodBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ecfdf5',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    gap: 6,
  },
  periodBannerText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0d6942',
  },
  remittanceCard: {
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    paddingHorizontal: 12,
  },
  remittanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 7,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  itemLabel: {
    fontSize: 11,
    color: '#64748b',
    fontWeight: '500',
  },
  itemVal: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0f172a',
  },
  subtotalRow: {
    backgroundColor: '#f1f5f9',
    marginHorizontal: -12,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  subtotalLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#334155',
  },
  subtotalVal: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#0f172a',
  },
  totalRow: {
    borderBottomWidth: 0,
    paddingVertical: 9,
  },
  totalLabel: {
    fontSize: 11.5,
    fontWeight: '900',
    color: '#0f172a',
  },
  totalVal: {
    fontSize: 14,
    fontWeight: '900',
    color: '#0d6942',
  },
  bankNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 2,
  },
  bankNoticeText: {
    fontSize: 10.5,
    color: '#64748b',
  },
  modalActionRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  editBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ecfdf5',
    borderWidth: 1,
    borderColor: '#a7f3d0',
    paddingVertical: 10,
    borderRadius: 8,
    gap: 6,
  },
  editBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0d6942',
  },
  deleteBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#fecaca',
    paddingVertical: 10,
    borderRadius: 8,
    gap: 6,
  },
  deleteBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#dc2626',
  },
  formGroup: {
    gap: 4,
  },
  formRow: {
    flexDirection: 'row',
    gap: 8,
  },
  formLabel: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#64748b',
    letterSpacing: 0.5,
  },
  formInput: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 7,
    paddingVertical: 8,
    paddingHorizontal: 10,
    fontSize: 12,
    color: '#0f172a',
  },
  vanToggleRow: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 7,
    overflow: 'hidden',
  },
  vanBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  vanBtnActive: {
    backgroundColor: '#0d6942',
  },
  vanBtnText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#64748b',
  },
  vanBtnTextActive: {
    color: '#ffffff',
  },
  formActionRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 10,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 7,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    alignItems: 'center',
  },
  cancelBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748b',
  },
  submitBtn: {
    flex: 2,
    backgroundColor: '#0d6942',
    paddingVertical: 10,
    borderRadius: 7,
    alignItems: 'center',
  },
  submitBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#ffffff',
  },
});
