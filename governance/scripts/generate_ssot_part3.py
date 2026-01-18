
# --- 8) Threshold tokens catalog ---
threshold_rows = [
    ("LOW","SEVERITY","Low severity threshold","generic"),
    ("MED","SEVERITY","Medium severity threshold","generic"),
    ("HIGH","SEVERITY","High severity threshold","generic"),
    ("CRITICAL","SEVERITY","Critical threshold","generic"),
    ("OK","STATE","Normal state token","generic"),
    ("P50","PERCENTILE","Percentile p50 token","latency"),
    ("P95","PERCENTILE","Percentile p95 token","latency"),
    ("P99","PERCENTILE","Percentile p99 token","latency"),
    ("BURN_FAST","SLO","Fast burn rate token","slo"),
    ("BURN_SLOW","SLO","Slow burn rate token","slo"),
    ("EB_EXHAUSTED","SLO","Error budget exhausted token","slo"),
    ("RATE_SPIKE","RATE","Traffic spike token","rate"),
    ("RATE_DROP","RATE","Traffic drop token","rate"),
    ("SAT_HIGH","SATURATION","High saturation token","saturation"),
    ("SAT_CRITICAL","SATURATION","Critical saturation token","saturation"),
    ("DEPTH_HIGH","QUEUE","High queue depth token","queue"),
    ("DEPTH_CRITICAL","QUEUE","Critical queue depth token","queue"),
    ("DLQ_HIGH","QUEUE","High DLQ token","queue"),
    ("DLQ_CRITICAL","QUEUE","Critical DLQ token","queue"),
    ("RETRY_STORM","QUEUE","Retry storm token","queue"),
    ("ABUSE_SPIKE","SECURITY","Abuse spike token","security"),
    ("SIGNATURE_FAIL_SPIKE","SECURITY","Webhook signature failures spike token","security"),
    ("AUTHZ_DENY_SPIKE","SECURITY","AuthZ deny spike token","security"),
    ("TOKEN_SPIKE","LLM","Token spike token","llm"),
    ("COST_SPIKE","LLM","Cost spike token","llm"),
    ("LATENCY_SPIKE","PERF","Latency spike token","perf"),
    ("CITATION_DROP","RAG","Citation coverage drop token","rag"),
    ("RETRIEVAL_EMPTY_SPIKE","RAG","Retrieval empty spike token","rag"),
    ("HALLUCINATION_SPIKE","LLM","Hallucination spike token (eval-derived)","llm"),
    ("W1M","WINDOW","Window 1 minute","window"),
    ("W5M","WINDOW","Window 5 minutes","window"),
    ("W15M","WINDOW","Window 15 minutes","window"),
    ("W1H","WINDOW","Window 1 hour","window"),
    ("W1D","WINDOW","Window 1 day","window"),
    ("W7D","WINDOW","Window 7 days","window"),
    ("W28D","WINDOW","Window 28 days","window"),
]
df_threshold_catalog = pd.DataFrame(threshold_rows, columns=["token","token_category","semantics","applies_to"])

