CREATE TABLE "ra_chat" (
	"chat_id" varchar(32) PRIMARY KEY NOT NULL,
	"team_id" integer NOT NULL,
	"title" varchar(255) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "ra_message" (
	"message_id" varchar(32) PRIMARY KEY NOT NULL,
	"chat_id" varchar(32) NOT NULL,
	"user_id" integer NOT NULL,
	"parts" jsonb NOT NULL,
	"attachments" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"role" varchar(255) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "ra_chat" ADD CONSTRAINT "ra_chat_team_id_ra_team_team_id_fk" FOREIGN KEY ("team_id") REFERENCES "public"."ra_team"("team_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ra_message" ADD CONSTRAINT "ra_message_chat_id_ra_chat_chat_id_fk" FOREIGN KEY ("chat_id") REFERENCES "public"."ra_chat"("chat_id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "ra_message" ADD CONSTRAINT "ra_message_user_id_ra_user_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."ra_user"("user_id") ON DELETE cascade ON UPDATE cascade;