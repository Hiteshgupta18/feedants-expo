import { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../constants/colors';

type Props = {
  label: string;
  targetDate: string;
};

function getTimeParts(msRemaining: number) {
  if (msRemaining <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
  const totalSeconds = Math.floor(msRemaining / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return { days, hours, minutes, seconds, expired: false };
}

export default function CountdownBanner({ label, targetDate }: Props) {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  const target = new Date(targetDate).getTime();
  const { days, hours, minutes, seconds, expired } = getTimeParts(target - now);

  const pad = (n: number) => n.toString().padStart(2, '0');

  return (
    <View style={styles.banner}>
      <View style={styles.left}>
        <Text style={styles.icon}>⏳</Text>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.time}>
          {expired ? 'Closed' : `${pad(days)}d : ${pad(hours)}h : ${pad(minutes)}m : ${pad(seconds)}s`}
        </Text>
      </View>
      {!expired && (
        <View style={styles.hurryBadge}>
          <Text style={styles.hurryText}>⏰ Hurry up!</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: COLORS.primaryLight,
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  left: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  icon: { fontSize: 14 },
  label: { fontSize: 12, color: COLORS.textMuted },
  time: { fontSize: 13, fontWeight: '700', color: COLORS.text },
  hurryBadge: {
    backgroundColor: COLORS.primaryLight,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  hurryText: { fontSize: 12.5, fontWeight: '700', color: COLORS.primary },
});
