import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Rider {
  id: string;
  name: string;
  phone: string;
  vehicle: string;
  zone: string;
  rating: number;
  status: 'Active' | 'Disabled' | 'On Delivery';
}

const INITIAL_RIDERS: Rider[] = [
  { id: '1', name: 'Marcus Vance', phone: '+1 (555) 234-5678', vehicle: 'Motorbike', zone: 'Downtown', rating: 4.95, status: 'Active' },
  { id: '2', name: 'Elena Rostova', phone: '+1 (555) 876-5432', vehicle: 'E-Bike', zone: 'Financial Dist', rating: 4.88, status: 'On Delivery' },
  { id: '3', name: 'Tariq Al-Mansoor', phone: '+1 (555) 345-6789', vehicle: 'Van', zone: 'Airport Hub', rating: 4.98, status: 'Active' },
  { id: '4', name: 'Chloe Bennett', phone: '+1 (555) 987-6543', vehicle: 'Scooter', zone: 'Uptown', rating: 4.75, status: 'Disabled' },
];

export const RidersScreen: React.FC = () => {
  const [riders, setRiders] = useState<Rider[]>(INITIAL_RIDERS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRider, setEditingRider] = useState<Rider | null>(null);

  // Form fields
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [vehicle, setVehicle] = useState('Motorbike');
  const [zone, setZone] = useState('Downtown');

  const handleOpenAdd = () => {
    setEditingRider(null);
    setName('');
    setPhone('');
    setVehicle('Motorbike');
    setZone('Downtown');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (r: Rider) => {
    setEditingRider(r);
    setName(r.name);
    setPhone(r.phone);
    setVehicle(r.vehicle);
    setZone(r.zone);
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!name || !phone) return;

    if (editingRider) {
      setRiders(prev => prev.map(r => r.id === editingRider.id ? { ...r, name, phone, vehicle, zone } : r));
    } else {
      const newRider: Rider = {
        id: String(Date.now()),
        name,
        phone,
        vehicle,
        zone,
        rating: 5.0,
        status: 'Active',
      };
      setRiders([newRider, ...riders]);
    }
    setIsModalOpen(false);
  };

  const handleToggleStatus = (id: string) => {
    setRiders(prev => prev.map(r => {
      if (r.id === id) {
        const next = r.status === 'Disabled' ? 'Active' : 'Disabled';
        return { ...r, status: next };
      }
      return r;
    }));
  };

  const handleDelete = (id: string, riderName: string) => {
    Alert.alert(
      'Delete Rider',
      `Are you sure you want to remove ${riderName}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => setRiders(prev => prev.filter(r => r.id !== id)),
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.title}>Delivery Riders</Text>
            <Text style={styles.subtitle}>Fleet onboarding & status</Text>
          </View>
          <TouchableOpacity onPress={handleOpenAdd} style={styles.addBtn}>
            <Ionicons name="add" size={16} color="#ffffff" />
            <Text style={styles.addBtnText}>Onboard</Text>
          </TouchableOpacity>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statVal}>{riders.length}</Text>
            <Text style={styles.statLbl}>Total Riders</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statVal, { color: '#0d6942' }]}>
              {riders.filter(r => r.status === 'Active').length}
            </Text>
            <Text style={styles.statLbl}>Active Fleet</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statVal, { color: '#0284c7' }]}>
              {riders.filter(r => r.status === 'On Delivery').length}
            </Text>
            <Text style={styles.statLbl}>On Route</Text>
          </View>
        </View>

        {/* Riders List */}
        <View style={styles.listContainer}>
          {riders.map(r => (
            <View key={r.id} style={styles.riderCard}>
              <View style={styles.riderTop}>
                <View style={styles.riderAvatar}>
                  <Text style={styles.riderInitial}>{r.name.charAt(0)}</Text>
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={styles.riderName}>{r.name}</Text>
                  <Text style={styles.riderSub}>{r.phone} • {r.vehicle}</Text>
                </View>

                {/* Status Pill */}
                <View style={[
                  styles.statusBadge,
                  r.status === 'Active' && styles.statusActive,
                  r.status === 'On Delivery' && styles.statusRoute,
                  r.status === 'Disabled' && styles.statusDisabled,
                ]}>
                  <Text style={[
                    styles.statusText,
                    r.status === 'Active' && { color: '#065f46' },
                    r.status === 'On Delivery' && { color: '#0369a1' },
                    r.status === 'Disabled' && { color: '#b91c1c' },
                  ]}>
                    {r.status}
                  </Text>
                </View>
              </View>

              <View style={styles.riderBottom}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                  <Ionicons name="location-sharp" size={13} color="#0d6942" />
                  <Text style={styles.zoneText}>{r.zone}</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                  <Ionicons name="star" size={12} color="#d97706" />
                  <Text style={styles.ratingText}>{r.rating.toFixed(2)}</Text>
                </View>

                {/* Actions */}
                <View style={styles.actionIcons}>
                  <TouchableOpacity onPress={() => handleOpenEdit(r)} style={styles.actionIconBtn}>
                    <Ionicons name="pencil" size={14} color="#475569" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleToggleStatus(r.id)} style={styles.actionIconBtn}>
                    <Ionicons
                      name="power"
                      size={14}
                      color={r.status === 'Disabled' ? '#059669' : '#dc2626'}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleDelete(r.id, r.name)} style={styles.actionIconBtn}>
                    <Ionicons name="trash-outline" size={14} color="#ef4444" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Modal for Add / Edit */}
      <Modal visible={isModalOpen} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingRider ? 'Edit Rider' : 'Onboard New Rider'}
              </Text>
              <TouchableOpacity onPress={() => setIsModalOpen(false)}>
                <Ionicons name="close" size={20} color="#64748b" />
              </TouchableOpacity>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Full Name</Text>
              <TextInput
                style={styles.formInput}
                placeholder="e.g. Jason Scott"
                value={name}
                onChangeText={setName}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Phone Number</Text>
              <TextInput
                style={styles.formInput}
                placeholder="+1 (555) 000-0000"
                value={phone}
                onChangeText={setPhone}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Vehicle</Text>
              <TextInput
                style={styles.formInput}
                placeholder="Motorbike, E-Bike, Van..."
                value={vehicle}
                onChangeText={setVehicle}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Operational Zone</Text>
              <TextInput
                style={styles.formInput}
                placeholder="Downtown, Uptown..."
                value={zone}
                onChangeText={setZone}
              />
            </View>

            <TouchableOpacity onPress={handleSave} style={styles.saveBtn}>
              <Text style={styles.saveBtnText}>Save Rider</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#eff2f6' },
  content: { padding: 16, paddingBottom: 30, gap: 14 },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: { fontSize: 22, fontWeight: '800', color: '#121826' },
  subtitle: { fontSize: 12, color: '#64748b', marginTop: 2 },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#0d6942',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addBtnText: { color: '#ffffff', fontSize: 12, fontWeight: '700' },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#eef2f6',
    alignItems: 'center',
  },
  statVal: { fontSize: 20, fontWeight: '800', color: '#121826' },
  statLbl: { fontSize: 10, color: '#64748b', marginTop: 2 },
  listContainer: { gap: 12 },
  riderCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 14,
    borderWidth: 1,
    borderColor: '#eef2f6',
    gap: 12,
  },
  riderTop: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  riderAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#d1fae5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  riderInitial: { fontSize: 14, fontWeight: '700', color: '#0d6942' },
  riderName: { fontSize: 14, fontWeight: '700', color: '#121826' },
  riderSub: { fontSize: 11, color: '#64748b', marginTop: 2 },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  statusActive: { backgroundColor: '#d1fae5' },
  statusRoute: { backgroundColor: '#e0f2fe' },
  statusDisabled: { backgroundColor: '#fee2e2' },
  statusText: { fontSize: 10, fontWeight: '700' },
  riderBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#f8fafc',
  },
  zoneText: { fontSize: 11, color: '#475569' },
  ratingText: { fontSize: 11, color: '#d97706', fontWeight: '700' },
  actionIcons: { flexDirection: 'row', gap: 8 },
  actionIconBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    justifyContent: 'center',
    padding: 20,
  },
  modalBox: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 22,
    gap: 12,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  modalTitle: { fontSize: 18, fontWeight: '800', color: '#121826' },
  formGroup: { gap: 4 },
  formLabel: { fontSize: 11, fontWeight: '600', color: '#475569' },
  formInput: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 13,
  },
  saveBtn: {
    backgroundColor: '#0d6942',
    paddingVertical: 12,
    borderRadius: 20,
    alignItems: 'center',
    marginTop: 8,
  },
  saveBtnText: { color: '#ffffff', fontWeight: '700', fontSize: 13 },
});
