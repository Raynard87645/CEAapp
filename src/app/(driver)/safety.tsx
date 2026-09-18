import * as ImagePicker from 'expo-image-picker';
import { useCallback, useEffect, useMemo, useState } from 'react';
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
import { useDriver } from '@/context/driver-context';
import { driverApi, type DriverReport, type SafetyItem } from '@/services/api/driver';

export default function DriverSafetyScreen() {
  const { dashboard } = useDriver();
  const tripId = dashboard?.activeTrip?.id;
  const [checklist, setChecklist] = useState<Record<string, SafetyItem[]>>({});
  const [reportTypes, setReportTypes] = useState<string[]>([]);
  const [reports, setReports] = useState<DriverReport[]>([]);
  const [reportType, setReportType] = useState('General Issue');
  const [reportNotes, setReportNotes] = useState('');
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const checklistComplete = useMemo(
    () =>
      Object.values(checklist).every((items) => items.every((item) => item.confirmed)),
    [checklist],
  );

  const load = useCallback(async () => {
    if (!tripId) {
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const response = await driverApi.safety(tripId);
      setChecklist(response.checklist);
      setReportTypes(response.reportTypes);
      setReports(response.reports);
      setReportType(response.reportTypes[0] ?? 'General Issue');
    } catch (error) {
      Alert.alert('Unable to load safety checklist', error instanceof Error ? error.message : 'Try again.');
    } finally {
      setLoading(false);
    }
  }, [tripId]);

  useEffect(() => {
    void load();
  }, [load]);

  const handleToggle = async (section: string, key: string) => {
    if (!tripId) {
      return;
    }

    try {
      const response = await driverApi.toggleSafetyItem(tripId, section, key);
      setChecklist(response.checklist);
    } catch (error) {
      Alert.alert('Unable to update item', error instanceof Error ? error.message : 'Try again.');
    }
  };

  const pickPhoto = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.8,
    });

    if (!result.canceled) {
      setPhotoUri(result.assets[0]?.uri ?? null);
    }
  };

  const handleSubmit = async () => {
    if (!tripId || (!reportNotes.trim() && !photoUri)) {
      Alert.alert('Add report notes or a photo.');
      return;
    }

    setSubmitting(true);

    try {
      const response = await driverApi.submitReport(tripId, {
        type: reportType,
        description: reportNotes.trim(),
        photoUri,
      });
      setReports((current) => [response.report, ...current]);
      setReportNotes('');
      setPhotoUri(null);
      Alert.alert('Safety report sent to FTS');
    } catch (error) {
      Alert.alert('Unable to submit report', error instanceof Error ? error.message : 'Try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DriverScreenShell>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.head}>
          <View>
            <Eyebrow>Driver readiness</Eyebrow>
            <PageTitle
              title="Safety Check"
              subtitle={dashboard?.activeTrip?.tripCode ?? undefined}
            />
          </View>
          <Pill>{checklistComplete ? 'READY' : 'PRE-TRIP'}</Pill>
        </View>

        {loading ? (
          <ActivityIndicator color={DriverColors.green} />
        ) : (
          Object.entries(checklist).map(([section, items]) => (
            <View key={section}>
              <Text style={styles.sectionLabel}>{section}</Text>
              <Card>
                {items.map((item, index) => (
                  <View key={item.key} style={[styles.row, index > 0 && styles.rowBorder]}>
                    <Text style={styles.rowLabel}>{item.label}</Text>
                    <Pressable
                      style={[styles.switch, item.confirmed && styles.switchOn]}
                      onPress={() => handleToggle(section, item.key)}
                    />
                  </View>
                ))}
              </Card>
            </View>
          ))
        )}

        <Text style={styles.sectionLabel}>Issue Report</Text>
        <Card>
          <Text style={styles.fieldLabel}>Report Type</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.typeRow}>
            {reportTypes.map((type) => (
              <Pressable
                key={type}
                style={[styles.typeChip, reportType === type && styles.typeChipActive]}
                onPress={() => setReportType(type)}>
                <Text style={[styles.typeChipText, reportType === type && styles.typeChipTextActive]}>
                  {type}
                </Text>
              </Pressable>
            ))}
          </ScrollView>

          <Text style={styles.fieldLabel}>Report Notes</Text>
          <TextInput
            style={styles.textarea}
            multiline
            placeholder="Describe the issue..."
            placeholderTextColor={DriverColors.muted}
            value={reportNotes}
            onChangeText={setReportNotes}
          />

          {photoUri ? <Image source={{ uri: photoUri }} style={styles.preview} /> : null}

          <View style={styles.actions}>
            <Pressable style={styles.cameraBtn} onPress={pickPhoto}>
              <Text style={styles.cameraText}>📷</Text>
            </Pressable>
            <Pressable
              style={[styles.submitBtn, submitting && styles.disabled]}
              onPress={handleSubmit}
              disabled={submitting}>
              {submitting ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.submitText}>Submit Report</Text>
              )}
            </Pressable>
          </View>
        </Card>

        {reports.map((report) => (
          <Card key={report.id} style={styles.reportCard}>
            <View style={styles.reportHead}>
              <Pill tone="gold">{report.type}</Pill>
              {report.status ? <Text style={styles.reportStatus}>{report.status}</Text> : null}
            </View>
            <Text style={styles.reportBody}>{report.description}</Text>
            {report.photoUrl ? (
              <Image source={{ uri: report.photoUrl }} style={styles.preview} />
            ) : null}
            <View style={styles.meta}>
              <Text style={styles.metaText}>{report.timeLabel ?? 'Just now'}</Text>
              <Text style={styles.metaText}>✓ Sent to FTS</Text>
            </View>
          </Card>
        ))}
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
  sectionLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: DriverColors.ink,
    marginBottom: 8,
    marginTop: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  rowBorder: {
    borderTopWidth: 1,
    borderTopColor: DriverColors.line,
  },
  rowLabel: {
    flex: 1,
    fontSize: 13,
    color: DriverColors.ink,
    paddingRight: 12,
  },
  switch: {
    width: 45,
    height: 26,
    borderRadius: 15,
    backgroundColor: '#d8d3c8',
    padding: 3,
    justifyContent: 'center',
  },
  switchOn: {
    backgroundColor: DriverColors.green,
    alignItems: 'flex-end',
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: DriverColors.ink,
    marginBottom: 7,
    marginTop: 8,
  },
  typeRow: {
    marginBottom: 8,
  },
  typeChip: {
    borderWidth: 1,
    borderColor: DriverColors.line,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    backgroundColor: '#fff',
  },
  typeChipActive: {
    backgroundColor: DriverColors.green,
    borderColor: DriverColors.green,
  },
  typeChipText: {
    fontSize: 12,
    color: DriverColors.ink,
  },
  typeChipTextActive: {
    color: '#fff',
    fontWeight: '700',
  },
  textarea: {
    minHeight: 100,
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
    height: 140,
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
  submitBtn: {
    flex: 1,
    backgroundColor: DriverColors.green,
    borderRadius: 14,
    minHeight: 47,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitText: {
    color: '#fff',
    fontWeight: '800',
  },
  disabled: {
    opacity: 0.7,
  },
  reportCard: {
    borderLeftWidth: 4,
    borderLeftColor: DriverColors.gold,
  },
  reportHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  reportStatus: {
    fontSize: 11,
    fontWeight: '700',
    color: DriverColors.muted,
    textTransform: 'uppercase',
  },
  reportBody: {
    marginTop: 10,
    color: DriverColors.ink,
    fontSize: 13,
  },
  meta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  metaText: {
    color: DriverColors.muted,
    fontSize: 11,
  },
});
