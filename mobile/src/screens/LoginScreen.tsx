import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { mobileApi, AuthResponse } from '../services/api';

interface LoginScreenProps {
  onSuccess: (data: AuthResponse) => void;
  onClose?: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onSuccess, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [role, setRole] = useState('Customer');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!email || !password) {
      setError('Please provide email and password.');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      if (isLogin) {
        const res = await mobileApi.login({ email, password });
        onSuccess(res);
      } else {
        const res = await mobileApi.register({
          email,
          password,
          firstName,
          lastName,
          role,
        });
        onSuccess(res);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Authentication failed';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const setDemoUser = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setError(null);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Close Button if inside modal */}
        {onClose && (
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Ionicons name="close" size={20} color="#64748b" />
          </TouchableOpacity>
        )}

        {/* Fleet Tracking Logo */}
        <View style={styles.brandRow}>
          <View style={styles.logoCircle}>
            <View style={styles.logoInner} />
            <View style={styles.logoDot} />
          </View>
          <View>
            <Text style={styles.brandTitle}>Fleet Tracking</Text>
            <Text style={{ fontSize: 10, fontWeight: '700', color: '#0d6942', letterSpacing: 0.5, textTransform: 'uppercase' }}>
              Management System
            </Text>
          </View>
        </View>

        <Text style={styles.title}>
          {isLogin ? 'Welcome Back' : 'Create an Account'}
        </Text>
        <Text style={styles.subtitle}>
          {isLogin
            ? 'Sign in to access your delivery fleet and financial analytics.'
            : 'Register to manage logistics and finance seamlessly.'}
        </Text>

        {/* Mode Switcher Tabs */}
        <View style={styles.modeTabs}>
          <TouchableOpacity
            onPress={() => { setIsLogin(true); setError(null); }}
            style={[styles.modeTab, isLogin && styles.modeTabActive]}
          >
            <Text style={[styles.modeTabText, isLogin && styles.modeTabTextActive]}>
              Sign In
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => { setIsLogin(false); setError(null); }}
            style={[styles.modeTab, !isLogin && styles.modeTabActive]}
          >
            <Text style={[styles.modeTabText, !isLogin && styles.modeTabTextActive]}>
              Create Account
            </Text>
          </TouchableOpacity>
        </View>

        {error && (
          <View style={styles.errorBox}>
            <Ionicons name="alert-circle" size={16} color="#dc2626" />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {/* Registration Extra Fields */}
        {!isLogin && (
          <>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>First Name</Text>
              <TextInput
                style={styles.input}
                placeholder="John"
                placeholderTextColor="#94a3b8"
                value={firstName}
                onChangeText={setFirstName}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Last Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Doe"
                placeholderTextColor="#94a3b8"
                value={lastName}
                onChangeText={setLastName}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Account Role</Text>
              <View style={styles.rolePickerRow}>
                {['Customer', 'Delivery', 'Admin'].map((r) => (
                  <TouchableOpacity
                    key={r}
                    onPress={() => setRole(r)}
                    style={[styles.roleChip, role === r && styles.roleChipActive]}
                  >
                    <Text style={[styles.roleChipText, role === r && styles.roleChipTextActive]}>
                      {r}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </>
        )}

        {/* Email */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email Address</Text>
          <View style={styles.inputWithIcon}>
            <Ionicons name="mail-outline" size={18} color="#94a3b8" style={styles.inputIcon} />
            <TextInput
              style={styles.inputField}
              placeholder="name@example.com"
              placeholderTextColor="#94a3b8"
              autoCapitalize="none"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />
          </View>
        </View>

        {/* Password */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Password</Text>
          <View style={styles.inputWithIcon}>
            <Ionicons name="lock-closed-outline" size={18} color="#94a3b8" style={styles.inputIcon} />
            <TextInput
              style={styles.inputField}
              placeholder="••••••••"
              placeholderTextColor="#94a3b8"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          onPress={handleSubmit}
          disabled={loading}
          style={styles.submitBtn}
        >
          {loading ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <>
              <Text style={styles.submitBtnText}>
                {isLogin ? 'Sign In' : 'Create Account'}
              </Text>
              <Ionicons name="arrow-forward" size={16} color="#ffffff" />
            </>
          )}
        </TouchableOpacity>

        {/* Quick Demo Logins */}
        <View style={styles.demoSection}>
          <Text style={styles.demoTitle}>QUICK DEMO ROLES</Text>
          <View style={styles.demoButtons}>
            <TouchableOpacity
              onPress={() => setDemoUser('herrigreinaldo@gmail.com', '132Careras@!')}
              style={[styles.demoBtn, { borderColor: '#bbf7d0', backgroundColor: '#f0fdf4', flexDirection: 'row', alignItems: 'center', gap: 4 }]}
            >
              <Ionicons name="shield-checkmark" size={12} color="#15803d" />
              <Text style={{ color: '#15803d', fontSize: 11, fontWeight: '700' }}>Admin (Reinaldo)</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setDemoUser('delivery@deliveryfinance.com', 'Delivery@123!')}
              style={[styles.demoBtn, { borderColor: '#a7f3d0', backgroundColor: '#ecfdf5', flexDirection: 'row', alignItems: 'center', gap: 4 }]}
            >
              <Ionicons name="bicycle" size={12} color="#065f46" />
              <Text style={{ color: '#065f46', fontSize: 11, fontWeight: '700' }}>Delivery</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setDemoUser('customer@deliveryfinance.com', 'Customer@123!')}
              style={[styles.demoBtn, { borderColor: '#e2e8f0', backgroundColor: '#f8fafc', flexDirection: 'row', alignItems: 'center', gap: 4 }]}
            >
              <Ionicons name="person" size={12} color="#334155" />
              <Text style={{ color: '#334155', fontSize: 11, fontWeight: '700' }}>Customer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollContent: {
    padding: 24,
    paddingTop: 50,
  },
  closeBtn: {
    alignSelf: 'flex-end',
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  logoCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#0d6942',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  logoInner: {
    width: 15,
    height: 15,
    borderRadius: 8,
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
    fontSize: 20,
    fontWeight: '800',
    color: '#102a1c',
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#121826',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: '#64748b',
    marginBottom: 20,
    lineHeight: 18,
  },
  modeTabs: {
    flexDirection: 'row',
    backgroundColor: '#f1f5f9',
    borderRadius: 30,
    padding: 4,
    marginBottom: 18,
  },
  modeTab: {
    flex: 1,
    paddingVertical: 9,
    alignItems: 'center',
    borderRadius: 25,
  },
  modeTabActive: {
    backgroundColor: '#ffffff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
  },
  modeTabText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748b',
  },
  modeTabTextActive: {
    color: '#0d6942',
    fontWeight: '700',
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#fee2e2',
    padding: 10,
    borderRadius: 12,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  errorText: {
    fontSize: 12,
    color: '#b91c1c',
    flex: 1,
  },
  inputGroup: {
    marginBottom: 14,
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 13,
    color: '#1e293b',
  },
  inputWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 14,
    paddingHorizontal: 12,
  },
  inputIcon: {
    marginRight: 8,
  },
  inputField: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 13,
    color: '#1e293b',
  },
  rolePickerRow: {
    flexDirection: 'row',
    gap: 8,
  },
  roleChip: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    backgroundColor: '#f8fafc',
  },
  roleChipActive: {
    backgroundColor: '#d1fae5',
    borderColor: '#10b981',
  },
  roleChipText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748b',
  },
  roleChipTextActive: {
    color: '#065f46',
    fontWeight: '700',
  },
  submitBtn: {
    backgroundColor: '#0d6942',
    borderRadius: 30,
    paddingVertical: 13,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 8,
    elevation: 3,
    shadowColor: '#0d6942',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  submitBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  demoSection: {
    marginTop: 24,
    paddingTop: 18,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    alignItems: 'center',
  },
  demoTitle: {
    fontSize: 11,
    fontWeight: '600',
    color: '#94a3b8',
    marginBottom: 10,
  },
  demoButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  demoBtn: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
  },
});