# --- 9) Alert templates catalog ---
alert_templates = [
    ("SRE-ALERT-LATENCY_P99-HIGH-W5M","LATENCY_P99","P99|HIGH|W5M","OBS|INGRESS|CORE|EVENT|LLM|RAG|API|IAM|BILLING|TENANT","Canonical latency alert"),
    ("SRE-ALERT-ERROR_RATE-CRITICAL-W5M","ERROR_RATE","CRITICAL|W5M","OBS|INGRESS|CORE|EVENT|LLM|RAG|API|IAM|BILLING|TENANT","Canonical error alert"),
    ("SRE-ALERT-BURN_FAST-CRITICAL-W5M","ERROR_RATE","BURN_FAST|CRITICAL|W5M","OBS|CORE","SLO burn fast"),
    ("SRE-ALERT-BURN_SLOW-HIGH-W1H","ERROR_RATE","BURN_SLOW|HIGH|W1H","OBS|CORE","SLO burn slow"),
    ("SRE-ALERT-QUEUE_DEPTH-DEPTH_HIGH-W15M","QUEUE_DEPTH","DEPTH_HIGH|W15M","OBS|EVENT","Queue depth high"),
    ("SRE-ALERT-DLQ_COUNT-DLQ_CRITICAL-W15M","DLQ_COUNT","DLQ_CRITICAL|W15M","OBS|EVENT","DLQ critical"),
    ("SRE-ALERT-RETRY_RATE-RETRY_STORM-CRITICAL-W5M","RETRY_RATE","RETRY_STORM|CRITICAL|W5M","OBS|EVENT","Retry storm"),
    ("SRE-ALERT-WEBHOOK_SIGNATURE_FAIL-SIGNATURE_FAIL_SPIKE-HIGH-W5M","ERROR_RATE","SIGNATURE_FAIL_SPIKE|HIGH|W5M","OBS|INGRESS","Webhook signature failures"),
    ("SRE-ALERT-AUTHZ_DENY_RATE-AUTHZ_DENY_SPIKE-HIGH-W5M","AUTHZ_DENY_RATE","AUTHZ_DENY_SPIKE|HIGH|W5M","OBS|IAM","AuthZ deny spike"),
    ("SRE-ALERT-TOKENS_PER_CONV-TOKEN_SPIKE-HIGH-W15M","TOKENS_PER_CONV","TOKEN_SPIKE|HIGH|W15M","OBS|LLM","Token spike"),
    ("SRE-ALERT-COST_PER_TENANT-COST_SPIKE-HIGH-W15M","COST_PER_TENANT","COST_SPIKE|HIGH|W15M","OBS|LLM|BILLING","Cost spike"),
    ("SRE-ALERT-CITATION_COVERAGE-CITATION_DROP-HIGH-W15M","CITATION_COVERAGE","CITATION_DROP|HIGH|W15M","OBS|RAG|LLM","Citation coverage drop"),
    ("SRE-ALERT-RETRIEVAL_EMPTY-RETRIEVAL_EMPTY_SPIKE-HIGH-W15M","RETRIEVAL_EMPTY_RATE","RETRIEVAL_EMPTY_SPIKE|HIGH|W15M","OBS|RAG","Retrieval empty spike"),
]
df_alert_templates = pd.DataFrame(alert_templates, columns=["alert_name","signal","required_tokens","allowed_roots","notes"])

# --- 10) SLO templates catalog ---
slo_templates = [
    ("SRE-SLO-INGRESS-ERROR_RATE-TARGET_AVAILABILITY-W28D","INGRESS","ERROR_RATE","TARGET_AVAILABILITY","W28D","Ingress availability"),
    ("SRE-SLO-INGRESS-LATENCY_P99-TARGET_LATENCY-W28D","INGRESS","LATENCY_P99","TARGET_LATENCY","W28D","Ingress latency"),
    ("SRE-SLO-CORE-ERROR_RATE-TARGET_AVAILABILITY-W28D","CORE","ERROR_RATE","TARGET_AVAILABILITY","W28D","Core availability"),
    ("SRE-SLO-CORE-LATENCY_P99-TARGET_LATENCY-W28D","CORE","LATENCY_P99","TARGET_LATENCY","W28D","Core latency"),
    ("SRE-SLO-EVENT-DLQ_COUNT-TARGET_DELIVERY-W28D","EVENT","DLQ_COUNT","TARGET_DELIVERY","W28D","DLQ delivery health"),
    ("SRE-SLO-EVENT-OUTBOX_DEPTH-TARGET_LATENCY-W7D","EVENT","OUTBOX_DEPTH","TARGET_LATENCY","W7D","Outbox backlog latency"),
    ("SRE-SLO-LLM-LLM_LATENCY_P99-TARGET_LATENCY-W28D","LLM","LLM_LATENCY_P99","TARGET_LATENCY","W28D","LLM latency"),
    ("SRE-SLO-LLM-POLICY_DENY_RATE-TARGET_CORRECTNESS-W28D","LLM","POLICY_DENY_RATE","TARGET_CORRECTNESS","W28D","Policy correctness"),
    ("SRE-SLO-RAG-CITATION_COVERAGE-TARGET_GROUNDING-W28D","RAG","CITATION_COVERAGE","TARGET_GROUNDING","W28D","Grounding quality"),
    ("SRE-SLO-RAG-RETRIEVAL_EMPTY_RATE-TARGET_CORRECTNESS-W28D","RAG","RETRIEVAL_EMPTY_RATE","TARGET_CORRECTNESS","W28D","Retrieval health"),
]
df_slo_templates = pd.DataFrame(slo_templates, columns=["slo_name","area","sli_signal","target_type","window","notes"])

