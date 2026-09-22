from rest_framework import viewsets
from .models import Student
from .serializers import StudentSerializer

class StudentViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Student.objects.prefetch_related('payment_set').all().order_by('full_name')  
    serializer_class = StudentSerializer