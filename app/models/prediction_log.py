from sqlalchemy import Column, Integer, Float, DateTime
from geoalchemy2 import Geometry
from datetime import datetime
from app.database import Base


class PredictionLog(Base):
    __tablename__ = "predictions"

    id = Column(Integer, primary_key=True, index=True)

    # Environmental inputs
    temperature = Column(Float, nullable=False)
    humidity = Column(Float, nullable=False)
    wind_speed = Column(Float, nullable=False)

    # ML output
    risk_probability = Column(Float, nullable=False)

    # Raw coordinates (for easier debugging + analytics)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)

    # PostGIS spatial column
    location = Column(
        Geometry(geometry_type="POINT", srid=4326),
        nullable=False
    )

    created_at = Column(DateTime, default=datetime.utcnow)