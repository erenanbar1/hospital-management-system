"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path

from api.views import user_login, user_registration, make_appointment_view, filter_doctors_by_dept_view, list_available_timeslots_of_doctor_view, doctor_declare_unavailability_view

from api.patientViews.healthCardViews import get_health_card_view

from api.patientViews.getAppointmentViews import get_appointments_view, getDoctorAppointments


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/login/', user_login, name='user_login'),

    path('api/register/', user_registration, name='user_registration'),

    path('api/make_appointment/', make_appointment_view, name='make_appointment'),
    path('api/get_appointments/<str:patient_id>/', get_appointments_view),
    path('api/get_health_card/<str:patient_id>/', get_health_card_view),
    path('api/get_doctor_appointments/<str:doc_id>/', getDoctorAppointments),
    path('api/filter_doctors_by_dept/', filter_doctors_by_dept_view, name='filter_doctors_by_dept'),
    path('api/list_available_timeslots_of_doctor/', list_available_timeslots_of_doctor_view, name='list_available_timeslots_of_doctor'),
    path('api/doctor_declare_unavailability/', doctor_declare_unavailability_view, name='doctor_declare_unavailability'),
]


