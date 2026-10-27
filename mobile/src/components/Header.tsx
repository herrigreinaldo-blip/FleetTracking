import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface HeaderProps {
  userName?: string;
  onOpenAuth?: () => void;
  onLogout?: () => void;
  isLoggedIn?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  userName = 'Reinaldo',
  onOpenAuth,
  onLogout,
  isLoggedIn = false,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.brandRow}>
        <View style={styles.logoCircle}>
          <View style={styles.logoInner} />
          <View style={styles.logoDot} />
        </View>
        <View>
          <Text style={styles.brandTitle}>Fleet Tracking</Text>
          <Text style={{ fontSize: 9, fontWeight: '700', color: '#0d6942', letterSpacing: 0.5, textTransform: 'uppercase' }}>Management System</Text>
        </View>
      </View>

      <View style={styles.actionsRow}>
        <TouchableOpacity style={styles.iconBtn}>
          <Ionicons name="search" size={18} color="#475569" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconBtn}>
          <Ionicons name="notifications-outline" size={18} color="#475569" />
          <View style={styles.unreadDot} />
        </TouchableOpacity>

        {isLoggedIn && onLogout ? (
          <TouchableOpacity 
            onPress={onLogout}
            style={[styles.avatarBtn, { backgroundColor: '#fee2e2', borderColor: '#fecaca' }]}
          >
            <View style={[styles.avatarCircle, { backgroundColor: '#ef4444' }]}>
              <Text style={styles.avatarText}>{userName.charAt(0).toUpperCase()}</Text>
            </View>
            <Ionicons name="log-out-outline" size={14} color="#dc2626" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity 
            onPress={onOpenAuth}
            style={styles.avatarBtn}
          >
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarText}>{userName.charAt(0).toUpperCase()}</Text>
            </View>
            <Ionicons name="person" size={14} color="#0d6942" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingTop: 50,
    paddingBottom: 14,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#0d6942',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  logoInner: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  logoDot: {
    position: 'absolute',
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#34d399',
  },
  brandTitle: {
    fontSize: 19,
    fontWeight: '800',
    color: '#102a1c',
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  unreadDot: {
    position: 'absolute',
    top: 6,
    right: 7,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10b981',
    borderWidth: 1,
    borderColor: '#ffffff',
  },
  avatarBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#f8fafc',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  avatarCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#0d6942',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 12,
  },
});
