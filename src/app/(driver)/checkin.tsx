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
import {
  driverApi,
  type Checkpoint,
  type DriverShiftState,
  type TripCompletionState,
} from '@/services/api/driver';

export default function DriverCheckInScreen() {
  const { dashboard } = useDriver();

  const [checkpoints, setCheckpoints] = useState<Checkpoint[]>([]);
  const [shift, setShift] = useState<DriverShiftState | null>(null);
  const [tripCompletion, setTripCompletion] =
    useState<TripCompletionState | null>(null);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState<string | null>(null);

  const tripId = dashboard?.activeTrip?.id;

  const load = useCallback(async () => {
    if (!tripId) {
      setCheckpoints([]);
      setShift(null);
      setTripCompletion(null);
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const response = await driverApi.checkpoints(tripId);

      setCheckpoints(response.checkpoints);
      setShift(response.shift);
      setTripCompletion(response.trip_completion);
    } catch (error) {
      Alert.alert(
        'Unable to load checkpoints',
        error instanceof Error ? error.message : 'Try again.',
      );
    } finally {
      setLoading(false);
    }
  }, [tripId]);

  useEffect(() => {
    void load();
  }, [load]);

  const handleToggle = async (checkpoint: Checkpoint) => {
    if (!tripId || submitting) {
      return;
    }

    if (
      checkpoint.key === 'start_shift' &&
      (shift?.check_in_requested_at || shift?.checked_in_at)
    ) {
      return;
    }

    if (
      checkpoint.key === 'end_shift' &&
      (
        !shift?.checked_in_at ||
        shift?.check_out_requested_at ||
        shift?.checked_out_at
      )
    ) {
      return;
    }

    setSubmitting(checkpoint.key);

    try {
      if (checkpoint.key === 'start_shift') {
        const response = await driverApi.requestCheckIn(tripId);

        setShift(response.shift);

        Alert.alert(
          'Check-in requested',
          response.message ||
            'Your check-in request was sent to FTS for approval.',
        );

        await load();
        return;
      }

      if (checkpoint.key === 'end_shift') {
        const response = await driverApi.requestCheckOut(tripId);

        setShift(response.shift);

        Alert.alert(
          'Check-out requested',
          response.message ||
            'Your check-out request was sent to FTS for approval.',
        );

        await load();
        return;
      }

      const response = await driverApi.toggleCheckpoint(
        tripId,
        checkpoint.key,
      );

      setCheckpoints(response.checkpoints);
    } catch (error) {
      Alert.alert(
        checkpoint.key === 'start_shift'
          ? 'Unable to request check-in'
          : checkpoint.key === 'end_shift'
            ? 'Unable to request check-out'
            : 'Unable to update checkpoint',
        error instanceof Error ? error.message : 'Try again.',
      );
    } finally {
      setSubmitting(null);
    }
  };

  const handleEndTrip = async () => {
    if (
      !tripId ||
      submitting ||
      tripCompletion?.requested_at
    ) {
      return;
    }

    setSubmitting('end_trip');

    try {
      const response = await driverApi.requestEndTrip(tripId);

      setTripCompletion({
        requested_at:
          response.trip.trip_completion_requested_at ?? null,
        approved_at:
          response.trip.trip_completion_approved_at ?? null,
        completed_at:
          response.trip.completed_at ?? null,
      });

      Alert.alert(
        'End trip requested',
        response.message ||
          'Your end trip request was sent to FTS for approval.',
      );

      await load();
    } catch (error) {
      Alert.alert(
        'Unable to request end trip',
        error instanceof Error ? error.message : 'Try again.',
      );
    } finally {
      setSubmitting(null);
    }
  };

  const formatShiftTime = (value?: string | null) => {
    if (!value) {
      return null;
    }

    const match = value.match(/(?:T|\s)(\d{2}):(\d{2})/);

    if (!match) {
      return null;
    }

    const hours = Number(match[1]);
    const minutes = match[2];
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;

    return `${displayHours}:${minutes} ${period}`;
  };

  const isCheckpointConfirmed = (checkpoint: Checkpoint) => {
    if (checkpoint.key === 'start_shift') {
      return Boolean(shift?.checked_in_at);
    }

    if (checkpoint.key === 'end_shift') {
      return Boolean(shift?.checked_out_at);
    }

    return checkpoint.confirmed;
  };

  const isCheckpointDisabled = (checkpoint: Checkpoint) => {
    if (submitting) {
      return true;
    }

    if (checkpoint.key === 'start_shift') {
      return Boolean(
        shift?.check_in_requested_at ||
        shift?.checked_in_at,
      );
    }

    if (checkpoint.key === 'end_shift') {
      return Boolean(
        !shift?.checked_in_at ||
        shift?.check_out_requested_at ||
        shift?.checked_out_at,
      );
    }

    return false;
  };

  const getCheckpointStatus = (checkpoint: Checkpoint) => {
    if (submitting === checkpoint.key) {
      return checkpoint.key === 'start_shift'
        ? 'Sending check-in request...'
        : checkpoint.key === 'end_shift'
          ? 'Sending check-out request...'
          : 'Updating...';
    }

    if (checkpoint.key === 'start_shift') {
      if (shift?.checked_in_at) {
        const time = formatShiftTime(shift.checked_in_at);

        return time
          ? `Checked in at ${time}`
          : 'Checked in';
      }

      if (shift?.check_in_requested_at) {
        return 'Awaiting FTS approval';
      }

      return 'Request check-in from FTS';
    }

    if (checkpoint.key === 'end_shift') {
      if (shift?.checked_out_at) {
        const time = formatShiftTime(shift.checked_out_at);

        return time
          ? `Checked out at ${time}`
          : 'Checked out';
      }

      if (shift?.check_out_requested_at) {
        return 'Awaiting FTS approval';
      }

      if (!shift?.checked_in_at) {
        return 'Available after check-in is approved';
      }

      return 'Request check-out from FTS';
    }

    if (checkpoint.confirmed) {
      return `Confirmed at ${checkpoint.timeLabel ?? 'now'}`;
    }

    return 'Awaiting confirmation';
  };

  const isDepartureDay =
    shift?.day_type === 'Departure Day';

  const showEndTrip =
    isDepartureDay &&
    Boolean(shift?.checked_out_at);

  const endTripRequested =
    Boolean(tripCompletion?.requested_at);

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
            <Text style={styles.empty}>
              Assign a trip to begin check-in.
            </Text>
          ) : (
            <>
              {checkpoints.map((checkpoint, index) => {
                const confirmed =
                  isCheckpointConfirmed(checkpoint);

                const disabled =
                  isCheckpointDisabled(checkpoint);

                return (
                  <View
                    key={checkpoint.key}
                    style={[
                      styles.item,
                      index > 0 && styles.itemBorder,
                    ]}>
                    <Pressable
                      style={[
                        styles.toggle,
                        confirmed && styles.toggleDone,
                      ]}
                      disabled={disabled}
                      onPress={() =>
                        handleToggle(checkpoint)
                      }>
                      {submitting === checkpoint.key ? (
                        <ActivityIndicator
                          size="small"
                          color={DriverColors.green}
                        />
                      ) : confirmed ? (
                        <Text style={styles.toggleMark}>
                          ✓
                        </Text>
                      ) : null}
                    </Pressable>

                    <View style={{ flex: 1 }}>
                      <Text style={styles.label}>
                        {checkpoint.label}
                      </Text>

                      <Text style={styles.small}>
                        {getCheckpointStatus(checkpoint)}
                      </Text>
                    </View>
                  </View>
                );
              })}

              {showEndTrip && (
                <View
                  style={[
                    styles.item,
                    styles.itemBorder,
                  ]}>
                  <Pressable
                    style={[
                      styles.toggle,
                      tripCompletion?.approved_at &&
                        styles.toggleDone,
                    ]}
                    disabled={
                      Boolean(submitting) ||
                      endTripRequested
                    }
                    onPress={handleEndTrip}>
                    {submitting === 'end_trip' ? (
                      <ActivityIndicator
                        size="small"
                        color={DriverColors.green}
                      />
                    ) : tripCompletion?.approved_at ? (
                      <Text style={styles.toggleMark}>
                        ✓
                      </Text>
                    ) : null}
                  </Pressable>

                  <View style={{ flex: 1 }}>
                    <Text style={styles.label}>
                      End Trip
                    </Text>

                    <Text style={styles.small}>
                      {submitting === 'end_trip'
                        ? 'Sending end trip request...'
                        : endTripRequested
                          ? 'Awaiting FTS approval'
                          : 'Request trip completion from FTS'}
                    </Text>
                  </View>
                </View>
              )}
            </>
          )}
        </Card>

        <Text style={styles.footer}>
          Confirmed timestamps sync to FTS.
        </Text>
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