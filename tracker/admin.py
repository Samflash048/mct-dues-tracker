from django.contrib import admin
from .models import Student, Payment

@admin.register(Student)
class StudentAdmin(admin.ModelAdmin):
    list_display = ('full_name', 'reg_number')
    search_fields = ('full_name', 'reg_number')
    ordering = ('full_name',)


@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ('student', 'academic_level', 'amount_paid', 'is_paid')
    list_filter = ('academic_level', 'is_paid')
    search_fields = ('student__reg_number', 'student__full_name')
    ordering = ('student__full_name', 'academic_level')
