from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import StudentViewSet, verify_reg_number, verify_access_code

router = DefaultRouter()
router.register(r'students', StudentViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('auth/verify-reg/', verify_reg_number, name='verify_reg'),
    path('auth/verify-code/', verify_access_code, name='verify_access'),
]