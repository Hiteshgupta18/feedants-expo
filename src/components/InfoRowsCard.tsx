import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS } from '../constants/colors';

export default function InfoRowsCard() {
  return (
    <View style={styles.card}>
      <View style={styles.leftCol}>
        <TouchableOpacity style={styles.playRow}>
          <View style={styles.outerSquare}>
            <View style={styles.innerCircle}>
              <Text style={styles.playIcon}>▶</Text>
            </View>
          </View>
          <View style={styles.textWrap}>
            <Text style={styles.label}>How will you receive{'\n'}prize money?</Text>
            <Text style={styles.link}>Watch video to know more</Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.divider} />

      <View style={styles.rightCol}>
        <View style={styles.row}>
          <Text style={styles.shieldIcon}>🛡️</Text>
          <Text style={styles.rowLabel}>Refund policy</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.shieldIcon}>🛡️</Text>
          <View>
            <Text style={styles.rowLabel}>Secure payments powered by</Text>
            <Text style={styles.razorpay}>⚡ Razorpay</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  leftCol: { flex: 1, justifyContent: 'center', alignItems: 'flex-start' },
  playRow: { flexDirection: 'row', alignItems: 'center', gap: 10, alignSelf: 'flex-start' },
  outerSquare: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-start',
    flexShrink: 0,
  },
  innerCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playIcon: { color: '#fff', fontSize: 9, marginLeft: 1 },
  textWrap: { flexShrink: 1 },
  label: { fontSize: 12, color: COLORS.text, fontWeight: '500', lineHeight: 16 },
  link: { fontSize: 10, color: COLORS.primary, fontWeight: '600', marginTop: 4 },
  divider: { width: 1, backgroundColor: COLORS.border, marginHorizontal: 14 },
  rightCol: { flex: 1, justifyContent: 'center', gap: 12 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  shieldIcon: { fontSize: 14 },
  rowLabel: { fontSize: 11, color: COLORS.text },
  razorpay: { fontSize: 11, color: COLORS.textMuted, fontWeight: '600', marginTop: 1 },
});
