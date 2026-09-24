import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import { COLORS } from '../constants/colors';

const showAlert = (title: string, message: string) => {
  if (Platform.OS === 'web') {
    window.alert(`${title}\n\n${message}`);
    return;
  }
  Alert.alert(title, message);
};

export default function LoginScreen() {
  const router = useRouter();
  const { login, register } = useAuth();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('riya.shah@example.com');
  const [password, setPassword] = useState('password123');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isSignup = mode === 'signup';

  const handleSubmit = async () => {
    if (!email || !password || (isSignup && !name)) {
      showAlert('Missing fields', isSignup ? 'Please fill in name, email, and password.' : 'Please enter both email and password.');
      return;
    }
    setIsSubmitting(true);
    try {
      if (isSignup) {
        await register(name, email, password);
      } else {
        await login(email, password);
      }
      router.replace('/');
    } catch (err: any) {
      const message = err?.response?.data?.message || `${isSignup ? 'Sign up' : 'Login'} failed. Please try again.`;
      showAlert(isSignup ? 'Sign up failed' : 'Login failed', message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const switchMode = (newMode: 'login' | 'signup') => {
    setMode(newMode);
    if (newMode === 'signup') {
      setName('');
      setEmail('');
      setPassword('');
    } else {
      setEmail('riya.shah@example.com');
      setPassword('password123');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.card}>
        <Text style={styles.title}>Feedants</Text>
        <Text style={styles.subtitle}>
          {isSignup ? 'Create a new account' : 'Sign in to continue'}
        </Text>

        <View style={styles.tabRow}>
          <TouchableOpacity
            style={[styles.tab, !isSignup && styles.tabActive]}
            onPress={() => switchMode('login')}
          >
            <Text style={[styles.tabText, !isSignup && styles.tabTextActive]}>Log In</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, isSignup && styles.tabActive]}
            onPress={() => switchMode('signup')}
          >
            <Text style={[styles.tabText, isSignup && styles.tabTextActive]}>Sign Up</Text>
          </TouchableOpacity>
        </View>

        {isSignup && (
          <TextInput
            style={styles.input}
            placeholder="Full name"
            value={name}
            onChangeText={setName}
          />
        )}
        <TextInput
          style={styles.input}
          placeholder="Email"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity
          style={[styles.button, isSubmitting && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>{isSignup ? 'Sign Up' : 'Log In'}</Text>
          )}
        </TouchableOpacity>

        {!isSignup && (
          <Text style={styles.hint}>
            Seeded test account is pre-filled. Password: password123
          </Text>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: COLORS.background,
    padding: 24,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    gap: 12,
  },
  title: { fontSize: 24, fontWeight: '700', color: COLORS.text, textAlign: 'center' },
  subtitle: { fontSize: 14, color: '#667', textAlign: 'center', marginBottom: 4 },
  tabRow: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F5',
    borderRadius: 10,
    padding: 3,
    marginBottom: 8,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  tabActive: { backgroundColor: COLORS.primary },
  tabText: { color: COLORS.textMuted, fontWeight: '600', fontSize: 13 },
  tabTextActive: { color: '#fff' },
  input: {
    borderWidth: 1,
    borderColor: '#E2E8E8',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
  },
  button: {
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  hint: { fontSize: 12, color: '#889', textAlign: 'center', marginTop: 8 },
});
