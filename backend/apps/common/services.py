from datetime import timedelta
from typing import Dict, Any, List, Tuple

from django.db import models
from django.utils import timezone

from apps.common.types import DjangoModelType


def model_update(
    *,
    instance: DjangoModelType,
    fields: List[str],
    data: Dict[str, Any],
    auto_updated_at=True,
) -> Tuple[DjangoModelType, bool]:
    has_updated = False
    m2m_data = {}
    update_fields = []

    model_fields = {field.name: field for field in instance._meta.get_fields()}  # noqa

    for field in fields:
        if field not in data:
            continue

        model_field = model_fields.get(field)

        assert model_field is not None, (
            f"{field} is not part of {instance.__class__.__name__} fields."
        )

        if isinstance(model_field, models.ManyToManyField):
            m2m_data[field] = data[field]
            continue

        if getattr(instance, field) != data[field]:
            has_updated = True
            update_fields.append(field)
            setattr(instance, field, data[field])

    if has_updated:
        if auto_updated_at:
            if "updated_at" in model_fields and "updated_at" not in update_fields:
                update_fields.append("updated_at")
                instance.updated_at = timezone.now()

        instance.full_clean()
        instance.save(update_fields=update_fields)

    for field_name, value in m2m_data.items():
        related_manager = getattr(instance, field_name)
        related_manager.set(value)

        has_updated = True

    return instance, has_updated


def counts_by_delta(model, attributes):
    data = []

    for i in reversed(range(7)):  # oldest to newest
        day_start = (timezone.now() - timedelta(days=i)).replace(
            hour=0, minute=0, second=0, microsecond=0
        )
        day_end = day_start + timedelta(days=1)
        label = day_start.strftime("%a")

        day_data = {
            "idx": 6 - i,
            "label": label,
        }

        for attr in attributes:
            attr_queryset = getattr(model, attr).all()
            filtered_count = attr_queryset.filter(
                created_at__gte=day_start, created_at__lt=day_end
            ).count()
            day_data[attr] = filtered_count

        data.append(day_data)

    return data


def calculate_growth(model, attribute, delta, n_delta):
    """
    Calculate the growth rate of an attribute.
    :param model: The model to calculate the growth for.
    :param attribute: The attribute to calculate the growth for.
    :param delta: The delta to calculate the growth for (e.g. timedelta(days=30)
    :param n_delta: The number of deltas to calculate the growth for. (e.g. 12 where delta=timedelta(days=30) for 12 months)
    """

    def growth(previous, current):
        if previous == 0:
            return 100.0 if current > 0 else 0.0
        return round(((current - previous) / previous) * 100, 1)

    data = []

    for i in range(n_delta):
        then = timezone.now() - (delta * i)
        previous_time = then - delta
        month = then.month
        year = then.year
        label = f"{month}/{year}"

        attr_queryset = getattr(model, attribute).all()
        attr_then = attr_queryset.filter(created_at__lte=then).count()
        attr_previous = attr_queryset.filter(created_at__lte=previous_time).count()

        period_growth = growth(attr_previous, attr_then)

        data.append(
            {
                "label": label,
                "count": attr_then,
                "growth": period_growth,
                "month": then.strftime("%B")[:3],
            }
        )

    return data
