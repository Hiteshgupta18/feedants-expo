import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../constants/colors';

export default function AdBanner() {
  return (
    <View style={styles.banner}>
      <Text style={styles.icon}>📢</Text>
      <Text style={styles.text}>Ad Here</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderStyle: 'dashed',
    borderRadius: 10,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  icon: { fontSize: 13 },
  text: { fontSize: 12, color: COLORS.textLight, fontWeight: '500' },
});
