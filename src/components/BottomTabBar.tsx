import { View, Text, StyleSheet, TouchableOpacity, useWindowDimensions } from 'react-native';
import { COLORS } from '../constants/colors';

type TabItem = { key: string; label: string; icon: string };

const TABS: TabItem[] = [
  { key: 'home', label: 'Home', icon: '🏠' },
  { key: 'explore', label: 'Explore', icon: '🔍' },
  { key: 'add', label: '', icon: '➕' },
  { key: 'competitions', label: 'Competitions', icon: '🏆' },
  { key: 'profile', label: 'Profile', icon: '👤' },
];

type Props = { activeTab?: string; onTabPress?: (key: string) => void };

export default function BottomTabBar({ activeTab = 'competitions', onTabPress }: Props) {
  const { width } = useWindowDimensions();
  const isWideScreen = width > 600;

  return (
    <View style={[styles.wrapper, isWideScreen && styles.centeredRow]}>
      <View style={[styles.inner, isWideScreen && styles.maxWidthContainer]}>
        {TABS.map((tab) => {
          const isActive = activeTab === tab.key;
          const isCenter = tab.key === 'add';
          return (
            <TouchableOpacity
              key={tab.key}
              style={styles.tabItem}
              onPress={() => onTabPress?.(tab.key)}
            >
              <View style={[isCenter && styles.centerButton]}>
                <Text style={[styles.icon, isCenter && styles.centerIcon]}>{tab.icon}</Text>
              </View>
              {!!tab.label && (
                <Text style={[styles.label, isActive && styles.labelActive]}>{tab.label}</Text>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 8,
    paddingBottom: 10,
  },
  centeredRow: { alignItems: 'center' },
  inner: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingHorizontal: 8,
  },
  maxWidthContainer: { maxWidth: 480 },
  tabItem: { alignItems: 'center', gap: 2, minWidth: 50 },
  icon: { fontSize: 18, color: COLORS.textLight },
  centerButton: {
    backgroundColor: COLORS.primary,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -18,
  },
  centerIcon: { color: '#fff', fontSize: 16 },
  label: { fontSize: 9, color: COLORS.textLight },
  labelActive: { color: COLORS.primary, fontWeight: '700' },
});
