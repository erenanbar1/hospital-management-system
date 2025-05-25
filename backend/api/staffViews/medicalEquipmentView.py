from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt


from sql_scripts.staff_scripts import get_equipment

@csrf_exempt
def get_equipment_view(request):
    if request.method == "GET":
        try:
            equipment = get_equipment()
            return JsonResponse({"success": True, "equipment": equipment})
        except Exception as e:
            return JsonResponse({"success": False, "message": str(e)}, status=500)
    else:
        return JsonResponse({"success": False, "message": "Only POST allowed."}, status=405)
    
    