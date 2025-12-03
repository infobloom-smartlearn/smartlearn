"""
Courses Router Module

Manages course creation, retrieval, and management for the SmartLearn platform.
Courses are collections of lessons that organize learning content by subject.

Endpoints:
- GET /api/courses - List all published courses
- GET /api/courses/{course_id} - Get specific course details
- GET /api/courses/{course_id}/lessons - Get all lessons in a course
- POST /api/courses - Create new course (admin only)
- PUT /api/courses/{course_id} - Update course (admin only)
- DELETE /api/courses/{course_id} - Delete course (admin only)

Dependencies:
- FastAPI for routing
- SQLAlchemy for async database operations
- Admin role check for write operations
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from ..db.session import get_db
from .. import schemas, models
from ..core.deps import get_current_user
from typing import List

router = APIRouter()


@router.get("/", response_model=List[schemas.CourseRead])
async def list_courses(
    db: AsyncSession = Depends(get_db)
):
    """
    List all published courses available to students.
    
    Features:
    - Get all courses in the system
    - Filter to only published courses (is_published=True)
    - Includes course metadata (title, description, subject, etc.)
    - Ordered by creation date or featured status
    
    Returns:
    - List[CourseRead]: Array of all published courses, including:
      * id - Unique course ID
      * title - Course name
      * description - Course overview/details
      * subject - Subject area (Math, Science, English, etc.)
      * slug - URL-friendly identifier
      * is_published - Always True (unpublished filtered out)
      * metadata - Additional course info (level, duration, etc.)
      * created_by - ID of creator
      * created_at - Course creation timestamp
    
    Authentication: Not required (public endpoint)
    HTTP Status: 200 OK
    
    Notes:
    - Returns empty list if no published courses exist
    - Unpublished courses (is_published=False) are hidden
    - Use for displaying course catalog/marketplace
    - Can be enhanced with filtering, pagination, sorting
    """
    # Query for all published courses only
    q = select(models.Course).where(models.Course.is_published == True)
    
    # Execute and return results
    res = await db.execute(q)
    return res.scalars().all()


@router.get("/{course_id}", response_model=schemas.CourseRead)
async def get_course(
    course_id: str,
    db: AsyncSession = Depends(get_db)
):
    """
    Retrieve a specific course by its ID.
    
    Features:
    - Get detailed course information
    - Returns all course metadata and configuration
    - Accessible regardless of published status (admin use)
    
    Path Parameters:
    - course_id: (required) UUID of the course to retrieve
    
    Returns:
    - CourseRead: Complete course object with:
      * id - Course UUID
      * title - Course name
      * description - Full course description
      * subject - Subject area
      * metadata - Additional details
      * is_published - Publication status
      * created_by - Creator user ID
      * created_at - Creation timestamp
    
    Raises:
    - HTTPException (404): If course with given ID doesn't exist
    
    Authentication: Not required (public endpoint)
    HTTP Status: 200 OK on success, 404 Not Found
    
    Notes:
    - Returns both published and unpublished courses
    - Use GET /api/courses/{course_id}/lessons for course's lessons
    - Course must exist to view; ID validation is required
    """
    # Query for specific course by ID
    q = select(models.Course).where(models.Course.id == course_id)
    res = await db.execute(q)
    
    # Return course or 404
    course = res.scalar_one_or_none()
    if not course:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Course with ID '{course_id}' not found"
        )
    
    return course


@router.get("/{course_id}/lessons", response_model=List[schemas.LessonRead])
async def get_course_lessons(
    course_id: str,
    db: AsyncSession = Depends(get_db)
):
    """
    Retrieve all lessons in a specific course, ordered by sequence.
    
    Features:
    - Get all lessons for a course in proper order
    - Lessons ordered by 'order' field for correct sequence
    - Includes lesson details (title, content, duration, etc.)
    - Shows prerequisites and difficulty levels
    
    Path Parameters:
    - course_id: (required) UUID of the course
    
    Returns:
    - List[LessonRead]: Array of lessons ordered by lesson order, containing:
      * id - Lesson UUID
      * course_id - Parent course ID
      * title - Lesson name
      * description - Lesson content overview
      * order - Sequence number (determines display order)
      * duration_minutes - Estimated lesson length
      * difficulty - Difficulty level
      * metadata - Additional lesson data
      * created_at - Creation timestamp
    
    Authentication: Not required (public endpoint)
    HTTP Status: 200 OK
    
    Notes:
    - Returns empty list if course has no lessons
    - Ordered by lesson.order ASC (ascending sequence)
    - Lesson order determines curriculum flow
    - Returns both published and unpublished lessons
    """
    # Query all lessons for the course, ordered by sequence
    q = select(models.Lesson).where(
        models.Lesson.course_id == course_id
    ).order_by(models.Lesson.order)
    
    # Execute and return lessons in order
    res = await db.execute(q)
    return res.scalars().all()


def is_admin(user: models.User) -> bool:
    """
    Check if user has admin/superuser privileges.
    
    Parameters:
    - user: User model instance to check
    
    Returns:
    - bool: True if user is superuser, False otherwise
    
    Implementation Note:
    - Could be enhanced with role-based access control (RBAC)
    - Currently checks is_superuser boolean flag
    """
    return getattr(user, "is_superuser", False)


@router.post("/", response_model=schemas.CourseRead, status_code=status.HTTP_201_CREATED)
async def create_course(
    payload: schemas.CourseRead,
    db: AsyncSession = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """
    Create a new course (admin only).
    
    Features:
    - Create new course in system
    - Set title, description, subject, metadata
    - Control publication status
    - Track creator information
    - Admin authorization required
    
    Request Body:
    - title: (required) Course name
    - description: (required) Course description
    - subject: (required) Subject area
    - slug: (optional) URL-friendly identifier
    - metadata: (optional) JSON object with additional course data
    - is_published: (optional) Published status (default False)
    
    Returns:
    - CourseRead: Created course object with:
      * id - Generated UUID
      * All request fields
      * created_by - Set to current user ID
      * created_at - Current timestamp
    
    Raises:
    - HTTPException (403): If user is not admin
    - HTTPException (422): If validation fails
    
    Authentication: Required with admin role
    HTTP Status: 201 Created on success, 403 Forbidden if not admin
    
    Notes:
    - Only admins can create courses
    - New courses default to unpublished (is_published=False)
    - Courses can be edited and published later
    - Creator is recorded for audit trail
    
    Authorization Check:
    - is_admin(current_user) must return True
    - is_superuser flag checked on user model
    """
    # Check admin authorization
    if not is_admin(current_user):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin role required to create courses"
        )
    
    # Create new course with provided data
    c = models.Course(
        title=payload.title,
        description=payload.description,
        slug=payload.slug,
        course_metadata=payload.course_metadata,
        is_published=payload.is_published,
        created_by=current_user.id
    )
    
    # Add to session and flush to get ID
    db.add(c)
    await db.flush()
    
    # Commit transaction
    await db.commit()
    
    # Refresh to get all defaults
    await db.refresh(c)
    
    return c


@router.put("/{course_id}", response_model=schemas.CourseRead)
async def update_course(
    course_id: str,
    payload: schemas.CourseRead,
    db: AsyncSession = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """
    Update an existing course (admin only).
    
    Features:
    - Update course details (title, description, metadata)
    - Change publication status
    - Support partial updates (only update provided fields)
    - Preserve creator and creation timestamp
    
    Path Parameters:
    - course_id: (required) UUID of course to update
    
    Request Body (all fields optional):
    - title: Updated course title
    - description: Updated description
    - subject: Updated subject area
    - metadata: Updated course metadata
    - is_published: Toggle publication status
    - Other fields remain unchanged if omitted
    
    Returns:
    - CourseRead: Updated course object with all changes applied
    
    Raises:
    - HTTPException (403): If user is not admin
    - HTTPException (404): If course doesn't exist
    - HTTPException (422): If validation fails
    
    Authentication: Required with admin role
    HTTP Status: 200 OK on success, 403 Forbidden, 404 Not Found
    
    Notes:
    - Only admins can update courses
    - Omitted fields in request are not modified
    - created_by and created_at are never changed
    - Use to publish/unpublish courses
    - Can update metadata for flexible additional data
    """
    # Check admin authorization
    if not is_admin(current_user):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin role required to update courses"
        )
    
    # Query for course by ID
    q = select(models.Course).where(models.Course.id == course_id)
    res = await db.execute(q)
    
    # Return 404 if not found
    course = res.scalar_one_or_none()
    if not course:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Course with ID '{course_id}' not found"
        )
    
    # Apply updates: only update provided fields (exclude_unset=True)
    for k, v in payload.dict(exclude_unset=True).items():
        setattr(course, k, v)
    
    # Commit changes
    await db.commit()
    
    # Refresh to get updated state
    await db.refresh(course)
    
    return course


@router.delete("/{course_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_course(
    course_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """
    Delete a course (admin only).
    
    Features:
    - Permanently remove course from system
    - Delete cascade removes associated lessons (if FK configured)
    - Admin authorization required
    - Returns no content on success
    
    Path Parameters:
    - course_id: (required) UUID of course to delete
    
    Raises:
    - HTTPException (403): If user is not admin
    - HTTPException (404): If course doesn't exist
    - HTTPException (409): If course has dependent data preventing deletion
    
    Authentication: Required with admin role
    HTTP Status: 204 No Content on success, 403 Forbidden, 404 Not Found
    
    Notes:
    - Only admins can delete courses
    - WARNING: This is permanent and cannot be undone
    - Consider soft delete (unpublish) for data preservation
    - May cascade delete lessons if FK constraint configured
    - User progress records may remain (depending on FK setup)
    
    Implementation Note:
    - Currently hard delete; could implement soft delete instead
    - Consider audit logging before deletion
    """
    # Check admin authorization
    if not is_admin(current_user):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin role required to delete courses"
        )
    
    # Query for course by ID
    q = select(models.Course).where(models.Course.id == course_id)
    res = await db.execute(q)
    
    # Return 404 if not found
    course = res.scalar_one_or_none()
    if not course:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Course with ID '{course_id}' not found"
        )
    
    # Delete course from database
    await db.delete(course)
    
    # Commit deletion
    await db.commit()
