import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS } from '../constants/colors';

type Props = { onPress?: () => void };

export default function HearFromUsersRow({ onPress }: Props) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.left}>
        <Text style={styles.icon}>💬</Text>
        <View>
          <Text style={styles.title}>Hear From Our Users</Text>
          <Text style={styles.subtitle}>See what participants say about Feedants</Text>
        </View>
      </View>
      <Text style={styles.arrow}>›</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  left: { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 },
  icon: { fontSize: 18 },
  title: { fontSize: 13, fontWeight: '700', color: COLORS.text },
  subtitle: { fontSize: 11, color: COLORS.textLight, marginTop: 2 },
  arrow: { fontSize: 20, color: COLORS.textLight },
});
