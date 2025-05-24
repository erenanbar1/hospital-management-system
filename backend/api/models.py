from django.db import models

# Create your models here.

class User(models.Model):
    u_id = models.CharField(max_length=5, primary_key=True)
    name = models.CharField(max_length=50)
    surname = models.CharField(max_length=50)
    email_address = models.EmailField(unique=True)
    password = models.CharField(max_length=15)
    phone_no = models.CharField(max_length=12, null=True)

    class Meta:
        db_table = 'user'

class HealthCard(models.Model):
    hc_id = models.CharField(max_length=5, primary_key=True)

    class Meta:
        db_table = 'health_card'

class Patient(models.Model):
    u_id = models.OneToOneField(User, primary_key=True, on_delete=models.CASCADE, db_column='u_id')
    hc_id = models.OneToOneField(HealthCard, on_delete=models.CASCADE, db_column='hc_id')
    balance = models.DecimalField(max_digits=8, decimal_places=2)

    class Meta:
        db_table = 'patient'

class Department(models.Model):
    d_id = models.CharField(max_length=5, primary_key=True)
    dept_name = models.CharField(max_length=15)
    employee_count = models.IntegerField()

    class Meta:
        db_table = 'department'

class Doctor(models.Model):
    u_id = models.OneToOneField(User, primary_key=True, on_delete=models.CASCADE, db_column='u_id')
    d_id = models.ForeignKey(Department, on_delete=models.CASCADE, db_column='d_id')
    rating = models.DecimalField(max_digits=2, decimal_places=1)
    price = models.DecimalField(max_digits=5, decimal_places=0)

    class Meta:
        db_table = 'doctor'

class TimeSlot(models.Model):
    ts_id = models.CharField(max_length=5, primary_key=True)
    start_time = models.TimeField()
    end_time = models.TimeField()

    class Meta:
        db_table = 'time_slot'

class Appointment(models.Model):
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, db_column='patient_id')
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE, db_column='doc_id')
    time_slot = models.ForeignKey(TimeSlot, on_delete=models.CASCADE, db_column='ts_id')
    date = models.DateField()

    class Meta:
        db_table = 'appointment'
        unique_together = ('patient', 'doctor', 'time_slot', 'date')

class Medication(models.Model):
    m_id = models.CharField(max_length=5, primary_key=True)
    name = models.CharField(max_length=50)
    format = models.CharField(max_length=20)
    dosage = models.DecimalField(max_digits=5, decimal_places=1)

    class Meta:
        db_table = 'medication'

class Prescription(models.Model):
    p_id = models.CharField(max_length=5, primary_key=True)
    hc_id = models.ForeignKey(HealthCard, on_delete=models.CASCADE, db_column='hc_id')
    doc_id = models.ForeignKey(Doctor, on_delete=models.CASCADE, db_column='doc_id')
    prescription_date = models.DateField()
    usage_info = models.CharField(max_length=100)

    class Meta:
        db_table = 'prescription'
