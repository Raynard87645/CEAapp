import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { DriverScreenShell } from '@/components/driver/top-bar';
import { Card, Eyebrow, PageTitle } from '@/components/driver/ui';
import { DriverColors } from '@/constants/driver-colors';
import { useDriver } from '@/context/driver-context';
import { driverApi, type Checkpoint } from '@/services/api/driver';

export default function DriverCheckInScreen() {
  const { dashboard } = useDriver();
  const [checkpoints, setCheckpoints] = useState<Checkpoint[]>([]);
  const [loading, setLoading] = useState(true);

  const tripId = dashboard?.activeTrip?.id;

  const load = useCallback(async () => {
    if (!tripId) {
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const response = await driverApi.checkpoints(tripId);
      setCheckpoints(response.checkpoints);
    } catch (error) {
      Alert.alert('Unable to load checkpoints', error instanceof Error ? error.message : 'Try again.');
    } finally {
      setLoading(false);
    }
  }, [tripId]);

  useEffect(() => {
    void load();
  }, [load]);

  const handleToggle = async (checkpoint: Checkpoint) => {
    if (!tripId) {
      return;
    }

    try {
      const response = await driverApi.toggleCheckpoint(tripId, checkpoint.key);
      setCheckpoints(response.checkpoints);
    } catch (error) {
      Alert.alert('Unable to update checkpoint', error instanceof Error ? error.message : 'Try again.');
    }
  };

  return (
    <DriverScreenShell>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.head}>
          <View>
            <Eyebrow>Movement log</Eyebrow>
            <PageTitle
              title="Check-In"
              subtitle="Complete each checkpoint as the movement progresses."
            />
          </View>
        </View>

        <Card>
          {loading ? (
            <ActivityIndicator color={DriverColors.green} />
          ) : checkpoints.length === 0 ? (
            <Text style={styles.empty}>Assign a trip to begin check-in.</Text>
          ) : (
            checkpoints.map((checkpoint, index) => (
              <View key={checkpoint.key} style={[styles.item, index > 0 && styles.itemBorder]}>
                <Pressable
                  style={[styles.toggle, checkpoint.confirmed && styles.toggleDone]}
                  onPress={() => handleToggle(checkpoint)}>
                  {checkpoint.confirmed ? <Text style={styles.toggleMark}>✓</Text> : null}
                </Pressable>
                <View style={{ flex: 1 }}>
                  <Text style={styles.label}>{checkpoint.label}</Text>
                  <Text style={styles.small}>
                    {checkpoint.confirmed
                      ? `Confirmed at ${checkpoint.timeLabel ?? 'now'}`
                      : 'Awaiting confirmation'}
                  </Text>
                </View>
              </View>
            ))
          )}
        </Card>

        <Text style={styles.footer}>Confirmed timestamps sync to FTS.</Text>
      </ScrollView>
    </DriverScreenShell>
  );
}

const styles = StyleSheet.create({
  head: {
    marginBottom: 16,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 13,
  },
  itemBorder: {
    borderTopWidth: 1,
    borderTopColor: DriverColors.line,
  },
  toggle: {
    width: 31,
    height: 31,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#cfc6b3',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleDone: {
    backgroundColor: DriverColors.green,
    borderColor: DriverColors.green,
  },
  toggleMark: {
    color: '#fff',
    fontWeight: '900',
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: DriverColors.ink,
  },
  small: {
    color: DriverColors.muted,
    fontSize: 12,
    marginTop: 2,
  },
  footer: {
    textAlign: 'center',
    color: DriverColors.muted,
    fontSize: 11,
    marginTop: 8,
  },
  empty: {
    color: DriverColors.muted,
    fontSize: 14,
  },
});
