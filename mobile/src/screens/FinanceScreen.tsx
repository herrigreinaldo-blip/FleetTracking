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

export interface FinanceCardItem {
  id: string;
  type: 'Account' | 'Drawings' | 'Transaction' | 'PnL';
  title: string;
  sub: string;
  amount: string;
  entity: string;
  badge: string;
  badgeColor: 'green' | 'blue' | 'amber' | 'red';
  category: string;
  date: string;
  details: { label: string; val: string }[];
}

const INITIAL_FINANCE_DATA: FinanceCardItem[] = [
  {
    id: 'F-1',
    type: 'Account',
    title: 'MS Herrig NatWest Current',
    sub: '••••4920 • Primary Account',
    amount: '£1,757.81',
    entity: 'MS Herrig Ltd',
    badge: 'Primary Account',
    badgeColor: 'green',
    category: 'Banking',
    date: '28 Oct 2026',
    details: [
      { label: 'Company Entity', val: 'MS Herrig Ltd' },
      { label: 'Bank Name', val: 'NatWest Commercial Business' },
      { label: 'Live Available Balance', val: '£1,757.81' },
      { label: 'September Gross Inflows', val: '£65,880.38' },
      { label: 'Primary Use', val: 'DPD Franchise Direct Inflows & Driver Pay' },
    ]
  },
  {
    id: 'F-2',
    type: 'Account',
    title: 'TGB Services NatWest Reserve',
    sub: '••••8812 • Secondary Account',
    amount: '£3,794.50',
    entity: 'TGB Services and Solutions Ltd',
    badge: 'Reserve Account',
    badgeColor: 'blue',
    category: 'Banking',
    date: '28 Oct 2026',
    details: [
      { label: 'Company Entity', val: 'TGB Services and Solutions Ltd' },
      { label: 'Bank Name', val: 'NatWest Business Reserve' },
      { label: 'Live Available Balance', val: '£3,794.50' },
      { label: 'September Gross Inflows', val: '£14,210.00' },
      { label: 'Primary Use', val: 'Fuel Card Direct Debits & Vehicle Leases' },
    ]
  },
  {
    id: 'F-3',
    type: 'Drawings',
    title: 'Director Reinaldo Herrig Drawings',
    sub: 'Target £5,000 / month cap',
    amount: '£4,200.00',
    entity: 'MS Herrig Ltd',
    badge: '84% Cap Used',
    badgeColor: 'green',
    category: 'Director',
    date: 'Oct 2026 Cycle',
    details: [
      { label: 'Director', val: 'Reinaldo Herrig' },
      { label: 'Debited Company', val: 'MS Herrig Ltd' },
      { label: 'Monthly Allowance Target', val: '£5,000.00' },
      { label: 'Current Total Drawn', val: '£4,200.00 (84%)' },
      { label: 'Remaining Cap', val: '£800.00' },
    ]
  },
  {
    id: 'F-4',
    type: 'Drawings',
    title: 'Director Tulio Santos Drawings',
    sub: 'Target £5,000 / month cap',
    amount: '£4,500.00',
    entity: 'TGB Services and Solutions Ltd',
    badge: '90% Cap Used',
    badgeColor: 'blue',
    category: 'Director',
    date: 'Oct 2026 Cycle',
    details: [
      { label: 'Director', val: 'Tulio Santos' },
      { label: 'Debited Company', val: 'TGB Services and Solutions Ltd' },
      { label: 'Monthly Allowance Target', val: '£5,000.00' },
      { label: 'Current Total Drawn', val: '£4,500.00 (90%)' },
      { label: 'Remaining Cap', val: '£500.00' },
    ]
  },
  {
    id: 'F-5',
    type: 'PnL',
    title: 'September 2026 P&L Audit',
    sub: 'Spreadsheet Tab: SETEMBRO-26',
    amount: '£15,465.48',
    entity: 'MS Herrig Ltd',
    badge: '23.5% Profit Margin',
    badgeColor: 'green',
    category: 'Carrier P&L',
    date: 'Sep 2026 Closed',
    details: [
      { label: 'Total DPD Carrier Income', val: '£65,880.38' },
      { label: 'Driver Subcontractor Payroll', val: '-£38,671.84' },
      { label: 'Gross Margin', val: '£27,208.54 (41.3%)' },
      { label: 'Fleet & Fuel Overheads', val: '-£7,040.20' },
      { label: 'Net Retained Operating Profit', val: '£15,465.48' },
    ]
  },
  {
    id: 'F-6',
    type: 'Transaction',
    title: 'Mercedes-Benz Birmingham Service',
    sub: '26 Sep • Fleet Maintenance',
    amount: '-£1,060.00',
    entity: 'MS Herrig Ltd',
    badge: 'Linked: KR23 XYZ',
    badgeColor: 'amber',
    category: 'Fleet Maintenance',
    date: '26 Sep 2026',
    details: [
      { label: 'Transaction ID', val: 'TXN-1087' },
      { label: 'Vendor / Supplier', val: 'Mercedes-Benz Birmingham Central' },
      { label: 'Gross Invoice Amount', val: '£1,060.00' },
      { label: '20% VAT Reclaimed', val: '£176.67 (Auto-routed to Box 4)' },
      { label: 'Linked Vehicle', val: 'KR23 XYZ (Appended to Logbook)' },
    ]
  },
  {
    id: 'F-7',
    type: 'Transaction',
    title: 'Allstar Fuel Direct Debit',
    sub: '25 Sep • Fleet Fuel Cards',
    amount: '-£2,150.00',
    entity: 'TGB Services and Solutions Ltd',
    badge: 'Direct Debit',
    badgeColor: 'amber',
    category: 'Fuel Overheads',
    date: '25 Sep 2026',
    details: [
      { label: 'Transaction ID', val: 'TXN-1088' },
      { label: 'Vendor / Supplier', val: 'Allstar Business Solutions' },
      { label: 'Gross Amount', val: '£2,150.00' },
      { label: '20% VAT Reclaimed', val: '£358.33' },
      { label: 'Fleet Card Count', val: '8 Active Fuel Cards' },
    ]
  }
];

