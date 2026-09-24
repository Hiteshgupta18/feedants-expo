import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  useWindowDimensions,
  ActivityIndicator,
  Modal,
  TextInput,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import dayjs from 'dayjs';

import CompetitionInfoCard from '../components/CompetitionInfoCard';
import JudgeCard from '../components/JudgeCard';
import CountdownBanner from '../components/CountdownBanner';
import ImportantDatesCard from '../components/ImportantDatesCard';
import PreviousWinnersCard from '../components/PreviousWinnersCard';
import CompetitionTabsCard from '../components/CompetitionTabsCard';
import RewardsCard from '../components/RewardsCard';
import DisclaimerBanner from '../components/DisclaimerBanner';
import InfoRowsCard from '../components/InfoRowsCard';
import ReferEarnCard from '../components/ReferEarnCard';
import HearFromUsersRow from '../components/HearFromUsersRow';
import AdBanner from '../components/AdBanner';
import BottomCTA from '../components/BottomCTA';
import BottomTabBar from '../components/BottomTabBar';
import { COLORS } from '../constants/colors';
import { useAuth } from '../context/AuthContext';
import { getCompetition, registerForCompetition, submitEntry } from '../api/competitions';
import { CompetitionStage } from '../api/types';

const COMPETITION_ID = '6ab56173e28aa2c3dfddd62d';

type CTAState = 'register' | 'registered_waiting' | 'upload_submission' | 'closed' | 'full';

const REWARD_ICONS: Record<number, string> = {
  1: '🏆',
  2: '🥈',
  3: '🥉',
};

const getCTAState = (
  stage: CompetitionStage,
  isRegistered: boolean,
  spotsLeft: number
): CTAState => {
  switch (stage) {
    case 'registration_open':
      if (isRegistered) return 'registered_waiting';
      return spotsLeft > 0 ? 'register' : 'full';
    case 'registration_closed':
      return isRegistered ? 'registered_waiting' : 'closed';
    case 'submission_open':
      return isRegistered ? 'upload_submission' : 'closed';
    case 'submission_closed':
    case 'results_declared':
    case 'upcoming':
    default:
      return 'closed';
  }
};

const showConfirm = (
  title: string,
  message: string,
  onConfirm: () => void
) => {
  if (Platform.OS === 'web') {
    const confirmed = window.confirm(`${title}\n\n${message}`);
    if (confirmed) onConfirm();
    return;
  }

  Alert.alert(title, message, [
    { text: 'Cancel', style: 'cancel' },
    { text: 'OK', style: 'destructive', onPress: onConfirm },
  ]);
};

const showAlert = (title: string, message: string) => {
  if (Platform.OS === 'web') {
    window.alert(`${title}\n\n${message}`);
    return;
  }
  Alert.alert(title, message);
};

