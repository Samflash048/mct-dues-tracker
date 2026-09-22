import os
import django

# Connect to your Django settings
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from tracker.models import Student, Payment

def generate_blank_records():
    students = Student.objects.all()
    count_400 = 0
    count_500 = 0

    for student in students:
        # Generate 400L Unpaid Record
        _, created_400 = Payment.objects.get_or_create(
            student=student,
            academic_level=400,
            defaults={'amount_paid': 0.00, 'is_paid': False}
        )
        if created_400: count_400 += 1

        # Generate 500L Unpaid Record
        _, created_500 = Payment.objects.get_or_create(
            student=student,
            academic_level=500,
            defaults={'amount_paid': 0.00, 'is_paid': False}
        )
        if created_500: count_500 += 1

    print(f"✅ Generated {count_400} new 400L records.")
    print(f"✅ Generated {count_500} new 500L records.")

if __name__ == '__main__':
    generate_blank_records()