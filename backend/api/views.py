import uuid
from rest_framework.permissions import AllowAny
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.db.models import Q
from django.conf import settings
from .models import Product, ChatSession, Message
from .serializers import ProductSerializer, ChatSessionSerializer, MessageSerializer
import google.generativeai as genai
from django.contrib.auth.models import User

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

class ChatbotAPIView(APIView):
    def __init__(self):
        super().__init__()
        # Configure Gemini
        genai.configure(api_key=settings.GEMINI_API_KEY)
        self.model = genai.GenerativeModel('gemini-pro')

    def get_product_context(self, query):
        """Get relevant product information from database"""
        products = Product.objects.filter(
            Q(name__icontains=query) | 
            Q(description__icontains=query)
        )
        
        # Get all products if no specific matches found
        if not products.exists():
            products = Product.objects.all()
        
        return "\n".join([
            f"Product: {p.name}\n"
            f"Description: {p.description}\n"
            f"Price: ${p.price}\n"
            f"Stock: {p.stock} units\n"
            for p in products
        ])

    def get_conversation_history(self, session):
        """Get recent conversation history"""
        recent_messages = Message.objects.filter(session=session).order_by('-created_at')[:5]
        history = []
        for msg in reversed(recent_messages):
            history.extend([
                f"User: {msg.user_message}",
                f"Assistant: {msg.bot_response}" if msg.bot_response else ""
            ])
        return "\n".join(history)

    def post(self, request):
        user = request.user
        message = request.data.get('message', '')
        session_id = request.data.get('session_id', None)

        if not message:
            return Response(
                {"error": "Message is required"}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        # Create or get session
        if not session_id:
            session_id = str(uuid.uuid4())
            session = ChatSession.objects.create(user=user, session_id=session_id)
        else:
            session = ChatSession.objects.get(session_id=session_id)

        # Get product context and conversation history
        product_context = self.get_product_context(message)
        conversation_history = self.get_conversation_history(session)

        # Prepare prompt for Gemini
        prompt = f"""
        You are an e-commerce assistant. Use the following product information and conversation history to provide helpful responses.
        
        Available Products:
        {product_context}

        Recent Conversation:
        {conversation_history}

        Please provide specific product recommendations when relevant, including prices and stock information.
        If asked about products not in the database, politely explain that you can only provide information about available products.
        
        Current User Message: {message}
        """

        try:
            # Get response from Gemini
            response = self.model.generate_content(prompt)
            bot_response = response.text
        except Exception as e:
            bot_response = (
                "I apologize, but I'm having trouble processing your request. "
                "Please try again in a moment."
            )
            print(f"Gemini API Error: {str(e)}")

        # Save the conversation
        Message.objects.create(
            session=session,
            user_message=message,
            bot_response=bot_response
        )

        return Response({
            "session_id": session_id,
            "user_message": message,
            "bot_response": bot_response
        })

class RegisterView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        email = request.data.get('email')

        if not username or not password or not email:
            return Response(
                {'error': 'Missing fields'}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        if User.objects.filter(username=username).exists():
            return Response(
                {'error': 'Username already exists'}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        user = User.objects.create_user(
            username=username,
            password=password,
            email=email
        )
        
        return Response(
            {'message': 'User registered successfully.', 'user_id': user.id}, 
            status=status.HTTP_201_CREATED
        )