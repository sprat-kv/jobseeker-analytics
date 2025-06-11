# Product Spec: Relevant Jobs
- Authors: [@elyseando](https://www.github.com/elyseando) [@happynasit](https://www.github.com/happynasit)
- Spec Template Author: [Alex Chiou](https://www.linkedin.com/in/alexander-chiou/), Co-Founder @ Taro, Ex-Robinhood, Ex-Meta Tech Lead

## Timeline


## Context
Job seekers often apply to multiple positions across various job boards, such as LinkedIn, Wellfound, and Indeed, to maximize their chances of landing a role. However, filtering through countless job postings to find the most relevant opportunities can be time-consuming and inefficient. Without a system that tailors job listings based on their skills and past applications, applicants may waste valuable time browsing irrelevant roles or applying to jobs that don’t align with their qualifications.

To address this challenge, we propose a Personalized Job Recommendations & Insights feature that curates highly relevant job listings for users based on their qualifications, past applications, and preferred industries. By analyzing job descriptions, company industries, and roles users have previously applied for, the system can surface opportunities that closely match their career goals, saving time and reducing the need for endless searching.

Additionally, users can see insights into which job boards provide the best opportunities for their specific background. For example, if a user consistently receives more responses from Wellfound rather than LinkedIn, they may choose to focus more on Wellfound for future applications. Over time, this feature will help job seekers refine their strategy, ensuring they apply to the most promising roles through the most effective channels. By combining personalized recommendations with data-driven insights, this feature streamlines the job search process, helping users spend less time searching and more time securing their next opportunity.


### What Do We Have Now?
We’re exploring a Personalized Job Recommendations & Insights feature that would help users discover highly relevant job opportunities based on their qualifications, past applications, and career preferences. Instead of manually searching through multiple job boards, users would receive tailored job suggestions, allowing them to apply more strategically. The concept of data-driven recommendations and insights can be valuable in helping users prioritize the best job boards and focus on applications with the highest success rates.

This feature hasn’t been implemented yet, but our goal is to provide intelligent, personalized job suggestions while also offering insights into job search trends, helping users refine their approach and increase their chances of landing the right role.


## Jobs To Be Done
At a high level, here’s how the Personalized Job Recommendations & Insights feature can add value to the lives of jobba.help users and jobba.help overall:
1. **More Relevant Job Listings** - Users receive tailored job recommendations based on their skills, past applications, and career preferences, reducing the need to sift through irrelevant job postings. This ensures that every opportunity presented is a strong match for their background and goals.
2. **Smarter Job Search Strategy** - By analyzing where users apply and which platforms yield the most interviews or responses, jobba.help helps them prioritize job boards that offer the best results. This data-driven approach saves time and increases the chances of securing interviews.
3. **Time Saving and Efficiency** - Instead of manually searching across multiple job boards, users get an automated, curated list of relevant jobs, allowing them to focus more on perfecting their applications and preparing for interviews.
4. **Better Job Fit for Users** - By continuously refining job suggestions based on user behaviour, jobba.help helps job seekers find positions that align with their skills, experience, and career trajectory, leading to more meaningful and fulfilling job opportunities.

Backend Tasks:
Develop a job recommendations model that analyzes past applications, job descriptions, and user preferences.
Integrate with external job boards and APIs to retrieve job listings if possible?
Implement a tracking system that logs job applications per platform to generate insights on which sources yield the best results.

Frontend Tasks:
Display personalized job listings and allow users to filter and sort job recommendations by criteria such as relevance, industry, company, and job type.
Display success rates by platform and application volume per job board.
Visual dashboard that tracks daily job applications and highlights the most effective job boards.

## Requirements

### Use Cases
1. User is able to browse up-to-date job listings with key information, including: 
   - Job position
   - Job type - Full Time, Internship, Part-time, Summer Job, etc.
   - Job level - Entry Level, Intermediate or Senior
   - Location of the job
2. User is able to select a job listing to view additional details such as:
   - About the position
   - About the company
   - Job Requirements
   - Job Benefits - Salary
   - Roles and Responsibilities
   - User is able to filter the listings based on the user preferences:
   - Search relevant Skills/Keywords
   - Job location
   - Desired salary
   - Job level
   - Remote/On-site/Hybrid
   - Job type - Full time, Part-time, Internship, etc.
3. User is able to organize the job listings in their desired order, such as:
   - Relevance
   - Date Posted: From most recent to least recent or vice versa
   - Salary: Highest to lowest or vice versa


### Edge Cases
1. User will view the job listing in case of certain cases:
   - No Job Listings Available: If no job listings are available in the system before and after the filters are applied, the user will see a placeholder message like "No jobs found
2. Lack of Information in the Job Description:
   - Incomplete Job Details: Few of the job details, such as requirements or salary may not be given. In that case, the message “Information not available” will be displayed
3. User will be able to reset the filters if they want to set the filters again by using reset filter
4. Applying for the Same Job Multiple Times
   - Reapplying for the same job: If a user applies for a job they’ve already applied to, display an indicator like "You’ve already applied" to avoid redundancy.
5. User will be able to apply for any jobs that are not their field
   - If they wish to apply for a position that doesn't align with their skills or interests, such as a part-time job, they can search for the role and reset the filter to explore different options.


## Data Model
The collection is called “job”.
All fields are required.
“id” (String) - Unique ID and primary key of the position
“position” (String) - position name
“company” (String) - The name of the company that posted it
“companylink”(String) - Link of the company
“location” (String) - Location of the position
“jobtype” (String) - job type (full time, part time..)
“description”(String) - Job Description
“salary” (Int) - salary 
“deadline”(String or datetime type) - Deadline to apply for the job
“experience_level”(String) - The experience required (e.g., entry-level, mid-level, senior).
“benefits”(String) – List of benefits offered (e.g., health insurance, paid time off).
“how_to_apply”(String) – Instructions for applying (e.g., email, website link).

## Overall Approach
The goal is to

### Trade-offs

With that as the comparison, we can talk pros and cons of our chosen approach:
### Pros

### Cons

## How Can This Really Break?

## Potential Future Improvements
These will be ordered in terms of likelihood/priority descending (i.e. iterations we are most likely to do come first).
- 
- 

## Questions


