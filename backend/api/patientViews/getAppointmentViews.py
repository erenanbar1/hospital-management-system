from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

import sys
import os

# Add sql_scripts to sys.path and import login and register
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../sql_scripts')))

from sql_scripts.getAppointment import get_appointments_for_patient

@csrf_exempt
def get_appointments_view(request, patient_id):
    if request.method == "GET":
        if not patient_id:
            return JsonResponse({"success": False, "message": "Patient ID is required."}, status=400)
        try:
            # Replace this with whatever logic you need to fetch the appointments
            appointments = get_appointments_for_patient(patient_id)
            return JsonResponse({"success": True, "appointments": appointments})
        except Exception as e:
            return JsonResponse({"success": False, "message": str(e)}, status=500)

    else:
        return JsonResponse({"success": False, "message": "Method not allowed."}, status=405)

from sql_scripts.getDoctorAppointment import get_appointments_for_doctor

@csrf_exempt
def getDoctorAppointments(request, doc_id):
    if request.method == "GET":
        if not doc_id:
            return JsonResponse({"success": False, "message": "Doctor ID is required."}, status=400)
        try:
            appointments = get_appointments_for_doctor(doc_id)
            return JsonResponse({"success": True, "appointments": appointments})
        except Exception as e:
            return JsonResponse({"success": False, "message": str(e)}, status=500)
    else:
        return JsonResponse({"success": False, "message": "Method not allowed."}, status=405)