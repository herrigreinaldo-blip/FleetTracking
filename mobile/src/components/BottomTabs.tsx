import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface BottomTabsProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
}

export const BottomTabs: React.FC<BottomTabsProps> = ({
  activeTab,
  onSelectTab,
}) => {
  const tabs = [
    { id: 'calendar', label: 'Roster', icon: 'calendar-outline' as const, activeIcon: 'calendar' as const },
    { id: 'fleet', label: 'Fleet', icon: 'car-outline' as const, activeIcon: 'car' as const },
    { id: 'finance', label: 'Finance', icon: 'business-outline' as const, activeIcon: 'business' as const },
    { id: 'payroll', label: 'Payroll', icon: 'card-outline' as const, activeIcon: 'card' as const },
    { id: 'vat', label: 'VAT/Audit', icon: 'shield-checkmark-outline' as const, activeIcon: 'shield-checkmark' as const },
  ];

  return (
    <View style={styles.container}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <TouchableOpacity
            key={tab.id}
            onPress={() => onSelectTab(tab.id)}
            style={styles.tabBtn}
          >
            <View style={[styles.iconContainer, isActive && styles.iconActive]}>
              <Ionicons
                name={isActive ? tab.activeIcon : tab.icon}
                size={17}
                color={isActive ? '#ffffff' : '#64748b'}
              />
            </View>
            <Text style={[styles.tabLabel, isActive && styles.labelActive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: '#ffffff',
    paddingVertical: 6,
    paddingBottom: 20,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
  },
  tabBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    flex: 1,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconActive: {
    backgroundColor: '#0d6942',
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#64748b',
    marginTop: 2,
  },
  labelActive: {
    color: '#0d6942',
    fontWeight: '800',
  },
});
