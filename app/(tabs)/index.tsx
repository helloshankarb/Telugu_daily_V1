import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Play, RotateCcw, CircleCheck as CheckCircle, Circle, Trophy, Target } from 'lucide-react-native';
import * as Speech from 'expo-speech';
import { getSentencesByDay } from '@/data/sentences';
import { useTheme } from '@/hooks/useTheme';
import BannerAdComponent from '@/components/BannerAd';

export default function HomeScreen() {
  const { theme } = useTheme();
  const [currentDay] = useState(1);
  const [completedSentences, setCompletedSentences] = useState<{ [key: number]: boolean }>({});
  const [masteredSentences, setMasteredSentences] = useState<{ [key: number]: boolean }>({});
  const [knowItCount, setKnowItCount] = useState<{ [key: number]: number }>({});
  
  const todaysSentences = getSentencesByDay(currentDay);
  const completedCount = Object.keys(completedSentences).length;
  const masteredCount = Object.keys(masteredSentences).length;

  useEffect(() => {
    console.log('HomeScreen: Component mounted, sentences loaded:', todaysSentences.length);
  }, []);

  const handleTextToSpeech = async (text: string, isEnglish: boolean = true) => {
    try {
      const language = isEnglish ? 'en-US' : 'te-IN';
      await Speech.speak(text, {
        language,
        pitch: 1.0,
        rate: 0.8,
      });
    } catch (error) {
      console.log('TTS Error:', error);
    }
  };

  const handleKnowIt = (sentenceId: number) => {
    const currentCount = (knowItCount[sentenceId] || 0) + 1;
    
    // Update know it count
    setKnowItCount(prev => ({
      ...prev,
      [sentenceId]: currentCount
    }));
    
    // Mark as completed on first tap
    setCompletedSentences(prev => ({
      ...prev,
      [sentenceId]: true
    }));
    
    // Mark as mastered after 2+ taps
    if (currentCount >= 2) {
      setMasteredSentences(prev => ({
        ...prev,
        [sentenceId]: true
      }));
    }
  };

  const getSentenceStatus = (sentenceId: number) => {
    const count = knowItCount[sentenceId] || 0;
    const isCompleted = completedSentences[sentenceId];
    const isMastered = masteredSentences[sentenceId];
    
    if (isMastered) return { status: 'mastered', count };
    if (isCompleted) return { status: 'learning', count };
    return { status: 'new', count };
  };

  const getButtonText = (sentenceId: number) => {
    const { status, count } = getSentenceStatus(sentenceId);
    
    if (status === 'mastered') return 'Mastered! 🌟';
    if (status === 'learning' && count === 1) return 'Know It Again';
    return 'Know It';
  };

  const getButtonStyle = (sentenceId: number) => {
    const { status } = getSentenceStatus(sentenceId);
    
    if (status === 'mastered') return styles.knowItButtonMastered;
    if (status === 'learning') return styles.knowItButtonCompleted;
    return styles.knowItButton;
  };

  const getButtonTextStyle = (sentenceId: number) => {
    const { status } = getSentenceStatus(sentenceId);
    
    if (status === 'mastered') return styles.knowItTextMastered;
    if (status === 'learning') return styles.knowItTextCompleted;
    return styles.knowItText;
  };

  const getStatusText = (sentenceId: number) => {
    const { status, count } = getSentenceStatus(sentenceId);
    
    if (status === 'mastered') return `Mastered! (${count} times)`;
    if (status === 'learning') return `Learning... (${count}/2 to master)`;
    return 'Tap "Know It" to learn';
  };

  const resetProgress = () => {
    Alert.alert(
      '🔄 Reset Daily Progress',
      'This will clear all your progress for today. You can always start fresh!\n\nAre you sure you want to continue?',
      [
        { 
          text: 'Keep Learning', 
          style: 'cancel',
          onPress: () => console.log('Reset cancelled')
        },
        { 
          text: '🗑️ Reset All', 
          style: 'destructive',
          onPress: () => {
            setCompletedSentences({});
            setMasteredSentences({});
            setKnowItCount({});
            Alert.alert('✅ Reset Complete', 'Your daily progress has been cleared. Ready for a fresh start!');
          }
        }
      ],
      {
        cancelable: true,
        userInterfaceStyle: 'light'
      }
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={['#4ECDC4', '#44B3AC']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <Text style={styles.appTitle}>Telugu Daily</Text>
          <TouchableOpacity style={styles.resetButton} onPress={resetProgress}>
            <RotateCcw size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
        
        <Text style={styles.dayTitle}>Day {currentDay} • 50 New Phrases</Text>
        
        {/* Progress Stats */}
        <View style={styles.progressContainer}>
          <View style={styles.progressCircle}>
            <Text style={styles.progressNumber}>{completedCount}/50</Text>
            <Text style={styles.progressLabel}>Learned</Text>
          </View>
          
          <View style={styles.masteredContainer}>
            <View style={styles.treeIcon}>
              <Text style={styles.treeEmoji}>🌳</Text>
            </View>
            <Text style={styles.masteredNumber}>{masteredCount}</Text>
            <Text style={styles.masteredLabel}>Mastered</Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Sentences List */}
        <View style={styles.sentencesContainer}>
          {todaysSentences.map((sentence, index) => {
            const { status } = getSentenceStatus(sentence.id);
            const sentenceNumber = index + 1;
            const shouldShowAd = sentenceNumber % 10 === 0;
            
            console.log(`Sentence ${sentenceNumber}: shouldShowAd = ${shouldShowAd}`);
            
            return (
              <React.Fragment key={sentence.id}>
                <View style={styles.sentenceCard}>
                  <View style={styles.cardHeader}>
                    <Text style={styles.sentenceNumber}>#{sentenceNumber}</Text>
                  </View>
                  
                  <TouchableOpacity 
                    style={styles.teluguContainer}
                    onPress={() => handleTextToSpeech(sentence.telugu, false)}
                  >
                    <Text style={styles.teluguText}>{sentence.telugu}</Text>
                    <Play size={20} color="#4ECDC4" style={styles.playIcon} />
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={styles.englishContainer}
                    onPress={() => handleTextToSpeech(sentence.english, true)}
                  >
                    <Text style={styles.englishText}>{sentence.english}</Text>
                    <Play size={16} color="#F5A623" style={styles.playIcon} />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={getButtonStyle(sentence.id)}
                    onPress={() => handleKnowIt(sentence.id)}
                  >
                    {status === 'mastered' && <CheckCircle size={16} color="#F5A623" style={styles.checkIcon} />}
                    {status === 'learning' && <CheckCircle size={16} color="#27AE60" style={styles.checkIcon} />}
                    <Text style={getButtonTextStyle(sentence.id)}>
                      {getButtonText(sentence.id)}
                    </Text>
                  </TouchableOpacity>

                  <Text style={styles.statusText}>
                    {getStatusText(sentence.id)}
                  </Text>
                </View>

                {shouldShowAd && (
                  <View style={styles.adContainer}>
                    <Text style={styles.adLabel}>Sponsored</Text>
                    <BannerAdComponent 
                      onAdLoaded={() => console.log(`Banner ad loaded after sentence ${sentenceNumber}`)}
                      onAdFailedToLoad={(error) => {
                        console.log(`Banner ad failed after sentence ${sentenceNumber}:`, error);
                      }}
                    />
                  </View>
                )}
              </React.Fragment>
            );
          })}
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    paddingTop: 50,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  appTitle: {
    fontSize: 28,
    fontFamily: 'Poppins-SemiBold',
    color: '#FFFFFF',
  },
  resetButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  dayTitle: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#FFFFFF',
    opacity: 0.9,
    marginBottom: 16,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  progressCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressNumber: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#FFFFFF',
  },
  progressLabel: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#FFFFFF',
    opacity: 0.9,
  },
  masteredContainer: {
    alignItems: 'center',
  },
  treeIcon: {
    marginBottom: 8,
  },
  treeEmoji: {
    fontSize: 32,
  },
  masteredNumber: {
    fontSize: 32,
    fontFamily: 'Poppins-SemiBold',
    color: '#FFFFFF',
  },
  masteredLabel: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#FFFFFF',
    opacity: 0.9,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sentencesContainer: {
    paddingTop: 20,
    paddingBottom: 20,
  },
  sentenceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardHeader: {
    marginBottom: 16,
  },
  sentenceNumber: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#4ECDC4',
  },
  teluguContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  teluguText: {
    flex: 1,
    fontSize: 22,
    fontFamily: 'NotoSansTelugu-Regular',
    color: '#2C3E50',
    lineHeight: 34,
  },
  playIcon: {
    marginLeft: 12,
    marginTop: 6,
  },
  englishContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  englishText: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#2C3E50',
    lineHeight: 24,
  },
  knowItButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E8F8F7',
    borderWidth: 2,
    borderColor: '#4ECDC4',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  knowItButtonCompleted: {
    backgroundColor: '#E8F5E8',
    borderColor: '#27AE60',
  },
  knowItButtonMastered: {
    backgroundColor: '#FFF8E1',
    borderColor: '#F5A623',
  },
  checkIcon: {
    marginRight: 8,
  },
  knowItText: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#4ECDC4',
  },
  knowItTextCompleted: {
    color: '#27AE60',
  },
  knowItTextMastered: {
    color: '#F5A623',
  },
  statusText: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#8E8E93',
    textAlign: 'center',
  },
  viewedText: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#8E8E93',
    textAlign: 'center',
  },
  adContainer: {
    marginVertical: 12,
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    padding: 4,
    minHeight: 70,
    justifyContent: 'center',
  },
  adLabel: {
    fontSize: 10,
    fontFamily: 'Poppins-Regular',
    color: '#8E8E93',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  bottomPadding: {
    height: 40,
  },
});