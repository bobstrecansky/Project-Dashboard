---------------------------------------------------------------------------
-----These tables account for all of the "basic" information regarding a Resource (SA / TPM / PM).
-----These include everything from basic HR data, through new hire training, and into potential attrition tracking.-----

-----[START] Employee TABLE-----
CREATE TABLE Employee
(
employee_id   serial    NOT NULL UNIQUE,
title_id    integer    NOT NULL,
name    text    NOT NULL,
ldap    text    NOT NULL,
phone_extension    text    NOT NULL,
phone_primary    text    NOT NULL,
phone_secondary    text    NOT NULL,
city    text    NOT NULL,
state     text    NOT NULL,
country     text    NOT NULL,
work_hours_begin    time     NOT NULL,
work_hours_end   	 time     NOT NULL,
start_date   	 date     NOT NULL,
birth_date   	 date     NOT NULL,
end_date   	 date
);

ALTER TABLE Employee ADD PRIMARY KEY (employee_id);
-----[END] Employee TABLE-----


-----[START] SkillType TABLE-----
CREATE TABLE SkillType
(
skill_type_id   	 serial    NOT NULL UNIQUE,
name   		 text    NOT NULL
);
-----[END] SkillType TABLE-----

-----[START] AttritionType TABLE-----
CREATE TABLE AttritionType
(
attrition_type_id   	 serial    NOT NULL UNIQUE,
name    		 text    NOT NULL
);
-----[END] AttritionType TABLE-----

-----[START] Attrition TABLE-----
CREATE TABLE Attrition
(
attrition_id     serial    NOT NULL UNIQUE,
employee_id    integer    REFERENCES Employee(employee_id),
attrition_type_id    integer    REFERENCES AttritionType(attrition_type_id),
destination     text    NOT NULL,
end_date     date
);

ALTER TABLE Attrition ADD PRIMARY KEY (attrition_id);
-----[END] Attrition TABLE-----



---------------------------------------------------------------------------
-----These tables extend the DB into managing the business. Included in here are region, assigner, and OOO information.
-----They heavily rely on the list tables to provide connections between them.-----

-----[START] Team TABLE-----
CREATE TABLE Team
(
team_id    serial NOT NULL UNIQUE,
manager_id    integer    NOT NULL,
name     text NOT NULL,
mailing_list    text
);

ALTER TABLE Team ADD PRIMARY KEY (team_id);
-----[END] Team TABLE-----

-----[START] Region TABLE-----
CREATE TABLE Region
(
region_id    serial NOT NULL UNIQUE,
manager_id    integer    NOT NULL,
assigner_id    integer    NOT NULL,
lead_id   	 integer    NOT NULL,
name     text NOT NULL,
cmg_partner   	 text NOT NULL,
tsg_partner   	 text NOT NULL,
mailing_list    text
);

ALTER TABLE Region ADD PRIMARY KEY (region_id);
-----[END] Region TABLE-----

-----[START] Assigner TABLE-----
CREATE TABLE Assigner
(
assigner_id    serial    NOT NULL,
employee_id    integer    REFERENCES Employee(employee_id),
region_id    integer    REFERENCES Region(region_id)
);

ALTER TABLE Assigner ADD PRIMARY KEY (assigner_id);
-----[END] Assigner TABLE-----

-----[START] OutOfOffice TABLE-----
CREATE TABLE OutOfOffice
(
ooo_id     serial NOT NULL,
employee_id    integer    REFERENCES Employee(employee_id),
ooo_type_id   	 integer,
ooo_availability_id    integer,
name     text,
description   	 text,
start_date    date,
end_date     date
);

ALTER TABLE OutOfOffice ADD PRIMARY KEY (ooo_id);
-----[END] OutOfOffice TABLE-----

---------------------------------------------------------------------------
-----These are mapping tables. Simply used to model a 1...n relationship
-----1 SA has multiple skills
-----1 Manager has multiple regions
-----1 SA could have multiple regions

