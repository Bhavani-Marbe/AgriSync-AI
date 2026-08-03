import os
import logging
from google import genai
from .models import AgronomistConversation, AgronomistMessage
from apps.farms.models import Farm

logger = logging.getLogger('apps.agronomist')

class AgronomistService:
    @staticmethod
    def chat_with_agronomist(user, message_text, conversation_id=None):
        logger.info(f"Agronomist query received from User [{user.email}]: {message_text[:50]}...")

        if conversation_id:
            conversation = AgronomistConversation.objects.filter(id=conversation_id, user=user).first()
        else:
            conversation = None

        if not conversation:
            title = message_text[:35] if len(message_text) > 35 else message_text
            conversation = AgronomistConversation.objects.create(user=user, title=title)

        # Save user message
        AgronomistMessage.objects.create(
            conversation=conversation,
            sender='USER',
            content=message_text
        )

        # Build context from user's active farms
        user_farms = Farm.objects.filter(owner=user, is_active=True).prefetch_related('fields')
        farm_context = []
        for farm in user_farms:
            crops = [f.current_crop for f in farm.fields.all() if f.current_crop]
            farm_context.append(f"Farm: {farm.name} ({farm.location_name}), Active Crops: {', '.join(crops) if crops else 'None'}")

        context_str = "\n".join(farm_context) if farm_context else "No active farm context registered."

        system_prompt = f"""You are the AgriSync AI Chief Agronomist and Soil Scientist.
Farmer Profile: {user.first_name} {user.last_name} ({user.email}).
Registered Farm Context:
{context_str}

Provide scientific, actionable, clear agricultural advice regarding soil chemistry, NPK fertigation, irrigation schedules, pest management, and crop rotations. Focus on practical steps."""

        reply_text = "To maintain optimal crop health, monitor soil moisture levels using drip sensor nodes and balance NPK fertilizers according to crop growth stage requirements."
        suggested_actions = [
            "Check soil moisture levels in Farms view",
            "Generate ML crop recommendation",
            "Upload leaf image for pathology diagnosis"
        ]

        api_key = os.environ.get('GEMINI_API_KEY')
        if api_key:
            try:
                client = genai.Client(api_key=api_key)
                response = client.models.generate_content(
                    model='gemini-3.6-flash',
                    contents=message_text,
                    config={
                        'system_instruction': system_prompt
                    }
                )
                if response.text:
                    reply_text = response.text
            except Exception as e:
                logger.warning(f"Gemini Agronomist API fallback: {e}")

        # Save AI assistant message
        assistant_msg = AgronomistMessage.objects.create(
            conversation=conversation,
            sender='ASSISTANT',
            content=reply_text,
            suggested_actions=suggested_actions
        )

        conversation.save()  # update timestamp
        return conversation, assistant_msg
