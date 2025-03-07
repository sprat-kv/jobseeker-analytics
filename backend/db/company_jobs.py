from sqlmodel import SQLModel, Field, UniqueConstraint
from datetime import datetime


class CompanyJobs(SQLModel, table=True):
    __tablename__ = "company_jobs"
    company_job_id: int = Field(default=None, primary_key=True)
    company_id: int = Field(foreign_key="companies.company_id", nullable=False)
    company_job_title_id: int | None = Field(
        default=None, foreign_key="job_titles.job_title_id", nullable=True
    )
    company_job_description: str | None = Field(default=None, nullable=True)
    company_job_posted_at: datetime = Field(
        default_factory=datetime.utcnow, nullable=False
    )
    company_job_location: str | None = Field(default=None, nullable=True)

    __table_args__ = (
        # Ensure that company_name and company_email_domain together are unique
        UniqueConstraint(
            "company_id",
            "job_title_id",
            "job_location",
            "job_posted_at",
            name="unique_job",
        ),
    )