# --- 11) Dashboard doc names ---
dashboards = [
    ("SRE-GS-OBS-DOC-DESIGN-DASHBOARD_INGRESS","INGRESS","Golden signals + ingress-specific"),
    ("SRE-GS-OBS-DOC-DESIGN-DASHBOARD_CORE","CORE","Golden signals + core-specific"),
    ("SRE-GS-OBS-DOC-DESIGN-DASHBOARD_EVENT","EVENT","Queues/outbox/DLQ"),
    ("SRE-GS-OBS-DOC-DESIGN-DASHBOARD_LLM","LLM","Tokens/cost/latency/policies"),
    ("SRE-GS-OBS-DOC-DESIGN-DASHBOARD_RAG","RAG","Retrieval/citations/precision"),
    ("SRE-GS-OBS-DOC-DESIGN-DASHBOARD_IAM","IAM","Auth/authz/MFA"),
    ("SRE-GS-OBS-DOC-DESIGN-DASHBOARD_BILLING","BILLING","Metering/payment failures"),
]
df_dashboards = pd.DataFrame(dashboards, columns=["dashboard_doc_name","area","notes"])

# --- 12) Artifact type rules ---
artifact_rules = [
    ("DOC-SPEC","Specification document","API|SEC|CORE|LLM|RAG|EVENT|OBS|SUPPLY|BILLING|TENANT|IAM|INGRESS","CSF|80053|SRE-SLO|SRE-GS|API|LLM|RAG|EVENT|SUPPLY|IAM","DOC-SPEC"),
    ("DOC-DESIGN","Design document","CORE|LLM|RAG|EVENT|OBS|SUPPLY|INGRESS|IAM|API","CSF|80053|SRE-GS|OTEL|LLM|RAG|EVENT|SUPPLY|API","DOC-DESIGN"),
    ("DOC-POLICY","Policy document","SEC|LLM|IAM|SUPPLY|TENANT","CSF|80053|LLM|IAM|SUPPLY","DOC-POLICY"),
    ("DOC-CHECKLIST","Checklist","SEC|SUPPLY|OPS","CSF|80053|SUPPLY","DOC-CHECKLIST"),
    ("DOC-ADR","Architecture Decision Record","CORE|SEC|SUPPLY","CSF-GV|80053-CM|API-SEMVER","DOC-ADR"),
    ("DOC-RUNBOOK","Operational runbook","OPS|EVENT|SEC","SRE-INC|CSF-RS|CSF-RC|80053-IR|80053-CP|EVENT-DLQ|SUPPLY-VULN","DOC-RUNBOOK"),
    ("ALERT","Alert definition","OBS|OPS","SRE-ALERT","SRE-ALERT-*"),
    ("LOG","Log event name","ALL_RUNTIME","OTEL-LOG","OTEL-LOG-<AREA>-<DESCRIPTOR>"),
    ("METRIC","Metric name","ALL_RUNTIME","OTEL-METRIC","OTEL-METRIC-<AREA>-<SIGNAL>"),
    ("TRACE","Trace/span name","ALL_RUNTIME","OTEL-TRACE","OTEL-TRACE-<AREA>-<OPERATION>"),
]
df_artifact_rules = pd.DataFrame(artifact_rules, columns=["artifact_type","semantics","allowed_roots","allowed_prefixes","naming_pattern"])

