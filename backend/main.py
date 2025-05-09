from flask import request, jsonify
from models import User, Booking, Hostel, Wishlist
from flask import Flask
from flask_cors import CORS
from sqlalchemy import inspect, or_, and_
from config import app, db
from datetime import datetime
import google.generativeai as genai
import os

# Configure the Gemini API
GEMINI_API_KEY = "AIzaSyBE-kz6gPz2GPXmvY27CqsetOuhsPmEH0Y"  # Replace with your actual API key
genai.configure(api_key=GEMINI_API_KEY)

# Set up the model
generation_config = {
    "temperature": 0.7,
    "top_p": 0.95,
    "top_k": 40,
    "max_output_tokens": 1024,
}

safety_settings = [
    {
        "category": "HARM_CATEGORY_HARASSMENT",
        "threshold": "BLOCK_MEDIUM_AND_ABOVE"
    },
    {
        "category": "HARM_CATEGORY_HATE_SPEECH",
        "threshold": "BLOCK_MEDIUM_AND_ABOVE"
    },
    {
        "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT",
        "threshold": "BLOCK_MEDIUM_AND_ABOVE"
    },
    {
        "category": "HARM_CATEGORY_DANGEROUS_CONTENT",
        "threshold": "BLOCK_MEDIUM_AND_ABOVE"
    },
]

model = genai.GenerativeModel(
    model_name="gemini-2.0-flash",
    generation_config=generation_config,
    safety_settings=safety_settings
)

@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    print("in register")
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'error': 'Email already exists'}), 400
    new_user = User(
        name=data['name'],
        email=data['email'],
        password=data['password'],
        phone="",
        university="",
        course="",
        bio="",
    )
    db.session.add(new_user)
    db.session.commit()
    return jsonify({'message': 'User registered successfully'}), 201

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(email=data.get('email')).first()
    if user and user.password == data.get('password'):
        return jsonify({
            'message': 'Login successful',
            'user': {
                'id': user.id,
                'name': user.name,
                'email': user.email,
                'phone': user.phone,
                'university': user.university,
                'course': user.course,
                'bio': user.bio
            }
        }), 200
    return jsonify({'error': 'Invalid email or password'}), 401

