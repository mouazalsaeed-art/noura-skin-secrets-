import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
  TextInput,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import { useAppStore } from '@/store/appStore';
import { appointmentsAPI, servicesAPI } from '@/api/services';
import { Service, Appointment } from '@/types';

export function BookingScreen({ navigation }: any) {
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState('');
  const { addAppointment, currentUser } = useAppStore();

  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
  ];

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      const data = await servicesAPI.getAll();
      setServices(data);
    } catch (error) {
      Alert.alert('خطأ', 'فشل تحميل الخدمات');
    } finally {
      setLoading(false);
    }
  };

  const handleBookAppointment = async () => {
    if (!selectedService || !selectedDate || !selectedTime) {
      Alert.alert('تنبيه', 'الرجاء ملء جميع الحقول المطلوبة');
      return;
    }

    try {
      const appointment: Omit<Appointment, 'id'> = {
        serviceId: selectedService.id,
        serviceName: selectedService.name,
        date: selectedDate,
        time: selectedTime,
        status: 'pending',
        notes,
        price: selectedService.price,
      };

      const created = await appointmentsAPI.create(appointment);
      addAppointment(created);

      Alert.alert('نجاح', 'تم حجز الموعد بنجاح');
      navigation.navigate('Appointments');
    } catch (error) {
      Alert.alert('خطأ', 'فشل حجز الموعد');
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#D4A574" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>احجز موعدك</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>اختر الخدمة</Text>
        <FlatList
          data={services}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.serviceOption,
                selectedService?.id === item.id && styles.serviceOptionSelected,
              ]}
              onPress={() => setSelectedService(item)}
            >
              <View>
                <Text style={styles.serviceOptionName}>{item.name}</Text>
                <Text style={styles.serviceOptionPrice}>${item.price}</Text>
              </View>
              <View style={styles.radio}>
                {selectedService?.id === item.id && (
                  <View style={styles.radioSelected} />
                )}
              </View>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
        />
      </View>

      {selectedService && (
        <>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>اختر التاريخ</Text>
            <Calendar
              onDayPress={(day) => setSelectedDate(day.dateString)}
              markedDates={{
                [selectedDate]: { selected: true, selectedColor: '#D4A574' },
              }}
              minDate={new Date().toISOString().split('T')[0]}
              style={styles.calendar}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>اختر الوقت</Text>
            <View style={styles.timeGrid}>
              {timeSlots.map((time) => (
                <TouchableOpacity
                  key={time}
                  style={[
                    styles.timeSlot,
                    selectedTime === time && styles.timeSlotSelected,
                  ]}
                  onPress={() => setSelectedTime(time)}
                >
                  <Text
                    style={[
                      styles.timeSlotText,
                      selectedTime === time && styles.timeSlotTextSelected,
                    ]}
                  >
                    {time}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>ملاحظات إضافية (اختياري)</Text>
            <TextInput
              style={styles.notesInput}
              placeholder="أضف أي ملاحظات أو طلبات خاصة"
              multiline
              numberOfLines={4}
              value={notes}
              onChangeText={setNotes}
              textAlignVertical="top"
              placeholderTextColor="#999"
            />
          </View>

          <TouchableOpacity
            style={styles.bookButton}
            onPress={handleBookAppointment}
          >
            <Text style={styles.bookButtonText}>تأكيد الحجز</Text>
          </TouchableOpacity>
        </>
      )}
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
  section: {
    padding: 20,
    backgroundColor: '#FFF',
    marginHorizontal: 10,
    marginVertical: 10,
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C2C2C',
    marginBottom: 12,
  },
  serviceOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#F5F5F5',
  },
  serviceOptionSelected: {
    backgroundColor: '#F0E6D8',
  },
  serviceOptionName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2C2C2C',
    marginBottom: 4,
  },
  serviceOptionPrice: {
    fontSize: 14,
    color: '#D4A574',
    fontWeight: '600',
  },
  radio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#D4A574',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioSelected: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#D4A574',
  },
  calendar: {
    marginVertical: 12,
  },
  timeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  timeSlot: {
    flex: 1,
    minWidth: '22%',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
  timeSlotSelected: {
    backgroundColor: '#D4A574',
    borderColor: '#D4A574',
  },
  timeSlotText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#2C2C2C',
  },
  timeSlotTextSelected: {
    color: '#FFF',
  },
  notesInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#2C2C2C',
    marginTop: 8,
  },
  bookButton: {
    marginHorizontal: 20,
    marginVertical: 30,
    paddingVertical: 16,
    backgroundColor: '#D4A574',
    borderRadius: 12,
    alignItems: 'center',
  },
  bookButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
  },
});