interface FinanceScreenProps {
  searchQuery?: string;
}

export const FinanceScreen: React.FC<FinanceScreenProps> = ({ searchQuery = '' }) => {
  const [items, setItems] = useState<FinanceCardItem[]>(INITIAL_FINANCE_DATA);
  const [selectedFilter, setSelectedFilter] = useState<'All' | 'Account' | 'Drawings' | 'Transaction' | 'PnL'>('All');
  const [selectedItem, setSelectedItem] = useState<FinanceCardItem | null>(null);

  // Modals & Feedback
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Add / Edit Form State
  const [formType, setFormType] = useState<'Transaction' | 'Drawings' | 'Account' | 'PnL'>('Transaction');
  const [formTitle, setFormTitle] = useState('');
  const [formSub, setFormSub] = useState('');
  const [formAmount, setFormAmount] = useState('');
  const [formEntity, setFormEntity] = useState('MS Herrig Ltd');
  const [formCategory, setFormCategory] = useState('Fleet Maintenance');
  const [formRef, setFormRef] = useState('');
  const [isInflow, setIsInflow] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Open Create Modal with clean defaults
  const handleOpenAdd = () => {
    setFormType('Transaction');
    setFormTitle('');
    setFormSub('Fleet Maintenance & Servicing');
    setFormAmount('450.00');
    setFormEntity('MS Herrig Ltd');
    setFormCategory('Fleet Maintenance');
    setFormRef('KR23 XYZ');
    setIsInflow(false);
    setIsAddModalOpen(true);
  };

  const handleCreateRecord = () => {
    if (!formTitle.trim() || !formAmount.trim()) {
      Alert.alert('Required Fields', 'Please enter a title and amount.');
      return;
    }

    const numAmt = parseFloat(formAmount.replace(/[^0-9.]/g, '')) || 0;
    const formattedAmt = `${formType === 'Transaction' && !isInflow ? '-' : ''}£${numAmt.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    const newItem: FinanceCardItem = {
      id: `F-${Date.now()}`,
      type: formType,
      title: formTitle.trim(),
      sub: formSub.trim() || `${formCategory} • ${formEntity}`,
      amount: formattedAmt,
      entity: formEntity,
      badge: formRef ? `Ref: ${formRef}` : formCategory,
      badgeColor: formType === 'Account' ? 'green' : formType === 'Drawings' ? 'blue' : isInflow ? 'green' : 'amber',
      category: formCategory,
      date: 'Today',
      details: [
        { label: 'Company Entity', val: formEntity },
        { label: 'Category', val: formCategory },
        { label: 'Gross Amount', val: formattedAmt },
        { label: 'Reference / Linked Asset', val: formRef || 'Unassigned' },
        { label: 'Auto-Routing Rule', val: formType === 'Transaction' ? 'VAT Box 4 Reclaim Tagged' : 'Direct Ledger Allocation' },
      ]
    };

    setItems([newItem, ...items]);
    setIsAddModalOpen(false);
    showToast(`Recorded: ${newItem.title}`);
  };

  // Open Edit Modal
  const handleOpenEdit = (item: FinanceCardItem) => {
    setFormType(item.type);
    setFormTitle(item.title);
    setFormSub(item.sub);
    setFormAmount(item.amount.replace(/[-£,]/g, ''));
    setFormEntity(item.entity);
    setFormCategory(item.category);
    setFormRef(item.badge.replace(/^Ref:\s*/, ''));
    setIsInflow(!item.amount.startsWith('-'));
    setIsEditModalOpen(true);
  };

  const handleUpdateRecord = () => {
    if (!selectedItem || !formTitle.trim()) return;

    const numAmt = parseFloat(formAmount.replace(/[^0-9.]/g, '')) || 0;
    const formattedAmt = `${formType === 'Transaction' && !isInflow ? '-' : ''}£${numAmt.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    const updated: FinanceCardItem = {
      ...selectedItem,
      type: formType,
      title: formTitle.trim(),
      sub: formSub.trim() || `${formCategory} • ${formEntity}`,
      amount: formattedAmt,
      entity: formEntity,
      category: formCategory,
      badge: formRef ? `Ref: ${formRef}` : formCategory,
      details: [
        { label: 'Company Entity', val: formEntity },
        { label: 'Category', val: formCategory },
        { label: 'Updated Amount', val: formattedAmt },
        { label: 'Reference / Linked Asset', val: formRef || 'Unassigned' },
        { label: 'Audit Status', val: 'Modified by Director Reinaldo' },
      ]
    };

    setItems(items.map(it => it.id === selectedItem.id ? updated : it));
    setSelectedItem(updated);
    setIsEditModalOpen(false);
    showToast(`Updated: ${updated.title}`);
  };

  const handleDeleteRecord = (itemId: string) => {
    const itemToDelete = items.find(it => it.id === itemId);
    setItems(items.filter(it => it.id !== itemId));
    setSelectedItem(null);
    showToast(`Deleted: ${itemToDelete?.title || 'Record'}`);
  };

  // Filter & Search Logic
  const filtered = items.filter(item => {
    const matchesFilter = selectedFilter === 'All' || item.type === selectedFilter;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      item.title.toLowerCase().includes(q) ||
      item.sub.toLowerCase().includes(q) ||
      item.amount.toLowerCase().includes(q) ||
      item.entity.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q);
    return matchesFilter && matchesSearch;
  });

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
          <Text style={styles.metricLabel}>TOTAL CASH</Text>
          <Text style={styles.metricVal}>£5,552.31</Text>
          <Text style={styles.metricSub}>2 NatWest accounts</Text>
        </View>
        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>SEP NET PROFIT</Text>
          <Text style={[styles.metricVal, { color: '#0d6942' }]}>£15,465.48</Text>
          <Text style={styles.metricSub}>23.5% margin</Text>
        </View>
        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>DRAWINGS TOTAL</Text>
          <Text style={[styles.metricVal, { color: '#1d4ed8' }]}>£8,700.00</Text>
          <Text style={styles.metricSub}>/ £10,000 cap</Text>
        </View>
      </View>

      {/* Subheader Toolbar with Add Button */}
      <View style={styles.actionHeader}>
        <View>
          <Text style={styles.headerTitle}>Financial Control</Text>
          <Text style={styles.headerSub}>{filtered.length} entries in multi-entity ledger</Text>
        </View>
        <TouchableOpacity onPress={handleOpenAdd} style={styles.createBtn} activeOpacity={0.8}>
          <Ionicons name="add" size={15} color="#ffffff" />
          <Text style={styles.createBtnText}>Record Entry</Text>
        </TouchableOpacity>
      </View>

      {/* Filter Chips */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterBar}>
        {(['All', 'Account', 'Drawings', 'Transaction', 'PnL'] as const).map(f => {
          const isSel = selectedFilter === f;
          return (
            <TouchableOpacity
              key={f}
              onPress={() => setSelectedFilter(f)}
              style={[styles.filterChip, isSel && styles.filterChipActive]}
            >
              <Text style={[styles.filterChipText, isSel && styles.filterChipTextActive]}>
                {f === 'Account' ? 'Accounts' : f === 'Transaction' ? 'Transactions' : f === 'PnL' ? 'P&L Audit' : f}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Minimal Navigation Cards Feed */}
      <ScrollView contentContainerStyle={styles.list}>
        {filtered.map(item => (
          <TouchableOpacity
            key={item.id}
            onPress={() => setSelectedItem(item)}
            style={styles.card}
            activeOpacity={0.7}
          >
            <View style={styles.cardContent}>
              <View style={[
                styles.iconBox,
                item.badgeColor === 'blue' ? styles.iconBlue :
                item.badgeColor === 'amber' ? styles.iconAmber : styles.iconGreen
              ]}>
                <Ionicons
                  name={
                    item.type === 'Account' ? 'business-outline' :
                    item.type === 'Drawings' ? 'person-outline' :
                    item.type === 'PnL' ? 'trending-up-outline' : 'receipt-outline'
                  }
                  size={15}
                  color={
                    item.badgeColor === 'blue' ? '#1d4ed8' :
                    item.badgeColor === 'amber' ? '#b45309' : '#0d6942'
                  }
                />
              </View>
              <View style={styles.infoCol}>
                <Text style={styles.titleText}>{item.title}</Text>
                <Text style={styles.subText}>{item.sub}</Text>
              </View>
            </View>

            <View style={styles.cardRight}>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={[
                  styles.amountText,
                  item.amount.startsWith('-') ? { color: '#dc2626' } :
                  item.type === 'Drawings' ? { color: '#1d4ed8' } : { color: '#0d6942' }
                ]}>
                  {item.amount}
                </Text>
                <Text style={styles.badgeLabel}>{item.badge}</Text>
              </View>
              <Ionicons name="chevron-forward" size={14} color="#94a3b8" />
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Redirection / Dedicated Finance Detail Modal */}
      <Modal visible={!!selectedItem} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <View style={{ flex: 1 }}>
                <Text style={styles.modalTitle}>{selectedItem?.title}</Text>
                <Text style={styles.modalSub}>{selectedItem?.entity} • {selectedItem?.category}</Text>
              </View>
              <TouchableOpacity onPress={() => setSelectedItem(null)} style={styles.closeBtn}>
                <Ionicons name="close" size={20} color="#64748b" />
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.sheetContent}>
              <View style={styles.calloutRow}>
                <Text style={styles.calloutLabel}>AMOUNT</Text>
                <Text style={[
                  styles.calloutVal,
                  selectedItem?.amount.startsWith('-') ? { color: '#dc2626' } :
                  selectedItem?.type === 'Drawings' ? { color: '#1d4ed8' } : { color: '#0d6942' }
                ]}>
                  {selectedItem?.amount}
                </Text>
              </View>

              <View style={styles.detailCard}>
                {selectedItem?.details.map((d, idx) => (
                  <View
                    key={idx}
                    style={[
                      styles.detailRow,
                      idx === selectedItem.details.length - 1 && { borderBottomWidth: 0 }
                    ]}
                  >
                    <Text style={styles.detailLabel}>{d.label}</Text>
                    <Text style={styles.detailValue}>{d.val}</Text>
                  </View>
                ))}
              </View>

              {/* Action Buttons: UPDATE & DELETE */}
              <View style={styles.modalActionRow}>
                <TouchableOpacity
                  onPress={() => handleOpenEdit(selectedItem!)}
                  style={styles.editBtn}
                  activeOpacity={0.8}
                >
                  <Ionicons name="create-outline" size={15} color="#0d6942" />
                  <Text style={styles.editBtnText}>Edit Record</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => handleDeleteRecord(selectedItem!.id)}
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

      {/* Add Record Modal */}
      <Modal visible={isAddModalOpen} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>Record Treasury Entry</Text>
                <Text style={styles.modalSub}>Append to multi-entity cash ledger</Text>
              </View>
              <TouchableOpacity onPress={() => setIsAddModalOpen(false)} style={styles.closeBtn}>
                <Ionicons name="close" size={20} color="#64748b" />
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.sheetContent}>
              {/* Type Picker */}
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>ENTRY TYPE</Text>
                <View style={styles.formTypeRow}>
                  {(['Transaction', 'Drawings', 'Account', 'PnL'] as const).map(t => (
                    <TouchableOpacity
                      key={t}
                      onPress={() => setFormType(t)}
                      style={[styles.typeBtn, formType === t && styles.typeBtnActive]}
                    >
                      <Text style={[styles.typeBtnText, formType === t && styles.typeBtnTextActive]}>
                        {t}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Company Entity */}
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>LEGAL ENTITY</Text>
                <View style={styles.formTypeRow}>
                  {['MS Herrig Ltd', 'TGB Services', 'GoConnect'].map(ent => (
                    <TouchableOpacity
                      key={ent}
                      onPress={() => setFormEntity(ent)}
                      style={[styles.typeBtn, formEntity.startsWith(ent) && styles.typeBtnActive]}
                    >
                      <Text style={[styles.typeBtnText, formEntity.startsWith(ent) && styles.typeBtnTextActive]}>
                        {ent}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Title / Description */}
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>TITLE / VENDOR DESCRIPTION</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="e.g. Mercedes-Benz Birmingham Service"
                  placeholderTextColor="#94a3b8"
                  value={formTitle}
                  onChangeText={setFormTitle}
                />
              </View>

              {/* Amount & Inflow/Outflow */}
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>AMOUNT (£)</Text>
                <View style={styles.amountInputRow}>
                  <TouchableOpacity
                    onPress={() => setIsInflow(!isInflow)}
                    style={[styles.inflowToggle, isInflow ? styles.inflowGreen : styles.inflowRed]}
                  >
                    <Ionicons name={isInflow ? 'arrow-down' : 'arrow-up'} size={14} color="#ffffff" />
                    <Text style={styles.inflowText}>{isInflow ? 'Inflow (+)' : 'Outflow (-)'}</Text>
                  </TouchableOpacity>
                  <TextInput
                    style={[styles.formInput, { flex: 1 }]}
                    placeholder="0.00"
                    placeholderTextColor="#94a3b8"
                    keyboardType="numeric"
                    value={formAmount}
                    onChangeText={setFormAmount}
                  />
                </View>
              </View>

              {/* Category */}
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>CATEGORY</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="Fleet Maintenance, Fuel, Banking, etc."
                  placeholderTextColor="#94a3b8"
                  value={formCategory}
                  onChangeText={setFormCategory}
                />
              </View>

              {/* Reference / Linked Vehicle */}
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>REFERENCE / LINKED ASSET</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="e.g. KR23 XYZ or Monzo Ref"
                  placeholderTextColor="#94a3b8"
                  value={formRef}
                  onChangeText={setFormRef}
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
                  onPress={handleCreateRecord}
                  style={styles.submitBtn}
                >
                  <Text style={styles.submitBtnText}>Record Entry</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Edit Record Modal */}
      <Modal visible={isEditModalOpen} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>Edit Financial Entry</Text>
                <Text style={styles.modalSub}>{selectedItem?.title}</Text>
              </View>
              <TouchableOpacity onPress={() => setIsEditModalOpen(false)} style={styles.closeBtn}>
                <Ionicons name="close" size={20} color="#64748b" />
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.sheetContent}>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>ENTRY TITLE</Text>
                <TextInput
                  style={styles.formInput}
                  value={formTitle}
                  onChangeText={setFormTitle}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>AMOUNT (£)</Text>
                <View style={styles.amountInputRow}>
                  <TouchableOpacity
                    onPress={() => setIsInflow(!isInflow)}
                    style={[styles.inflowToggle, isInflow ? styles.inflowGreen : styles.inflowRed]}
                  >
                    <Ionicons name={isInflow ? 'arrow-down' : 'arrow-up'} size={14} color="#ffffff" />
                    <Text style={styles.inflowText}>{isInflow ? 'Inflow (+)' : 'Outflow (-)'}</Text>
                  </TouchableOpacity>
                  <TextInput
                    style={[styles.formInput, { flex: 1 }]}
                    keyboardType="numeric"
                    value={formAmount}
                    onChangeText={setFormAmount}
                  />
                </View>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>CATEGORY</Text>
                <TextInput
                  style={styles.formInput}
                  value={formCategory}
                  onChangeText={setFormCategory}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>REFERENCE / LINKED ASSET</Text>
                <TextInput
                  style={styles.formInput}
                  value={formRef}
                  onChangeText={setFormRef}
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
                  onPress={handleUpdateRecord}
                  style={styles.submitBtn}
                >
                  <Text style={styles.submitBtnText}>Save Changes</Text>
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
  iconAmber: { backgroundColor: '#fffbeb' },
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
  amountText: {
    fontSize: 12.5,
    fontWeight: '900',
    color: '#0f172a',
  },
  badgeLabel: {
    fontSize: 9.5,
    color: '#94a3b8',
    fontWeight: '600',
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
  calloutRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  calloutLabel: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#94a3b8',
    letterSpacing: 0.5,
  },
  calloutVal: {
    fontSize: 16,
    fontWeight: '900',
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
    textAlign: 'right',
    maxWidth: '65%',
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
  formLabel: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#64748b',
    letterSpacing: 0.5,
  },
  formTypeRow: {
    flexDirection: 'row',
    gap: 6,
    flexWrap: 'wrap',
  },
  typeBtn: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    backgroundColor: '#f8fafc',
  },
  typeBtnActive: {
    backgroundColor: '#0d6942',
    borderColor: '#0d6942',
  },
  typeBtnText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#475569',
  },
  typeBtnTextActive: {
    color: '#ffffff',
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
  amountInputRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  inflowToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 7,
  },
  inflowGreen: { backgroundColor: '#0d6942' },
  inflowRed: { backgroundColor: '#dc2626' },
  inflowText: {
    color: '#ffffff',
    fontSize: 10.5,
    fontWeight: '800',
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
