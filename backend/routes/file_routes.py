import csv
import os
import logging
import plotly.graph_objects as go
from fastapi import APIRouter, HTTPException, Request, Depends
from fastapi.responses import FileResponse, RedirectResponse
from slowapi import Limiter
from slowapi.util import get_remote_address
import database
from utils.file_utils import get_user_filepath
from session.session_layer import validate_session
from routes.email_routes import query_emails
from utils.config_utils import get_settings

settings = get_settings()

# Logger setup
logger = logging.getLogger(__name__)

# FastAPI router for file routes
router = APIRouter()
limiter = Limiter(key_func=get_remote_address)

@router.get("/download-file")
async def download_file(request: Request, user_id: str = Depends(validate_session)):
    if not user_id:
        return RedirectResponse("/logout", status_code=303)
    directory = get_user_filepath(user_id)
    filename = "emails.csv"
    filepath = f"{directory}/{filename}"
    if os.path.exists(filepath):
        logger.info("user_id:%s downloading from filepath %s", user_id, filepath)
        return FileResponse(filepath)
    raise HTTPException(status_code=400, detail="File not found")


# Write and download csv
@router.get("/process-csv")
@limiter.limit("2/minute")
async def process_csv(request: Request, db_session: database.DBSession, user_id: str = Depends(validate_session)):
    if not user_id:
        return RedirectResponse("/logout", status_code=303)

    directory = get_user_filepath(user_id)
    filename = "emails.csv"
    filepath = os.path.join(directory, filename)
    
    # Get job related email data from DB
    emails = query_emails(request, db_session=db_session, user_id=user_id)
    if not emails:
        raise HTTPException(status_code=400, detail="No data found to write")
    # Ensure the directory exists
    os.makedirs(directory, exist_ok=True)

    # Key: DB field name; Value: Human-readable field name
    field_mapping = {
        "company_name": "Company Name",
        "application_status": "Application Status",
        "received_at": "Received At",
        "job_title": "Job Title",
        "subject": "Subject",
        "email_from": "Sender"
    }

    if not settings.is_publicly_deployed:
        logger.info("DEBUG: Adding message id to output")
        field_mapping.update({"id": "Message ID"})

    selected_fields = list(field_mapping.keys())
    headers = list(field_mapping.values())

    # Filter out unwanted fields
    processed_emails = [
        {key: value for key, value in email if key in selected_fields} for email in emails
    ]

    # Write to CSV
    with open(filepath, mode="w", newline="") as file:
        writer = csv.writer(file)
        writer.writerow(headers)
        for row in processed_emails:
            writer.writerow([row[field] for field in selected_fields])

    logger.info("CSV file created at %s", filepath)
    
    # Download CSV
    if os.path.exists(filepath):
        logger.info("user_id:%s downloading from filepath %s", user_id, filepath)
        return FileResponse(filepath)
    
    # File not found error
    raise HTTPException(status_code=400, detail="File not found")


