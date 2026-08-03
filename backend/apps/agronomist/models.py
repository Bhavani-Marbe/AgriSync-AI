import uuid
from django.db import models
from django.conf import settings

class AgronomistConversation(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='agronomist_conversations'
    )
    title = models.CharField(max_length=255, default='Agronomy Advisory Session')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-updated_at']

    def __str__(self):
        return f"{self.user.email} - {self.title}"

class AgronomistMessage(models.Model):
    SENDER_CHOICES = [
        ('USER', 'User / Farmer'),
        ('ASSISTANT', 'AI Agronomist')
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    conversation = models.ForeignKey(
        AgronomistConversation,
        on_delete=models.CASCADE,
        related_name='messages'
    )
    sender = models.CharField(max_length=20, choices=SENDER_CHOICES)
    content = models.TextField()
    suggested_actions = models.JSONField(default=list, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['created_at']

    def __str__(self):
        return f"{self.sender}: {self.content[:40]}..."
