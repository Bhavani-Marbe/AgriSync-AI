from rest_framework import serializers
from .models import AgronomistConversation, AgronomistMessage

class AgronomistMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = AgronomistMessage
        fields = ['id', 'sender', 'content', 'suggested_actions', 'created_at']

class AgronomistConversationSerializer(serializers.ModelSerializer):
    messages = AgronomistMessageSerializer(many=True, read_only=True)

    class Meta:
        model = AgronomistConversation
        fields = ['id', 'title', 'created_at', 'updated_at', 'messages']

class AgronomistChatInputSerializer(serializers.Serializer):
    message = serializers.CharField(max_length=2000)
    conversationId = serializers.UUIDField(required=False, allow_null=True)
