SET session_replication_role = replica;

--
-- PostgreSQL database dump
--

-- Dumped from database version 17.4
-- Dumped by pg_dump version 17.4

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: audit_log_entries; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."audit_log_entries" ("instance_id", "id", "payload", "created_at", "ip_address") VALUES
	('00000000-0000-0000-0000-000000000000', 'fade571f-221f-4d63-a7ce-999875fd1947', '{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"provider":"email","user_email":"admin@example.com","user_id":"5f8a938c-c73f-4b2e-b0e4-ab701181dba5","user_phone":""}}', '2025-10-01 15:50:10.379191+00', ''),
	('00000000-0000-0000-0000-000000000000', 'c29e8cf0-b1cd-4b52-8a79-3d3941571f14', '{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"provider":"email","user_email":"john@example.com","user_id":"e86faa69-a0f0-49d6-a667-1d8f89793391","user_phone":""}}', '2025-10-01 15:50:10.457168+00', ''),
	('00000000-0000-0000-0000-000000000000', '20494b5f-f7ad-4fab-927d-ed0afe9b9b2b', '{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"provider":"email","user_email":"jane@example.com","user_id":"baffc45e-442e-4e63-923d-ec85991b0cd0","user_phone":""}}', '2025-10-01 15:50:10.530239+00', ''),
	('00000000-0000-0000-0000-000000000000', '5782f52c-592c-4c8a-a844-5ec882a2a73d', '{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"provider":"email","user_email":"bob@example.com","user_id":"c072175a-c693-4aaa-93b5-5130729314ca","user_phone":""}}', '2025-10-01 15:50:10.605919+00', ''),
	('00000000-0000-0000-0000-000000000000', 'fd446da2-ed6f-48dd-94b5-e6c004106bbb', '{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"provider":"email","user_email":"alice@example.com","user_id":"95c1c8b5-0627-4db1-abd3-27674b09256d","user_phone":""}}', '2025-10-01 15:50:10.68156+00', ''),
	('00000000-0000-0000-0000-000000000000', '706b1feb-b07b-445c-90d3-843e96d97c77', '{"action":"login","actor_id":"5f8a938c-c73f-4b2e-b0e4-ab701181dba5","actor_username":"admin@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-10-01 15:50:49.337071+00', ''),
	('00000000-0000-0000-0000-000000000000', '16d73a77-c83f-42e4-9f20-ba43ca56a62a', '{"action":"logout","actor_id":"5f8a938c-c73f-4b2e-b0e4-ab701181dba5","actor_username":"admin@example.com","actor_via_sso":false,"log_type":"account"}', '2025-10-01 15:51:12.019834+00', ''),
	('00000000-0000-0000-0000-000000000000', '0104d8c2-8130-4551-bc82-6bee99d6c2a6', '{"action":"login","actor_id":"e86faa69-a0f0-49d6-a667-1d8f89793391","actor_username":"john@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-10-01 15:51:15.491063+00', '');


