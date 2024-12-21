from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProductViewSet, ChatbotAPIView ,RegisterView

router = DefaultRouter()
router.register(r'products', ProductViewSet, basename='product')

urlpatterns = [
    path('', include(router.urls)),  # CRUD API for products
    path('chatbot/', ChatbotAPIView.as_view(), name='chatbot'),  # Chatbot API
    path('users/register/',RegisterView.as_view(),name="user-register"),
]
