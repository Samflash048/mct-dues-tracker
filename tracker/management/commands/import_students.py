import csv
from django.core.management.base import BaseCommand
from tracker.models import Student

class Command(BaseCommand):
    help = 'Bulk import the student roster from a CSV file'

    def add_arguments(self, parser):
        parser.add_argument('csv_file', type=str, help='The path to the CSV file')

    def handle(self, *args, **kwargs):
        csv_file = kwargs['csv_file']

        try:
            with open(csv_file, mode='r', encoding='utf-8-sig') as file:
                reader = csv.DictReader(file)
                count = 0
                
                for row in reader:
                    # Look for columns named exactly 'full_name' and 'reg_number'
                    name = row.get('full_name', '').strip()
                    reg_no = row.get('reg_number', '').strip()

                    if reg_no:
                        # update_or_create ensures we don't create duplicates if you run it twice
                        student, created = Student.objects.update_or_create(
                            reg_number=reg_no,
                            defaults={'full_name': name}
                        )
                        count += 1

                self.stdout.write(self.style.SUCCESS(f'Successfully synced {count} students to the database!'))
                
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'Error: {str(e)}'))