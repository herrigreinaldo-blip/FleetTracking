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

export interface VatAuditCardItem {
  id: string;
  category: 'VAT Return' | 'DPD Dispute' | 'Receipt';
  title: string;
  sub: string;
  status: 'Compliant' | 'Dispute Required' | 'Verified' | 'Resolved';
  statusColor: 'green' | 'red' | 'blue' | 'amber';
  highlight: string;
  details: { label: string; val: string }[];
  letterContent?: string;
}

const INITIAL_VAT_AUDIT_DATA: VatAuditCardItem[] = [
  {
    id: 'VA-1',
    category: 'VAT Return',
    title: 'HMRC Quarterly VAT Return Q3',
    sub: 'MS Herrig Ltd • 01-07 to 30-09-2026',
    status: 'Compliant',
    statusColor: 'green',
    highlight: 'Net Due: £3,116.50',
    details: [
      { label: 'Company VAT Reg', val: 'GB 412 8990 12' },
      { label: 'Box 1: Output VAT (Sales)', val: '£22,626.98' },
      { label: 'Box 4: Input VAT (Purchases)', val: '£19,510.48' },
      { label: 'Box 5: Net Payable to HMRC', val: '£3,116.50' },
      { label: 'Direct Debit Settled', val: '£3,420.00' },
      { label: 'Rollover Credit to Q4', val: '+£303.50 (Overpayment)' },
    ]
  },
  {
    id: 'VA-2',
    category: 'DPD Dispute',
    title: 'Route 593 Remittance Shortfall',
    sub: 'FD 12354 Birmingham • Week 41',
    status: 'Dispute Required',
    statusColor: 'red',
    highlight: '-£57.42 Underpaid',
    details: [
      { label: 'Route Identifier', val: 'Route 593' },
      { label: 'Depot Franchise', val: 'FD 12354 (Birmingham Central)' },
      { label: 'Assigned Driver', val: 'Ronaldo Luiz Silva (DR 85899)' },
      { label: 'Contracted Agreed Rate', val: '£1,045.00' },
      { label: 'DPD Remitted Rate', val: '£987.58' },
      { label: 'Unreconciled Shortfall', val: '-£57.42 (Stop clawback)' },
    ],
    letterContent: `TO: DPD UK Accounts Payable (Depot FD 12354)
FROM: MS Herrig Ltd
DATE: 28 October 2026
SUBJECT: CONTRACT RATE RECONCILIATION - Route 593

We formally dispute the remittance underpayment on Route 593 for operating week 41.
• Contracted Rate: £1,045.00
• Remitted Rate:   £987.58
• Shortfall Due:   £57.42 + 20% VAT

All scheduled deliveries were fulfilled according to carrier specification. Please issue a supplementary remittance invoice on the upcoming cycle.`
  },
  {
    id: 'VA-3',
    category: 'DPD Dispute',
    title: 'Route 104 Remittance Shortfall',
    sub: 'FD 14902 Solihull • Week 41',
    status: 'Dispute Required',
    statusColor: 'red',
    highlight: '-£80.00 Underpaid',
    details: [
      { label: 'Route Identifier', val: 'Route 104' },
      { label: 'Depot Franchise', val: 'FD 14902 (Solihull West)' },
      { label: 'Assigned Driver', val: 'Douglas Santos (DR 85901)' },
      { label: 'Contracted Agreed Rate', val: '£1,100.00' },
      { label: 'DPD Remitted Rate', val: '£1,020.00' },
      { label: 'Unreconciled Shortfall', val: '-£80.00' },
    ],
    letterContent: `TO: DPD UK Accounts Payable (Depot FD 14902)
FROM: MS Herrig Ltd
DATE: 28 October 2026
SUBJECT: CONTRACT RATE RECONCILIATION - Route 104

We formally dispute the remittance underpayment on Route 104 for operating week 41.
• Contracted Rate: £1,100.00
• Remitted Rate:   £1,020.00
• Shortfall Due:   £80.00 + 20% VAT`
  },
  {
    id: 'VA-4',
    category: 'Receipt',
    title: 'Mercedes-Benz Birmingham Central',
    sub: 'Invoice MB-88491 • 26 Sep 2026',
    status: 'Verified',
    statusColor: 'blue',
    highlight: '£1,060.00 Gross',
    details: [
      { label: 'Supplier', val: 'Mercedes-Benz Birmingham Central' },
      { label: 'Category', val: 'Fleet Repairs & Maintenance' },
      { label: 'Net Purchase', val: '£883.33' },
      { label: '20% VAT Reclaim Portion', val: '£176.67 (Linked to Box 4)' },
      { label: 'Linked Vehicle', val: 'KR23 XYZ (Appended to Logbook)' },
      { label: 'HMRC Retention', val: '6-Year Digital Audit Compliant' },
    ]
  },
  {
    id: 'VA-5',
    category: 'Receipt',
    title: 'Allstar Fuel Solutions Card',
    sub: 'Invoice ALL-2026-09 • 25 Sep 2026',
    status: 'Verified',
    statusColor: 'blue',
    highlight: '£2,150.00 Gross',
    details: [
      { label: 'Supplier', val: 'Allstar Business Solutions' },
      { label: 'Category', val: 'Fuel Card Fleet Direct Debit' },
      { label: 'Net Purchase', val: '£1,791.67' },
      { label: '20% VAT Reclaim Portion', val: '£358.33 (Linked to Box 4)' },
      { label: 'HMRC Retention', val: '6-Year Digital Audit Compliant' },
    ]
  }
];

