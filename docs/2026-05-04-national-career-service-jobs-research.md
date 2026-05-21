# National Career Service Jobs & Career Centers Research

## Feature name and user value

**Feature:** District Jobs & Career Center Monitor

**User value:** Citizens could see live district-level job listings, hiring volume signals, and nearby government career centers without leaving ForThePeople. This is especially useful for support pages, contributor outreach, and future district opportunity surfaces.

## Source URLs

- National Career Service home: https://www.ncs.gov.in/
- NCS search jobs page: https://www.ncs.gov.in/job-seeker/pages/search.aspx
- NCS career center search page: https://www.ncs.gov.in/career-center/Pages/Search.aspx
- NCS newer career-center experience: https://betacloud.ncs.gov.in/career-center

## Licensing and access notes

- The NCS site is publicly accessible and operated by the Ministry of Labour & Employment, Government of India.
- I did **not** find an explicit open-data license comparable to OGD/NDSAP on the job-search and career-center pages.
- That means a jobs feature is likely feasible for public linking and limited metadata ingestion, but any automated scraping, bulk caching, or republication should be checked against the site’s terms, robots behavior, and practical rate limits before rollout.

## Update frequency

- Jobs appear to be near-real-time or at least daily-updated based on the live search surface and homepage live counters.
- Career-center directory updates appear less frequent but still active; the current beta surface shows a “Last updated: 31-08-25” footer marker, which suggests periodic directory refreshes rather than static archival data.

## District and state granularity

- **District granularity:** yes. Both the jobs search and career-center search expose district/state location selectors.
- **State granularity:** yes.
- **National fallback:** yes.
- Important constraint: granularity is driven by user-facing location filters, not an openly documented district bulk-export API.

## Available data fields

### Jobs search surface

- job title / keyword match
- district / state location filters
- employer / organisation type
- sector / functional area / functional role
- salary type and minimum salary filters
- posted date filters
- government jobs / internships variants on the same surface

### Career center surface

- center name
- district and state
- address
- phone
- email
- website URL
- organisation type / sector filters

## Data quality concerns

- District names are user-facing strings, so alias normalization will matter.
- Jobs can disappear quickly; stale cache policy must be conservative.
- Duplicate postings and recruiter spam are likely on any large employment marketplace.
- Some postings may have incomplete salary, district, or employer metadata.
- Career-center directory quality may vary by state and may include outdated phone/email fields.

## Implementation risks

- No clearly documented public bulk API was confirmed from the public pages reviewed.
- Site structure may be JavaScript-heavy or protected against aggressive scraping.
- Bulk republication risk is higher here than with OGD datasets because this looks like a transactional service, not a clearly licensed data dump.
- Vacancy counts may fluctuate rapidly, so the UI must clearly label freshness and avoid “official opportunity guarantee” wording.

## Privacy and legal concerns

- Do not collect or proxy applicant personal data.
- Do not imply ForThePeople is an official application channel.
- Keep outbound actions as deep links to NCS or employer pages.
- Preserve fraud warnings because the NCS site itself prominently warns users about impersonation and fee scams.

## Split implementation tasks

1. **Data model**
   - Add `district_job_snapshot` and `career_center_directory` tables with source URL, fetched timestamp, district/state slugs, and safe public metadata only.
2. **Scraper / import / API**
   - Start with career centers first because the fields are directory-like and lower-churn than jobs.
   - Validate whether NCS exposes network calls that are safer than HTML scraping.
   - Expose `/api/data/jobs` and `/api/data/career-centers` with explicit freshness and source-link fields.
3. **UI surface**
   - Add an “Opportunities” card on district pages with live job count, latest roles, and nearby career-center contact info.
   - Keep apply actions as outbound links only.
4. **Tests**
   - Cover district alias joins, missing-contact fallbacks, stale freshness copy, duplicate-job dedupe, and empty local-dev behavior.
5. **Rollout / backfill**
   - Pilot career centers first, then test a narrow jobs ingestion path for 1-2 states before expanding nationally.

## Recommendation

This is a promising feature, but it is **not as implementation-safe as OGD-backed datasets**. The best first slice is a **District Career Center Directory** backed by NCS public pages, followed by a careful legal/technical review before adding live job-posting ingestion.
