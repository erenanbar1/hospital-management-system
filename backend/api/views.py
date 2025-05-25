from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json

from "../sql_scripts/login.py" import login as login_func

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
            if result == "SUCCESS":
                return JsonResponse({"success": True, "message": "Login successful."})
            else:
                return JsonResponse({"success": False, "message": "Invalid credentials."}, status=401)
        except Exception as e:
            return JsonResponse({"success": False, "message": str(e)}, status=500)
    else:
        return JsonResponse({"success": False, "message": "Only POST allowed."}, status=405)
