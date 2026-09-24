import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { COLORS } from '../constants/colors';

type Props = {
  name: string;
  title: string;
  experience: string;
  photoUrl: string;
  onPlayVideo?: () => void;
};

export default function JudgeCard({ name, title, experience, photoUrl, onPlayVideo }: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <Image source={{ uri: photoUrl }} style={styles.photo} />
        <View style={styles.info}>
          <Text style={styles.label}>Judge</Text>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.experience}>{experience}</Text>
        </View>
        <TouchableOpacity style={styles.playButton} onPress={onPlayVideo}>
          <View style={styles.playCircle}>
            <Text style={styles.playIcon}>▶</Text>
          </View>
          <Text style={styles.playLabel}>Intro Video</Text>
        </TouchableOpacity>
      </View>
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
  row: { flexDirection: 'row', alignItems: 'center' },
  photo: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#eee' },
  info: { flex: 1, marginLeft: 14 },
  label: { fontSize: 11, color: COLORS.textLight, marginBottom: 2 },
  name: { fontSize: 15, fontWeight: '700', color: '#0D2E2E' },
  title: { fontSize: 12, color: COLORS.textMuted, marginTop: 3 },
  experience: { fontSize: 11, color: COLORS.textLight, marginTop: 1 },
  playButton: { alignItems: 'center' },
  playCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playIcon: { color: COLORS.primary, fontSize: 16, marginLeft: 2 },
  playLabel: { fontSize: 10, color: COLORS.textMuted, marginTop: 6, fontWeight: '500' },
});
