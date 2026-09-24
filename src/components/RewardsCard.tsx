import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../constants/colors';
import StarIcon from './StarIcon';

type Reward = {
  icon: string;
  label: string;
  amount: number;
  useStar?: boolean;
};

type Props = {
  rewards: Reward[];
};

export default function RewardsCard({ rewards }: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Rewards</Text>
        <Text style={styles.subtitle}>(All Positions)</Text>
      </View>

      {rewards.map((reward, index) => (
        <View key={index} style={styles.row}>
          <View style={styles.left}>
            {reward.useStar ? <StarIcon /> : <Text style={styles.icon}>{reward.icon}</Text>}
            <Text style={styles.label}>{reward.label}</Text>
          </View>
          <Text style={styles.amount}>₹ {reward.amount.toLocaleString('en-IN')}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  headerRow: { flexDirection: 'row', alignItems: 'baseline', gap: 6, marginBottom: 12 },
  title: { fontSize: 13, fontWeight: '700', color: COLORS.text },
  subtitle: { fontSize: 11, color: COLORS.textLight },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  left: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  icon: { fontSize: 15 },
  label: { fontSize: 13, color: '#333' },
  amount: { fontSize: 13, fontWeight: '700', color: COLORS.text },
});
