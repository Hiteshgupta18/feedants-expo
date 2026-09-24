import { View, Text, StyleSheet, TouchableOpacity, useWindowDimensions } from 'react-native';
import { COLORS } from '../constants/colors';

type Props = {
  referralLink: string;
  earnAmount: number;
  onCopy?: () => void;
  onReferNow?: () => void;
};

export default function ReferEarnCard({ referralLink, earnAmount, onCopy, onReferNow }: Props) {
  const { width } = useWindowDimensions();
  const isNarrow = width < 380;

  return (
    <View style={[styles.card, isNarrow && styles.cardStacked]}>
      <View style={styles.leftCol}>
        <View style={styles.headerRow}>
          <Text style={styles.icon}>📣</Text>
          <Text style={styles.title}>Refer & Earn more discount</Text>
        </View>

        <View style={styles.linkRow}>
          <Text style={styles.linkText} numberOfLines={1}>{referralLink}</Text>
          <TouchableOpacity onPress={onCopy} style={styles.copyButton}>
            <Text style={styles.copyText}>Copy Link</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={[styles.rightCol, isNarrow && styles.rightColStacked]}>
        <TouchableOpacity onPress={onReferNow} style={styles.referButton}>
          <Text style={styles.referButtonText}>Refer Now</Text>
        </TouchableOpacity>
        <Text style={styles.earnText}>
          You earn <Text style={styles.earnAmount}>₹{earnAmount}</Text> for every signup
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.primaryLight,
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  cardStacked: { flexDirection: 'column', alignItems: 'stretch' },
  leftCol: { flex: 1.4, gap: 8 },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  icon: { fontSize: 16 },
  title: { fontSize: 13, fontWeight: '700', color: COLORS.text },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#CFE3E0',
    paddingLeft: 10,
    paddingRight: 4,
    paddingVertical: 4,
    justifyContent: 'space-between',
  },
  linkText: { fontSize: 11, color: COLORS.textMuted, flex: 1, marginRight: 8 },
  copyButton: {
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  copyText: { color: COLORS.primary, fontSize: 11, fontWeight: '700' },
  rightCol: { alignItems: 'center', gap: 6 },
  rightColStacked: { alignItems: 'stretch', marginTop: 4 },
  referButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  referButtonText: { color: '#fff', fontSize: 12, fontWeight: '700', textAlign: 'center' },
  earnText: { fontSize: 10, color: COLORS.textMuted, textAlign: 'center' },
  earnAmount: { color: COLORS.primary, fontWeight: '700' },
});
