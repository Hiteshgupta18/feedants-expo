import { View, Text, StyleSheet, TouchableOpacity, useWindowDimensions } from 'react-native';
import { COLORS } from '../constants/colors';

type CTAState = 'register' | 'registered_waiting' | 'upload_submission' | 'closed' | 'full';

type Props = {
  state: CTAState;
  onPress?: () => void;
};

const CTA_CONFIG: Record<CTAState, { label: string; subLabel?: string; disabled: boolean; color: string }> = {
  register: { label: 'Register Now', disabled: false, color: COLORS.primary },
  registered_waiting: { label: 'Registered', subLabel: 'Submission opens soon', disabled: true, color: '#999' },
  upload_submission: { label: 'Upload Submission', subLabel: 'Registered', disabled: false, color: COLORS.primary },
  closed: { label: 'Registration Closed', disabled: true, color: '#999' },
  full: { label: 'Spots Full', disabled: true, color: '#999' },
};

export default function BottomCTA({ state, onPress }: Props) {
  const { width } = useWindowDimensions();
  const isWideScreen = width > 600;
  const config = CTA_CONFIG[state];

  return (
    <View style={[styles.wrapper, isWideScreen && styles.centeredRow]}>
      <View style={[styles.inner, isWideScreen && styles.maxWidthContainer]}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: config.disabled ? '#CCCCCC' : config.color }]}
          onPress={onPress}
          disabled={config.disabled}
        >
          <Text style={styles.buttonText}>{config.label}</Text>
          {config.subLabel && <Text style={styles.subText}>{config.subLabel}</Text>}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: COLORS.background,
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 10,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  centeredRow: { alignItems: 'center' },
  inner: { width: '100%' },
  maxWidthContainer: { maxWidth: 480 },
  button: {
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontSize: 15, fontWeight: '700' },
  subText: { color: '#fff', fontSize: 11, opacity: 0.85, marginTop: 2 },
});
