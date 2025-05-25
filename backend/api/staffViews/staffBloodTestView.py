from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json

from sql_scripts.staff_scripts import create_blood_test

@csrf_exempt
def create_blood_test_view(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            patient_id = data.get("patient_id")
            vitamins = data.get("vitamins")
            minerals = data.get("minerals")
            cholesterol = data.get("cholesterol")
            glucose = data.get("glucose")
            hemoglobin = data.get("hemoglobin")
            whiteBC = data.get("whiteBC")
            redBC = data.get("redBC")
            if not all([patient_id, cholesterol, glucose, hemoglobin, vitamins, minerals, whiteBC, redBC]):
                return JsonResponse({"success": False, "message": "All fields are required."}, status=400)
            create_blood_test(patient_id, vitamins, minerals, cholesterol, glucose, hemoglobin, whiteBC, redBC)
            return JsonResponse({"success": True, "message": "Blood test created."})
        except Exception as e:
            return JsonResponse({"success": False, "message": str(e)}, status=500)
    else:
        return JsonResponse({"success": False, "message": "Only POST allowed."}, status=405)