-----[START] Skills TABLE-----
CREATE TABLE Skills
(
skill_id   	 serial    NOT NULL UNIQUE,
skill_type_id   	 integer    REFERENCES SkillType(skill_type_id),
name    		 text    NOT NULL
);
-----[END] Skills TABLE-----

-----[START] EmployeeToSkill TABLE-----
CREATE TABLE EmployeeToSkill
(
employee_id integer REFERENCES Employee(employee_id),
skill_id  integer REFERENCES Skills(skill_id),
skill_date  date,
level   integer
);
-----[END] EmployeeToSkill TABLE-----

-----[START] AchievementType TABLE-----
CREATE TABLE AchievementType
(
achievement_type_id   	 integer    NOT NULL UNIQUE,
name    		 text    NOT NULL
);

-----[END] AchievementType TABLE-----

-----[START] Achievements TABLE-----
CREATE TABLE Achievements
(
achievement_id    integer    NOT NULL UNIQUE,
achievement_type_id integer REFERENCES AchievementType(achievement_type_id),
name    			 text    NOT NULL
);
-----[END] Achievements TABLE-----

-----[START] EmployeeToAchievement TABLE-----
CREATE TABLE EmployeeToAchievement
(
employee_id integer REFERENCES Employee(employee_id),
achievement_id  integer REFERENCES Achievements(achievement_id),
achievement_date  date
);
-----[END] EmployeeToAchievement TABLE-----

-----[START] Awards TABLE-----
CREATE TABLE Awards
(
award_id    integer    NOT NULL UNIQUE,
name    			 text    NOT NULL
);
-----[END] Awards TABLE-----


-----[START] EmployeeToAward TABLE-----
CREATE TABLE EmployeeToAward
(
employee_id integer REFERENCES Employee(employee_id),
award_id  integer REFERENCES Awards(award_id),
award_date  date,
comments   text
);
-----[END] EmployeeToAward TABLE-----

-----[START] EmployeeToRegion TABLE-----
CREATE TABLE EmployeeToRegion
(
employee_id integer REFERENCES Employee(employee_id),
region_id integer REFERENCES Region(region_id)
);
-----[END] EmployeeToRegion TABLE-----

-----[START] EmployeeToTeam TABLE-----
CREATE TABLE EmployeeToTeam
(
employee_id integer REFERENCES Employee(employee_id),
team_id integer REFERENCES Team(team_id)
);
-----[END] EmployeeToTeam TABLE-----

---------------------------------------------------------------------------
-----These tables will hold values that will be referenced in other tables and used in drop-down boxes on the site-----

-----[START] OutOfOfficeType TABLE-----
CREATE TABLE OutOfOfficeType
(
ooo_type_id   	 serial    NOT NULL,
name    		 text    NOT NULL
);
-----[END] OutOfOfficeType TABLE-----

-----[START] OutOfOfficeAvailability TABLE-----
CREATE TABLE OutOfOfficeAvailability
(
ooo_availability_id   	 serial    NOT NULL,
name    		 text    NOT NULL
);
-----[END] OutOfOfficeAvailability TABLE-----





-----[START] EmployeeTitle TABLE-----
CREATE TABLE EmployeeTitle
(
title_id    serial    NOT NULL UNIQUE,
title    	 text    NOT NULL
);
-----[END] EmployeeTitle TABLE-----

---------------------------------------------------------------------------
----- These tables hold historical data for metrics,
----- graphing, and finding trends.

-----[START] MetricType TABLE-----
CREATE TABLE MetricType
(
metric_type_id   	 serial    NOT NULL UNIQUE,
name   		 text    NOT NULL
);

-----[START] RegionMetrics TABLE-----
CREATE TABLE RegionMetrics
(
region_id integer REFERENCES Region(region_id),
metric_type_id integer REFERENCES MetricType(metric_type_id),
metric_time time NOT NULL,
value decimal NOT NULL
);
-----[END] RegionMetrics TABLE-----