export default function CompetitionDetailsScreen() {
  const { width } = useWindowDimensions();
  const isWideScreen = width > 600;
  const router = useRouter();
  const { token, user, isLoading: authLoading, logout } = useAuth();
  const queryClient = useQueryClient();

  const [submissionModalVisible, setSubmissionModalVisible] = useState(false);
  const [submissionUrl, setSubmissionUrl] = useState('');

  const {
    data: competition,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['competition', COMPETITION_ID, token],
    queryFn: () => getCompetition(COMPETITION_ID, token),
    refetchInterval: 30000,
  });

  const registerMutation = useMutation({
    mutationFn: () => {
      if (!token) throw new Error('Not authenticated');
      return registerForCompetition(COMPETITION_ID, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['competition', COMPETITION_ID] });
      showAlert('Success', 'You are registered for this competition!');
    },
    onError: (err: any) => {
      const message = err?.response?.data?.message || 'Registration failed. Please try again.';
      showAlert('Registration failed', message);
    },
  });

  const submissionMutation = useMutation({
    mutationFn: () => {
      if (!token) throw new Error('Not authenticated');
      return submitEntry(COMPETITION_ID, token, submissionUrl.trim());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['competition', COMPETITION_ID] });
      setSubmissionModalVisible(false);
      setSubmissionUrl('');
      showAlert('Success', 'Your submission has been received!');
    },
    onError: (err: any) => {
      const message = err?.response?.data?.message || 'Submission failed. Please try again.';
      showAlert('Submission failed', message);
    },
  });

  const handleCTAPress = () => {
    if (!token) {
      router.push('/login');
      return;
    }

    if (!competition) return;

    const ctaState = getCTAState(competition.currentStage, competition.isRegistered, competition.spotsLeft);

    if (ctaState === 'register') {
      registerMutation.mutate();
    } else if (ctaState === 'upload_submission') {
      setSubmissionModalVisible(true);
    }
  };

  const handleSubmitEntry = () => {
    if (!submissionUrl.trim()) {
      showAlert('Missing URL', 'Please enter a link to your submission video.');
      return;
    }
    submissionMutation.mutate();
  };

  const handleLogout = () => {
    showConfirm('Log out', 'Are you sure you want to log out?', async () => {
      await logout();
      queryClient.invalidateQueries({ queryKey: ['competition', COMPETITION_ID] });
    });
  };

  if (isLoading || authLoading) {
    return (
      <SafeAreaView style={styles.centeredScreen}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading competition...</Text>
      </SafeAreaView>
    );
  }

  if (isError || !competition) {
    return (
      <SafeAreaView style={styles.centeredScreen}>
        <Text style={styles.errorText}>
          Couldn't load this competition. {(error as any)?.message || ''}
        </Text>
      </SafeAreaView>
    );
  }

  const ctaState = getCTAState(competition.currentStage, competition.isRegistered, competition.spotsLeft);

  const isMutating = registerMutation.isPending || submissionMutation.isPending;

  let countdownLabel: string | null = null;
  let countdownTarget: string | null = null;
  if (competition.currentStage === 'registration_open') {
    countdownLabel = 'Registration closes in';
    countdownTarget = competition.registrationEndAt;
  } else if (competition.currentStage === 'submission_open') {
    countdownLabel = 'Submission closes in';
    countdownTarget = competition.submissionEndAt;
  }

  const importantDates = [
    {
      icon: '📅',
      label: 'Register Before',
      date: dayjs(competition.registrationEndAt).format('D MMM YY'),
      time: dayjs(competition.registrationEndAt).format('hh:mm A'),
    },
    {
      icon: '📤',
      label: 'Submission Starts',
      date: dayjs(competition.submissionStartAt).format('D MMM YY'),
      time: dayjs(competition.submissionStartAt).format('hh:mm A'),
    },
    {
      icon: '⬆️',
      label: 'Submission Ends',
      date: dayjs(competition.submissionEndAt).format('D MMM YY'),
      time: dayjs(competition.submissionEndAt).format('hh:mm A'),
    },
    {
      icon: '🏆',
      label: 'Result Date',
      date: dayjs(competition.resultDate).format('D MMM YY'),
      time: dayjs(competition.resultDate).format('hh:mm A'),
    },
  ];

  const previousWinners = competition.previousWinners.map((w) => ({
    name: w.name,
    rank: w.position,
    photoUrl: w.thumbnailUrl,
  }));

  const rewards = competition.rewards.map((r) => ({
    icon: REWARD_ICONS[r.position] || '⭐',
    label: r.label,
    amount: r.amount,
    useStar: r.position > 3,
  }));

  const aboutText = competition.aboutText;
  const judgingParametersText = competition.judgingParameters.map((p) => `• ${p}`).join('\n');
  const rulesText = competition.rulesAndEligibility.map((r) => `• ${r}`).join('\n');

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={[styles.header, isWideScreen && styles.centeredRow]}>
        <View style={[styles.headerInner, isWideScreen && styles.maxWidthContainer]}>
          <TouchableOpacity style={styles.backButton}>
            <Text style={styles.backText}>← Go back</Text>
          </TouchableOpacity>
          <View style={styles.headerRight}>
            <View style={styles.langToggleWrapper}>
              <View style={styles.langToggleActive}>
                <Text style={styles.langTextActive}>ENG</Text>
              </View>
              <Text style={styles.langTextInactive}>हिंदी</Text>
            </View>
            {token && (
              <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
                <Text style={styles.logoutText}>Log out</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, isWideScreen && styles.centeredRow]}
      >
        <View style={[styles.contentInner, isWideScreen && styles.maxWidthContainer]}>
          {!token && (
            <TouchableOpacity style={styles.loginBanner} onPress={() => router.push('/login')}>
              <Text style={styles.loginBannerText}>
                Log in to register and track your participation →
              </Text>
            </TouchableOpacity>
          )}

          {token && user && (
            <View style={styles.userBanner}>
              <Text style={styles.userBannerText}>Logged in as {user.name} ({user.email})</Text>
            </View>
          )}

          <CompetitionInfoCard
            title={competition.title}
            tags={competition.tags}
            isRegistered={competition.isRegistered}
            prizePool={competition.prizePool}
            entryFee={competition.entryFee}
            spotsLeft={competition.spotsLeft}
            totalSpots={competition.totalSpots}
            bookedSpots={competition.bookedSpots}
          />

          <JudgeCard
            name={competition.judge.name}
            title={competition.judge.title}
            experience={competition.judge.experience}
            photoUrl={competition.judge.photoUrl}
            onPlayVideo={() => console.log('play video')}
          />

          {countdownLabel && countdownTarget && (
            <CountdownBanner label={countdownLabel} targetDate={countdownTarget} />
          )}

          <ImportantDatesCard dates={importantDates} />

          {previousWinners.length > 0 && <PreviousWinnersCard winners={previousWinners} />}

          <CompetitionTabsCard
            about={aboutText}
            judgingParameters={judgingParametersText}
            rulesEligibility={rulesText}
          />

          <RewardsCard rewards={rewards} />

          {competition.disclaimer && <DisclaimerBanner text={competition.disclaimer} />}

          <InfoRowsCard />

          <ReferEarnCard
            referralLink={`https://feedants.com/r/${user?.id || 'guest'}`}
            earnAmount={110}
            onCopy={() => console.log('copied')}
            onReferNow={() => console.log('refer now')}
          />

          <HearFromUsersRow onPress={() => console.log('hear from users')} />

          <AdBanner />
        </View>
      </ScrollView>

      <BottomCTA state={ctaState} onPress={handleCTAPress} />

      {isMutating && (
        <View style={styles.mutatingOverlay}>
          <ActivityIndicator color="#fff" />
        </View>
      )}

      <BottomTabBar activeTab="competitions" onTabPress={(key) => console.log('tab', key)} />

      <Modal
        visible={submissionModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setSubmissionModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Upload Your Submission</Text>
            <Text style={styles.modalSubtitle}>Paste a link to your performance video</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="https://..."
              autoCapitalize="none"
              value={submissionUrl}
              onChangeText={setSubmissionUrl}
            />
            <View style={styles.modalButtonRow}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => {
                  setSubmissionModalVisible(false);
                  setSubmissionUrl('');
                }}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalSubmitButton}
                onPress={handleSubmitEntry}
                disabled={submissionMutation.isPending}
              >
                {submissionMutation.isPending ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text style={styles.modalSubmitText}>Submit</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  centeredScreen: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    padding: 24,
  },
  loadingText: { color: COLORS.textMuted, fontSize: 14 },
  errorText: { color: COLORS.danger, fontSize: 14, textAlign: 'center' },
  header: { paddingVertical: 12, backgroundColor: COLORS.background },
  headerInner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  backButton: { flexDirection: 'row', alignItems: 'center' },
  backText: { fontSize: 15, fontWeight: '500', color: COLORS.text },
  langToggleWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F5',
    borderRadius: 16,
    padding: 3,
    gap: 2,
  },
  langToggleActive: {
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  langTextActive: { color: '#fff', fontSize: 11, fontWeight: '700' },
  langTextInactive: { color: COLORS.primary, fontSize: 11, fontWeight: '600', paddingHorizontal: 8 },
  logoutButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: COLORS.dangerLight,
  },
  logoutText: { color: COLORS.danger, fontSize: 12, fontWeight: '700' },
  scroll: { flex: 1 },
  scrollContent: { paddingVertical: 8 },
  contentInner: { paddingHorizontal: 16, gap: 16, width: '100%' },
  centeredRow: { alignItems: 'center' },
  maxWidthContainer: { maxWidth: 480, width: '100%' },
  loginBanner: {
    backgroundColor: COLORS.primaryLight,
    borderRadius: 10,
    padding: 12,
  },
  loginBannerText: { color: COLORS.primary, fontWeight: '600', fontSize: 13 },
  userBanner: {
    backgroundColor: '#F1F5F5',
    borderRadius: 10,
    padding: 10,
  },
  userBannerText: { color: COLORS.textMuted, fontSize: 12, fontWeight: '500' },
  mutatingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 24,
    gap: 12,
  },
  modalTitle: { fontSize: 18, fontWeight: '700', color: COLORS.text },
  modalSubtitle: { fontSize: 13, color: COLORS.textMuted },
  modalInput: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
  },
  modalButtonRow: { flexDirection: 'row', gap: 10, marginTop: 8 },
  modalCancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
  },
  modalCancelText: { color: COLORS.textMuted, fontWeight: '600' },
  modalSubmitButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
  },
  modalSubmitText: { color: '#fff', fontWeight: '700' },
});
