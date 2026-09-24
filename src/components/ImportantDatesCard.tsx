import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../constants/colors';

type DateItem = {
  icon: string;
  label: string;
  date: string;
  time: string;
};

type Props = {
  dates: DateItem[];
};

export default function ImportantDatesCard({ dates }: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Important Dates</Text>
      <View style={styles.grid}>
        {dates.map((item, index) => (
          <View key={index} style={styles.cell}>
            <Text style={styles.icon}>{item.icon}</Text>
            <View>
              <Text style={styles.label}>{item.label}</Text>
              <Text style={styles.date}>{item.date}</Text>
              <Text style={styles.time}>{item.time}</Text>
            </View>
          </View>
        ))}
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
  title: { fontSize: 13, fontWeight: '700', color: COLORS.text, marginBottom: 14 },
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  cell: {
    width: '50%',
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 16,
    paddingRight: 8,
  },
  icon: { fontSize: 16, marginTop: 2 },
  label: { fontSize: 11, color: COLORS.textLight },
  date: { fontSize: 13, fontWeight: '700', color: COLORS.primary, marginTop: 2 },
  time: { fontSize: 11, color: COLORS.textLight, marginTop: 1 },
});
