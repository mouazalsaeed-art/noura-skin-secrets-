import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  FlatList,
  Alert,
  TextInput,
} from 'react-native';
import { useAppStore } from '@/store/appStore';
import { clientAPI } from '@/api/services';
import { ClientProfile } from '@/types';

export function ProfileScreen({ navigation }: any) {
  const currentUser = useAppStore((state) => state.currentUser);
  const setCurrentUser = useAppStore((state) => state.setCurrentUser);
  const logout = useAppStore((state) => state.logout);
  const [editMode, setEditMode] = useState(false);
  const [profileData, setProfileData] = useState<Partial<ClientProfile>>({});

  useEffect(() => {
    if (currentUser) {
      setProfileData(currentUser);
    }
  }, [currentUser]);

  const handleSaveProfile = async () => {
    try {
      const updated = await clientAPI.updateProfile(profileData);
      setCurrentUser(updated);
      setEditMode(false);
      Alert.alert('نجاح', 'تم تحديث الملف الشخصي');
    } catch (error) {
      Alert.alert('خطأ', 'فشل تحديث الملف الشخصي');
    }
  };

  const handleLogout = () => {
    Alert.alert('تسجيل الخروج', 'هل أنت متأكد من رغبتك في تسجيل الخروج؟', [
      { text: 'إلغاء', onPress: () => {} },
      {
        text: 'تسجيل الخروج',
        onPress: () => {
          logout();
          navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
        },
      },
    ]);
  };

  if (!currentUser) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text>لم يتم تحميل البيانات</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>ملفي الشخصي</Text>
      </View>

      <View style={styles.profileSection}>
        <Image
          source={{
            uri: currentUser.image || 'https://via.placeholder.com/120',
          }}
          style={styles.profileImage}
        />
        <TouchableOpacity style={styles.editImageButton}>
          <Text style={styles.editImageText}>تغيير الصورة</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>البيانات الشخصية</Text>
          <TouchableOpacity onPress={() => setEditMode(!editMode)}>
            <Text style={styles.editButton}>
              {editMode ? 'إلغاء' : 'تعديل'}
            </Text>
          </TouchableOpacity>
        </View>

        {editMode ? (
          <View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>الاسم</Text>
              <TextInput
                style={styles.input}
                value={profileData.name}
                onChangeText={(value) =>
                  setProfileData({ ...profileData, name: value })
                }
                placeholder="الاسم الكامل"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>البريد الإلكتروني</Text>
              <TextInput
                style={styles.input}
                value={profileData.email}
                onChangeText={(value) =>
                  setProfileData({ ...profileData, email: value })
                }
                placeholder="البريد الإلكتروني"
                keyboardType="email-address"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>رقم الهاتف</Text>
              <TextInput
                style={styles.input}
                value={profileData.phone}
                onChangeText={(value) =>
                  setProfileData({ ...profileData, phone: value })
                }
                placeholder="رقم الهاتف"
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>نوع البشرة</Text>
              <TextInput
                style={styles.input}
                value={profileData.skinType}
                onChangeText={(value) =>
                  setProfileData({ ...profileData, skinType: value })
                }
                placeholder="نوع البشرة"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>الحساسيات</Text>
              <TextInput
                style={styles.input}
                value={profileData.allergies}
                onChangeText={(value) =>
                  setProfileData({ ...profileData, allergies: value })
                }
                placeholder="الحساسيات المعروفة"
                multiline
              />
            </View>

            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSaveProfile}
            >
              <Text style={styles.saveButtonText}>حفظ التعديلات</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>الاسم</Text>
              <Text style={styles.value}>{currentUser.name}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>البريد الإلكتروني</Text>
              <Text style={styles.value}>{currentUser.email}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>رقم الهاتف</Text>
              <Text style={styles.value}>{currentUser.phone}</Text>
            </View>
            {currentUser.skinType && (
              <View style={styles.infoRow}>
                <Text style={styles.label}>نوع البشرة</Text>
                <Text style={styles.value}>{currentUser.skinType}</Text>
              </View>
            )}
            {currentUser.allergies && (
              <View style={styles.infoRow}>
                <Text style={styles.label}>الحساسيات</Text>
                <Text style={styles.value}>{currentUser.allergies}</Text>
              </View>
            )}
          </View>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>إحصائيات</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>
              {currentUser.appointments?.length || 0}
            </Text>
            <Text style={styles.statLabel}>المواعيد</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>${currentUser.totalSpent || 0}</Text>
            <Text style={styles.statLabel}>المنفق</Text>
          </View>
        </View>
      </View>

      <TouchableOpacity
        style={styles.logoutButton}
        onPress={handleLogout}
      >
        <Text style={styles.logoutButtonText}>تسجيل الخروج</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F7F4',
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2C2C2C',
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 12,
  },
  editImageButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#D4A574',
  },
  editImageText: {
    color: '#D4A574',
    fontWeight: '500',
  },
  section: {
    padding: 20,
    backgroundColor: '#FFF',
    marginHorizontal: 10,
    marginVertical: 10,
    borderRadius: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C2C2C',
  },
  editButton: {
    fontSize: 14,
    color: '#D4A574',
    fontWeight: '600',
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#2C2C2C',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#2C2C2C',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0E6D8',
  },
  value: {
    fontSize: 14,
    color: '#666',
  },
  saveButton: {
    marginTop: 12,
    paddingVertical: 12,
    backgroundColor: '#D4A574',
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  statCard: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 12,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#D4A574',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  logoutButton: {
    marginHorizontal: 20,
    marginVertical: 30,
    paddingVertical: 12,
    backgroundColor: '#FF6B6B',
    borderRadius: 8,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 16,
  },
});
