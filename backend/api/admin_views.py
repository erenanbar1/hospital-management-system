from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
import json
from api.admin_functions import get_all_users, get_system_stats, delete_user, create_user, update_user, get_all_departments

@csrf_exempt
def admin_users_view(request):
    """Handle users endpoint - GET for list, POST for create"""
    if request.method == 'GET':
        try:
            users = get_all_users()
            return JsonResponse({
                'success': True,
                'users': users
            })
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': str(e)
            }, status=500)
    
    elif request.method == 'POST':
        try:
            data = json.loads(request.body)
            
            # Required fields
            required = ['name', 'surname', 'email', 'password', 'phone', 'role']
            for field in required:
                if field not in data:
                    return JsonResponse({
                        'success': False,
                        'message': f'Missing required field: {field}'
                    }, status=400)
            
            # Create user
            user_id = create_user(
                name=data['name'],
                surname=data['surname'],
                email=data['email'],
                password=data['password'],
                phone=data['phone'],
                role=data['role'],
                specialization=data.get('specialization'),
                price=data.get('price'),
                department=data.get('department'),
                balance=data.get('balance')
            )
            
            if user_id:
                return JsonResponse({
                    'success': True,
                    'message': 'User created successfully',
                    'user_id': user_id
                })
            else:
                return JsonResponse({
                    'success': False,
                    'message': 'Failed to create user'
                }, status=400)
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': str(e)
            }, status=500)

@csrf_exempt
def admin_user_detail_view(request, user_id):
    """Handle single user endpoint - DELETE for delete, PUT for update"""
    if request.method == 'DELETE':
        try:
            success = delete_user(user_id)
            if success:
                return JsonResponse({
                    'success': True,
                    'message': 'User deleted successfully'
                })
            else:
                return JsonResponse({
                    'success': False,
                    'message': 'Failed to delete user'
                }, status=400)
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': str(e)
            }, status=500)
    
    elif request.method == 'PUT':
        try:
            data = json.loads(request.body)
            
            # Update user
            success = update_user(user_id, **data)
            
            if success:
                return JsonResponse({
                    'success': True,
                    'message': 'User updated successfully'
                })
            else:
                return JsonResponse({
                    'success': False,
                    'message': 'Failed to update user'
                }, status=400)
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': str(e)
            }, status=500)

@csrf_exempt
@require_http_methods(["GET"])
def admin_stats_view(request):
    """Get system statistics"""
    try:
        stats = get_system_stats()
        return JsonResponse({
            'success': True,
            'stats': stats
        })
    except Exception as e:
        return JsonResponse({
            'success': False,
            'message': str(e)
        }, status=500)

@csrf_exempt
@require_http_methods(["GET"])
def admin_departments_view(request):
    """Get all departments"""
    try:
        departments = get_all_departments()
        return JsonResponse({
            'success': True,
            'departments': departments
        })
    except Exception as e:
        return JsonResponse({
            'success': False,
            'message': str(e)
        }, status=500) 