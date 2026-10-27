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
    { id: 'analytics', label: 'Dashboard', icon: 'grid' as const },
    { id: 'riders', label: 'Riders', icon: 'people' as const },
    { id: 'packages', label: 'Packages', icon: 'cube' as const },
    { id: 'invoices', label: 'Invoices', icon: 'document-text' as const },
    { id: 'finance', label: 'Finance', icon: 'wallet' as const },
    { id: 'sales', label: 'Sales', icon: 'trending-up' as const },
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
                name={tab.icon}
                size={18}
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
    paddingVertical: 8,
    paddingBottom: 22,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  tabBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
    paddingHorizontal: 4,
  },
  iconContainer: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconActive: {
    backgroundColor: '#0d6942',
    elevation: 3,
    shadowColor: '#0d6942',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#64748b',
  },
  labelActive: {
    color: '#0d6942',
    fontWeight: '700',
  },
});
