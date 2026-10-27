import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Header } from './src/components/Header';
import { BottomTabs } from './src/components/BottomTabs';
import { AnalyticsScreen } from './src/screens/AnalyticsScreen';
import { RidersScreen } from './src/screens/RidersScreen';
import { PackagesScreen } from './src/screens/PackagesScreen';
import { InvoicesScreen } from './src/screens/InvoicesScreen';
import { FinanceScreen } from './src/screens/FinanceScreen';
import { SalesScreen } from './src/screens/SalesScreen';
import { LoginScreen } from './src/screens/LoginScreen';
import { AuthResponse } from './src/services/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('analytics');
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
      fullName: isReinaldo ? 'Reinaldo' : (res.fullName || res.email.split('@')[0]),
      roles: res.roles,
    });
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  // =========================================================================
  // GATED VIEW: If not signed in, show full-screen Sign In
  // =========================================================================
  if (!currentUser) {
    return (
      <View style={styles.container}>
        <StatusBar style="dark" />
        <LoginScreen
          onSuccess={handleAuthSuccess}
        />
      </View>
    );
  }

  // =========================================================================
  // AUTHENTICATED VIEW: Full Fleet Tracking Management Dashboard
  // =========================================================================
  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      {/* Top Header */}
      <Header
        userName={currentUser.fullName || 'Reinaldo'}
        isLoggedIn={true}
        onLogout={handleLogout}
      />

      {/* Active Tab Screen */}
      <View style={styles.screenContainer}>
        {activeTab === 'analytics' && (
          <AnalyticsScreen
            userName={currentUser.fullName || 'Reinaldo'}
            onOpenWallet={() => {}}
          />
        )}
        {activeTab === 'riders' && <RidersScreen />}
        {activeTab === 'packages' && <PackagesScreen />}
        {activeTab === 'invoices' && <InvoicesScreen />}
        {activeTab === 'finance' && <FinanceScreen />}
        {activeTab === 'sales' && <SalesScreen />}
      </View>

      {/* Bottom Tabs Navigation */}
      <BottomTabs
        activeTab={activeTab}
        onSelectTab={setActiveTab}
      />
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