@app.route('/api/user/<int:user_id>', methods=['GET'])
def get_user(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    return jsonify({
        'user': {
            'id': user.id,
            'name': user.name,
            'email': user.email,
            'phone': user.phone,
            'university': user.university,
            'course': user.course,
            'bio': user.bio
        }
    }), 200

@app.route('/api/user/<int:user_id>', methods=['PUT'])
def update_user(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    data = request.get_json()
    
    # Update user fields
    user.name = data.get('name', user.name)
    user.phone = data.get('phone', user.phone)
    user.university = data.get('university', user.university)
    user.course = data.get('course', user.course)
    user.bio = data.get('bio', user.bio)
    
    try:
        db.session.commit()
        return jsonify({
            'message': 'User profile updated successfully',
            'user': {
                'id': user.id,
                'name': user.name,
                'email': user.email,
                'phone': user.phone,
                'university': user.university,
                'course': user.course,
                'bio': user.bio
            }
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to update user profile'}), 500

@app.route('/api/bookings', methods=['GET'])
def get_all_bookings():
    try:
        # Fetch all bookings from the database
        bookings = Booking.query.all()
        
        bookings_data = []
        for booking in bookings:
            # Get the hostel name
            hostel = Hostel.query.get(booking.hostel_id)
            hostel_name = hostel.name if hostel else "Unknown Hostel"
            
            # Get the user name
            user = User.query.get(booking.student_id)
            user_name = user.name if user else "Unknown User"
            
            # Format the booking data
            booking_data = {
                'id': booking.id,
                'user_id': booking.student_id,
                'user_name': user_name,
                'hostel_id': booking.hostel_id,
                'hostel_name': hostel_name,
                'check_in': booking.check_in_date.strftime('%Y-%m-%d'),
                'check_out': booking.check_out_date.strftime('%Y-%m-%d'),
                'room_type': booking.room_type,
                'total_price': booking.total_price,
                'status': 'Confirmed'  # Default status if not in database
            }
            bookings_data.append(booking_data)
        
        return jsonify({'bookings': bookings_data}), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/bookings', methods=['POST'])
def create_booking():
    try:
        data = request.get_json()
        required_fields = ['user_id', 'hostel_id', 'room_type', 'check_in', 'check_out', 'total_price']
        
        # Validate required fields
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Missing required field: {field}'}), 400
        
        # Convert string dates to datetime objects
        try:
            check_in = datetime.strptime(data['check_in'], '%Y-%m-%d')
            check_out = datetime.strptime(data['check_out'], '%Y-%m-%d')
        except ValueError:
            return jsonify({'error': 'Invalid date format. Use YYYY-MM-DD'}), 400
        
        # Validate check-in and check-out dates
        if check_in >= check_out:
            return jsonify({'error': 'Check-out date must be after check-in date'}), 400
        
        if check_in.date() < datetime.now().date():
            return jsonify({'error': 'Check-in date cannot be in the past'}), 400
        
        # Verify user exists
        user = User.query.get(data['user_id'])
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        # Create new booking using the actual database column names
        new_booking = Booking(
            student_id=data['user_id'],  # Use student_id if that's what's in your database
            hostel_id=data['hostel_id'],
            room_type=data['room_type'],
            check_in_date=check_in,      # Use check_in_date if that's what's in your database
            check_out_date=check_out,    # Use check_out_date if that's what's in your database
            total_price=data['total_price']
        )
        
        db.session.add(new_booking)
        db.session.commit()
        
        # Get hostel name for response
        hostel = Hostel.query.get(data['hostel_id'])
        hostel_name = hostel.name if hostel else "Unknown Hostel"
        
        return jsonify({
            'message': 'Booking created successfully',
            'booking': {
                'id': new_booking.id,
                'hostel_name': hostel_name,
                'check_in': check_in.strftime('%Y-%m-%d'),
                'check_out': check_out.strftime('%Y-%m-%d'),
                'room_type': new_booking.room_type,
                'total_price': new_booking.total_price,
                'status': 'Confirmed'  # Assuming status is not in your actual database
            }
        }), 201
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@app.route('/api/wishlist', methods=['POST'])
def add_to_wishlist():
    try:
        data = request.get_json()
        
        # Validate required fields
        
        # Check if user exists
        user = User.query.get(data['student_id'])
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        # Check if hostel exists
        # hostel = Hostel.query.get(data['hostel_id'])
        # if not hostel:
        #     return jsonify({'error': 'Hostel not found'}), 404
        
        # Check if already in wishlist
        existing_wishlist = Wishlist.query.filter_by(
            student_id=data['student_id'], 
            hostel_id=data['hostel_id']
        ).first()
        
        if existing_wishlist:
            # If entry exists and we want to remove it
            if data.get('remove', False):
                db.session.delete(existing_wishlist)
                db.session.commit()
                return jsonify({'message': 'Hostel removed from wishlist'}), 200
            else:
                return jsonify({'message': 'Hostel already in wishlist'}), 200
        
        # Create new wishlist entry
        new_wishlist = Wishlist(
            student_id=data['student_id'],
            hostel_id=data['hostel_id']
        )
        
        db.session.add(new_wishlist)
        db.session.commit()
        
        return jsonify({
            'message': 'Hostel added to wishlist successfully',
            'wishlist_item': {
                'id': new_wishlist.id,
                'student_id': new_wishlist.student_id,
                'hostel_id': new_wishlist.hostel_id,
                'created_at': new_wishlist.created_at.strftime('%Y-%m-%d %H:%M:%S')
            }
        }), 201
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@app.route('/api/wishlist/<int:student_id>', methods=['GET'])
def get_wishlist(student_id):
    try:
        # Check if user exists
        user = User.query.get(student_id)
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        # Get all wishlist items for the user
        wishlist_items = Wishlist.query.filter_by(student_id=student_id).all()
        
        wishlist_data = []
        for item in wishlist_items:
            hostel = Hostel.query.get(item.hostel_id)
            if hostel:
                # Format the hostel data similar to your HostelCard component
                hostel_data = {
                    'id': hostel.id,
                    'name': hostel.name,
                    'description': hostel.description,
                    'address': hostel.address,
                    'price_per_month': hostel.price_per_month,
                    'gender_preference': hostel.gender_preference,
                    'available_rooms': hostel.available_rooms,
                    'total_rooms': hostel.total_rooms,
                    'wishlist_id': item.id,
                    'added_on': item.created_at.strftime('%Y-%m-%d %H:%M:%S')
                }
                wishlist_data.append(hostel_data)
        
        return jsonify({
            'wishlist': wishlist_data,
            'count': len(wishlist_data)
        }), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/bookings/<int:booking_id>', methods=['DELETE'])
def delete_booking(booking_id):
    try:
        # Find the booking by ID
        booking = Booking.query.get(booking_id)
        
        # Check if booking exists
        if not booking:
            return jsonify({'error': 'Booking not found'}), 404
        
        # Delete the booking
        db.session.delete(booking)
        db.session.commit()
        
        return jsonify({'message': 'Booking deleted successfully'}), 200
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# Add the Gemini AI chat endpoint
@app.route('/api/chat', methods=['POST'])
def chat():
    try:
        data = request.get_json()
        user_message = data.get('message', '')
        history = data.get('history', [])
        
        if not user_message:
            return jsonify({'error': 'No message provided'}), 400
        
        # Create a system prompt to define the assistant's behavior
        system_prompt = """
        You are HostelMate AI, a helpful assistant for a student accommodation platform.
        Your role is to help students find suitable hostels and PGs near universities across Pakistan.
        
        You can:
        - Answer questions about student accommodations, hostels, and PGs
        - Provide information about different cities and universities in Pakistan
        - Offer advice on what to look for in student accommodations
        - Explain the booking process on HostelMate
        - Suggest amenities that are important for student living
        
        Keep your responses friendly, concise, and focused on helping students find the right accommodation.
        If you don't know something, be honest about it.
        
        Do not:
        - Make up specific hostel listings that don't exist in our database
        - Provide personal opinions on which specific hostel is "best"
        - Share any personal information about users
        - Discuss topics unrelated to student accommodation or education
        """
        
        # Format the conversation history for the model
        formatted_prompt = system_prompt + "\n\n"
        
        # Add the conversation history
        for msg in history:
            if msg["role"] == "user":
                formatted_prompt += f"User: {msg['content']}\n"
            else:
                formatted_prompt += f"Assistant: {msg['content']}\n"
        
        # Add the current user message
        formatted_prompt += f"User: {user_message}\nAssistant:"
        
        # Generate a response using Gemini
        response = model.generate_content(formatted_prompt)
        
        # Return the AI response
        return jsonify({
            'response': response.text
        }), 200
    
    except Exception as e:
        print(f"Error in chat endpoint: {str(e)}")
        return jsonify({'error': str(e), 'response': 'Sorry, I encountered an error. Please try again later.'}), 500


if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(debug=True)
