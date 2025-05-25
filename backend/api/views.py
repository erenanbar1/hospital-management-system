from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
import sys
import os

# Add sql_scripts to sys.path and import login, register, and filter_doctors_by_dept
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../sql_scripts')))
from login import login as login_func
from registration import register as register_func
from make_appointment import make_appointment as make_appointment_func
from filter_doctors_by_dept import filter_doctors_by_dept as filter_doctors_by_dept_func
from list_available_timeslots_of_doctor import list_available_timeslots_of_doctor as list_timeslots_func
from doctor_declare_unavailability import declare_unavailability


@csrf_exempt
def user_login(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            email = data.get("email")
            password = data.get("password")
            if not email or not password:
                return JsonResponse({"success": False, "message": "Email and password required."}, status=400)
            result = login_func(email, password)

            if result:
                u_id, role, name, surname = result
                return JsonResponse({
                    "success": True, 
                    "message": "Login successful.", 
                    "u_id": u_id, 
                    "role": role,
                    "name": name,
                    "surname": surname
                })
            else:
                return JsonResponse({"success": False, "message": "Invalid credentials."}, status=401)
        except Exception as e:
            return JsonResponse({"success": False, "message": str(e)}, status=500)
    else:
        return JsonResponse({"success": False, "message": "Only POST allowed."}, status=405)


@csrf_exempt
def user_registration(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            name = data.get("name")
            surname = data.get("surname")
            email = data.get("email")
            password = data.get("password")
            phone = data.get("phone")
            if not all([name, surname, email, password, phone]):
                return JsonResponse({"success": False, "message": "All fields are required."}, status=400)
            u_id, hc_id = register_func(name, surname, email, password, phone)
            return JsonResponse({
                "success": True,
                "message": "Registration successful.",
                "u_id": u_id,
                "hc_id": hc_id
            })
        except Exception as e:
            return JsonResponse({"success": False, "message": str(e)}, status=500)
    else:
        return JsonResponse({"success": False, "message": "Only POST allowed."}, status=405)


@csrf_exempt
def make_appointment_view(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            patient_id = data.get("patient_id")
            doc_id = data.get("doc_id")
            ts_id = data.get("ts_id")
            date = data.get("date")
            if not all([patient_id, doc_id, ts_id, date]):
                return JsonResponse({"success": False, "message": "All fields are required."}, status=400)
            make_appointment_func(patient_id, doc_id, ts_id, date)
            return JsonResponse({"success": True, "message": "Appointment created."})
        except Exception as e:
            return JsonResponse({"success": False, "message": str(e)}, status=500)
    else:
        return JsonResponse({"success": False, "message": "Only POST allowed."}, status=405)


@csrf_exempt
def filter_doctors_by_dept_view(request):
    if request.method == "GET":
        dept_name = request.GET.get("dept_name")
        if not dept_name:
            return JsonResponse({"success": False, "message": "Department name is required."}, status=400)
        try:
            doctors = filter_doctors_by_dept_func(dept_name)
            return JsonResponse({"success": True, "doctors": doctors})
        except Exception as e:
            return JsonResponse({"success": False, "message": str(e)}, status=500)
    else:
        return JsonResponse({"success": False, "message": "Only GET allowed."}, status=405)


@csrf_exempt
def list_available_timeslots_of_doctor_view(request):
    if request.method == "GET":
        doc_id = request.GET.get("doc_id")
        date = request.GET.get("date")
        if not doc_id or not date:
            return JsonResponse({"success": False, "message": "Doctor ID and date are required."}, status=400)
        try:
            timeslots = list_timeslots_func(doc_id, date)
            return JsonResponse({"success": True, "timeslots": timeslots})
        except Exception as e:
            return JsonResponse({"success": False, "message": str(e)}, status=500)
    else:
        return JsonResponse({"success": False, "message": "Only GET allowed."}, status=405)


@csrf_exempt
def doctor_declare_unavailability_view(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            ts_id = data.get("ts_id")
            doc_id = data.get("doc_id")
            date = data.get("date")
            if not all([ts_id, doc_id, date]):
                return JsonResponse({"success": False, "message": "All fields are required."}, status=400)
            ua_id = declare_unavailability(ts_id, doc_id, date)
            return JsonResponse({"success": True, "message": "Unavailability declared.", "ua_id": ua_id})
        except Exception as e:
            return JsonResponse({"success": False, "message": str(e)}, status=500)
    else:
        return JsonResponse({"success": False, "message": "Only POST allowed."}, status=405)


