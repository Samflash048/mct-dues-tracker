from django.db import models

class Student(models.Model):
    reg_number = models.CharField(max_length=20, unique=True)
    full_name = models.CharField(max_length=150)

    def __str__(self):
        return self.full_name

class Payment(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    academic_level = models.IntegerField()
    amount_paid = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    is_paid = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.student.reg_number} - {self.academic_level}L"

# New code added to the models.py file
import secrets
import string

class AcademicSession(models.Model):
    name = models.CharField(max_length=100, unique=True)
    is_active = models.BooleanField(default=False)

    def __str__(self):
        return self.name

class Course(models.Model):
    SEMESTER_CHOICES = ((1, 'First Semester'), (2, 'Second Semester'))
    LEVEL_CHOICES = (
        (100, '100 Level'), (200, '200 Level'), 
        (300, '300 Level'), (400, '400 Level'), 
        (500, '500 Level')
    )
    code = models.CharField(max_length=10, unique=True)
    title = models.CharField(max_length=150)
    unit_load = models.IntegerField()
    level = models.IntegerField(choices=LEVEL_CHOICES)
    semester = models.IntegerField(choices=SEMESTER_CHOICES)

    def __str__(self):
        return f"{self.code} - {self.title}"

class Result(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='results')
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='results')
    session = models.ForeignKey(AcademicSession, on_delete=models.CASCADE,)
    score = models.FloatField(null=True, blank=True)
    grade = models.CharField(max_length=2, null=True, blank=True)

class AccessCode(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='access_codes')
    session = models.ForeignKey(AcademicSession, on_delete=models.CASCADE,)
    code = models.CharField(max_length=10, unique=True, blank=True)

    class Meta:
        unique_together = ('student', 'session')

    def save(self, *args, **kwargs):
        if not self.code:
            alphabet = string.ascii_uppercase + string.digits
            self.code = ''.join(secrets.choice(alphabet) for i in range(6))
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.student.reg_number} - {self.session.name} - {self.code}"