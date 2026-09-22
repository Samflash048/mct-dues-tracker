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