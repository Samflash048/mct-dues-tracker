from rest_framework import serializers
from .models import Student, Payment

class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = ['id', 'academic_level', 'amount_paid', 'is_paid']

class StudentSerializer(serializers.ModelSerializer):
    payments = PaymentSerializer(many=True, read_only=True, source='payment_set')

    class Meta:
        model = Student
        fields = ['id', 'reg_number', 'full_name', 'payments']