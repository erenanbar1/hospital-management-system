from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

from sql_scripts.healthCardScript import get_health_card_of_patient


@csrf_exempt
def get_health_card_view(request, patient_id):
    if request.method == "GET":
        if not patient_id:
            return JsonResponse({"success": False, "message": "Patient ID is required."}, status=400)
        try:
            healthCard = get_health_card_of_patient(patient_id)
            return JsonResponse({"success": True, "healthCard": healthCard})
        except Exception as e:
            return JsonResponse({"success": False, "message": str(e)}, status=500)

    else:
        return JsonResponse({"success": False, "message": "Method not allowed."}, status=405)
