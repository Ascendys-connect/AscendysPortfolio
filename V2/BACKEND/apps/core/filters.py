"""
Custom filters for advanced filtering.
"""
from django_filters import rest_framework as filters
from django.utils import timezone
from datetime import timedelta


class DateRangeFilter(filters.FilterSet):
    """
    Base filter for date range filtering.
    """
    date_from = filters.DateTimeFilter(field_name='created_at', lookup_expr='gte')
    date_to = filters.DateTimeFilter(field_name='created_at', lookup_expr='lte')
    
    # Quick filters
    today = filters.BooleanFilter(method='filter_today')
    yesterday = filters.BooleanFilter(method='filter_yesterday')
    this_week = filters.BooleanFilter(method='filter_this_week')
    this_month = filters.BooleanFilter(method='filter_this_month')
    last_7_days = filters.BooleanFilter(method='filter_last_7_days')
    last_30_days = filters.BooleanFilter(method='filter_last_30_days')
    
    def filter_today(self, queryset, name, value):
        if value:
            today = timezone.now().date()
            return queryset.filter(created_at__date=today)
        return queryset
    
    def filter_yesterday(self, queryset, name, value):
        if value:
            yesterday = timezone.now().date() - timedelta(days=1)
            return queryset.filter(created_at__date=yesterday)
        return queryset
    
    def filter_this_week(self, queryset, name, value):
        if value:
            today = timezone.now()
            start_week = today - timedelta(days=today.weekday())
            return queryset.filter(created_at__gte=start_week)
        return queryset
    
    def filter_this_month(self, queryset, name, value):
        if value:
            today = timezone.now()
            start_month = today.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
            return queryset.filter(created_at__gte=start_month)
        return queryset
    
    def filter_last_7_days(self, queryset, name, value):
        if value:
            date_from = timezone.now() - timedelta(days=7)
            return queryset.filter(created_at__gte=date_from)
        return queryset
    
    def filter_last_30_days(self, queryset, name, value):
        if value:
            date_from = timezone.now() - timedelta(days=30)
            return queryset.filter(created_at__gte=date_from)
        return queryset


class PublicationStatusFilter(filters.FilterSet):
    """
    Filter for publication status (DRAFT, PUBLISHED, ARCHIVED).
    """
    status = filters.CharFilter(field_name='status')
    is_published = filters.BooleanFilter(method='filter_is_published')
    is_draft = filters.BooleanFilter(method='filter_is_draft')
    is_archived = filters.BooleanFilter(method='filter_is_archived')
    
    def filter_is_published(self, queryset, name, value):
        if value:
            return queryset.filter(status='PUBLISHED')
        return queryset
    
    def filter_is_draft(self, queryset, name, value):
        if value:
            return queryset.filter(status='DRAFT')
        return queryset
    
    def filter_is_archived(self, queryset, name, value):
        if value:
            return queryset.filter(status='ARCHIVED')
        return queryset


class PriceRangeFilter(filters.FilterSet):
    """
    Filter for price ranges.
    """
    min_price = filters.NumberFilter(field_name='price', lookup_expr='gte')
    max_price = filters.NumberFilter(field_name='price', lookup_expr='lte')
    is_free = filters.BooleanFilter(method='filter_is_free')
    
    def filter_is_free(self, queryset, name, value):
        if value:
            return queryset.filter(price=0)
        return queryset


class MultiFieldSearchFilter(filters.FilterSet):
    """
    Advanced multi-field search filter.
    """
    search = filters.CharFilter(method='multi_field_search')
    
    def multi_field_search(self, queryset, name, value):
        """
        Override this method in subclasses to define search fields.
        """
        return queryset
