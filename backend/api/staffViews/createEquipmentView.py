from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json

from sql_scripts.staff_scripts import create_equipment

@csrf_exempt
def create_equipment_view(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            name = data.get("name")
            format = data.get("format")
            amount = data.get("amount")
            
            if not all([name, format, amount]):
                return JsonResponse({"success": False, "message": "All fields are required."}, status=400)
            
            # Validate amount is a positive number
            try:
                amount_int = int(amount)
                if amount_int < 0:
                    return JsonResponse({"success": False, "message": "Amount must be a positive number."}, status=400)
            except ValueError:
                return JsonResponse({"success": False, "message": "Amount must be a valid number."}, status=400)
            
            equipment = create_equipment(name, format, amount)
            return JsonResponse({"success": True, "message": "Equipment created successfully.", "equipment": equipment})
        except Exception as e:
            return JsonResponse({"success": False, "message": str(e)}, status=500)
    else:
        return JsonResponse({"success": False, "message": "Only POST allowed."}, status=405) 