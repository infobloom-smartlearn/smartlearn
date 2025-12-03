"""
AI Tutor Router Module

Manages conversational AI interactions for the SmartLearn platform.
Enables students to have multi-turn conversations with an AI tutor
for personalized learning support and question answering.

Features:
- Create and manage tutor conversations
- Send and receive messages in conversations
- Track conversation history and metadata
- Support for AI response generation (via Celery tasks)

Endpoints:
- POST /api/ai-tutor/conversations - Create new conversation
- GET /api/ai-tutor/conversations - List user's conversations
- GET /api/ai-tutor/conversations/{conv_id} - Get conversation details
- GET /api/ai-tutor/conversations/{conv_id}/messages - List messages in conversation
- POST /api/ai-tutor/conversations/{conv_id}/messages - Post message to conversation

Dependencies:
- FastAPI for routing
- SQLAlchemy for async database operations
- Authentication for user-specific conversations
- Celery for async AI response generation (TODO)
"""

from fastapi import APIRouter, Depends, HTTPException, status
from typing import List, Optional
from uuid import UUID
from backend.app import schemas, models
from backend.app.db.session import get_db
from backend.app.core.deps import get_current_user
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from datetime import datetime

router = APIRouter()


@router.post("/conversations", response_model=schemas.ConversationRead, status_code=status.HTTP_201_CREATED)
async def create_conversation(
    payload: schemas.ConversationCreate,
    db: AsyncSession = Depends(get_db),
    user: models.User = Depends(get_current_user)
):
    """
    Create a new AI tutor conversation.
    
    Features:
    - Initialize new conversation session
    - Set conversation title/topic
    - Track conversation metadata
    - Associate with current user
    
    Request Body:
    - title: (required) Conversation title or topic
    - metadata: (optional) JSON object with additional context
      Example: {"topic": "Algebra", "difficulty": "intermediate"}
    
    Returns:
    - ConversationRead: Created conversation object with:
      * id - Unique conversation UUID
      * user_id - Associated user ID
      * title - Conversation title
      * metadata - Additional context
      * created_at - Creation timestamp
      * last_message_at - NULL (no messages yet)
    
    Authentication: Required (current_user)
    HTTP Status: 201 Created on success
    
    Notes:
    - Each conversation is separate and independent
    - Useful for organizing different tutoring topics
    - User can have multiple concurrent conversations
    - Messages can be added after conversation creation
    """
    # Create new conversation for current user
    conv = models.Conversation(
        user_id=user.id,
        title=payload.title,
        metadata=payload.metadata
    )
    
    # Add to session
    db.add(conv)
    await db.flush()
    
    # Commit transaction
    await db.commit()
    
    # Refresh to get all defaults
    await db.refresh(conv)
    
    return conv


@router.get("/conversations", response_model=List[schemas.ConversationRead])
async def list_conversations(
    db: AsyncSession = Depends(get_db),
    user: models.User = Depends(get_current_user)
):
    """
    List all conversations for the current user.
    
    Features:
    - Retrieve all tutor conversations
    - Ordered by most recent message
    - Includes conversation metadata and timestamps
    - Show last_message_at for quick scanning
    
    Returns:
    - List[ConversationRead]: All conversations, ordered by last_message_at DESC
      Each includes:
      * id - Conversation UUID
      * title - Conversation topic
      * metadata - Context about conversation
      * created_at - When conversation started
      * last_message_at - Timestamp of most recent message
    
    Authentication: Required (current_user)
    HTTP Status: 200 OK
    
    Notes:
    - Returns empty list if user has no conversations
    - Ordered by most recent first (last_message_at DESC)
    - Shows only current user's conversations
    - Used for conversation history sidebar in frontend
    """
    # Query all conversations for current user
    q = select(models.Conversation).where(
        models.Conversation.user_id == user.id
    ).order_by(models.Conversation.last_message_at.desc())
    
    # Execute and return all conversations
    res = await db.execute(q)
    return res.scalars().all()


@router.get("/conversations/{conv_id}", response_model=schemas.ConversationRead)
async def get_conversation(
    conv_id: UUID,
    db: AsyncSession = Depends(get_db),
    user: models.User = Depends(get_current_user)
):
    """
    Retrieve a specific conversation by ID.
    
    Features:
    - Get conversation details
    - Verify user owns conversation
    - Show metadata and timestamps
    
    Path Parameters:
    - conv_id: (required) UUID of conversation to retrieve
    
    Returns:
    - ConversationRead: Conversation object with:
      * id - Conversation UUID
      * title - Conversation title
      * metadata - Additional context
      * created_at - Creation timestamp
      * last_message_at - Most recent message timestamp
    
    Raises:
    - HTTPException (404): If conversation doesn't exist or user doesn't own it
    
    Authentication: Required (current_user)
    HTTP Status: 200 OK on success, 404 Not Found
    
    Security:
    - Verifies user owns conversation before returning
    - Prevents users from accessing others' conversations
    """
    # Query for conversation by ID
    q = select(models.Conversation).where(models.Conversation.id == conv_id)
    res = await db.execute(q)
    conv = res.scalar_one_or_none()
    
    # Return 404 if not found or doesn't belong to user
    if not conv or conv.user_id != user.id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Conversation with ID '{conv_id}' not found or access denied"
        )
    
    return conv