# --- 13) Lint rules (high-level) ---
lint_rules = [
    ("PREFIX_REQUIRED","ERROR","All artifacts must begin with allowed prefix","GLOBAL"),
    ("ROOT_COMPATIBLE","ERROR","Prefix must be allowed for the root namespace","GLOBAL"),
    ("SUBPREFIX_ALLOWED","ERROR","Subprefix must be allowed in the root (if conditional)","GLOBAL"),
    ("AREA_CONTROLLED","ERROR","Area must be in controlled vocabulary","GLOBAL"),
    ("DESCRIPTOR_REQUIRED","ERROR","LOG/METRIC/TRACE/ALERT/RUNBOOK require descriptor","GLOBAL"),
    ("DESCRIPTOR_VOCAB_ONLY","ERROR","Descriptor must exist in descriptor catalog or allowed family patterns","GLOBAL"),
    ("TYPE_BINDING","ERROR","Artifact type must be valid for root namespace","GLOBAL"),
    ("NO_PROVIDER_NAMES","WARN","Avoid provider/brand names in logical identifiers","GLOBAL"),
    ("NO_AMBIGUOUS_TOKENS","WARN","Disallow MISC/TEMP/NEW/OLD/FIX in names","GLOBAL"),
    ("DENY_OVERRIDES","INFO","Any DENY rule wins over ALLOW","GLOBAL"),
]
df_lint_rules = pd.DataFrame(lint_rules, columns=["rule_id","severity","semantics","scope"])

# --- 14) Naming test suite examples ---
test_cases = [
    ("ALLOW","OTEL-LOG-INGRESS-WEBHOOK_RECEIVED","Valid ingress log event"),
    ("DENY","OTEL-METRIC-INGRESS-DLQ_COUNT","DLQ is EVENT-only metric"),
    ("ALLOW","OTEL-LOG-CORE-FSM_TRANSITION_DENIED","Valid core FSM log"),
    ("DENY","OTEL-LOG-CORE-OIDC_LOGIN_OK","OIDC is IAM-only"),
    ("ALLOW","SRE-ALERT-DLQ_COUNT-DLQ_CRITICAL-W15M","Valid DLQ alert"),
    ("DENY","SRE-ALERT-INGEST_FAIL-CRITICAL-W5M","Ingest failures are logs, not SRE alert name"),
    ("ALLOW","LLM-INJDEF-SEC-DOC-POLICY","Conditional allow in SEC for LLM policy"),
    ("DENY","LLM-AGENT-SEC-DOC-DESIGN","LLM agent logic forbidden in SEC"),
    ("ALLOW","RAG-CITE-LLM-DOC-SPEC","Allowed conditional in LLM only for cite/ctxasm interfaces"),
    ("DENY","RAG-INGEST-LLM-DOC-SPEC","RAG ingest forbidden in LLM root"),
]
df_test_suite = pd.DataFrame(test_cases, columns=["expected","example_name","reason"])

