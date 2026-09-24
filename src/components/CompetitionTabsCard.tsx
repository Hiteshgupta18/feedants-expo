import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

type TabKey = 'about' | 'judging' | 'rules';

type Props = {
  about: string;
  judgingParameters: string;
  rulesEligibility: string;
};

const TABS: { key: TabKey; label: string }[] = [
  { key: 'about', label: 'About Competition' },
  { key: 'judging', label: 'Judging Parameters' },
  { key: 'rules', label: 'Rules & Eligibility' },
];

const PREVIEW_LENGTH = 140;

export default function CompetitionTabsCard({ about, judgingParameters, rulesEligibility }: Props) {
  const [activeTab, setActiveTab] = useState<TabKey>('about');
  const [expanded, setExpanded] = useState(false);

  const contentMap: Record<TabKey, string> = {
    about,
    judging: judgingParameters,
    rules: rulesEligibility,
  };

  const fullText = contentMap[activeTab];
  const isLong = fullText.length > PREVIEW_LENGTH;
  const displayText = expanded || !isLong ? fullText : fullText.slice(0, PREVIEW_LENGTH) + '...';

  const handleTabChange = (key: TabKey) => {
    setActiveTab(key);
    setExpanded(false); // reset expand state when switching tabs
  };

  return (
    <View style={styles.card}>
      <View style={styles.tabRow}>
        {TABS.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tabButton, activeTab === tab.key && styles.tabButtonActive]}
            onPress={() => handleTabChange(tab.key)}
          >
            <Text style={[styles.tabText, activeTab === tab.key && styles.tabTextActive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.content}>{displayText}</Text>

      {isLong && (
        <TouchableOpacity onPress={() => setExpanded(!expanded)} style={styles.viewMoreButton}>
          <Text style={styles.viewMoreText}>{expanded ? 'View less' : 'View more'} {expanded ? '▲' : '▼'}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  tabRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
    marginBottom: 12,
  },
  tabButton: { paddingBottom: 10, marginRight: 20 },
  tabButtonActive: { borderBottomWidth: 2, borderBottomColor: '#0E7C6B' },
  tabText: { fontSize: 12, color: '#999', fontWeight: '500' },
  tabTextActive: { color: '#0E7C6B', fontWeight: '700' },
  content: { fontSize: 13, color: '#555', lineHeight: 20 },
  viewMoreButton: { marginTop: 8 },
  viewMoreText: { fontSize: 12, color: '#0E7C6B', fontWeight: '700' },
});
