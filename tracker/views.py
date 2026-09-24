from rest_framework import viewsets
from .models import Student
from .serializers import StudentSerializer
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Student, AcademicSession, AccessCode

class StudentViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Student.objects.prefetch_related('payment_set').all().order_by('full_name')  
    serializer_class = StudentSerializer


@api_view(['POST'])
def verify_reg_number(request):
    reg_number = request.data.get('reg_number')
    try:
        student = Student.objects.get(reg_number__iexact=reg_number)
        return Response({
            "message": "Student found", 
            "name": student.full_name
        }, status=status.HTTP_200_OK)
    except Student.DoesNotExist:
        return Response({"error": "Student not found. Please check your Registration Number."}, status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
def verify_access_code(request):
    reg_number = request.data.get('reg_number')
    code = request.data.get('code')
    
    try:
        active_session = AcademicSession.objects.get(is_active=True)
    except AcademicSession.DoesNotExist:
        return Response({"error": "System error: No active academic session set by Admin."}, status=status.HTTP_400_BAD_REQUEST)
        
    try:
        student = Student.objects.get(reg_number__iexact=reg_number)
        access_record = AccessCode.objects.get(student=student, session=active_session)
        
        if access_record.code == code:
            return Response({
                "message": "Login successful",
                "student_id": student.id,
                "name": student.full_name,
                "session": active_session.name
            }, status=status.HTTP_200_OK)
        else:
            return Response({"error": "Invalid Session PIN. Please check the code and try again."}, status=status.HTTP_401_UNAUTHORIZED)
            
    except Student.DoesNotExist:
        return Response({"error": "Student not found."}, status=status.HTTP_404_NOT_FOUND)
    except AccessCode.DoesNotExist:
        return Response({"error": "No access code generated for you this session. See your Class Rep."}, status=status.HTTP_401_UNAUTHORIZED)