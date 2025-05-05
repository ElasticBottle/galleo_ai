CREATE TABLE "ra_fee_quote_item" (
	"id" serial PRIMARY KEY NOT NULL,
	"team_id" integer NOT NULL,
	"description" text NOT NULL,
	"base_price_unit" integer DEFAULT 0 NOT NULL,
	"base_price_decimal" integer DEFAULT 2 NOT NULL,
	"base_price_currency" text DEFAULT 'SGD' NOT NULL,
	"professional_price_unit" integer DEFAULT 0 NOT NULL,
	"professional_price_decimal" integer DEFAULT 2 NOT NULL,
	"professional_price_currency" text DEFAULT 'SGD' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "ra_team_role" (
	"user_id" integer NOT NULL,
	"team_id" integer NOT NULL,
	"role" varchar(64) DEFAULT 'member' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	CONSTRAINT "ra_team_role_user_id_team_id_pk" PRIMARY KEY("user_id","team_id")
);
--> statement-breakpoint
CREATE TABLE "ra_team" (
	"team_id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "ra_user" (
	"user_id" serial PRIMARY KEY NOT NULL,
	"provider_id" text NOT NULL,
	"username" text,
	"email" text,
	"image_url" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	CONSTRAINT "ra_user_provider_id_unique" UNIQUE("provider_id")
);
--> statement-breakpoint
ALTER TABLE "ra_fee_quote_item" ADD CONSTRAINT "ra_fee_quote_item_team_id_ra_team_team_id_fk" FOREIGN KEY ("team_id") REFERENCES "public"."ra_team"("team_id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "ra_team_role" ADD CONSTRAINT "ra_team_role_user_id_ra_user_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."ra_user"("user_id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "ra_team_role" ADD CONSTRAINT "ra_team_role_team_id_ra_team_team_id_fk" FOREIGN KEY ("team_id") REFERENCES "public"."ra_team"("team_id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
CREATE INDEX "fee_quote_item_team_id_idx" ON "ra_fee_quote_item" USING btree ("team_id");--> statement-breakpoint
CREATE INDEX "team_name_unique_idx" ON "ra_team" USING btree ("name");--> statement-breakpoint
CREATE INDEX "user_username_unique_idx" ON "ra_user" USING btree ("username");--> statement-breakpoint
CREATE INDEX "user_email_unique_idx" ON "ra_user" USING btree ("email");--> statement-breakpoint
CREATE UNIQUE INDEX "user_provider_id_unique_idx" ON "ra_user" USING btree ("provider_id");