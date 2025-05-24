from django.urls import path
from . import views

urlpatterns = [
    path('register/patient/', views.register_patient, name='register_patient'),
    path('login/', views.login, name='login'),
    path('doctors/available/', views.list_available_doctors, name='list_available_doctors'),
    path('appointments/book/', views.book_appointment, name='book_appointment'),
] 