# --- 15) ConversationMessageTable schema ---
conversation_message_schema = [
    ("message_id","STRING","NO","PK (ULID/UUID)","INDEX"),
    ("conversation_id","STRING","NO","Conversation thread FK","INDEX"),
    ("tenant_id","STRING","NO","Tenant boundary FK","INDEX"),
    ("user_id","STRING","YES","End-user identifier","INDEX"),
    ("actor_type","ENUM(HUMAN|AGENT|SYSTEM|TOOL)","NO","Who produced the message","INDEX"),
    ("actor_id","STRING","YES","Agent/tool/system identifier",""),
    ("channel","ENUM(whatsapp|web|ios|android|api)","NO","Channel source","INDEX"),
    ("role","ENUM(user|assistant|system|tool)","NO","Chat role",""),
    ("message_type","ENUM(text|image|audio|tool_call|tool_result|event)","NO","Message kind","INDEX"),
    ("content_text","STRING","YES","Text content (post-redaction)",""),
    ("content_structured","JSON","YES","Structured payload (tool args/result, metadata)",""),
    ("language","STRING","YES","Detected language (iso)",""),
    ("locale","STRING","YES","Locale (BCP-47)",""),
    ("token_count","INT","YES","Total tokens",""),
    ("input_tokens","INT","YES","Input tokens",""),
    ("output_tokens","INT","YES","Output tokens",""),
    ("cost_usd","DECIMAL","YES","Estimated cost","INDEX"),
    ("model_provider","ENUM(openai|anthropic|google|local)","YES","Model provider",""),
    ("model_name","STRING","YES","Model identifier",""),
    ("tool_name","STRING","YES","Tool invoked (allowlisted)","INDEX"),
    ("tool_call_id","STRING","YES","Tool call correlation id","INDEX"),
    ("tool_status","ENUM(proposed|allowed|executed|failed|rejected)","YES","Tool lifecycle status","INDEX"),
    ("policy_decision","ENUM(allow|deny|degrade)","YES","Policy gate decision","INDEX"),
    ("policy_reason","STRING","YES","Reason code",""),
    ("risk_level","ENUM(low|med|high)","YES","Risk classification","INDEX"),
    ("is_pii","BOOLEAN","YES","PII detected","INDEX"),
    ("redaction_applied","BOOLEAN","YES","Redaction performed",""),
    ("is_hallucination","ENUM(true|false|unknown)","YES","Hallucination label (eval)",""),
    ("confidence_score","FLOAT","YES","Confidence score (0-1)",""),
    ("citation_count","INT","YES","Citations count",""),
    ("citation_ids","STRING","YES","Cited doc ids (pipe-separated)",""),
    ("retrieval_used","BOOLEAN","YES","RAG used","INDEX"),
    ("retrieval_query","STRING","YES","Normalized query",""),
    ("retrieval_doc_ids","STRING","YES","Retrieved doc ids (pipe-separated)",""),
    ("fsm_state_before","STRING","YES","FSM state before","INDEX"),
    ("fsm_state_after","STRING","YES","FSM state after","INDEX"),
    ("trace_id","STRING","YES","Distributed trace id","INDEX"),
    ("parent_message_id","STRING","YES","Parent message id",""),
    ("idempotency_key","STRING","YES","Idempotency key","INDEX"),
    ("created_at","TIMESTAMP","NO","Persist time","INDEX"),
    ("received_at","TIMESTAMP","YES","Ingress time",""),
    ("processed_at","TIMESTAMP","YES","Processing completion time",""),
    ("latency_ms","INT","YES","End-to-end latency ms",""),
    ("status","ENUM(ok|error|timeout|dropped)","NO","Final status","INDEX"),
    ("error_code","STRING","YES","Normalized error code",""),
    ("error_message","STRING","YES","Sanitized error message",""),
]
df_conversation_message_schema = pd.DataFrame(conversation_message_schema, columns=["column_name","data_type","nullable","semantics","index_hint"])

# Additional schemas (minimal) for completeness
conversation_schema = [
    ("conversation_id","STRING","NO","PK","INDEX"),
    ("tenant_id","STRING","NO","Tenant boundary","INDEX"),
    ("user_id","STRING","YES","End-user","INDEX"),
    ("channel","ENUM(whatsapp|web|ios|android|api)","NO","Primary channel","INDEX"),
    ("status","ENUM(open|closed|archived)","NO","Conversation status","INDEX"),
    ("current_fsm_state","STRING","YES","Current FSM state","INDEX"),
    ("created_at","TIMESTAMP","NO","Created","INDEX"),
    ("updated_at","TIMESTAMP","NO","Updated",""),
    ("last_message_at","TIMESTAMP","YES","Last activity","INDEX"),
]
df_conversation_schema = pd.DataFrame(conversation_schema, columns=["column_name","data_type","nullable","semantics","index_hint"])

