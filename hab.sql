create database HAB character set='utf8mb4' collate ='utf8mb4_spanish_ci';
use HAB;

create table us (
	id					int unsigned auto_increment primary key,
    usName				varchar(20) not null unique,
    usRealName			varchar(100) not null,
    birthDate			date not null,
    creationDate		datetime,
    lastAccessDate		datetime,
    websiteUrl			varchar(100),
    profileImageUrl		varchar(100),
    userEmail			varchar(100) not null,
    profession			varchar(20),
    skills				varchar(100),
    aboutMe				text,	
    reputation			int,
    ProfileViews		int
);

create table typeRequest (
	id					int unsigned auto_increment primary key,
    typeReq				enum ('Photo Edition', 'Graphic Design', 'Logo Prototype', 'Text Edition', 'Others', 'Corporative Design','Illustration')
);

create table request (
	id					int unsigned auto_increment primary key,
    user_id             int unsigned not null,
	typeRequest_id		int unsigned not null,
    creationDate		datetime,
    lastEditDate		datetime,
    lastActivityDAte	datetime,
	acceptedAnswers     enum ('true', 'false') default 'true',
    title				varchar(20),
    descriptionRequest	tinytext,
    fileRequest			varchar(30),
    filename			varchar(30),
	constraint request_user_id_fk1 foreign key (user_id)
		references us(id) on delete restrict,
	constraint request_typeRequest_id_fk2 foreign key (typeRequest_id)
		references typeRequest(id) on delete restrict
);

create table solution (
	id					int unsigned auto_increment primary key,
    user_id             int unsigned not null,
    request_id			int unsigned not null,
    creationDate		datetime,
    title				varchar(20),
    descriptionSolution	tinytext,
    fileSolution		varchar(30),
    filenameSol			varchar(30),
    score				float,
	constraint solution_user_id_fk1 foreign key (user_id)
		references us(id) on delete restrict,
	constraint solution_request_id_fk2 foreign key (request_id)
		references request(id) on delete restrict,
	constraint solution_score_ck1 check (score between 0 and 10)
);
create table comments (
	id					int unsigned auto_increment primary key,
    user_id             int unsigned not null,
    solution_id			int unsigned not null,
    creationDate		datetime,
    title				varchar(20),
    commentary			tinytext,
    vote				tinyint unsigned,
	constraint comments_user_id_fk1 foreign key (user_id)
		references us(id) on delete restrict,
	constraint comments_solution_id_fk2 foreign key (solution_id)
		references solution(id) on delete restrict,
	constraint comments_vote_ck1 check (vote between 0 and 10)
);

create table comments_comments (
	id					int unsigned auto_increment primary key,
    user_id             int unsigned not null,
    comment_id			int unsigned not null,
    creationDate		datetime,
    title				varchar(20),
    commentary			tinytext,

	constraint comments_comments_user_id_fk1 foreign key (user_id)
		references us(id) on delete restrict,
	constraint comments_comments_comment_id_fk2 foreign key (comment_id)
		references comments(id) on delete restrict
);

create table comments_request (
	id					int unsigned auto_increment primary key,
    user_id             int unsigned not null,
    request_id			int unsigned not null,
    creationDate		datetime,
    title				varchar(20),
    commentary			tinytext,
	constraint comments_request_user_id_fk1 foreign key (user_id)
		references us(id) on delete restrict,
	constraint comments_request_id_fk2 foreign key (request_id)
		references request(id) on delete restrict
);

create table comments_comments_request (
	id					int unsigned auto_increment primary key,
    user_id             int unsigned not null,
    comment_request_id	int unsigned not null,
    creationDate		datetime,
    title				varchar(20),
    commentary			tinytext,

	constraint comments_comments_request_user_id_fk1 foreign key (user_id)
		references us(id) on delete restrict,
	constraint comments_comments_comment_request_id_fk2 foreign key (comment_request_id)
		references comments_request(id) on delete restrict
);