ALTER TABLE MetricType ADD PRIMARY KEY (metric_type_id);
-----[END] MetricType TABLE-----

---------------------------------------------------------------------------
----- Three request types to be handled by the
----- system at first: PeerReview, Backup, and Resource

-----[START] PeerReview TABLE-----
CREATE TABLE PeerReview
(
peer_review_id	serial	NOT NULL UNIQUE,
employee_id    integer    REFERENCES Employee(employee_id),
reviewer_id    integer    REFERENCES Employee(employee_id),
region_id    integer    REFERENCES Region(region_id),
project_link    text    NOT NULL,
act_link	text	NOT NULL,
customer_name    text    NOT NULL,
config_name    text    NOT NULL,
config_version    integer    NOT NULL,
description     text    NOT NULL,
projected_loe     decimal    NOT NULL,
priority    integer     NOT NULL,
requested_date TIMESTAMP NOT NULL,
filled_date   TIMESTAMP,
completed_date TIMESTAMP,
actual_loe   	 decimal,
skill_pri   	 integer,
skill_sec   	 integer,
skill_ter   	 integer
);

ALTER TABLE PeerReview ADD PRIMARY KEY (peer_review_id);
-----[END] PeerReview TABLE-----

-----[START] Backup TABLE-----
CREATE TABLE Backup
(
backup_id   serial    NOT NULL UNIQUE,
employee_id    integer    REFERENCES Employee(employee_id),
backup_employee_id    integer    REFERENCES Employee(employee_id),
region_id    integer    REFERENCES Region(region_id),
project_link    text    NOT NULL,
customer_name    text    NOT NULL,
description     text    NOT NULL,
projected_loe     decimal    NOT NULL,
start_date   	 date NOT NULL,
end_date   date NOT NULL,
requested_date   	 timestamp NOT NULL,
filled_date   timestamp,
completed_date   	 timestamp,
actual_loe   	 decimal,
skill_pri   	 integer, 
skill_sec   	 integer,
skill_ter   	 integer
);

ALTER TABLE Backup ADD PRIMARY KEY (backup_id);
-----[END] Backup TABLE-----

-----[START] Resource TABLE-----
CREATE TABLE Resource
(
resource_id   serial    NOT NULL UNIQUE,
assigner_id    integer    REFERENCES Employee(employee_id),
assigned_employee_id    integer    REFERENCES Employee(employee_id),
region_id    integer    REFERENCES Region(region_id),
salesforce_link    text    NOT NULL,
akamai_poc    text    NOT NULL,
customer_name    text    NOT NULL,
start_date   	 timestamp NOT NULL,
end_date   timestamp NOT NULL,
description     text    NOT NULL,
projected_loe     decimal    NOT NULL,
severity    integer     NOT NULL,
requested_date   	 timestamp NOT NULL,
filled_date   timestamp,
completed_date   	 timestamp,
actual_loe   	 decimal,
skill_pri   	 integer,
skill_sec   	 integer,
skill_ter   	 integer
);

ALTER TABLE Resource ADD PRIMARY KEY (resource_id);
-----[END] Resource TABLE-----

-----[START] AlertType TABLE-----
CREATE TABLE AlertType
(
alert_type_id   	 serial    NOT NULL UNIQUE,
name   		 text    NOT NULL
);

ALTER TABLE AlertType ADD PRIMARY KEY (alert_type_id);
-----[END] AlertType TABLE-----

-----[START] Alerts TABLE-----
CREATE TABLE Alerts
(
alert_id serial NOT NULL UNIQUE,
alert_type_id integer REFERENCES AlertType(alert_type_id),
name  text NOT NULL,
start_date timestamp NOT NULL,
end_date  timestamp NOT NULL
);
-----[END] Alerts TABLE-----
