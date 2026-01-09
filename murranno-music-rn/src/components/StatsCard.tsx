/**
 * Stats Card Component
 * Displays statistics with icon and change indicator
 */
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../theme';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: string;
  change?: number;
  changeLabel?: string;
  gradient?: boolean;
  onPress?: () => void;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon,
  change,
  changeLabel,
  gradient = false,
  onPress,
}) => {
  const content = (
    <>
      <View style={styles.header}>
        <View style={[styles.iconContainer, gradient && styles.iconContainerGradient]}>
          <Text style={styles.icon}>{icon}</Text>
        </View>
        {change !== undefined && (
          <View style={[styles.changeBadge, change >= 0 ? styles.changePositive : styles.changeNegative]}>
            <Text style={[styles.changeText, change >= 0 ? styles.changeTextPositive : styles.changeTextNegative]}>
              {change >= 0 ? '+' : ''}{change}%
            </Text>
          </View>
        )}
      </View>
      <Text style={[styles.value, gradient && styles.valueGradient]}>{value}</Text>
      <Text style={[styles.title, gradient && styles.titleGradient]}>{title}</Text>
      {changeLabel && <Text style={[styles.changeLabel, gradient && styles.changeLabelGradient]}>{changeLabel}</Text>}
    </>
  );

  if (gradient) {
    return (
      <TouchableOpacity onPress={onPress} disabled={!onPress}>
        <LinearGradient
          colors={colors.gradientPrimary}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.container}
        >
          {content}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} disabled={!onPress}>
      {content}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary + '30',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainerGradient: {
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  icon: {
    fontSize: 20,
  },
  changeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  changePositive: {
    backgroundColor: colors.success + '20',
  },
  changeNegative: {
    backgroundColor: colors.destructive + '20',
  },
  changeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  changeTextPositive: {
    color: colors.success,
  },
  changeTextNegative: {
    color: colors.destructive,
  },
  value: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.foreground,
  },
  valueGradient: {
    color: '#fff',
  },
  title: {
    fontSize: 13,
    color: colors.mutedForeground,
    fontWeight: '500',
    marginTop: 4,
  },
  titleGradient: {
    color: 'rgba(255,255,255,0.8)',
  },
  changeLabel: {
    fontSize: 11,
    color: colors.mutedForeground,
    marginTop: 8,
  },
  changeLabelGradient: {
    color: 'rgba(255,255,255,0.6)',
  },
});

export default StatsCard;
