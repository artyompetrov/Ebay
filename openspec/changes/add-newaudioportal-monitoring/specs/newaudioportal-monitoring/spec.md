# Spec Delta

## Purpose

Collects sale offers from the configured sections of the newaudioportal.com forum, turning each recently active topic into an advertisement of its topic starter built from the opening post and the starter's latest posts, while keeping the load on the site low.

## ADDED Requirements

### Requirement: Only the first page of each configured section is read
For each configured forum section (default: section 197, "Продам радиолампы."), every collection SHALL request exactly one section page: the first page, which lists topics by last activity. It SHALL NOT request further section pages.

#### Scenario: Default configuration reads one section page
- **WHEN** no sections are configured and a collection runs
- **THEN** exactly one section page is requested, the first page of section 197, and no other section page is requested

### Requirement: Section page parsing
The system SHALL extract from each topic row of a section page the topic id, the absolute topic link and the time of the topic's last post, read as UTC from the row's machine-readable last-post timestamp. A row without a parsable id, link or last-post time SHALL be skipped with a logged warning, without failing the other rows.

#### Scenario: Topic row is parsed
- **WHEN** a section page has a row for topic 18273 linking to `https://newaudioportal.com/topic/18273-%D1%80%D0%B0%D0%B4%D0%B8%D0%BE%D0%BB%D0%B0%D0%BC%D0%BF%D1%8B-siemens-e88cc/` whose last post is dated `2026-10-24T14:35:21Z`
- **THEN** the topic id is 18273, the link equals that URI, and the last-post time is 2026-10-24 14:35:21 UTC

#### Scenario: Malformed topic row is skipped
- **WHEN** a section page has one row without a last-post timestamp, alongside a well-formed row
- **THEN** the malformed row is skipped with a logged warning, and the well-formed row's topic is collected

### Requirement: An unusable section page fails the collection
A section page request that fails, answers with a non-success status, or returns a page without a topic list SHALL fail the collection, and no topic page SHALL be requested for that section. A page without a topic list SHALL NOT be treated as a section without topics, so a blocked or changed page is reported by the monitoring run rather than silently yielding nothing.

#### Scenario: Page without a topic list
- **WHEN** the section page request returns a page that has no topic list
- **THEN** the collection fails and no advertisement is returned

#### Scenario: Section page answers with an error status
- **WHEN** the section page request answers with status 500
- **THEN** the collection fails and no topic page is requested

### Requirement: Topics are read only when their last post time changes
The system SHALL read a topic's pages only when that topic id has not been read yet with the same last-post time. Otherwise it SHALL reuse the previously built result. Consecutive requests to the site SHALL be separated by a delay.

#### Scenario: Unchanged topic is not read again
- **WHEN** topic 16745 was already read with last-post time 2026-10-24 15:06:25 UTC, and a later collection sees it with the same last-post time
- **THEN** no topic page is requested for it, and the previously built advertisement is returned

#### Scenario: Topic with a new post is read again
- **WHEN** topic 16745 was read with last-post time 2026-09-13 21:17:27 UTC and appears with last-post time 2026-10-24 15:06:25 UTC
- **THEN** its topic pages are requested again

### Requirement: Opening post and latest page are read
Reading a topic SHALL request its first page, which holds the opening post. When the topic has more than one page, the system SHALL also request its last page and SHALL NOT request the pages in between.

#### Scenario: Single-page topic
- **WHEN** a changed topic has one page
- **THEN** exactly one page of that topic is requested

#### Scenario: Multi-page topic
- **WHEN** a changed topic has three pages
- **THEN** exactly its first and third pages are requested

### Requirement: Advertisement lines come from the topic starter's posts
The advertisement lines SHALL be the topic title, followed by each non-empty line of every post on the read pages written by the topic starter, opening post first, in page order. Each paragraph and each line break SHALL start a new line. Posts written by other users SHALL NOT contribute lines.

#### Scenario: Title, opening post and starter's reply become lines
- **WHEN** topic "ГМ-70 Медный Анод Новые Много" by brakoman has the opening post paragraphs "Цена-8000р/шт" and "В наличии 28шт", a reply by Артём П "возьму все оптом", and a reply by brakoman "1 коробка-14шт продана"
- **THEN** the advertisement lines are exactly "ГМ-70 Медный Анод Новые Много", "Цена-8000р/шт", "В наличии 28шт" and "1 коробка-14шт продана"

#### Scenario: Paragraphs and line breaks split lines
- **WHEN** an opening post body is `<p>6Н2П 10шт</p><p>6Н1П 5шт<br>6Н3П 2шт</p>`
- **THEN** the lines after the title are exactly "6Н2П 10шт", "6Н1П 5шт" and "6Н3П 2шт"

#### Scenario: Starter's posts on both read pages of a multi-page topic
- **WHEN** a topic has three pages, the starter wrote the opening post "6С33С 4шт" and a reply "6Н2П 10шт" on page 1, nothing on page 2 except "6П14П 8шт", and a reply "ГУ-50 2шт" on page 3
- **THEN** the lines after the title are exactly "6С33С 4шт", "6Н2П 10шт" and "ГУ-50 2шт"

#### Scenario: Opening post is re-read on every topic read
- **WHEN** a topic is read again after its starter edited the opening post to add the line "6С33С-В 4шт" and someone posted a reply
- **THEN** the new advertisement lines contain "6С33С-В 4шт"

