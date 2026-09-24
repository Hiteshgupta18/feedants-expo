import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../constants/colors';

type Props = {
  title: string;
  tags: string[];
  isRegistered: boolean;
  prizePool: number;
  entryFee: number;
  spotsLeft: number;
  totalSpots: number;
  bookedSpots: number;
};

export default function CompetitionInfoCard({
  title,
  tags,
  isRegistered,
  prizePool,
  entryFee,
  spotsLeft,
  totalSpots,
  bookedSpots,
}: Props) {
  const bookedPercent = (bookedSpots / totalSpots) * 100;

  return (
    <View style={styles.card}>
      <View style={styles.titleRow}>
        <Text style={styles.title}>{title}</Text>
        {isRegistered && (
          <View style={styles.registeredBadge}>
            <View style={styles.checkCircle}>
              <Text style={styles.checkMark}>✓</Text>
            </View>
            <Text style={styles.registeredText}>Registered</Text>
          </View>
        )}
      </View>

      <View style={styles.tagsRow}>
        <View style={styles.tagPill}>
          <Text style={styles.tagText}>Dance</Text>
        </View>
        <View style={styles.tagPill}>
          <Text style={styles.tagText}>Multi-Win</Text>
        </View>
        <View style={styles.certRow}>
          <Text style={styles.trophyIcon}>🏆</Text>
          <Text style={styles.certText}>Winners get certificate</Text>
        </View>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statBlock}>
          <Text style={styles.statLabel}>Prize Pool</Text>
          <Text style={styles.statValuePrize}>₹ {prizePool.toLocaleString('en-IN')}</Text>
        </View>
        <View style={styles.statBlock}>
          <Text style={styles.statLabel}>Entry Fee</Text>
          <Text style={styles.statValue}>₹ {entryFee}</Text>
        </View>
        <View style={[styles.statBlock, { flex: 1.3 }]}>
          <View style={styles.spotsLabelRow}>
            <Text style={styles.spotsIcon}>👥</Text>
            <Text style={styles.spotsLabel}>
              {spotsLeft > 0 ? `Only ${spotsLeft} spots left` : 'Spots full'}
            </Text>
          </View>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${bookedPercent}%` }]} />
          </View>
          <Text style={styles.statSubtext}>
            {bookedSpots} / {totalSpots} Booked
          </Text>
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
    gap: 10,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  title: { fontSize: 18, fontWeight: '800', color: '#0D2E2E', flex: 1, marginRight: 8 },
  registeredBadge: {
    backgroundColor: COLORS.primaryLight,
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 5,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  checkCircle: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkMark: { color: '#fff', fontSize: 9, fontWeight: '700' },
  registeredText: { color: COLORS.primary, fontSize: 12, fontWeight: '700' },
  tagsRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap', alignItems: 'center' },
  tagPill: {
    backgroundColor: '#F1F5F5',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  tagText: { fontSize: 12, color: COLORS.textMuted, fontWeight: '500' },
  certRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  trophyIcon: { fontSize: 13 },
  certText: { fontSize: 12, color: COLORS.primary, fontWeight: '600' },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 14,
  },
  statBlock: { flex: 1 },
  statLabel: { fontSize: 12, color: COLORS.textLight, marginBottom: 4 },
  statValuePrize: { fontSize: 20, fontWeight: '800', color: COLORS.primary },
  statValue: { fontSize: 20, fontWeight: '800', color: '#0D2E2E' },
  spotsLabelRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 6 },
  spotsIcon: { fontSize: 12 },
  spotsLabel: { fontSize: 12, fontWeight: '700', color: COLORS.primary },
  progressTrack: {
    height: 3,
    backgroundColor: '#E8EEEE',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 2,
  },
  statSubtext: { fontSize: 11, color: COLORS.textLight },
});
