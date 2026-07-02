import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useAppStore } from '@/store/appStore';
import { reviewsAPI } from '@/api/services';

export function ReviewScreen({ route, navigation }: any) {
  const { serviceId } = route.params;
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const { currentUser, addReview } = useAppStore();

  const handleSubmitReview = async () => {
    if (rating === 0) {
      Alert.alert('تنبيه', 'الرجاء اختيار التقييم');
      return;
    }

    try {
      setLoading(true);
      const review = {
        serviceId,
        clientId: currentUser?.id || '',
        clientName: currentUser?.name || 'مستخدم مجهول',
        rating,
        comment,
        verified: false,
      };

      const created = await reviewsAPI.create(review);
      addReview(created);

      Alert.alert('شكراً', 'تم إضافة تقييمك بنجاح');
      navigation.goBack();
    } catch (error) {
      Alert.alert('خطأ', 'فشل إضافة التقييم');
    } finally {
      setLoading(false);
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
        <Text style={styles.title}>أضف تقييماً</Text>
        <Text style={styles.subtitle}>شارك تجربتك مع خدماتنا</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>التقييم</Text>
        <View style={styles.ratingContainer}>
          {[1, 2, 3, 4, 5].map((star) => (
            <TouchableOpacity
              key={star}
              onPress={() => setRating(star)}
              style={styles.starButton}
            >
              <Text
                style={[
                  styles.star,
                  star <= rating && styles.starFilled,
                ]}
              >
                ★
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={styles.ratingLabel}>
          {rating > 0 ? `تقييمك: ${rating} من 5 نجوم` : 'لم يتم اختيار تقييم'}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>تعليقك</Text>
        <TextInput
          style={styles.commentInput}
          placeholder="شارك رأيك وملاحظاتك (اختياري)"
          multiline
          numberOfLines={6}
          value={comment}
          onChangeText={setComment}
          textAlignVertical="top"
          placeholderTextColor="#999"
        />
      </View>

      <TouchableOpacity
        style={styles.submitButton}
        onPress={handleSubmitReview}
      >
        <Text style={styles.submitButtonText}>إرسال التقييم</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.cancelButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.cancelButtonText}>إلغاء</Text>
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
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
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
    marginBottom: 16,
  },
  ratingContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 16,
  },
  starButton: {
    padding: 8,
  },
  star: {
    fontSize: 40,
    color: '#DDD',
  },
  starFilled: {
    color: '#FFD700',
  },
  ratingLabel: {
    textAlign: 'center',
    fontSize: 14,
    color: '#666',
  },
  commentInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#2C2C2C',
  },
  submitButton: {
    marginHorizontal: 20,
    marginVertical: 10,
    paddingVertical: 16,
    backgroundColor: '#D4A574',
    borderRadius: 12,
    alignItems: 'center',
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
  },
  cancelButton: {
    marginHorizontal: 20,
    marginVertical: 10,
    marginBottom: 30,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#D4A574',
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#D4A574',
  },
});