### Requirement: Quotes and edit notices are excluded from posts
Quoted posts and the forum's "edited by" notices inside the topic starter's posts SHALL NOT contribute lines, so another user's text quoted in a reply is not attributed to the seller.

#### Scenario: Starter's reply quoting a buyer
- **WHEN** a post by the topic starter quotes DOK72's "Хочу приобрести остаток ламп." and adds "Остаток 10шт"
- **THEN** the advertisement lines contain "Остаток 10шт" and do not contain "Хочу приобрести остаток ламп."

#### Scenario: Edit notice is not a line
- **WHEN** the opening post contains "6Н2П 10шт" and an edit notice "Edited October 20 by brakoman"
- **THEN** the advertisement lines contain "6Н2П 10шт" and no line contains "Edited"

### Requirement: Topic seller parsing
The seller key SHALL be the numeric id from the opening post author's profile link `/profile/<id>-<slug>/`, and the seller display name SHALL be that author's nickname. Posts are attributed to the starter by profile id, not by nickname. A topic whose opening post has no author profile link, such as one by a deleted account, SHALL be skipped with a logged warning.

#### Scenario: Seller key and display name
- **WHEN** a topic's opening post is written by "brakoman" linking to `https://newaudioportal.com/profile/3913-brakoman/`
- **THEN** the advertisement has seller key `3913` and display name "brakoman"

#### Scenario: Topic without an author profile link is skipped
- **WHEN** a topic's opening post has no link to an author profile
- **THEN** the topic is not returned, and a warning is logged

### Requirement: Topics without any author fail the collection
When the listed topics that were read in a collection, or reused from earlier reads, all lack an opening post author with a profile link, the collection SHALL fail instead of returning no advertisements, so a markup change that hides authors is reported on every run. Topics that could not be fetched SHALL NOT count. A single topic without an author among topics with authors SHALL only be skipped.

#### Scenario: No topic has an author
- **WHEN** a section page lists two topics and neither opening post has an author profile link
- **THEN** the collection fails

#### Scenario: Failure repeats while the topics are remembered
- **WHEN** a collection failed because no topic had an author, and the next collection sees the same topics with the same last-post times
- **THEN** that collection fails again without requesting any topic page

#### Scenario: One topic without an author among others
- **WHEN** a section page lists two topics and only the first one's opening post has no author profile link
- **THEN** the collection succeeds and returns the second topic's advertisement

### Requirement: Advertisement date is the topic starter's latest post
The advertisement date SHALL be the time of the latest post by the topic starter among the read posts, the opening post included. Posts by other users SHALL NOT move it. The advertisement title SHALL be the topic title and its link SHALL be the topic link.

#### Scenario: Buyer's reply does not move the date
- **WHEN** the topic starter's latest post is dated 2026-09-13 21:17:27 UTC and another user replied on 2026-10-24 15:06:25 UTC
- **THEN** the advertisement date is 2026-09-13 21:17:27 UTC

#### Scenario: Starter has no post on the last page
- **WHEN** a two-page topic's opening post is dated 2026-03-18 15:11:39 UTC, the starter has no other post, and page 2 has only other users' posts
- **THEN** the advertisement date is 2026-03-18 15:11:39 UTC

### Requirement: A failed topic read skips only that topic
If any page of a topic cannot be fetched, or a fetched page has no topic title or no posts, the system SHALL log a warning, skip that topic in this collection without remembering the failure, and continue with the other topics.

#### Scenario: One topic fails to load
- **WHEN** a section page lists two changed topics and the request for the first topic's page fails
- **THEN** a warning is logged, the second topic's advertisement is returned, and the next collection requests the first topic again

#### Scenario: Last page of a topic fails to load
- **WHEN** a changed topic has two pages, page 1 loads and the request for page 2 fails
- **THEN** a warning is logged, the topic is not returned, and the next collection requests it again

#### Scenario: Topic page without posts is not remembered
- **WHEN** a topic page is returned without any post
- **THEN** a warning is logged, the topic is not returned, and the next collection requests it again

### Requirement: Seller contact is the topic starter's profile link
The contact of a newaudioportal.com advertisement SHALL be the absolute URL `https://newaudioportal.com/profile/<seller key>-<slug>/`, where the slug is the seller display name lowercased, with whitespace runs replaced by `-` and URL-escaped, or `user` when that is empty. The system SHALL NOT make any request to resolve it.

#### Scenario: Contact is the profile URL
- **WHEN** the contact is resolved for an advertisement whose seller key is `3913` and display name is "brakoman"
- **THEN** the contact is `https://newaudioportal.com/profile/3913-brakoman/`, and no HTTP request is made to resolve it

#### Scenario: Display name with spaces and Cyrillic letters
- **WHEN** the contact is resolved for an advertisement whose seller key is `3550` and display name is "Артём П"
- **THEN** the contact is `https://newaudioportal.com/profile/3550-%D0%B0%D1%80%D1%82%D1%91%D0%BC-%D0%BF/`

#### Scenario: Empty display name
- **WHEN** the contact is resolved for an advertisement whose seller key is `3913` and display name is empty
- **THEN** the contact is `https://newaudioportal.com/profile/3913-user/`
