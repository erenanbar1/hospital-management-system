from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
<<<<<<< Updated upstream
<<<<<<< Updated upstream
import sys
import os

# Add sql_scripts to sys.path and import login and register
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../sql_scripts')))
from login import login as login_func
from registration import register as register_func
=======

from "../sql_scripts/login.py" import login as login_func
>>>>>>> Stashed changes
=======

from "../sql_scripts/login.py" import login as login_func
>>>>>>> Stashed changes

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
<<<<<<< Updated upstream
<<<<<<< Updated upstream
            if result:
=======
            if result == "SUCCESS":
>>>>>>> Stashed changes
=======
            if result == "SUCCESS":
>>>>>>> Stashed changes
                return JsonResponse({"success": True, "message": "Login successful."})
            else:
                return JsonResponse({"success": False, "message": "Invalid credentials."}, status=401)
        except Exception as e:
            return JsonResponse({"success": False, "message": str(e)}, status=500)
    else:
        return JsonResponse({"success": False, "message": "Only POST allowed."}, status=405)
<<<<<<< Updated upstream
<<<<<<< Updated upstream

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
=======
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
