import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../constants/colors';

type Props = { text: string };

export default function DisclaimerBanner({ text }: Props) {
  return (
    <View style={styles.banner}>
      <Text style={styles.icon}>ⓘ    Disclaimer:</Text>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: COLORS.primaryLight,
    borderRadius: 10,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  icon: { color: COLORS.primary, fontSize: 13, marginTop: 1 },
  text: { color: COLORS.text, fontSize: 12, flex: 1, lineHeight: 17, fontWeight: '500' },
});
