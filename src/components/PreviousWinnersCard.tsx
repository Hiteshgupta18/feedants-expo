import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import { COLORS } from '../constants/colors';

type Winner = {
  name: string;
  rank: string;
  photoUrl: string;
};

type Props = {
  winners: Winner[];
};

export default function PreviousWinnersCard({ winners }: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Previous Winners</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
        {winners.map((winner, index) => (
          <TouchableOpacity key={index} style={styles.item}>
            <View style={styles.photoWrapper}>
              <Image source={{ uri: winner.photoUrl }} style={styles.photo} />
              <View style={styles.playOverlay}>
                <Text style={styles.playIcon}>▶</Text>
              </View>
            </View>
            <View style={styles.textCol}>
              <Text style={styles.name} numberOfLines={1}>{winner.name}</Text>
              <Text style={styles.rank}>{winner.rank}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
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
  title: { fontSize: 13, fontWeight: '700', color: COLORS.text, marginBottom: 12 },
  row: { flexDirection: 'row', gap: 16 },
  item: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  photoWrapper: { position: 'relative', width: 96, height: 85 },
  photo: { width: 96, height: 85, borderRadius: 8, backgroundColor: '#eee' },
  playOverlay: {
    position: 'absolute',
    bottom: +4,
    right: +4,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#fff',
  },
  playIcon: { color: '#fff', fontSize: 7 },
  textCol: { maxWidth: 80 },
  name: { fontSize: 12, fontWeight: '600', color: COLORS.text },
  rank: { fontSize: 10, color: COLORS.primary, marginTop: 1 },
});
