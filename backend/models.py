from datetime import datetime
from config import db



# class UserType:
#     STUDENT = 'student'
#     HOST = 'host'

class GenderPreference:
    MALE = 'male'
    FEMALE = 'female'
    ANY = 'any'

class BookingStatus:
    PENDING = 'pending'
    CONFIRMED = 'confirmed'
    CANCELLED = 'cancelled'

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100))
    email = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.Text, nullable=False)
    phone = db.Column(db.String(20))
    university = db.Column(db.String(150))
    course = db.Column(db.String(150))
    bio = db.Column(db.Text)
    

class City(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), unique=True, nullable=False)

class University(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(150), nullable=False)
    city_id = db.Column(db.Integer, db.ForeignKey('city.id'), nullable=False)
    city = db.relationship('City', backref=db.backref('universities', lazy=True))

class Hostel(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100))
    description = db.Column(db.Text)
    address = db.Column(db.Text)
    city_id = db.Column(db.Integer, db.ForeignKey('city.id'))
    university_id = db.Column(db.Integer, db.ForeignKey('university.id'))
    host_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    total_rooms = db.Column(db.Integer)
    price_per_month = db.Column(db.Float)
    gender_preference = db.Column(db.String(10))
    available_rooms = db.Column(db.Integer)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Booking(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('user.id'))  # Keep as student_id if that's in your database
    hostel_id = db.Column(db.Integer, db.ForeignKey('hostel.id'))
    check_in_date = db.Column(db.Date)  # Keep as check_in_date if that's in your database
    check_out_date = db.Column(db.Date)  # Keep as check_out_date if that's in your database
    total_price = db.Column(db.Float)
    room_type = db.Column(db.String(10))
    # If status is not in your database, don't include it here
  # Added status field
class Wishlist(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    hostel_id = db.Column(db.Integer, db.ForeignKey('hostel.id'), nullable=False)
    