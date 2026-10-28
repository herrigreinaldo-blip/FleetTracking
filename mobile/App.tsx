import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Header } from './src/components/Header';
import { CalendarScreen } from './src/screens/CalendarScreen';
import { FleetScreen } from './src/screens/FleetScreen';
import { FinanceScreen } from './src/screens/FinanceScreen';
import { PayrollScreen } from './src/screens/PayrollScreen';
import { VatAuditScreen } from './src/screens/VatAuditScreen';
import { LoginScreen } from './src/screens/LoginScreen';
import { AuthResponse } from './src/services/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('calendar');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentUser, setCurrentUser] = useState<{
    email: string;
    fullName: string;
    roles: string[];
    token: string;
  } | null>(null);

  const handleAuthSuccess = (res: AuthResponse) => {
    const isReinaldo = res.email.toLowerCase().includes('reinaldo');
    setCurrentUser({
      token: res.token,
      email: res.email,
      fullName: isReinaldo ? 'Reinaldo Herrig' : (res.fullName || res.email.split('@')[0]),
      roles: res.roles,
    });
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  // =========================================================================
  // GATED VIEW: If not signed in, show sleek Sign In Portal
  // =========================================================================
  if (!currentUser) {
    return (
      <View style={styles.container}>
        <StatusBar style="dark" />
        <LoginScreen onSuccess={handleAuthSuccess} />
      </View>
    );
  }

  // =========================================================================
  // AUTHENTICATED VIEW: Uncluttered Mobile Platform with Hamburger & Top Search
  // =========================================================================
  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      {/* Top Header with Hamburger Navigation & Search Bar */}
      <Header
        userName={currentUser.fullName || 'Reinaldo'}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        isLoggedIn={true}
        onLogout={handleLogout}
      />

      {/* Screen Content Feed with Minimal Navigation Cards */}
      <View style={styles.screenContainer}>
        {activeTab === 'calendar' && <CalendarScreen searchQuery={searchQuery} />}
        {activeTab === 'fleet' && <FleetScreen searchQuery={searchQuery} />}
        {activeTab === 'finance' && <FinanceScreen searchQuery={searchQuery} />}
        {activeTab === 'payroll' && <PayrollScreen searchQuery={searchQuery} />}
        {activeTab === 'vat' && <VatAuditScreen searchQuery={searchQuery} />}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eff2f6',
  },
  screenContainer: {
    flex: 1,
  },
});
