import * as ImagePicker from 'expo-image-picker';
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { DriverScreenShell } from '@/components/driver/top-bar';
import { Card, Eyebrow, PageTitle, Pill } from '@/components/driver/ui';
import { AppDialog } from '@/components/ui/app-dialog';
import { DriverColors } from '@/constants/driver-colors';
import { useDriver } from '@/context/driver-context';
import { driverApi, type StatusUpdate } from '@/services/api/driver';

export default function DriverUpdatesScreen() {
  const { dashboard } = useDriver();
  const [updates, setUpdates] = useState<StatusUpdate[]>([]);
  const [message, setMessage] = useState('');
  const [location, setLocation] = useState('');
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [dialog, setDialog] = useState({
    visible: false,
    title: '',
    message: '',
  });

  const showDialog = useCallback(
    (title: string, message = '') => {
      setDialog({
        visible: true,
        title,
        message,
      });
    },
    [],
  );

  const closeDialog = useCallback(() => {
    setDialog((current) => ({
      ...current,
      visible: false,
    }));
  }, []);

  const load = useCallback(async () => {
    setLoading(true);

    try {
      const response = await driverApi.updates();
      setUpdates(response.updates);
    } catch (error) {
      showDialog(
        'Unable to load updates',
        error instanceof Error ? error.message : 'Try again.',
      );
    } finally {
      setLoading(false);
    }
  }, [showDialog]);

  useEffect(() => {
    void load();
  }, [load]);

  const pickPhoto = async () => {
    const permission =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      showDialog(
        'Photo access required',
        'Allow photo access in your device settings to attach a photo to an update.',
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.8,
    });

    if (!result.canceled) {
      setPhotoUri(result.assets[0]?.uri ?? null);
    }
  };

  const handlePost = async () => {
    const trimmedMessage = message.trim();

    if (!trimmedMessage && !photoUri) {
      showDialog(
        'Add update details',
        'Add update text or attach a photo before posting.',
      );
      return;
    }

    setSubmitting(true);

    try {
      const response = await driverApi.postUpdate({
        message: trimmedMessage,
        location: location.trim(),
        photoUri,
      });

      setUpdates((current) => [response.update, ...current]);
      setMessage('');
      setLocation('');
      setPhotoUri(null);


    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DriverScreenShell>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        <View style={styles.head}>
          <View style={styles.headCopy}>
            <Eyebrow>Live activity</Eyebrow>

            <PageTitle
              title="What's happening?"
              subtitle={
                dashboard?.activeTrip?.tripCode
                  ? `${dashboard.activeTrip.tripCode} · ${dashboard.activeTrip.clientName}`
                  : undefined
              }
            />
          </View>

          <Pill>● ONLINE</Pill>
        </View>

        <Card>
          <TextInput
            style={styles.textarea}
            multiline
            placeholder="Share a movement update..."
            placeholderTextColor={DriverColors.muted}
            value={message}
            onChangeText={setMessage}
          />

          <TextInput
            style={styles.locationInput}
            placeholder="Location (optional)"
            placeholderTextColor={DriverColors.muted}
            value={location}
            onChangeText={setLocation}
          />

          {photoUri ? (
            <View style={styles.previewWrap}>
              <Image
                source={{ uri: photoUri }}
                style={styles.preview}
              />

              <Pressable
                style={styles.removePhoto}
                onPress={() => setPhotoUri(null)}
                accessibilityRole="button"
                accessibilityLabel="Remove attached photo">
                <Text style={styles.removePhotoText}>Remove</Text>
              </Pressable>
            </View>
          ) : null}

          <View style={styles.actions}>
            <Pressable
              style={styles.cameraBtn}
              onPress={pickPhoto}
              accessibilityRole="button"
              accessibilityLabel="Attach photo">
              <Text style={styles.cameraText}>📷</Text>
            </Pressable>

            <Pressable
              style={[
                styles.postBtn,
                submitting && styles.disabled,
              ]}
              onPress={handlePost}
              disabled={submitting}
              accessibilityRole="button"
              accessibilityLabel="Post update">
              {submitting ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.postText}>Post Update</Text>
              )}
            </Pressable>
          </View>
        </Card>

        {loading ? (
          <ActivityIndicator
            color={DriverColors.green}
            style={styles.loading}
          />
        ) : (
          updates.map((update) => (
            <Card key={update.id} style={styles.feedCard}>
              <View style={styles.feedLine} />

              <View style={styles.feedBody}>
                <Text style={styles.feedMessage}>
                  {update.message}
                </Text>

                {update.location ? (
                  <Text style={styles.feedMeta}>
                    📍 {update.location}
                  </Text>
                ) : null}

                {update.tripCode || update.vehicleName ? (
                  <Text style={styles.feedMeta}>
                    {[update.tripCode, update.vehicleName]
                      .filter(Boolean)
                      .join(' · ')}
                  </Text>
                ) : null}

                {update.photoUrl ? (
                  <Image
                    source={{ uri: update.photoUrl }}
                    style={styles.feedPhoto}
                  />
                ) : null}

                <View style={styles.meta}>
                  <Text style={styles.metaText}>
                    {update.timeLabel ?? 'Just now'}
                  </Text>

                  <Text style={styles.metaText}>
                    ✓ Sent to FTS
                  </Text>
                </View>
              </View>
            </Card>
          ))
        )}
      </ScrollView>

      <AppDialog
        visible={dialog.visible}
        title={dialog.title}
        message={dialog.message}
        confirmLabel="OK"
        onConfirm={closeDialog}
        onCancel={closeDialog}
      />
    </DriverScreenShell>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 24,
  },

  head: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 16,
  },

  headCopy: {
    flex: 1,
    paddingRight: 12,
  },

  textarea: {
    minHeight: 104,
    borderWidth: 1,
    borderColor: DriverColors.line,
    borderRadius: 13,
    padding: 13,
    backgroundColor: '#fff',
    textAlignVertical: 'top',
    color: DriverColors.ink,
  },

  locationInput: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: DriverColors.line,
    borderRadius: 13,
    paddingHorizontal: 13,
    paddingVertical: 12,
    backgroundColor: '#fff',
    color: DriverColors.ink,
  },

  previewWrap: {
    position: 'relative',
  },

  preview: {
    width: '100%',
    height: 160,
    borderRadius: 12,
    marginTop: 8,
  },

  removePhoto: {
    position: 'absolute',
    top: 16,
    right: 8,
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 8,
    backgroundColor: 'rgba(0,0,0,0.65)',
  },

  removePhotoText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },

  actions: {
    flexDirection: 'row',
    gap: 9,
    marginTop: 10,
    alignItems: 'center',
  },

  cameraBtn: {
    width: 48,
    height: 47,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: DriverColors.line,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },

  cameraText: {
    fontSize: 20,
    color: DriverColors.gold,
  },

  postBtn: {
    flex: 1,
    backgroundColor: DriverColors.green,
    borderRadius: 14,
    minHeight: 47,
    alignItems: 'center',
    justifyContent: 'center',
  },

  postText: {
    color: '#fff',
    fontWeight: '800',
  },

  disabled: {
    opacity: 0.7,
  },

  loading: {
    marginTop: 24,
  },

  feedCard: {
    flexDirection: 'row',
    gap: 12,
  },

  feedLine: {
    width: 4,
    borderRadius: 3,
    backgroundColor: DriverColors.gold,
  },

  feedBody: {
    flex: 1,
  },

  feedMessage: {
    fontWeight: '700',
    color: DriverColors.ink,
    marginBottom: 6,
  },

  feedMeta: {
    color: DriverColors.muted,
    fontSize: 12,
    marginBottom: 8,
  },

  feedPhoto: {
    width: '100%',
    height: 140,
    borderRadius: 12,
    marginBottom: 8,
  },

  meta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  metaText: {
    color: DriverColors.muted,
    fontSize: 11,
  },
});