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

from api.views import user_login, user_registration, make_appointment_view, filter_doctors_by_dept_view, list_available_timeslots_of_doctor_view, doctor_declare_unavailability_view, get_patient_balance_view, get_patient_balance_view, give_feedback_view

from api.patientViews.healthCardViews import get_health_card_view
from api.staffViews.staffBloodTestView import create_blood_test_view, create_prescripton_view, prescribe_medication_view
from api.staffViews.medicalEquipmentView import get_equipment_view
from api.staffViews.createEquipmentView import create_equipment_view
from api.staffViews.staffTestResultsView import get_patient_blood_tests_view, update_blood_test_results_view, get_recent_blood_tests_view

from api.patientViews.getAppointmentViews import get_appointments_view, getDoctorAppointments


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/login/', user_login, name='user_login'),

    path('api/register/', user_registration, name='user_registration'),

    path('api/make_appointment/', make_appointment_view, name='make_appointment'),
    path('api/create_blood_test/', create_blood_test_view, name='create_blood_test'),
    path('api/equipment/', get_equipment_view, name='get_equipment'),
    path('api/create_equipment/', create_equipment_view, name='create_equipment'),
    path('api/create_prescription/', create_prescripton_view, name='create_prescription'),
    path('api/prescribe_medication/', prescribe_medication_view, name='prescribe_medication'),
    path('api/get_appointments/<str:patient_id>/', get_appointments_view),
    path('api/get_health_card/<str:patient_id>/', get_health_card_view),
    path('api/get_doctor_appointments/<str:doc_id>/', getDoctorAppointments),
    path('api/get_patient_balance/<str:patient_id>/', get_patient_balance_view, name='get_patient_balance'),
    path('api/filter_doctors_by_dept/', filter_doctors_by_dept_view, name='filter_doctors_by_dept'),
    path('api/list_available_timeslots_of_doctor/', list_available_timeslots_of_doctor_view, name='list_available_timeslots_of_doctor'),
    path('api/doctor_declare_unavailability/', doctor_declare_unavailability_view, name='doctor_declare_unavailability'),
    path('api/get_patient_blood_tests/<str:patient_id>/', get_patient_blood_tests_view, name='get_patient_blood_tests'),
    path('api/update_blood_test_results/', update_blood_test_results_view, name='update_blood_test_results'),
    path('api/get_recent_blood_tests/', get_recent_blood_tests_view, name='get_recent_blood_tests'),
    path('api/give_feedback/', give_feedback_view, name='give_feedback'),

]


