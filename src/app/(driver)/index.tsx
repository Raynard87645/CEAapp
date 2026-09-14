import * as ImagePicker from 'expo-image-picker';
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
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
import { DriverColors } from '@/constants/driver-colors';
import { driverApi, type StatusUpdate } from '@/services/api/driver';

export default function DriverUpdatesScreen() {
  const [updates, setUpdates] = useState<StatusUpdate[]>([]);
  const [message, setMessage] = useState('');
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);

    try {
      const response = await driverApi.updates();
      setUpdates(response.updates);
    } catch (error) {
      Alert.alert('Unable to load updates', error instanceof Error ? error.message : 'Try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const pickPhoto = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.8,
    });

    if (!result.canceled) {
      setPhotoUri(result.assets[0]?.uri ?? null);
    }
  };

  const handlePost = async () => {
    if (!message.trim() && !photoUri) {
      Alert.alert('Add update text or a photo.');
      return;
    }

    setSubmitting(true);

    try {
      const response = await driverApi.postUpdate({
        message: message.trim(),
        photoUri,
      });
      setUpdates((current) => [response.update, ...current]);
      setMessage('');
      setPhotoUri(null);
      Alert.alert('Update sent to FTS');
    } catch (error) {
      Alert.alert('Unable to post update', error instanceof Error ? error.message : 'Try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DriverScreenShell>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.head}>
          <View>
            <Eyebrow>Live activity</Eyebrow>
            <PageTitle title="What's happening?" />
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
          {photoUri ? <Image source={{ uri: photoUri }} style={styles.preview} /> : null}
          <View style={styles.actions}>
            <Pressable style={styles.cameraBtn} onPress={pickPhoto}>
              <Text style={styles.cameraText}>📷</Text>
            </Pressable>
            <Pressable
              style={[styles.postBtn, submitting && styles.disabled]}
              onPress={handlePost}
              disabled={submitting}>
              {submitting ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.postText}>Post Update</Text>
              )}
            </Pressable>
          </View>
        </Card>

        {loading ? (
          <ActivityIndicator color={DriverColors.green} style={{ marginTop: 24 }} />
        ) : (
          updates.map((update) => (
            <Card key={update.id} style={styles.feedCard}>
              <View style={styles.feedLine} />
              <View style={styles.feedBody}>
                <Text style={styles.feedMessage}>{update.message}</Text>
                {update.photoUrl ? (
                  <Image source={{ uri: update.photoUrl }} style={styles.feedPhoto} />
                ) : null}
                <View style={styles.meta}>
                  <Text style={styles.metaText}>{update.timeLabel ?? 'Just now'}</Text>
                  <Text style={styles.metaText}>✓ Sent to FTS</Text>
                </View>
              </View>
            </Card>
          ))
        )}
      </ScrollView>
    </DriverScreenShell>
  );
}

const styles = StyleSheet.create({
  head: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 16,
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
  preview: {
    width: '100%',
    height: 160,
    borderRadius: 12,
    marginTop: 8,
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
    marginBottom: 10,
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