--
-- Data for Name: flow_state; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: users; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."users" ("instance_id", "id", "aud", "role", "email", "encrypted_password", "email_confirmed_at", "invited_at", "confirmation_token", "confirmation_sent_at", "recovery_token", "recovery_sent_at", "email_change_token_new", "email_change", "email_change_sent_at", "last_sign_in_at", "raw_app_meta_data", "raw_user_meta_data", "is_super_admin", "created_at", "updated_at", "phone", "phone_confirmed_at", "phone_change", "phone_change_token", "phone_change_sent_at", "email_change_token_current", "email_change_confirm_status", "banned_until", "reauthentication_token", "reauthentication_sent_at", "is_sso_user", "deleted_at", "is_anonymous") VALUES
	('00000000-0000-0000-0000-000000000000', '95c1c8b5-0627-4db1-abd3-27674b09256d', 'authenticated', 'authenticated', 'alice@example.com', '$2a$10$FrEzROfh7Pu1tHgH45ldU.fNBIkznWN/at8V3mc6jUQwsDpphT2B.', '2025-10-01 15:50:10.682607+00', NULL, '', NULL, '', NULL, '', '', NULL, NULL, '{"provider": "email", "providers": ["email"]}', '{"name": "Alice Brown", "avatar_url": "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150", "email_verified": true}', NULL, '2025-10-01 15:50:10.679603+00', '2025-10-01 15:50:10.683249+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '5f8a938c-c73f-4b2e-b0e4-ab701181dba5', 'authenticated', 'authenticated', 'admin@example.com', '$2a$10$oiYgf3M7oZXoapJQ84ITDerSdfEp1SZS5srVn5PAGsin5dJvH9GO6', '2025-10-01 15:50:10.380855+00', NULL, '', NULL, '', NULL, '', '', NULL, '2025-10-01 15:50:49.337783+00', '{"provider": "email", "providers": ["email"]}', '{"name": "管理者ユーザー", "avatar_url": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150", "email_verified": true}', NULL, '2025-10-01 15:50:10.375724+00', '2025-10-01 15:50:49.341706+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', 'e86faa69-a0f0-49d6-a667-1d8f89793391', 'authenticated', 'authenticated', 'john@example.com', '$2a$10$a7GiKAhmfNnvgHOEwpRxPu1P9jR2Txsa1o7VjpCUBF1ufDA9iUEOS', '2025-10-01 15:50:10.458211+00', NULL, '', NULL, '', NULL, '', '', NULL, '2025-10-01 15:51:15.491915+00', '{"provider": "email", "providers": ["email"]}', '{"name": "John Doe", "avatar_url": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150", "email_verified": true}', NULL, '2025-10-01 15:50:10.455316+00', '2025-10-01 15:51:15.494099+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', 'baffc45e-442e-4e63-923d-ec85991b0cd0', 'authenticated', 'authenticated', 'jane@example.com', '$2a$10$m8yEOaC2LRGPDJRvrH7.lOPntkJD2GJv3ndQ21jXKZ4i6e9WWXh6G', '2025-10-01 15:50:10.531182+00', NULL, '', NULL, '', NULL, '', '', NULL, NULL, '{"provider": "email", "providers": ["email"]}', '{"name": "Jane Smith", "avatar_url": "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150", "email_verified": true}', NULL, '2025-10-01 15:50:10.528248+00', '2025-10-01 15:50:10.531817+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', 'c072175a-c693-4aaa-93b5-5130729314ca', 'authenticated', 'authenticated', 'bob@example.com', '$2a$10$kRv8kfodiQBb2/DtytnsAOtQJbZYPzFz5BJbZN/.E/uqxGZg76uEq', '2025-10-01 15:50:10.606976+00', NULL, '', NULL, '', NULL, '', '', NULL, NULL, '{"provider": "email", "providers": ["email"]}', '{"name": "Bob Johnson", "avatar_url": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150", "email_verified": true}', NULL, '2025-10-01 15:50:10.603777+00', '2025-10-01 15:50:10.607572+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false);


--
-- Data for Name: identities; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."identities" ("provider_id", "user_id", "identity_data", "provider", "last_sign_in_at", "created_at", "updated_at", "id") VALUES
	('5f8a938c-c73f-4b2e-b0e4-ab701181dba5', '5f8a938c-c73f-4b2e-b0e4-ab701181dba5', '{"sub": "5f8a938c-c73f-4b2e-b0e4-ab701181dba5", "email": "admin@example.com", "email_verified": false, "phone_verified": false}', 'email', '2025-10-01 15:50:10.377721+00', '2025-10-01 15:50:10.377776+00', '2025-10-01 15:50:10.377776+00', '87f6f143-a8bd-4846-bc7c-fd8dd2ca2f3a'),
	('e86faa69-a0f0-49d6-a667-1d8f89793391', 'e86faa69-a0f0-49d6-a667-1d8f89793391', '{"sub": "e86faa69-a0f0-49d6-a667-1d8f89793391", "email": "john@example.com", "email_verified": false, "phone_verified": false}', 'email', '2025-10-01 15:50:10.456358+00', '2025-10-01 15:50:10.456392+00', '2025-10-01 15:50:10.456392+00', 'a75ac3e7-cb4e-4869-aa31-8a8093cb57a7'),
	('baffc45e-442e-4e63-923d-ec85991b0cd0', 'baffc45e-442e-4e63-923d-ec85991b0cd0', '{"sub": "baffc45e-442e-4e63-923d-ec85991b0cd0", "email": "jane@example.com", "email_verified": false, "phone_verified": false}', 'email', '2025-10-01 15:50:10.529418+00', '2025-10-01 15:50:10.529468+00', '2025-10-01 15:50:10.529468+00', '49194824-e3f8-4c94-919c-b42b31db127d'),
	('c072175a-c693-4aaa-93b5-5130729314ca', 'c072175a-c693-4aaa-93b5-5130729314ca', '{"sub": "c072175a-c693-4aaa-93b5-5130729314ca", "email": "bob@example.com", "email_verified": false, "phone_verified": false}', 'email', '2025-10-01 15:50:10.604929+00', '2025-10-01 15:50:10.60498+00', '2025-10-01 15:50:10.60498+00', '4893a542-6fcb-480e-b39c-fd77443e68d0'),
	('95c1c8b5-0627-4db1-abd3-27674b09256d', '95c1c8b5-0627-4db1-abd3-27674b09256d', '{"sub": "95c1c8b5-0627-4db1-abd3-27674b09256d", "email": "alice@example.com", "email_verified": false, "phone_verified": false}', 'email', '2025-10-01 15:50:10.680719+00', '2025-10-01 15:50:10.680757+00', '2025-10-01 15:50:10.680757+00', 'e367f423-0200-4098-bdbd-146cd226601c');


--
-- Data for Name: instances; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sessions; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."sessions" ("id", "user_id", "created_at", "updated_at", "factor_id", "aal", "not_after", "refreshed_at", "user_agent", "ip", "tag") VALUES
	('4c1f8c61-adc9-4b05-aa1e-862fd9f87f65', 'e86faa69-a0f0-49d6-a667-1d8f89793391', '2025-10-01 15:51:15.491983+00', '2025-10-01 15:51:15.491983+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', '172.18.0.1', NULL);


--
-- Data for Name: mfa_amr_claims; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."mfa_amr_claims" ("session_id", "created_at", "updated_at", "authentication_method", "id") VALUES
	('4c1f8c61-adc9-4b05-aa1e-862fd9f87f65', '2025-10-01 15:51:15.494521+00', '2025-10-01 15:51:15.494521+00', 'password', 'f0c96f1a-ddd9-44a7-a6f8-29b13c580089');


--
-- Data for Name: mfa_factors; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: mfa_challenges; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: one_time_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."refresh_tokens" ("instance_id", "id", "token", "user_id", "revoked", "created_at", "updated_at", "parent", "session_id") VALUES
	('00000000-0000-0000-0000-000000000000', 2, 'gisszbpjwhm4', 'e86faa69-a0f0-49d6-a667-1d8f89793391', false, '2025-10-01 15:51:15.492914+00', '2025-10-01 15:51:15.492914+00', NULL, '4c1f8c61-adc9-4b05-aa1e-862fd9f87f65');


--
-- Data for Name: sso_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: saml_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: saml_relay_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sso_domains; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "logs", "rolled_back_at", "started_at", "applied_steps_count") VALUES
	('a7ccd0d0-c41b-4020-83c6-c5fc81ef9e60', '4ccdb93a0c48e3f8cd1da3d0730388ff2f9b80069dbb2c61374ba80955a861da', '2025-10-01 15:50:06.135128+00', '20250810211411_init', NULL, NULL, '2025-10-01 15:50:06.127065+00', 1),
	('a68c157f-73fe-4efe-9610-263747b5a385', '60dd5883e8905d5dafe3cf5fcdfeba528cfdc879c7d9112ec9f030391f20b786', '2025-10-01 15:50:06.143805+00', '20250816034133_add_updated_at_default', NULL, NULL, '2025-10-01 15:50:06.136824+00', 1),
	('79e54690-98cf-410f-8b86-c0fd7d4c6b43', 'cd927f9286456e79afc4b5b08d2bfca77910f7daf4cdd8be4e81f03144171d0a', '2025-10-01 15:50:06.155134+00', '20250926023208_add_products_table', NULL, NULL, '2025-10-01 15:50:06.145927+00', 1),
	('50b874b0-85d9-4f73-89b1-afb0db731dcf', '85f1b579fdf19ebeb3bdc2d3b95155a940c46b7d8366c222d8ec2472575abc5b', '2025-10-01 15:50:06.163899+00', '20250926091420_update_imageurl_to_text', NULL, NULL, '2025-10-01 15:50:06.157367+00', 1);


--
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."products" ("id", "name", "description", "price", "image_url", "category", "is_active", "created_at", "updated_at") VALUES
	('a1111111-1111-1111-1111-111111111111', 'クラシックバーガー', 'ビーフパティ、レタス、トマト、オニオンの定番バーガー', 580, 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400', 'バーガー', true, '2024-01-01 00:00:00+00', '2024-01-01 00:00:00+00'),
	('b2222222-2222-2222-2222-222222222222', 'チーズバーガー', 'とろけるチェダーチーズが決め手のバーガー', 650, 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400', 'バーガー', true, '2024-01-02 00:00:00+00', '2024-01-02 00:00:00+00'),
	('c3333333-3333-3333-3333-333333333333', 'ベーコンバーガー', 'カリカリベーコンが香ばしいボリューム満点バーガー', 720, 'https://images.unsplash.com/photo-1553979459-d2229ba7433a?w=400', 'バーガー', true, '2024-01-03 00:00:00+00', '2024-01-03 00:00:00+00'),
	('d4444444-4444-4444-4444-444444444444', 'フライドポテト', 'サクサクの黄金フライドポテト（Mサイズ）', 280, 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400', 'サイド', true, '2024-01-04 00:00:00+00', '2024-01-04 00:00:00+00'),
	('e5555555-5555-5555-5555-555555555555', 'チキンナゲット', 'ジューシーなチキンナゲット6個入り', 380, 'https://images.unsplash.com/photo-1562967914-608f82629710?w=400', 'サイド', true, '2024-01-05 00:00:00+00', '2024-01-05 00:00:00+00'),
	('f6666666-6666-6666-6666-666666666666', 'オニオンリング', '甘くてサクサクのオニオンリング5個入り', 320, 'https://images.unsplash.com/photo-1639024471283-03518883512d?w=400', 'サイド', true, '2024-01-06 00:00:00+00', '2024-01-06 00:00:00+00'),
	('a7777777-7777-7777-7777-777777777777', 'コーラ', '氷入りコーラ（Mサイズ）', 220, 'https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=400', '飲み物', true, '2024-01-07 00:00:00+00', '2024-01-07 00:00:00+00'),
	('b8888888-8888-8888-8888-888888888888', 'アイスコーヒー', '香り豊かなアイスコーヒー（Mサイズ）', 250, 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400', '飲み物', true, '2024-01-08 00:00:00+00', '2024-01-08 00:00:00+00');


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: buckets; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: buckets_analytics; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: iceberg_namespaces; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: iceberg_tables; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: objects; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: prefixes; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: s3_multipart_uploads; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: s3_multipart_uploads_parts; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: hooks; Type: TABLE DATA; Schema: supabase_functions; Owner: supabase_functions_admin
--



--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE SET; Schema: auth; Owner: supabase_auth_admin
--

SELECT pg_catalog.setval('"auth"."refresh_tokens_id_seq"', 2, true);


--
-- Name: hooks_id_seq; Type: SEQUENCE SET; Schema: supabase_functions; Owner: supabase_functions_admin
--


--
-- PostgreSQL database dump complete
--

RESET ALL;
