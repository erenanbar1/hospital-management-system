import os
import psycopg2
import personalSettings
import uuid

# Path to the SQL template
SQL_PATH = os.path.abspath(
    os.path.join(os.path.dirname(__file__), '..', 'sql', 'give_feedback.sql')
)

def generate_feedback_id():
    """Generate a unique 5-character ID for feedback"""
    return 'F' + str(uuid.uuid4())[:4].upper()

def give_feedback(patient_id: str, doc_id: str, rating: float, comment: str = None):
    """
    Inserts feedback for a doctor from a patient.
    Returns the feedback ID on success, raises exception on failure.
    
    Parameters:
        patient_id: The ID of the patient giving feedback
        doc_id: The ID of the doctor receiving feedback
        rating: A number from 1 to 5 (can have one decimal place)
        comment: Optional feedback comment text
    """
    # Validate input
    if not patient_id or not doc_id:
        raise ValueError("Patient ID and Doctor ID are required")
    
    if rating is None or not (1.0 <= float(rating) <= 5.0):
        raise ValueError("Rating must be between 1.0 and 5.0")
    
    # Generate a feedback ID
    f_id = generate_feedback_id()
    
    # Read the SQL template
    with open(SQL_PATH, 'r') as f:
        sql = f.read()

    # Connect to database
    conn = psycopg2.connect(
        dbname=personalSettings.tableName,
        user=personalSettings.dbUser,
        password=personalSettings.dbPassword,
        host="localhost",
        port=personalSettings.dbPort
    )
    
    try:
        with conn:
            with conn.cursor() as cur:
                # First verify that the patient has had an appointment with this doctor
                cur.execute(
                    "SELECT COUNT(*) FROM appointment WHERE patient_id = %s AND doc_id = %s",
                    (patient_id, doc_id)
                )
                appointment_count = cur.fetchone()[0]
                
                if appointment_count == 0:
                    raise ValueError("Patient has no appointments with this doctor")
                
                # Execute feedback insert
                cur.execute(sql, {
                    'f_id': f_id,
                    'patient_id': patient_id,
                    'doc_id': doc_id,
                    'rating': float(rating),
                    'comment': comment
                })
                
                # Update doctor's average rating
                cur.execute(
                    """
                    UPDATE doctor 
                    SET rating = (
                        SELECT AVG(rating) 
                        FROM feedback 
                        WHERE doc_id = %s
                    )
                    WHERE u_id = %s
                    """,
                    (doc_id, doc_id)
                )
                
        return f_id
    finally:
        conn.close()

# For command-line testing
if __name__ == "__main__":
    import argparse
    
    parser = argparse.ArgumentParser(description="Submit feedback for a doctor")
    parser.add_argument('patient_id', help="Patient ID")
    parser.add_argument('doctor_id', help="Doctor ID")
    parser.add_argument('rating', type=float, help="Rating (1.0-5.0)")
    parser.add_argument('--comment', help="Feedback comment (optional)")
    
    args = parser.parse_args()
    
    try:
        f_id = give_feedback(
            args.patient_id, args.doctor_id, args.rating, args.comment
        )
        print(f"✅ Feedback submitted successfully with ID: {f_id}")
    except Exception as e:
        print(f"❌ Failed to submit feedback: {e}")