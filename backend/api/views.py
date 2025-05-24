from django.shortcuts import render
from django.db import connection
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.db import transaction

# Create your views here.

@api_view(['POST'])
def register_patient(request):
    try:
        with transaction.atomic():
            with connection.cursor() as cursor:
                # Insert into user table
                cursor.execute("""
                    INSERT INTO user (u_id, name, surname, email_address, password, phone_no) 
                    VALUES (%s, %s, %s, %s, %s, %s)
                    RETURNING u_id
                """, [
                    request.data['u_id'],
                    request.data['name'],
                    request.data['surname'],
                    request.data['email'],
                    request.data['password'],
                    request.data.get('phone_no')
                ])
                u_id = cursor.fetchone()[0]

                # Create health card
                cursor.execute("""
                    INSERT INTO health_card (hc_id)
                    VALUES (%s)
                    RETURNING hc_id
                """, [request.data['hc_id']])
                hc_id = cursor.fetchone()[0]

                # Insert into patient table
                cursor.execute("""
                    INSERT INTO patient (u_id, hc_id, balance)
                    VALUES (%s, %s, 0)
                """, [u_id, hc_id])

        return Response({'message': 'Patient registered successfully'}, status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def login(request):
    with connection.cursor() as cursor:
        cursor.execute("""
            (SELECT u.u_id, u.name, u.surname, 'patient' AS role
            FROM user u
            NATURAL JOIN patient p
            WHERE u.email_address = %s AND u.password = %s)
            UNION
            (SELECT u.u_id, u.name, u.surname, 'doctor' AS role
            FROM user u
            NATURAL JOIN doctor d
            WHERE u.email_address = %s AND u.password = %s)
            UNION
            (SELECT u.u_id, u.name, u.surname, 'staff' AS role
            FROM user u
            NATURAL JOIN staff s
            WHERE u.email_address = %s AND u.password = %s)
            UNION
            (SELECT u.u_id, u.name, u.surname, 'admin' AS role
            FROM user u
            NATURAL JOIN admin a
            WHERE u.email_address = %s AND u.password = %s)
        """, [
            request.data['email'], request.data['password'],
            request.data['email'], request.data['password'],
            request.data['email'], request.data['password'],
            request.data['email'], request.data['password']
        ])
        row = cursor.fetchone()
        
        if row:
            return Response({
                'u_id': row[0],
                'name': row[1],
                'surname': row[2],
                'role': row[3]
            })
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['GET'])
def list_available_doctors(request):
    date = request.query_params.get('date')
    time_slot = request.query_params.get('time_slot')
    
    with connection.cursor() as cursor:
        cursor.execute("""
            SELECT d.u_id, u.name, u.surname
            FROM doctor d
            JOIN user u ON d.u_id = u.u_id
            WHERE NOT EXISTS (
                SELECT *
                FROM appointment a
                WHERE a.doc_id = d.u_id 
                AND a.date = %s 
                AND a.ts_id = %s
            )
            AND NOT EXISTS (
                SELECT *
                FROM unavailability un
                WHERE un.doc_id = d.u_id 
                AND un.date = %s 
                AND un.ts_id = %s
            )
        """, [date, time_slot, date, time_slot])
        
        columns = [col[0] for col in cursor.description]
        doctors = [dict(zip(columns, row)) for row in cursor.fetchall()]
        
        return Response(doctors)

@api_view(['POST'])
def book_appointment(request):
    try:
        with transaction.atomic():
            with connection.cursor() as cursor:
                # Check if slot is available
                cursor.execute("""
                    SELECT ts.ts_id
                    FROM time_slot ts
                    WHERE ts.ts_id = %s 
                    AND ts.ts_id NOT IN (
                        SELECT a1.ts_id 
                        FROM appointment a1
                        WHERE a1.doc_id = %s AND a1.date = %s
                        UNION
                        SELECT unav.ts_id
                        FROM unavailability unav
                        WHERE unav.doc_id = %s AND unav.date = %s
                    )
                """, [
                    request.data['ts_id'],
                    request.data['doc_id'],
                    request.data['date'],
                    request.data['doc_id'],
                    request.data['date']
                ])
                
                if not cursor.fetchone():
                    return Response(
                        {'error': 'Time slot not available'},
                        status=status.HTTP_400_BAD_REQUEST
                    )

                # Book the appointment
                cursor.execute("""
                    INSERT INTO appointment (patient_id, doc_id, ts_id, date)
                    VALUES (%s, %s, %s, %s)
                """, [
                    request.data['patient_id'],
                    request.data['doc_id'],
                    request.data['ts_id'],
                    request.data['date']
                ])

                # Update patient balance
                cursor.execute("""
                    UPDATE patient
                    SET balance = balance - (
                        SELECT price
                        FROM doctor
                        WHERE u_id = %s
                    )
                    WHERE u_id = %s
                """, [request.data['doc_id'], request.data['patient_id']])

        return Response({'message': 'Appointment booked successfully'})
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