# Write and download sankey diagram
@router.get("/process-sankey")
@limiter.limit("2/minute")
async def process_sankey(request: Request, db_session: database.DBSession, user_id: str = Depends(validate_session)):
    # Validate user session, redirect if invalid
    if not user_id:
        return RedirectResponse("/logout", status_code=303)
    
    num_applications = 0
    num_offers = 0
    num_rejected = 0
    num_request_for_availability = 0
    num_interview_scheduled = 0
    num_no_response = 0
    
    # Individual counters for all 12 LLM statuses
    num_offer_made = 0
    num_rejection = 0
    num_availability_request = 0
    num_interview_invitation = 0
    num_assessment_sent = 0
    num_application_confirmation = 0
    num_information_request = 0
    num_inbound_request = 0
    num_action_required = 0
    num_hiring_freeze = 0
    num_withdrew_application = 0
    num_false_positive = 0

    # Get job related email data from DB
    emails = query_emails(request, db_session=db_session, user_id=user_id)
    if not emails:
        raise HTTPException(status_code=400, detail="No data found to write")
    
    for email in emails:
        # normalize the output
        status = email.application_status.strip().lower()
        num_applications += 1
        
        # Used exact matching for the official LLM status labels
        # Reference: backend/utils/llm_utils.py for the 12 official statuses
        if status == "offer made":
            num_offers += 1
            num_offer_made += 1
        elif status == "rejection":
            num_rejected += 1
            num_rejection += 1
        elif status == "availability request":
            num_request_for_availability += 1
            num_availability_request += 1
        elif status == "interview invitation":
            num_interview_scheduled += 1
            num_interview_invitation += 1
        elif status == "assessment sent":
            num_interview_scheduled += 1
            num_assessment_sent += 1
        elif status == "application confirmation":
            num_no_response += 1
            num_application_confirmation += 1
        elif status == "information request":
            num_no_response += 1
            num_information_request += 1
        elif status == "did not apply - inbound request":
            num_no_response += 1
            num_inbound_request += 1
        elif status == "action required from company":
            num_no_response += 1
            num_action_required += 1
        elif status == "hiring freeze notification":
            num_no_response += 1
            num_hiring_freeze += 1
        elif status == "withdrew application":
            num_no_response += 1
            num_withdrew_application += 1
        elif status == "false positive":
            # Skip false positives - don't count them in any category
            num_applications -= 1  # Decrement since we already incremented above
            num_false_positive += 1
            continue
        else:
            # Fallback: treat unknown statuses as no response
            num_no_response += 1
    
    # Calculate unknown statuses correctly - statuses that went to "else" clause
    num_unknown_status = num_no_response - (num_application_confirmation + num_information_request + 
                                          num_inbound_request + num_action_required + 
                                          num_hiring_freeze + num_withdrew_application)
    
    # Check if we have any categorized data
    total_categorized = num_offers + num_rejected + num_request_for_availability + num_interview_scheduled + num_no_response
    if total_categorized == 0:
        logger.warning("user_id:%s - No emails matched any status categories, creating fallback diagram", user_id)
        # Create a simple fallback diagram
        num_no_response = num_applications

    # Create the comprehensive Sankey diagram with all 12 LLM statuses (excluding False Positives)
    fig = go.Figure(go.Sankey(
        node=dict(
            pad=15,
            thickness=20,
            line=dict(color="black", width=1),
            label=[
                f"Applications ({num_applications})",
                # Positive outcomes
                f"Offer Made ({num_offer_made})",
                # Negative outcomes  
                f"Rejection ({num_rejection})",
                # Interview-related
                f"Interview Invitation ({num_interview_invitation})",
                f"Assessment Sent ({num_assessment_sent})",
                # Availability
                f"Availability Request ({num_availability_request})",
                # Communication/Process
                f"Application Confirmation ({num_application_confirmation})",
                f"ℹInformation Request ({num_information_request})",
                f"Inbound Request ({num_inbound_request})",
                f"Action Required ({num_action_required})",
                # Company decisions
                f"Hiring Freeze ({num_hiring_freeze})",
                f"Withdrew Application ({num_withdrew_application})",
                # Other (only if there are unknown statuses)
                f"Other/Unknown ({num_unknown_status})" if num_unknown_status > 0 else None
            ],
            # Color scheme: green(good), red(bad), purple(interviews), orange(availability), 
            # blue(communication), gray(process), yellow(action)
            color=[
                "#1f77b4",  # Applications - blue
                "#2ca02c",  # Offer Made - green
                "#d62728",  # Rejection - red
                "#9467bd",  # Interview Invitation - purple
                "#8e4ec6",  # Assessment Sent - darker purple
                "#ff7f0e",  # Availability Request - orange
                "#17a2b8",  # Application Confirmation - teal
                "#6c757d",  # Information Request - gray
                "#28a745",  # Inbound Request - success green
                "#ffc107",  # Action Required - yellow
                "#6f42c1",  # Hiring Freeze - indigo
                "#dc3545",  # Withdrew Application - danger red
                "#8c564b",  # Other/Unknown - brown
            ]
        ),
        link=dict(
            source=[0] * (12 if num_unknown_status > 0 else 11),  # All from Applications
            target=list(range(1, 13 if num_unknown_status > 0 else 12)),  # To each status
            value=[
                num_offer_made,
                num_rejection, 
                num_interview_invitation,
                num_assessment_sent,
                num_availability_request,
                num_application_confirmation,
                num_information_request,
                num_inbound_request,
                num_action_required,
                num_hiring_freeze,
                num_withdrew_application,
            ] + ([num_unknown_status] if num_unknown_status > 0 else []),
            # Matching link colors with transparency
            color=[
                "rgba(44, 160, 44, 0.6)",   # Offer Made - green
                "rgba(214, 39, 40, 0.6)",   # Rejection - red
                "rgba(148, 103, 189, 0.6)", # Interview Invitation - purple
                "rgba(142, 78, 198, 0.6)",  # Assessment Sent - darker purple
                "rgba(255, 127, 14, 0.6)",  # Availability Request - orange
                "rgba(23, 162, 184, 0.6)",  # Application Confirmation - teal
                "rgba(108, 117, 125, 0.6)", # Information Request - gray
                "rgba(40, 167, 69, 0.6)",   # Inbound Request - success green
                "rgba(255, 193, 7, 0.6)",   # Action Required - yellow
                "rgba(111, 66, 193, 0.6)",  # Hiring Freeze - indigo
                "rgba(220, 53, 69, 0.6)",   # Withdrew Application - danger red
            ] + (["rgba(140, 86, 75, 0.6)"] if num_unknown_status > 0 else [])  # Other/Unknown - brown
        )
    ))
    
    # Filter out None values from labels
    node_labels = [label for label in fig.data[0].node.label if label is not None]
    node_colors = fig.data[0].node.color[:len(node_labels)]
    
    fig.data[0].node.label = node_labels
    fig.data[0].node.color = node_colors
    
    # Add comprehensive layout configuration
    fig.update_layout(
        title={
            'text': f"Job Application Flow Analysis - Status Breakdown<br><sub>Total Applications: {num_applications} | Showing 11 LLM Categories + Other (False Positives Excluded)</sub>",
            'x': 0.5,
            'xanchor': 'center',
            'font': {'size': 20, 'color': '#2E86AB'}
        },
        font=dict(size=14, family="Arial, sans-serif"),
        width=1400,
        height=900,
        paper_bgcolor="white",
        plot_bgcolor="white",
        margin=dict(l=50, r=50, t=120, b=50)
    )


    # Define the user's file path and ensure the directory exists
    directory = get_user_filepath(user_id)
    filename = "sankey_diagram.png"
    filepath = os.path.join(directory, filename)

    # Ensure the directory exists
    os.makedirs(directory, exist_ok=True)

    try:
        # Save the Sankey diagram as PNG with enhanced settings
        fig.write_image(
            filepath, 
            width=1400, 
            height=900, 
            scale=2,
            format="png",
            engine="kaleido"
        )
        
        # Verify the file was created and has content
        if not os.path.exists(filepath):
            raise Exception("Sankey diagram file was not created")
        
        file_size = os.path.getsize(filepath)
        if file_size == 0:
            raise Exception("Sankey diagram file is empty")
        
        logger.info("user_id:%s Sankey diagram saved to %s (size: %d bytes)", user_id, filepath, file_size)

        # Return the file with correct headers and explicit filename
        return FileResponse(
            filepath,
            media_type="image/png",  # Correct media type for PNG
            filename=filename, 
            headers={
                "Content-Disposition": f"attachment; filename={filename}",
                "Cache-Control": "no-cache, no-store, must-revalidate",
                "Pragma": "no-cache",
                "Expires": "0"
            }
        )
    except Exception as e:
        logger.error("Error generating Sankey diagram for user_id:%s - %s", user_id, str(e))
        
        # Clean up any partially created file
        if os.path.exists(filepath):
            try:
                os.remove(filepath)
                logger.info("Cleaned up partially created file: %s", filepath)
            except Exception as cleanup_error:
                logger.warning("Failed to clean up file %s: %s", filepath, str(cleanup_error))
        
        # Try to create a beautiful structured fallback image with all 12 LLM statuses
        try:
            import matplotlib.pyplot as plt
            import matplotlib.patches as patches
            
            # Create figure with professional styling
            plt.style.use('default')
            fig_fallback, ax = plt.subplots(figsize=(14, 16))
            fig_fallback.patch.set_facecolor('#f8f9fa')
            
            # Title section with error message
            ax.text(0.5, 0.97, "Job Application Analytics - LLM Status Breakdown", 
                   ha='center', va='center', fontsize=24, fontweight='bold', color='#2E86AB')
            ax.text(0.5, 0.94, "⚠️ Sankey Diagram Generation Failed", 
                   ha='center', va='center', fontsize=16, color='#d62728', fontweight='bold')
            
            # Main stats section
            ax.text(0.5, 0.90, f"Total Applications: {num_applications}", 
                   ha='center', va='center', fontsize=20, fontweight='bold', color='#1f77b4')
            
            # All 12 LLM Statuses (Detailed) - Centered
            ax.text(0.5, 0.85, "Individual LLM Status Categories", 
                   ha='center', va='center', fontsize=18, fontweight='bold', color='#333333')
            
            # All LLM statuses with unique colors (using text symbols instead of emojis)
            # Include False Positives and Unknown Status in fallback for debugging
            detailed_statuses = [
                ("● Offer Made", num_offer_made, "#2ca02c"),
                ("● Rejection", num_rejection, "#d62728"),
                ("● Interview Invitation", num_interview_invitation, "#9467bd"),
                ("● Assessment Sent", num_assessment_sent, "#8e4ec6"),
                ("● Availability Request", num_availability_request, "#ff7f0e"),
                ("● Application Confirmation", num_application_confirmation, "#17a2b8"),
                ("● Information Request", num_information_request, "#6c757d"),
                ("● Inbound Request", num_inbound_request, "#28a745"),
                ("● Action Required", num_action_required, "#ffc107"),
                ("● Hiring Freeze", num_hiring_freeze, "#6f42c1"),
                ("● Withdrew Application", num_withdrew_application, "#dc3545"),
                ("● Other/Unknown Status", num_unknown_status, "#8c564b"),
                ("● False Positive (Internal- Dont Count)", num_false_positive, "#e83e8c")
            ]
            
            # Draw detailed status boxes (centered)
            detail_box_width = 0.6
            detail_box_height = 0.040
            detail_spacing = 0.008
            detail_y_start = 0.80
            
            for i, (label, count, color) in enumerate(detailed_statuses):
                y_pos = detail_y_start - i * (detail_box_height + detail_spacing)
                
                # Create background box
                rect = patches.Rectangle((0.2, y_pos - detail_box_height/2), detail_box_width, detail_box_height, 
                                       linewidth=1.5, edgecolor=color, facecolor=color, alpha=0.2)
                ax.add_patch(rect)
                
                # Add label and count
                ax.text(0.22, y_pos, label, ha='left', va='center', fontsize=12, fontweight='bold', color=color)
                ax.text(0.77, y_pos, str(count), ha='right', va='center', fontsize=12, fontweight='bold', color=color)
                
                # Add percentage for non-zero counts
                if num_applications > 0 and count > 0:
                    percentage = (count / num_applications) * 100
                    ax.text(0.73, y_pos, f"({percentage:.1f}%)", ha='right', va='center', fontsize=10, color='#666666')
            
            # Summary section
            ax.text(0.5, 0.17, "Status Summary", 
                   ha='center', va='center', fontsize=16, fontweight='bold', color='#333333')
            
            # Calculate summary stats
            positive_outcomes = num_offer_made
            negative_outcomes = num_rejection
            pending_outcomes = num_interview_invitation + num_assessment_sent + num_availability_request
            communication_outcomes = (num_application_confirmation + num_information_request + 
                                    num_inbound_request + num_action_required + num_hiring_freeze + 
                                    num_withdrew_application)
            
            summary_text = (
                f"Positive Outcomes: {positive_outcomes}\n"
                f"Negative Outcomes: {negative_outcomes}\n"
                f"Pending/Interview Related: {pending_outcomes}\n"
                f"Communication/Process: {communication_outcomes}\n"
                f"False Positives (Excluded): {num_false_positive}"
            )
            ax.text(0.5, 0.10, summary_text, 
                   ha='center', va='center', fontsize=12, color='#333333', 
                   bbox=dict(boxstyle="round,pad=0.5", facecolor='#ffffff', edgecolor='#dddddd'))
            
            # Footer
            ax.text(0.5, 0.025, "Please contact support if this issue persists", 
                   ha='center', va='center', fontsize=10, color='#999999', style='italic')
            
            # Remove axes and set limits
            ax.set_xlim(0, 1)
            ax.set_ylim(0, 1)
            ax.axis('off')
            
            # Save with high quality
            fallback_filename = "sankey_fallback.png"
            fallback_filepath = os.path.join(directory, fallback_filename)
            plt.savefig(fallback_filepath, dpi=200, bbox_inches='tight', 
                       facecolor='#f8f9fa', edgecolor='none', pad_inches=0.3)
            plt.close()
            
            return FileResponse(
                fallback_filepath,
                media_type="image/png",
                filename=fallback_filename,
                headers={"Content-Disposition": f"attachment; filename={fallback_filename}"}
            )
        except Exception as fallback_error:
            logger.error("Fallback diagram creation also failed: %s", str(fallback_error))
            raise HTTPException(status_code=500, detail=f"Error generating Sankey diagram: {str(e)}")

