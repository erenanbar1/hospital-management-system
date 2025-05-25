from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json

from sql_scripts.staff_scripts import get_equipment, update_equipment

@csrf_exempt
def get_equipment_view(request):
    if request.method == "GET":
        try:
            equipment = get_equipment()
            return JsonResponse({"success": True, "equipment": equipment})
        except Exception as e:
            return JsonResponse({"success": False, "message": str(e)}, status=500)
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            equipment = data.get("equipment")
            amount = data.get("amount")
            if not all([equipment, amount]):
                return JsonResponse({"success": False, "message": "All fields are required."}, status=400)
            update_equipment(equipment, amount)
            return JsonResponse({"success": True, "message": "Equipment updated."})
        except Exception as e:
            return JsonResponse({"success": False, "message": str(e)}, status=500)
    else:
        return JsonResponse({"success": False, "message": "Only POST allowed."}, status=405)
    
    