interface VatAuditScreenProps {
  searchQuery?: string;
}

export const VatAuditScreen: React.FC<VatAuditScreenProps> = ({ searchQuery = '' }) => {
  const [items, setItems] = useState<VatAuditCardItem[]>(INITIAL_VAT_AUDIT_DATA);
  const [selectedFilter, setSelectedFilter] = useState<'All' | 'VAT Return' | 'DPD Dispute' | 'Receipt'>('All');
  const [selectedItem, setSelectedItem] = useState<VatAuditCardItem | null>(null);

  // Modals & Feedback
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form State
  const [formCategory, setFormCategory] = useState<'DPD Dispute' | 'Receipt' | 'VAT Return'>('DPD Dispute');
  const [formTitle, setFormTitle] = useState('');
  const [formSub, setFormSub] = useState('');
  const [formHighlight, setFormHighlight] = useState('');
  const [formStatus, setFormStatus] = useState<'Dispute Required' | 'Compliant' | 'Verified' | 'Resolved'>('Dispute Required');
  const [formLetter, setFormLetter] = useState('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleOpenAdd = () => {
    setFormCategory('DPD Dispute');
    setFormTitle('Route 214 Remittance Shortfall');
    setFormSub('FD 12354 Birmingham • Week 41');
    setFormHighlight('-£45.00 Underpaid');
    setFormStatus('Dispute Required');
    setFormLetter(`TO: DPD UK Accounts Payable (Depot FD 12354)
FROM: MS Herrig Ltd
DATE: 28 October 2026
SUBJECT: CONTRACT RATE RECONCILIATION - Route 214

We formally dispute the remittance underpayment on Route 214.
• Shortfall Due: £45.00 + 20% VAT`);
    setIsAddModalOpen(true);
  };

  const handleCreateEntry = () => {
    if (!formTitle.trim()) {
      Alert.alert('Required Field', 'Please enter a title for this audit entry.');
      return;
    }

    const newItem: VatAuditCardItem = {
      id: `VA-${Date.now()}`,
      category: formCategory,
      title: formTitle.trim(),
      sub: formSub.trim() || 'MS Herrig Ltd • Audit Vault',
      status: formStatus,
      statusColor: formStatus === 'Dispute Required' ? 'red' : formStatus === 'Verified' ? 'blue' : 'green',
      highlight: formHighlight.trim() || 'Logged',
      details: [
        { label: 'Category', val: formCategory },
        { label: 'Audit Reference', val: formTitle },
        { label: 'Compliance Status', val: formStatus },
        { label: 'Digital Timestamp', val: '28-Oct-2026 13:30' },
      ],
      letterContent: formCategory === 'DPD Dispute' ? formLetter : undefined
    };

    setItems([newItem, ...items]);
    setIsAddModalOpen(false);
    showToast(`Added: ${newItem.title}`);
  };

  const handleOpenEdit = (item: VatAuditCardItem) => {
    setFormCategory(item.category);
    setFormTitle(item.title);
    setFormSub(item.sub);
    setFormHighlight(item.highlight);
    setFormStatus(item.status);
    setFormLetter(item.letterContent || '');
    setIsEditModalOpen(true);
  };

  const handleUpdateEntry = () => {
    if (!selectedItem) return;

    const updated: VatAuditCardItem = {
      ...selectedItem,
      title: formTitle.trim() || selectedItem.title,
      sub: formSub.trim() || selectedItem.sub,
      highlight: formHighlight.trim() || selectedItem.highlight,
      status: formStatus,
      statusColor: formStatus === 'Dispute Required' ? 'red' : formStatus === 'Verified' ? 'blue' : 'green',
      letterContent: formCategory === 'DPD Dispute' ? formLetter : undefined,
    };

    setItems(items.map(it => it.id === selectedItem.id ? updated : it));
    setSelectedItem(updated);
    setIsEditModalOpen(false);
    showToast(`Updated: ${updated.title}`);
  };

  const handleDeleteEntry = (id: string) => {
    const toDelete = items.find(it => it.id === id);
    setItems(items.filter(it => it.id !== id));
    setSelectedItem(null);
    showToast(`Deleted: ${toDelete?.title || 'Audit Entry'}`);
  };

  // Filter & Search
  const filtered = items.filter(item => {
    const matchesFilter = selectedFilter === 'All' || item.category === selectedFilter;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      item.title.toLowerCase().includes(q) ||
      item.sub.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q) ||
      item.highlight.toLowerCase().includes(q);
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
          <Text style={styles.metricLabel}>Q3 NET VAT DUE</Text>
          <Text style={[styles.metricVal, { color: '#0d6942' }]}>£3,116.50</Text>
          <Text style={styles.metricSub}>HMRC Box 5</Text>
        </View>
        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>DPD SHORTFALLS</Text>
          <Text style={[styles.metricVal, { color: '#dc2626' }]}>-£137.42</Text>
          <Text style={styles.metricSub}>2 routes disputed</Text>
        </View>
        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>INPUT RECLAIM</Text>
          <Text style={[styles.metricVal, { color: '#1d4ed8' }]}>£19,510.48</Text>
          <Text style={styles.metricSub}>6-yr audit vault</Text>
        </View>
      </View>

      {/* Subheader Toolbar with Add Button */}
      <View style={styles.actionHeader}>
        <View>
          <Text style={styles.headerTitle}>VAT & Carrier Audits</Text>
          <Text style={styles.headerSub}>{filtered.length} compliance entries</Text>
        </View>
        <TouchableOpacity onPress={handleOpenAdd} style={styles.createBtn} activeOpacity={0.8}>
          <Ionicons name="add" size={15} color="#ffffff" />
          <Text style={styles.createBtnText}>New Audit Entry</Text>
        </TouchableOpacity>
      </View>

      {/* Filter Chips */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterBar}>
        {(['All', 'VAT Return', 'DPD Dispute', 'Receipt'] as const).map(f => {
          const isSel = selectedFilter === f;
          return (
            <TouchableOpacity
              key={f}
              onPress={() => setSelectedFilter(f)}
              style={[styles.filterChip, isSel && styles.filterChipActive]}
            >
              <Text style={[styles.filterChipText, isSel && styles.filterChipTextActive]}>
                {f === 'DPD Dispute' ? 'DPD Disputes' : f === 'Receipt' ? 'Purchase Receipts' : f}
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
                item.statusColor === 'red' ? styles.iconRed :
                item.statusColor === 'blue' ? styles.iconBlue : styles.iconGreen
              ]}>
                <Ionicons
                  name={
                    item.category === 'DPD Dispute' ? 'alert-circle-outline' :
                    item.category === 'Receipt' ? 'receipt-outline' : 'shield-checkmark-outline'
                  }
                  size={15}
                  color={
                    item.statusColor === 'red' ? '#dc2626' :
                    item.statusColor === 'blue' ? '#1d4ed8' : '#0d6942'
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
                  styles.highlightText,
                  item.statusColor === 'red' ? { color: '#dc2626' } :
                  item.statusColor === 'blue' ? { color: '#1d4ed8' } : { color: '#0d6942' }
                ]}>
                  {item.highlight}
                </Text>
                <View style={[
                  styles.badge,
                  item.statusColor === 'red' ? styles.badgeRed :
                  item.statusColor === 'blue' ? styles.badgeBlue : styles.badgeGreen
                ]}>
                  <Text style={[
                    styles.badgeText,
                    item.statusColor === 'red' ? { color: '#dc2626' } :
                    item.statusColor === 'blue' ? { color: '#1d4ed8' } : { color: '#0d6942' }
                  ]}>
                    {item.status}
                  </Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={14} color="#94a3b8" />
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Redirection / Dedicated VAT & Dispute Inspector Modal */}
      <Modal visible={!!selectedItem} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <View style={{ flex: 1 }}>
                <Text style={styles.modalTitle}>{selectedItem?.title}</Text>
                <Text style={styles.modalSub}>{selectedItem?.sub}</Text>
              </View>
              <TouchableOpacity onPress={() => setSelectedItem(null)} style={styles.closeBtn}>
                <Ionicons name="close" size={20} color="#64748b" />
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.sheetContent}>
              <View style={styles.calloutRow}>
                <Text style={styles.calloutLabel}>AUDIT HIGHLIGHT</Text>
                <Text style={[
                  styles.calloutVal,
                  selectedItem?.statusColor === 'red' ? { color: '#dc2626' } :
                  selectedItem?.statusColor === 'blue' ? { color: '#1d4ed8' } : { color: '#0d6942' }
                ]}>
                  {selectedItem?.highlight}
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

              {/* Dispute Formal Demand Letter View */}
              {selectedItem?.letterContent && (
                <View style={styles.letterCard}>
                  <View style={styles.letterHeader}>
                    <Ionicons name="document-text-outline" size={14} color="#0f172a" />
                    <Text style={styles.letterHeaderTitle}>Formal Carrier Demand Notice</Text>
                  </View>
                  <Text style={styles.letterBody}>{selectedItem.letterContent}</Text>
                </View>
              )}

              {/* Action Buttons: UPDATE & DELETE */}
              <View style={styles.modalActionRow}>
                <TouchableOpacity
                  onPress={() => handleOpenEdit(selectedItem!)}
                  style={styles.editBtn}
                  activeOpacity={0.8}
                >
                  <Ionicons name="create-outline" size={15} color="#0d6942" />
                  <Text style={styles.editBtnText}>Edit Entry</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => handleDeleteEntry(selectedItem!.id)}
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

      {/* Add Audit Entry Modal */}
      <Modal visible={isAddModalOpen} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>New Audit Vault Entry</Text>
                <Text style={styles.modalSub}>Log carrier dispute or HMRC receipt</Text>
              </View>
              <TouchableOpacity onPress={() => setIsAddModalOpen(false)} style={styles.closeBtn}>
                <Ionicons name="close" size={20} color="#64748b" />
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.sheetContent}>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>ENTRY CATEGORY</Text>
                <View style={styles.categoryToggleRow}>
                  {(['DPD Dispute', 'Receipt', 'VAT Return'] as const).map(c => (
                    <TouchableOpacity
                      key={c}
                      onPress={() => setFormCategory(c)}
                      style={[styles.categoryBtn, formCategory === c && styles.categoryBtnActive]}
                    >
                      <Text style={[styles.categoryBtnText, formCategory === c && styles.categoryBtnTextActive]}>
                        {c}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>TITLE / VENDOR / ROUTE</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="e.g. Route 302 Underpayment or Kwik Fit Tyres"
                  placeholderTextColor="#94a3b8"
                  value={formTitle}
                  onChangeText={setFormTitle}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>SUBTITLE / DEPOT / REFERENCE</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="FD 12354 Birmingham • Week 41"
                  placeholderTextColor="#94a3b8"
                  value={formSub}
                  onChangeText={setFormSub}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>HIGHLIGHT / SHORTFALL AMOUNT</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="-£65.00 Underpaid or £480.00 Gross"
                  placeholderTextColor="#94a3b8"
                  value={formHighlight}
                  onChangeText={setFormHighlight}
                />
              </View>

              {formCategory === 'DPD Dispute' && (
                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>FORMAL DISPUTE LETTER NOTICE</Text>
                  <TextInput
                    style={[styles.formInput, { height: 90, textAlignVertical: 'top' }]}
                    multiline
                    value={formLetter}
                    onChangeText={setFormLetter}
                  />
                </View>
              )}

              <View style={styles.formActionRow}>
                <TouchableOpacity
                  onPress={() => setIsAddModalOpen(false)}
                  style={styles.cancelBtn}
                >
                  <Text style={styles.cancelBtnText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleCreateEntry}
                  style={styles.submitBtn}
                >
                  <Text style={styles.submitBtnText}>Save Entry</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Edit Entry Modal */}
      <Modal visible={isEditModalOpen} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>Edit Audit Entry</Text>
                <Text style={styles.modalSub}>{selectedItem?.title}</Text>
              </View>
              <TouchableOpacity onPress={() => setIsEditModalOpen(false)} style={styles.closeBtn}>
                <Ionicons name="close" size={20} color="#64748b" />
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.sheetContent}>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>TITLE</Text>
                <TextInput
                  style={styles.formInput}
                  value={formTitle}
                  onChangeText={setFormTitle}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>STATUS</Text>
                <View style={styles.categoryToggleRow}>
                  {(['Dispute Required', 'Verified', 'Compliant', 'Resolved'] as const).map(st => (
                    <TouchableOpacity
                      key={st}
                      onPress={() => setFormStatus(st)}
                      style={[styles.categoryBtn, formStatus === st && styles.categoryBtnActive]}
                    >
                      <Text style={[styles.categoryBtnText, formStatus === st && styles.categoryBtnTextActive]}>
                        {st}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>HIGHLIGHT / VALUE</Text>
                <TextInput
                  style={styles.formInput}
                  value={formHighlight}
                  onChangeText={setFormHighlight}
                />
              </View>

              {formCategory === 'DPD Dispute' && (
                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>DISPUTE LETTER NOTICE</Text>
                  <TextInput
                    style={[styles.formInput, { height: 90, textAlignVertical: 'top' }]}
                    multiline
                    value={formLetter}
                    onChangeText={setFormLetter}
                  />
                </View>
              )}

              <View style={styles.formActionRow}>
                <TouchableOpacity
                  onPress={() => setIsEditModalOpen(false)}
                  style={styles.cancelBtn}
                >
                  <Text style={styles.cancelBtnText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleUpdateEntry}
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
  iconRed: { backgroundColor: '#fef2f2' },
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
  highlightText: {
    fontSize: 12.5,
    fontWeight: '900',
  },
  badge: {
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 10,
    marginTop: 2,
  },
  badgeGreen: { backgroundColor: '#ecfdf5' },
  badgeBlue: { backgroundColor: '#eff6ff' },
  badgeRed: { backgroundColor: '#fef2f2' },
  badgeText: {
    fontSize: 9.5,
    fontWeight: '700',
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
  letterCard: {
    backgroundColor: '#fffbeb',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#fde68a',
    padding: 10,
    gap: 6,
  },
  letterHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  letterHeaderTitle: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#92400e',
  },
  letterBody: {
    fontSize: 10.5,
    color: '#78350f',
    lineHeight: 15,
    fontFamily: 'monospace',
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
  categoryToggleRow: {
    flexDirection: 'row',
    gap: 6,
    flexWrap: 'wrap',
  },
  categoryBtn: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    backgroundColor: '#f8fafc',
  },
  categoryBtnActive: {
    backgroundColor: '#0d6942',
    borderColor: '#0d6942',
  },
  categoryBtnText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#475569',
  },
  categoryBtnTextActive: {
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