outbox_schema = [
    ("outbox_id","STRING","NO","PK (ULID)","INDEX"),
    ("tenant_id","STRING","NO","Tenant boundary","INDEX"),
    ("trace_id","STRING","YES","Trace correlation","INDEX"),
    ("action_type","STRING","NO","Side-effect action type","INDEX"),
    ("payload","JSON","NO","Action payload",""),
    ("idempotency_key","STRING","NO","Idempotency key","INDEX"),
    ("status","ENUM(pending|processing|done|failed)","NO","Outbox status","INDEX"),
    ("attempt","INT","NO","Attempt count",""),
    ("next_run_at","TIMESTAMP","YES","Next scheduled run","INDEX"),
    ("created_at","TIMESTAMP","NO","Created","INDEX"),
    ("updated_at","TIMESTAMP","NO","Updated",""),
]
df_outbox_schema = pd.DataFrame(outbox_schema, columns=["column_name","data_type","nullable","semantics","index_hint"])

audit_schema = [
    ("audit_id","STRING","NO","PK (ULID)","INDEX"),
    ("tenant_id","STRING","NO","Tenant boundary","INDEX"),
    ("trace_id","STRING","YES","Trace correlation","INDEX"),
    ("actor_type","ENUM(HUMAN|AGENT|SYSTEM|TOOL)","NO","Actor type",""),
    ("actor_id","STRING","YES","Actor id",""),
    ("decision_type","STRING","NO","Decision/action type","INDEX"),
    ("decision_outcome","STRING","NO","Outcome","INDEX"),
    ("inputs_hash","STRING","YES","Hash of inputs",""),
    ("outputs_hash","STRING","YES","Hash of outputs",""),
    ("hash_chain_prev","STRING","YES","Previous hash chain value",""),
    ("hash_chain_curr","STRING","NO","Current hash chain value",""),
    ("created_at","TIMESTAMP","NO","Created","INDEX"),
]
df_audit_schema = pd.DataFrame(audit_schema, columns=["column_name","data_type","nullable","semantics","index_hint"])

# --- Save all tables as CSVs and zip them ---
tables = {
    "OfficialPrefixRegistry.csv": df_official_prefix,
    "ExtendedPrefixRegistry.csv": df_extended_prefix,
    "RootNamespaceMap.csv": df_root_map,
    "RootPrefixFamilyMatrix.csv": df_root_prefix_family_matrix,
    "DescriptorCatalog.csv": df_descriptor_catalog,
    "DescriptorFamilyRules.csv": df_descriptor_family_rules,
    "SignalCatalog.csv": df_signal_catalog,
    "ThresholdTokenCatalog.csv": df_threshold_catalog,
    "AlertTemplateCatalog.csv": df_alert_templates,
    "SLOTemplateCatalog.csv": df_slo_templates,
    "DashboardCatalog.csv": df_dashboards,
    "ArtifactTypeRules.csv": df_artifact_rules,
    "LintRuleCatalog.csv": df_lint_rules,
    "NamingTestSuite.csv": df_test_suite,
    "ConversationMessageTableSchema.csv": df_conversation_message_schema,
    "ConversationTableSchema.csv": df_conversation_schema,
    "OutboxEventTableSchema.csv": df_outbox_schema,
    "AuditLogTableSchema.csv": df_audit_schema,
}

for name, df in tables.items():
    df.to_csv(out_dir / name, index=False)

zip_path = Path("governance/system_tables_bundle.zip")
with zipfile.ZipFile(zip_path, "w", compression=zipfile.ZIP_DEFLATED) as z:
    for name in tables.keys():
        z.write(out_dir / name, arcname=name)

print(f"Generated {len(tables)} CSV files in {out_dir}")
print(f"Created zip bundle at {zip_path}")
