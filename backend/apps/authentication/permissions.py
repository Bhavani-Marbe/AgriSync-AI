from rest_framework import permissions
from .models import Role

class IsFarmer(permissions.BasePermission):
    """
    Allows access only to Farmer users or Admins.
    """
    def has_permission(self, request, view):
        return bool(
            request.user and
            request.user.is_authenticated and
            (request.user.role == Role.FARMER or request.user.role == Role.ADMIN)
        )

class IsAgronomist(permissions.BasePermission):
    """
    Allows access only to Agronomist users or Admins.
    """
    def has_permission(self, request, view):
        return bool(
            request.user and
            request.user.is_authenticated and
            (request.user.role == Role.AGRONOMIST or request.user.role == Role.ADMIN)
        )

class IsAdminUser(permissions.BasePermission):
    """
    Allows access only to Platform Administrators.
    """
    def has_permission(self, request, view):
        return bool(
            request.user and
            request.user.is_authenticated and
            (request.user.role == Role.ADMIN or request.user.is_staff or request.user.is_superuser)
        )

class IsOwnerOrAdmin(permissions.BasePermission):
    """
    Object-level permission to only allow owners of an object or admins to edit it.
    """
    def has_object_permission(self, request, view, obj):
        if request.user.role == Role.ADMIN or request.user.is_staff:
            return True
        return hasattr(obj, 'user') and obj.user == request.user
