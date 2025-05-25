from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json

from sql_scripts.staff_scripts import get_patient_blood_tests, update_blood_test_results, get_recent_blood_tests

@csrf_exempt
def get_patient_blood_tests_view(request, patient_id):
    """
    GET endpoint to retrieve all blood tests for a specific patient
    """
    if request.method == "GET":
        try:
            blood_tests = get_patient_blood_tests(patient_id)
            return JsonResponse({"success": True, "blood_tests": blood_tests})
        except Exception as e:
            return JsonResponse({"success": False, "message": str(e)}, status=500)
    else:
        return JsonResponse({"success": False, "message": "Only GET allowed."}, status=405)

@csrf_exempt
def update_blood_test_results_view(request):
    """
    POST endpoint to update blood test results
    """
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            bt_id = data.get("bt_id")
            vitamins = data.get("vitamins")
            minerals = data.get("minerals")
            cholesterol = data.get("cholesterol")
            glucose = data.get("glucose")
            hemoglobin = data.get("hemoglobin")
            whiteBC = data.get("whiteBC")
            redBC = data.get("redBC")
            test_date = data.get("test_date")  # Optional
            
            if not all([bt_id, vitamins, minerals, cholesterol, glucose, hemoglobin, whiteBC, redBC]):
                return JsonResponse({"success": False, "message": "All required fields must be provided."}, status=400)
            
            update_blood_test_results(bt_id, vitamins, minerals, cholesterol, glucose, hemoglobin, whiteBC, redBC, test_date)
            return JsonResponse({"success": True, "message": "Blood test results updated successfully."})
        except Exception as e:
            return JsonResponse({"success": False, "message": str(e)}, status=500)
    else:
        return JsonResponse({"success": False, "message": "Only POST allowed."}, status=405)

@csrf_exempt
def get_recent_blood_tests_view(request):
    """
    GET endpoint to retrieve recent blood tests for staff dashboard
    """
    if request.method == "GET":
        try:
            recent_tests = get_recent_blood_tests()
            return JsonResponse({"success": True, "recent_tests": recent_tests})
        except Exception as e:
            return JsonResponse({"success": False, "message": str(e)}, status=500)
    else:
        return JsonResponse({"success": False, "message": "Only GET allowed."}, status=405) 