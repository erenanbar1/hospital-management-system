from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json

from sql_scripts.admin_scripts import get_all_users, get_system_stats, get_all_departments, delete_user, update_user_role, create_user, update_user_details

@csrf_exempt
def get_all_users_view(request):
    """
    GET endpoint to retrieve all users in the system
    """
    if request.method == "GET":
        try:
            users = get_all_users()
            return JsonResponse({"success": True, "users": users})
        except Exception as e:
            return JsonResponse({"success": False, "message": str(e)}, status=500)
    else:
        return JsonResponse({"success": False, "message": "Only GET allowed."}, status=405)

@csrf_exempt
def get_system_stats_view(request):
    """
    GET endpoint to retrieve system statistics for admin dashboard
    """
    if request.method == "GET":
        try:
            stats = get_system_stats()
            return JsonResponse({"success": True, "stats": stats})
        except Exception as e:
            return JsonResponse({"success": False, "message": str(e)}, status=500)
    else:
        return JsonResponse({"success": False, "message": "Only GET allowed."}, status=405)

@csrf_exempt
def get_all_departments_view(request):
    """
    GET endpoint to retrieve all departments
    """
    if request.method == "GET":
        try:
            departments = get_all_departments()
            return JsonResponse({"success": True, "departments": departments})
        except Exception as e:
            return JsonResponse({"success": False, "message": str(e)}, status=500)
    else:
        return JsonResponse({"success": False, "message": "Only GET allowed."}, status=405)

@csrf_exempt
def delete_user_view(request, user_id):
    """
    DELETE endpoint to remove a user from the system
    """
    if request.method == "DELETE":
        try:
            delete_user(user_id)
            return JsonResponse({"success": True, "message": "User deleted successfully."})
        except Exception as e:
            return JsonResponse({"success": False, "message": str(e)}, status=500)
    else:
        return JsonResponse({"success": False, "message": "Only DELETE allowed."}, status=405)

@csrf_exempt
def update_user_role_view(request, user_id):
    """
    PUT endpoint to update a user's role
    """
    if request.method == "PUT":
        try:
            data = json.loads(request.body)
            new_role = data.get("role")
            
            if not new_role:
                return JsonResponse({"success": False, "message": "Role is required."}, status=400)
            
            if new_role.lower() not in ['patient', 'doctor', 'staff', 'admin']:
                return JsonResponse({"success": False, "message": "Invalid role."}, status=400)
            
            update_user_role(user_id, new_role)
            return JsonResponse({"success": True, "message": "User role updated successfully."})
        except Exception as e:
            return JsonResponse({"success": False, "message": str(e)}, status=500)
    else:
        return JsonResponse({"success": False, "message": "Only PUT allowed."}, status=405)

@csrf_exempt
def create_user_view(request):
    """
    POST endpoint to create a new user (admin only)
    """
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            name = data.get("name")
            surname = data.get("surname")
            email = data.get("email")
            password = data.get("password")
            phone = data.get("phone")
            role = data.get("role")
            if not all([name, surname, email, password, phone, role]):
                return JsonResponse({"success": False, "message": "All fields are required."}, status=400)
            new_uid = create_user(name, surname, email, password, phone, role)
            return JsonResponse({"success": True, "message": "User created successfully.", "u_id": new_uid})
        except Exception as e:
            return JsonResponse({"success": False, "message": str(e)}, status=500)
    else:
        return JsonResponse({"success": False, "message": "Only POST allowed."}, status=405)

@csrf_exempt
def update_user_details_view(request, user_id):
    """
    PUT endpoint to update user details (not role or ID)
    """
    if request.method == "PUT":
        try:
            data = json.loads(request.body)
            name = data.get("name")
            surname = data.get("surname")
            email = data.get("email")
            phone = data.get("phone")
            specialization = data.get("specialization")
            price = data.get("price")
            department = data.get("department")
            balance = data.get("balance")
            update_user_details(user_id, name, surname, email, phone, specialization, price, department, balance)
            return JsonResponse({"success": True, "message": "User details updated successfully."})
        except Exception as e:
            return JsonResponse({"success": False, "message": str(e)}, status=500)
    else:
        return JsonResponse({"success": False, "message": "Only PUT allowed."}, status=405) 