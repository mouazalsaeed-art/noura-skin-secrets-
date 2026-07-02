import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useAppStore } from '@/store/appStore';
import { appointmentsAPI } from '@/api/services';
import { Appointment } from '@/types';

export function AppointmentsScreen({ navigation }: any) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'completed'>(
    'upcoming'
  );
  const { appointments: storeAppointments } = useAppStore();

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    try {
      setLoading(true);
      const data = await appointmentsAPI.getAll();
      setAppointments(data);
    } catch (error) {
      console.error('Failed to load appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredAppointments = () => {
    const now = new Date();
    return appointments.filter((apt) => {
      if (filter === 'upcoming') {
        return apt.status === 'confirmed' || apt.status === 'pending';
      }
      if (filter === 'completed') {
        return apt.status === 'completed' || apt.status === 'cancelled';
      }
      return true;
    });
  };

  const handleCancelAppointment = (appointmentId: string) => {
    Alert.alert('إلغاء الموعد', 'هل أنت متأكد من رغبتك في إلغاء هذا الموعد؟', [
      { text: 'إلغاء', onPress: () => {} },
      {
        text: 'نعم، ألغِ',
        onPress: async () => {
          try {
            await appointmentsAPI.cancel(appointmentId);
            setAppointments(
              appointments.map((apt) =>
                apt.id === appointmentId
                  ? { ...apt, status: 'cancelled' }
                  : apt
              )
            );
            Alert.alert('نجاح', 'تم إلغاء الموعد');
          } catch (error) {
            Alert.alert('خطأ', 'فشل إلغاء الموعد');
          }
        },
      },
    ]);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return '#4CAF50';
      case 'pending':
        return '#FF9800';
      case 'completed':
        return '#2196F3';
      case 'cancelled':
        return '#F44336';
      default:
        return '#999';
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: { [key: string]: string } = {
      confirmed: 'مؤكد',
      pending: 'قيد الانتظار',
      completed: 'مكتمل',
      cancelled: 'ملغى',
    };
    return labels[status] || status;
  };

  const renderAppointmentCard = ({ item }: { item: Appointment }) => (
    <View style={styles.appointmentCard}>
      <View style={styles.appointmentHeader}>
        <View>
          <Text style={styles.appointmentService}>{item.serviceName}</Text>
          <Text style={styles.appointmentDateTime}>
            {item.date} - {item.time}
          </Text>
        </View>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor(item.status) },
          ]}
        >
          <Text style={styles.statusText}>{getStatusLabel(item.status)}</Text>
        </View>
      </View>

      {item.notes && (
        <Text style={styles.appointmentNotes}>ملاحظات: {item.notes}</Text>
      )}

      <View style={styles.appointmentFooter}>
        <Text style={styles.appointmentPrice}>${item.price}</Text>
        {(item.status === 'pending' || item.status === 'confirmed') && (
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => handleCancelAppointment(item.id)}
            >
              <Text style={styles.cancelButtonText}>إلغاء</Text>
            </TouchableOpacity>
            {item.status === 'confirmed' && (
              <TouchableOpacity
                style={styles.editButton}
                onPress={() =>
                  navigation.navigate('EditAppointment', {
                    appointmentId: item.id,
                  })
                }
              >
                <Text style={styles.editButtonText}>تعديل</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
        {item.status === 'completed' && (
          <TouchableOpacity
            style={styles.reviewButton}
            onPress={() =>
              navigation.navigate('AddReview', { serviceId: item.serviceId })
            }
          >
            <Text style={styles.reviewButtonText}>أضف تقييم</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  const filteredAppointments = getFilteredAppointments();

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#D4A574" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>مواعيدي</Text>
      </View>

      <View style={styles.filterContainer}>
        {(['all', 'upcoming', 'completed'] as const).map((f) => (
          <TouchableOpacity
            key={f}
            style={[
              styles.filterButton,
              filter === f && styles.filterButtonActive,
            ]}
            onPress={() => setFilter(f)}
          >
            <Text
              style={[
                styles.filterButtonText,
                filter === f && styles.filterButtonTextActive,
              ]}
            >
              {f === 'all'
                ? 'الكل'
                : f === 'upcoming'
                ? 'القادمة'
                : 'المكتملة'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {filteredAppointments.length === 0 ? (
        <View style={[styles.container, styles.centerContent]}>
          <Text style={styles.emptyText}>لا توجد مواعيد</Text>
        </View>
      ) : (
        <FlatList
          data={filteredAppointments}
          renderItem={renderAppointmentCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.appointmentsList}
        />
      )}
    </View>
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
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 16,
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#D4A574',
  },
  filterButtonActive: {
    backgroundColor: '#D4A574',
  },
  filterButtonText: {
    color: '#D4A574',
    fontWeight: '500',
    fontSize: 12,
  },
  filterButtonTextActive: {
    color: '#FFF',
  },
  appointmentsList: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  appointmentCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  appointmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  appointmentService: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C2C2C',
    marginBottom: 4,
  },
  appointmentDateTime: {
    fontSize: 13,
    color: '#666',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
  },
  appointmentNotes: {
    fontSize: 12,
    color: '#666',
    marginBottom: 12,
    fontStyle: 'italic',
  },
  appointmentFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  appointmentPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#D4A574',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  cancelButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#F44336',
  },
  cancelButtonText: {
    color: '#F44336',
    fontWeight: '500',
    fontSize: 12,
  },
  editButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#D4A574',
  },
  editButtonText: {
    color: '#FFF',
    fontWeight: '500',
    fontSize: 12,
  },
  reviewButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#2196F3',
  },
  reviewButtonText: {
    color: '#FFF',
    fontWeight: '500',
    fontSize: 12,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
});
