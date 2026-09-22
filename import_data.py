import os
import django
import csv

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from tracker.models import Student, Payment

def load_csv(file_path, level):
    try:
        with open(file_path, mode='r', encoding='utf-8') as file:
            for row in csv.DictReader(file):
                student, _ = Student.objects.get_or_create(
                    reg_number=row['reg_number'], 
                    defaults={'full_name': row['full_name']}
                )
                
                is_paid = str(row['is_paid']).strip().lower() in ['yes', 'true', '1']
                
                Payment.objects.update_or_create(
                    student=student, 
                    academic_level=level,
                    defaults={'amount_paid': row['amount_paid'], 'is_paid': is_paid}
                )
        print(f"✅ Successfully imported {level}L records!")
    except Exception as e:
        print(f"❌ Error loading {level}L: {e}")

if __name__ == '__main__':
    load_csv('100L_cleaned.csv', 100)
    load_csv('300L_cleaned.csv', 300)