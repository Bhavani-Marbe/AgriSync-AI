from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import AgronomistConversation
from .serializers import (
    AgronomistConversationSerializer,
    AgronomistChatInputSerializer,
    AgronomistMessageSerializer
)
from .services import AgronomistService

class AgronomistViewSet(viewsets.ModelViewSet):
    serializer_class = AgronomistConversationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return AgronomistConversation.objects.filter(user=self.request.user)

    @action(detail=False, methods=['post'], url_path='chat')
    def chat(self, request):
        serializer = AgronomistChatInputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        message_text = serializer.validated_data['message']
        conv_id = serializer.validated_data.get('conversationId')

        conversation, assistant_msg = AgronomistService.chat_with_agronomist(
            user=request.user,
            message_text=message_text,
            conversation_id=conv_id
        )

        return Response({
            'conversationId': str(conversation.id),
            'reply': assistant_msg.content,
            'suggestedActions': assistant_msg.suggested_actions,
            'createdAt': assistant_msg.created_at.isoformat()
        }, status=status.HTTP_200_OK)
