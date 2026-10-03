import csv
from django.core.management.base import BaseCommand
from tracker.models import Result, Student, Course, AcademicSession

class Command(BaseCommand):
    help = 'Bulk import student results from a CSV file'

    def add_arguments(self, parser):
        parser.add_argument('csv_file', type=str, help='Path to the CSV file')
        parser.add_argument('session_name', type=str, help='Academic session (e.g., 2022-2023)')

    def handle(self, *args, **kwargs):
        csv_file = kwargs['csv_file']
        session_name = kwargs['session_name']

        # Get or create the academic session
        session, _ = AcademicSession.objects.get_or_create(name=session_name)

        with open(csv_file, 'r') as file:
            reader = csv.DictReader(file)
            for row in reader:
                course_code = row['course_code'].strip()
                reg_number = row['reg_number'].strip()
                score = row['score'].strip()
                grade = row['grade'].strip()

                # Get or create the course
                course, _ = Course.objects.get_or_create(
                    code=course_code, 
                    defaults={'title': 'To be updated', 'unit_load': 2, 'level': 200, 'semester': 1}
                )
                
                # Verify the student exists before attaching a result
                try:
                    student = Student.objects.get(reg_number=reg_number)
                except Student.DoesNotExist:
                    self.stdout.write(self.style.WARNING(f"Skipped {reg_number}: Student not found in database."))
                    continue

                # Create or update the academic result
                Result.objects.update_or_create(
                    student=student,
                    course=course,
                    session=session,
                    defaults={'score': score, 'grade': grade}
                )
        
        self.stdout.write(self.style.SUCCESS(f"Successfully imported {course_code} results!"))