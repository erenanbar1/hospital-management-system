from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json

from sql_scripts.staff_scripts import create_blood_test, create_prescription_script, prescribe_medication_script

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



@csrf_exempt
def create_prescripton_view(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            patient_id = data.get("patient_id")
            doc_id = data.get("doctor_id")
            usage = data.get("usage")
            if not all([patient_id, doc_id, usage]):
                return JsonResponse({"success": False, "message": "All fields are required."}, status=400)
            presc_id = create_prescription_script(patient_id, doc_id, usage)
            return JsonResponse({"success": True, "prescription": presc_id})
        except Exception as e:
            return JsonResponse({"success": False, "message": str(e)}, status=500)
    else:
        return JsonResponse({"success": False, "message": "Only POST allowed."}, status=405)
    
@csrf_exempt
def prescribe_medication_view(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            prescription = data.get("prescription")
            medicine = data.get("medicine")
            if not all([prescription, medicine]):
                return JsonResponse({"success": False, "message": "All fields are required."}, status=400)
            prescribe_medication_script(prescription, medicine)
            return JsonResponse({"success": True, "message": "Medication prescribed."})
        except Exception as e:
            return JsonResponse({"success": False, "message": str(e)}, status=500)
    else:
        return JsonResponse({"success": False, "message": "Only POST allowed."}, status=405)
      