@router.get("/conversations/{conv_id}/messages", response_model=List[schemas.MessageRead])
async def list_messages(
    conv_id: UUID,
    limit: int = 50,
    after: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
    user: models.User = Depends(get_current_user)
):
    """
    Retrieve messages from a conversation with optional pagination.
    
    Features:
    - Get conversation message history
    - Pagination support via limit and after parameters
    - Filter by timestamp (get messages after specific time)
    - Ordered chronologically (oldest first)
    - Verify user owns conversation
    
    Path Parameters:
    - conv_id: (required) UUID of conversation
    
    Query Parameters:
    - limit: (optional) Max messages to return (default 50)
    - after: (optional) ISO 8601 timestamp; return only messages after this time
      Format: "2024-01-15T10:30:00" or "2024-01-15T10:30:00.123456"
    
    Returns:
    - List[MessageRead]: Messages ordered by created_at ASC (oldest first)
      Each message includes:
      * id - Message UUID
      * conversation_id - Parent conversation
      * sender - "user" or "ai" (who sent message)
      * content - Message text
      * created_at - Message timestamp
      * attachments - Optional file/media links
    
    Raises:
    - HTTPException (404): If conversation doesn't exist or user doesn't own it
    
    Authentication: Required (current_user)
    HTTP Status: 200 OK on success, 404 Not Found
    
    Pagination Example:
    - First call: GET /api/ai-tutor/conversations/{conv_id}/messages?limit=20
    - Get last message's created_at timestamp
    - Next call: GET /api/.../messages?limit=20&after=2024-01-15T10:45:00
    
    Notes:
    - Limit defaults to 50 for reasonable payload size
    - After parameter enables infinite scroll/pagination
    - Ordered chronologically (oldest messages first)
    - Useful for loading conversation history in chat UI
    """
    # First verify user owns this conversation
    q_conv = select(models.Conversation).where(models.Conversation.id == conv_id)
    res = await db.execute(q_conv)
    conv = res.scalar_one_or_none()
    
    # Return 404 if conversation doesn't exist or user doesn't own it
    if not conv or conv.user_id != user.id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Conversation with ID '{conv_id}' not found or access denied"
        )

    # Build base query for messages
    q = select(models.Message).where(
        models.Message.conversation_id == conv_id
    ).order_by(models.Message.created_at.asc()).limit(limit)
    
    # If after timestamp provided, filter to messages after that time
    if after:
        try:
            # Parse ISO 8601 timestamp
            after_dt = datetime.fromisoformat(after)
            # Query messages created after the specified time
            q = select(models.Message).where(
                models.Message.conversation_id == conv_id,
                models.Message.created_at > after_dt
            ).order_by(models.Message.created_at.asc()).limit(limit)
        except ValueError:
            # Ignore invalid timestamp format; return all messages
            pass
    
    # Execute and return messages
    res = await db.execute(q)
    return res.scalars().all()


@router.post("/conversations/{conv_id}/messages", response_model=schemas.MessageRead, status_code=status.HTTP_201_CREATED)
async def post_message(
    conv_id: UUID,
    payload: schemas.MessageCreate,
    db: AsyncSession = Depends(get_db),
    user: models.User = Depends(get_current_user)
):
    """
    Post a new message to a conversation.
    
    Features:
    - Add user message to conversation
    - Trigger AI response generation (via Celery task)
    - Update conversation's last_message_at timestamp
    - Track sender (user vs AI)
    - Support message attachments/metadata
    
    Path Parameters:
    - conv_id: (required) UUID of conversation to post to
    
    Request Body:
    - sender: (required) "user" or "ai" (typically "user" for this endpoint)
    - content: (required) Message text
    - attachments: (optional) JSON array of file/resource references
    
    Returns:
    - MessageRead: Created message object with:
      * id - Unique message UUID
      * conversation_id - Parent conversation ID
      * sender - Sender type ("user" or "ai")
      * content - Message content
      * created_at - Message timestamp
      * attachments - Optional file references
    
    Raises:
    - HTTPException (404): If conversation doesn't exist or user doesn't own it
    - HTTPException (422): If validation fails
    
    Authentication: Required (current_user)
    HTTP Status: 201 Created on success, 404 Not Found
    
    AI Response Generation:
    - After message created, should enqueue Celery task for AI response
    - AI task: analyze message, generate response, save as new message
    - TODO: Integrate with Celery + AI client service
    
    Notes:
    - Message saved immediately even before AI response
    - AI response generation is async (TODO via Celery)
    - Useful for chat interface where user types and sends message
    - Update conversation.last_message_at on each message
    
    Frontend Usage:
    1. User types message in chat UI
    2. POST message to this endpoint
    3. Show user message in chat immediately
    4. Poll/WebSocket for AI response (when ready)
    5. Display AI response in chat
    
    Example Request:
    ```json
    {
      "sender": "user",
      "content": "How do I solve quadratic equations?",
      "attachments": []
    }
    ```
    """
    # Verify conversation exists and user owns it
    q = select(models.Conversation).where(models.Conversation.id == conv_id)
    res = await db.execute(q)
    conv = res.scalar_one_or_none()
    
    # Return 404 if not found or doesn't belong to user
    if not conv or conv.user_id != user.id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Conversation with ID '{conv_id}' not found or access denied"
        )
    
    # Create new message in conversation
    msg = models.Message(
        conversation_id=conv_id,
        sender=payload.sender,
        content=payload.content
    )
    
    # Add to session
    db.add(msg)
    await db.flush()
    
    # TODO: Enqueue Celery task here for AI response generation
    # Example: celery_app.send_task('tasks.generate_ai_response', args=[str(conv_id), str(msg.id)])
    
    # Commit message to database
    await db.commit()
    
    # Refresh to get timestamps
    await db.refresh(msg)
    
    return msg
