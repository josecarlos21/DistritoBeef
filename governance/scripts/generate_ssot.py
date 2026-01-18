import pandas as pd
from pathlib import Path
import zipfile
import os

# Create output directories
out_dir = Path("governance/definitions")
out_dir.mkdir(parents=True, exist_ok=True)

# --- 1) Official 30 prefixes registry (expanded columns) ---
official_prefix_rows = [
    # prefix, category, plane, primary_area, primary_purpose, allowed_roots, allowed_artifact_types, descriptor_families, default_slo, default_alerts, default_runbooks, dependencies, notes
    ("CSF-GV","Security & Governance","GOVERNANCE","SEC","Governance, policy management, risk strategy","CORE|SEC|TENANT|SUPPLY","DOC-POLICY|DOC-DESIGN|DOC-ADR|DOC-CHECKLIST","POLICY_*|RISK_*|GOV_*","","","", "80053-AU|SUPPLY-SBOM","Governance namespace; no runtime signals"),
    ("CSF-ID","Security & Governance","GOVERNANCE","SEC","Asset and data classification, risk context","INGRESS|RAG|TENANT|SEC","DOC-POLICY|DOC-SPEC|DOC-CHECKLIST","CLASSIFICATION_*|ASSET_*|DATA_*","","","", "80053-AU|RAG-INGEST","Inventory/classification policies"),
    ("CSF-PR","Security & Governance","GOVERNANCE","SEC","Protection: authentication, data security, hardening","INGRESS|CORE|IAM|SEC","DOC-POLICY|DOC-CHECKLIST","PROTECT_*|ACCESS_*|DATA_*","","","", "80053-AC|80053-IA|80053-SC","Protective control policies"),
    ("CSF-DE","Security & Governance","GOVERNANCE","SEC","Detection: anomaly, abuse, continuous monitoring","INGRESS|LLM|OBS|SEC","DOC-POLICY|DOC-DESIGN|DOC-RUNBOOK","DETECT_*|ANOMALY_*|ABUSE_*","SRE-SLO-OBS-ERROR_RATE-TARGET_AVAILABILITY-W28D","SRE-ALERT-ERROR_RATE-CRITICAL-W5M","SRE-INC-RUNBOOK-ABUSE_SPIKE", "OTEL-LOG|OTEL-METRIC","Detection governance (signals live under OTEL/SRE)"),
    ("CSF-RS","Security & Governance","GOVERNANCE","OPS","Incident response and containment","OPS|EVENT|SEC","DOC-RUNBOOK","INCIDENT_*|MITIGATION_*|CONTAIN_*","","","CSF-RS-RUNBOOK-*","SRE-INC|80053-IR","Incident response procedures"),
    ("CSF-RC","Security & Governance","GOVERNANCE","OPS","Recovery and disaster recovery","OPS|SEC","DOC-RUNBOOK","RESTORE_*|RECOVER_*|DR_*","SRE-SLO-OPS-RESTORE-TARGET_DELIVERY-W28D","","CSF-RC-RUNBOOK-*","80053-CP","Recovery/DR procedures"),

    ("80053-AC","NIST 800-53","SECURITY_CONTROL","SEC","Access control and authorization","CORE|IAM|TENANT|SEC","DOC-POLICY|DOC-CHECKLIST","AUTHZ_*|LEAST_PRIVILEGE|RLS_*","SRE-SLO-IAM-AUTHZ_DENY_RATE-TARGET_AVAILABILITY-W28D","SRE-ALERT-AUTHZ_DENY_RATE-AUTHZ_DENY_SPIKE-HIGH-W5M","SRE-INC-RUNBOOK-AUTHZ_DENY_SPIKE","IAM-RBAC|IAM-ABAC","Access control enforcement; audit under 80053-AU"),
    ("80053-IA","NIST 800-53","SECURITY_CONTROL","SEC","Identity, authentication, MFA","IAM|TENANT|SEC","DOC-POLICY|DOC-CHECKLIST","AUTHN_*|TOKEN_*|MFA_*","SRE-SLO-IAM-ERROR_RATE-TARGET_AVAILABILITY-W28D","","SRE-INC-RUNBOOK-AUTH_FAIL","IAM-OIDC|IAM-OAUTH|IAM-MFA","Identity control policies"),
    ("80053-AU","NIST 800-53","SECURITY_CONTROL","SEC","Audit logging and accountability","CORE|EVENT|OBS|SEC","DOC-POLICY|DOC-DESIGN","AUDIT_*|TRACEABILITY_*","SRE-SLO-CORE-ERROR_RATE-TARGET_AVAILABILITY-W28D","","CSF-RS-RUNBOOK-AUDIT_WRITE_FAIL","OTEL-LOG|OTEL-TRACE","Audit plane governance; runtime logs are OTEL-LOG"),
    ("80053-SC","NIST 800-53","SECURITY_CONTROL","SEC","System and communications protection","INGRESS|API|SEC","DOC-POLICY|DOC-CHECKLIST","TLS_*|EGRESS_*|TRANSPORT_*","SRE-SLO-INGRESS-ERROR_RATE-TARGET_AVAILABILITY-W28D","SRE-ALERT-WEBHOOK_SIGNATURE_FAIL-SIGNATURE_FAIL_SPIKE-HIGH-W5M","SRE-INC-RUNBOOK-TLS_FAIL","API-OAS","Transport security controls"),
    ("80053-SI","NIST 800-53","SECURITY_CONTROL","SEC","System integrity and input validation","INGRESS|CORE|SEC","DOC-POLICY|DOC-CHECKLIST","INPUT_*|VALIDATION_*|INTEGRITY_*","SRE-SLO-INGRESS-ERROR_RATE-TARGET_AVAILABILITY-W28D","","SRE-INC-RUNBOOK-INPUT_VALIDATION_FAIL","API-SCHEMA","Input validation and integrity"),
    ("80053-IR","NIST 800-53","SECURITY_CONTROL","SEC","Incident handling and forensics","OPS|SEC","DOC-RUNBOOK","FORENSIC_*|CONTAIN_*|ESCALATE_*","SRE-SLO-OPS-MTTR-TARGET_DELIVERY-W28D","","SRE-INC-RUNBOOK-INCIDENT_DECLARED","CSF-RS","Incident handling control family"),

    ("SRE-SLO","Reliability (SRE)","RELIABILITY","OBS","SLOs, error budgets, burn rate governance","CORE|OBS|OPS","DOC-SPEC|DOC-DESIGN","SLO_*|ERROR_BUDGET_*|BURN_*","SRE-SLO-*","SRE-ALERT-BURN_FAST-CRITICAL-W5M","SRE-INC-RUNBOOK-SLO_VIOLATION","SRE-ALERT|SRE-GS","Reliability contract system"),
    ("SRE-GS","Reliability (SRE)","RELIABILITY","OBS","Golden Signals monitoring","INGRESS|CORE|EVENT|LLM|RAG|OBS|SUPPLY","DOC-DESIGN|DOC-SPEC","LATENCY_*|ERROR_*|TRAFFIC_*|SATURATION_*","SRE-SLO-CORE-LATENCY_P99-TARGET_LATENCY-W28D","SRE-ALERT-LATENCY_P99-HIGH-W5M","SRE-INC-RUNBOOK-LATENCY_SPIKE","OTEL-METRIC","Golden signals across planes"),
    ("SRE-ALERT","Reliability (SRE)","RELIABILITY","OBS","Alert rules and thresholds","OBS|OPS|CORE|INGRESS|EVENT|LLM|RAG|SUPPLY","ALERT","ALERT_*|*_SPIKE|*_HIGH","SRE-SLO-*","SRE-ALERT-*","SRE-INC-RUNBOOK-*","SRE-SLO","Alerting layer (names start with SRE-ALERT)"),
    ("SRE-INC","Reliability (SRE)","RELIABILITY","OPS","Incident lifecycle management","OPS","DOC-RUNBOOK","INCIDENT_*|POSTMORTEM_*|ACTION_ITEM_*","","","SRE-INC-RUNBOOK-*","CSF-RS","Incident command playbooks"),

    ("OTEL-TRACE","Observability","OBSERVABILITY","OBS","Distributed tracing","INGRESS|CORE|IAM|API|EVENT|LLM|RAG|OBS|SEC|OPS|BILLING|TENANT","TRACE","RECEIVE|VALIDATE|AUTHORIZE|DISPATCH|RETRIEVE|RERANK|COMPOSE|READ|WRITE","SRE-SLO-OBS-TRACE-TARGET_AVAILABILITY-W28D","","SRE-INC-RUNBOOK-TRACE_COVERAGE_DROP","SRE-GS","Traces backbone"),
    ("OTEL-LOG","Observability","OBSERVABILITY","OBS","Structured logging","INGRESS|CORE|IAM|API|EVENT|LLM|RAG|OBS|SEC|OPS|BILLING|TENANT","LOG","*_OK|*_FAIL|*_DENY|*_REJECTED|*_TIMEOUT|*_DETECTED|*_APPLIED|*_STARTED|*_DONE|*_ENQUEUED|*_DEQUEUED","SRE-SLO-OBS-LOGS-TARGET_AVAILABILITY-W28D","","SRE-INC-RUNBOOK-PII_IN_LOGS","80053-AU","Logs backbone"),
    ("OTEL-METRIC","Observability","OBSERVABILITY","OBS","Metrics and time series","INGRESS|CORE|IAM|API|EVENT|LLM|RAG|OBS|SEC|OPS|BILLING|TENANT","METRIC","*_RATE|*_COUNT|*_DEPTH|LATENCY_P50|LATENCY_P95|LATENCY_P99|*_UTILIZATION|*_COVERAGE|*_PRECISION","SRE-SLO-OBS-METRICS-TARGET_AVAILABILITY-W28D","","SRE-INC-RUNBOOK-CARDINALITY_EXPLOSION","SRE-GS","Metrics backbone"),

    ("LLM-TOOLGOV","LLM Governance","AI_GOVERNANCE","LLM","Tool governance (allowlist, schema, sandbox)","LLM|SEC","DOC-POLICY|DOC-SPEC","TOOL_*|ALLOWLIST_*|SCHEMA_*","SRE-SLO-LLM-POLICY_DENY_RATE-TARGET_CORRECTNESS-W28D","","SRE-INC-RUNBOOK-TOOL_DENIED","LLM-POLICYGATE|EVENT-OUTBOX","Tooling control plane"),
    ("LLM-POLICYGATE","LLM Governance","AI_GOVERNANCE","LLM","Policy gating (risk, cost, quotas, compliance)","LLM|SEC","DOC-POLICY|DOC-SPEC","POLICY_*|RISK_*|QUOTA_*|COST_*","SRE-SLO-LLM-POLICY_DENY_RATE-TARGET_CORRECTNESS-W28D","SRE-ALERT-POLICY_DENY_RATE-HIGH-W15M","SRE-INC-RUNBOOK-POLICY_GATE_FAILURE","LLM-BUDGET","Deterministic gates for AI actions"),
    ("LLM-OUTVAL","LLM Governance","AI_GOVERNANCE","LLM","Output validation (schema, constraints, grounding)","LLM|RAG|SEC","DOC-POLICY|DOC-SPEC","OUTPUT_VALIDATION_*|CITATION_*|GROUNDING_*","SRE-SLO-RAG-CITATION_COVERAGE-TARGET_GROUNDING-W28D","SRE-ALERT-CITATION_COVERAGE-CITATION_DROP-HIGH-W15M","SRE-INC-RUNBOOK-HALLUCINATION_SPIKE","RAG-CITE|RAG-EVAL","Anti-hallucination layer"),
    ("LLM-BUDGET","LLM Governance","AI_GOVERNANCE","LLM","Token/latency/cost budgeting","LLM|SEC","DOC-POLICY|DOC-SPEC","TOKEN_*|LATENCY_*|COST_*","SRE-SLO-LLM-LLM_LATENCY_P99-TARGET_LATENCY-W28D","SRE-ALERT-TOKENS_PER_CONV-TOKEN_SPIKE-HIGH-W15M","SRE-INC-RUNBOOK-COST_SPIKE","OTEL-METRIC","Budget policy layer"),

    ("RAG-HYBRID","RAG","KNOWLEDGE","RAG","Hybrid retrieval (lexical + vector)","RAG","DOC-SPEC|DOC-DESIGN","RETRIEVE_*|HYBRID_*","SRE-SLO-RAG-RETRIEVAL_EMPTY_RATE-TARGET_CORRECTNESS-W28D","SRE-ALERT-RETRIEVAL_EMPTY-RETRIEVAL_EMPTY_SPIKE-HIGH-W15M","SRE-INC-RUNBOOK-RETRIEVE_EMPTY","RAG-RERANK","Retrieval core"),
    ("RAG-RERANK","RAG","KNOWLEDGE","RAG","Reranking (fine relevance ranking)","RAG","DOC-SPEC|DOC-DESIGN","RERANK_*","SRE-SLO-RAG-LATENCY_P99-TARGET_LATENCY-W28D","","SRE-INC-RUNBOOK-RERANK_FAIL","RAG-HYBRID","Reranking stage"),
    ("RAG-CITE","RAG","KNOWLEDGE","RAG","Citation grounding (source attribution)","RAG|LLM","DOC-SPEC|DOC-POLICY","CITATION_*|GROUNDING_*","SRE-SLO-RAG-CITATION_COVERAGE-TARGET_GROUNDING-W28D","SRE-ALERT-CITATION_COVERAGE-CITATION_DROP-HIGH-W15M","SRE-INC-RUNBOOK-CITATION_DROP","LLM-OUTVAL","Evidence layer"),
    ("RAG-EVAL","RAG","KNOWLEDGE","RAG","RAG evaluation (retrieval + grounding)","RAG|OPS","DOC-SPEC|DOC-DESIGN","RETRIEVAL_EVAL_*|GROUNDING_*","SRE-SLO-RAG-RETRIEVAL_PRECISION-TARGET_CORRECTNESS-W28D","","SRE-INC-RUNBOOK-RAG_PRECISION_DROP","SRE-SLO","Quality gate for knowledge"),

    ("EVENT-OUTBOX","Event & Durability","DURABILITY","EVENT","Transactional outbox for side-effects","EVENT|CORE|BILLING","DOC-DESIGN|DOC-SPEC","OUTBOX_*","SRE-SLO-EVENT-OUTBOX_DEPTH-TARGET_DELIVERY-W28D","SRE-ALERT-QUEUE_DEPTH-DEPTH_HIGH-W15M","SRE-INC-RUNBOOK-OUTBOX_BACKLOG_HIGH","EVENT-IDEMP","Durable side-effects"),
    ("EVENT-IDEMP","Event & Durability","DURABILITY","EVENT","Idempotency and deduplication","INGRESS|EVENT|CORE|IAM|BILLING","DOC-DESIGN|DOC-SPEC","IDEMP_*|DEDUPE_*","SRE-SLO-EVENT-IDEMP_HIT_RATE-TARGET_CORRECTNESS-W28D","SRE-ALERT-IDEMP_HIT_RATE-HIGH-W15M","SRE-INC-RUNBOOK-IDEMP_HIT_SPIKE","EVENT-OUTBOX","Logical exactly-once"),
    ("EVENT-DLQ","Event & Durability","DURABILITY","EVENT","Dead letter queue handling","EVENT|OPS","DOC-DESIGN|DOC-RUNBOOK","DLQ_*|REPLAY_*|POISON_*","SRE-SLO-EVENT-DLQ_COUNT-TARGET_DELIVERY-W28D","SRE-ALERT-DLQ_COUNT-DLQ_CRITICAL-W15M","EVENT-DLQ-OPS-RUNBOOK-DLQ_REPROCESS","SRE-INC","Failure isolation"),
]

df_official_prefix = pd.DataFrame(official_prefix_rows, columns=[
    "prefix","category","plane","primary_area","primary_purpose",
    "allowed_roots","allowed_artifact_types","allowed_descriptor_families",
    "default_slo","default_alerts","default_runbooks","dependencies","notes"
])

# --- 2) Extended prefixes (subprefixes) used by lint/taxonomy but not in official 30 ---
extended_prefix_rows = [
    # API
    ("API-OAS","API Contracts","EXTENDED","API","OpenAPI contract specification","API","DOC-SPEC","OAS_*","","","", "", ""),
    ("API-SCHEMA","API Contracts","EXTENDED","API","Schema validation contracts","API|INGRESS|CORE","DOC-SPEC","SCHEMA_*|VALIDATION_*","","","", "", ""),
    ("API-SCHEMAFIRST","API Contracts","EXTENDED","API","Schema-first development","API","DOC-DESIGN","SCHEMAFIRST_*","","","", "", ""),
    ("API-BC","API Contracts","EXTENDED","API","Backward compatibility rules","API","DOC-POLICY","BC_*","","","", "", ""),
    ("API-SEMVER","API Contracts","EXTENDED","API","Semantic versioning for APIs/releases","API|SUPPLY","DOC-POLICY","SEMVER_*","","","", "", ""),
    ("API-CDC","API Contracts","EXTENDED","API","Consumer-driven contracts","API","DOC-SPEC","CDC_*","","","", "", ""),
    ("API-CTEST","API Contracts","EXTENDED","API","Contract testing","API","DOC-SPEC","CONTRACT_*","","","", "", ""),
    ("API-ERRTAX","API Contracts","EXTENDED","API","Error taxonomy standard","API|CORE","DOC-SPEC","ERROR_*","","","", "", ""),
    # IAM
    ("IAM-OIDC","IAM","EXTENDED","IAM","OpenID Connect integration","IAM|API","DOC-SPEC","OIDC_*","","","", "", ""),
    ("IAM-OAUTH","IAM","EXTENDED","IAM","OAuth2 flows and scopes","IAM|API","DOC-SPEC","OAUTH_*","","","", "", ""),
    ("IAM-JWT","IAM","EXTENDED","IAM","JWT validation and claims","IAM","DOC-SPEC","JWT_*","","","", "", ""),
    ("IAM-JWKS","IAM","EXTENDED","IAM","JWK/JWKS key distribution","IAM","DOC-SPEC","JWKS_*","","","", "", ""),
    ("IAM-PKCE","IAM","EXTENDED","IAM","PKCE enforcement","IAM","DOC-POLICY","PKCE_*","","","", "", ""),
    ("IAM-SESSION","IAM","EXTENDED","IAM","Session management","IAM","DOC-SPEC","SESSION_*","","","", "", ""),
    ("IAM-MFA","IAM","EXTENDED","IAM","Multi-factor authentication","IAM","DOC-POLICY","MFA_*","","","", "", ""),
    ("IAM-FIDO2","IAM","EXTENDED","IAM","FIDO2/WebAuthn authentication","IAM","DOC-SPEC","FIDO2_*","","","", "", ""),
    ("IAM-SCIM","IAM","EXTENDED","IAM","SCIM provisioning","IAM","DOC-SPEC","SCIM_*","","","", "", ""),
    ("IAM-RBAC","IAM","EXTENDED","IAM","RBAC model","IAM|CORE","DOC-SPEC","RBAC_*","","","", "", ""),
    ("IAM-ABAC","IAM","EXTENDED","IAM","ABAC model","IAM|CORE","DOC-SPEC","ABAC_*","","","", "", ""),
    ("IAM-PAM","IAM","EXTENDED","IAM","Privileged access management","IAM|SEC","DOC-POLICY","PAM_*","","","", "", ""),
    ("IAM-JIT","IAM","EXTENDED","IAM","Just-in-time access","IAM|SEC","DOC-POLICY","JIT_*","","","", "", ""),
    # EVENT extensions
    ("EVENT-EDA","Event Patterns","EXTENDED","EVENT","Event-driven architecture","EVENT|CORE","DOC-DESIGN","EDA_*","","","", "", ""),
    ("EVENT-INBOX","Event Patterns","EXTENDED","EVENT","Inbox pattern for inbound dedupe","EVENT|INGRESS","DOC-DESIGN","INBOX_*","","","", "", ""),
    ("EVENT-ALOO","Event Patterns","EXTENDED","EVENT","At-least-once delivery semantics","EVENT","DOC-POLICY","ALOO_*","","","", "", ""),
    ("EVENT-EOLOG","Event Patterns","EXTENDED","EVENT","Exactly-once logical semantics","EVENT","DOC-POLICY","EOLOG_*","","","", "", ""),
    ("EVENT-REPLAY","Event Patterns","EXTENDED","EVENT","Replay/reprocess control","EVENT|OPS","DOC-RUNBOOK","REPLAY_*","","","", "", ""),
    ("EVENT-SAGA","Event Patterns","EXTENDED","EVENT","Saga pattern","EVENT|CORE","DOC-DESIGN","SAGA_*","","","", "", ""),
    ("EVENT-CQRS","Event Patterns","EXTENDED","EVENT","CQRS pattern","CORE","DOC-DESIGN","CQRS_*","","","", "", ""),
    # SUPPLY
    ("SUPPLY-SBOM","Supply Chain","EXTENDED","SUPPLY","Software Bill of Materials","SUPPLY|SEC","DOC-SPEC","SBOM_*","","","", "", ""),
    ("SUPPLY-PROV","Supply Chain","EXTENDED","SUPPLY","Build provenance","SUPPLY|SEC","DOC-SPEC","PROVENANCE_*","","","", "", ""),
    ("SUPPLY-SIGN","Supply Chain","EXTENDED","SUPPLY","Artifact signing","SUPPLY|SEC","DOC-POLICY","ARTIFACT_*","","","", "", ""),
    ("SUPPLY-SLSA","Supply Chain","EXTENDED","SUPPLY","SLSA maturity levels","SUPPLY|SEC","DOC-POLICY","SLSA_*","","","", "", ""),
    ("SUPPLY-PIN","Supply Chain","EXTENDED","SUPPLY","Dependency pinning","SUPPLY","DOC-POLICY","DEPENDENCY_*","","","", "", ""),
    ("SUPPLY-VULN","Supply Chain","EXTENDED","SUPPLY","Vulnerability scanning","SUPPLY|OPS","DOC-RUNBOOK","VULN_SCAN_*","","","", "", ""),
    ("SUPPLY-SAST","Supply Chain","EXTENDED","SUPPLY","Static analysis security testing","SUPPLY","DOC-POLICY","SAST_*","","","", "", ""),
    ("SUPPLY-DAST","Supply Chain","EXTENDED","SUPPLY","Dynamic analysis security testing","SUPPLY","DOC-POLICY","DAST_*","","","", "", ""),
    ("SUPPLY-SECRETS","Supply Chain","EXTENDED","SUPPLY","Secrets scanning","SUPPLY","DOC-POLICY","SECRETS_SCAN_*","","","", "", ""),
    ("SUPPLY-POLICYCODE","Supply Chain","EXTENDED","SUPPLY","Policy as code gates","SUPPLY","DOC-DESIGN","POLICYCODE_*","","","", "", ""),
    # LLM extended
    ("LLM-AGENT","LLM Governance","EXTENDED","LLM","Agentic workflow orchestration","LLM","DOC-DESIGN","AGENT_*","","","", "", ""),
    ("LLM-TOOLS","LLM Governance","EXTENDED","LLM","Tool calling mechanisms","LLM","DOC-DESIGN","TOOLS_*","","","", "", ""),
    ("LLM-MULTIMODEL","LLM Governance","EXTENDED","LLM","Multi-model routing","LLM","DOC-DESIGN","MODEL_*","","","", "", ""),
    ("LLM-OBS","LLM Governance","EXTENDED","LLM","LLM observability","LLM|OBS","DOC-DESIGN","OBS_*","","","", "", ""),
    ("LLM-EVAL","LLM Governance","EXTENDED","LLM","LLM evaluation harness","LLM|OPS","DOC-SPEC","EVAL_*","","","", "", ""),
    ("LLM-REDTEAM","LLM Governance","EXTENDED","LLM","Adversarial testing / red teaming","LLM|OPS","DOC-SPEC","REDTEAM_*","","","", "", ""),
    ("LLM-INJDEF","LLM Governance","EXTENDED","SEC","Prompt injection mitigation policy","SEC|LLM","DOC-POLICY","INJDEF_*","","","", "", ""),
    # RAG extended
    ("RAG-INGEST","RAG","EXTENDED","RAG","Document ingestion pipeline","RAG|OPS","DOC-DESIGN","INGEST_*","","","", "", ""),
    ("RAG-PARSE","RAG","EXTENDED","RAG","Document parsing","RAG","DOC-DESIGN","PARSE_*","","","", "", ""),
    ("RAG-CHUNK","RAG","EXTENDED","RAG","Chunking strategy","RAG","DOC-DESIGN","CHUNK_*","","","", "", ""),
    ("RAG-EMBED","RAG","EXTENDED","RAG","Embedding generation","RAG","DOC-DESIGN","EMBED_*","","","", "", ""),
    ("RAG-VDB","RAG","EXTENDED","RAG","Vector database","RAG","DOC-DESIGN","VDB_*","","","", "", ""),
    ("RAG-BM25","RAG","EXTENDED","RAG","BM25 retrieval","RAG","DOC-DESIGN","BM25_*","","","", "", ""),
    ("RAG-CTXASM","RAG","EXTENDED","RAG","Context assembly for generation","RAG|LLM","DOC-DESIGN","CTXASM_*","","","", "", ""),
    ("RAG-FRESH","RAG","EXTENDED","RAG","Freshness policy","RAG","DOC-POLICY","FRESH_*","","","", "", ""),
]
df_extended_prefix = pd.DataFrame(extended_prefix_rows, columns=df_official_prefix.columns)

# --- 3) Root namespace map (summarized) ---
root_rows = [
    ("INGRESS","Ingress Plane","Input/webhooks/APIs inbound; verify+validate+dedupe","CSF|80053|SRE|OTEL|IAM|API|EVENT","LLM|RAG|SUPPLY","Signature verify, validation, rate limit, idempotency"),
    ("CORE","Core Plane","SSOT/FSM/routing; deterministic decisions","CSF|80053|SRE|OTEL|API|EVENT","LLM|RAG|SUPPLY|IAM","No LLM dependency in core logic"),
    ("IAM","Identity Plane","AuthN/AuthZ, tokens, sessions, MFA","CSF|80053|SRE|OTEL|IAM|API|EVENT(IDEMP)","LLM|RAG|SUPPLY","Deny-by-default access"),
    ("API","Contracts Plane","OpenAPI/Schema/versioning/compatibility","80053(SC)|SRE|OTEL|IAM(auth endpoints)|API","CSF|EVENT|LLM|RAG|SUPPLY","No runtime logic; contracts only"),
    ("EVENT","Durability Plane","Outbox/inbox/retries/DLQ/workers","CSF(RS/RC)|80053|SRE|OTEL|EVENT","IAM|API|LLM|RAG|SUPPLY","All side-effects durable"),
    ("LLM","Agent Plane","Agent orchestration + policy gate + tool governance","CSF(DE/PR)|80053|SRE|OTEL|LLM|RAG(CITE/CTXASM)","IAM|API|EVENT|SUPPLY|RAG(INGEST...)","Agent proposes; core executes"),
    ("RAG","Knowledge Plane","Ingest/retrieval/rerank/citations/evals","CSF(ID/PR)|80053|SRE|OTEL|RAG|LLM(OUTVAL)","IAM|API|EVENT|SUPPLY|LLM(AGENT...)","No side-effects"),
    ("OBS","Observability Plane","Dashboards/alerts/SLOs/telemetry","CSF(DE)|80053(AU)|SRE|OTEL","IAM|API|EVENT|LLM|RAG|SUPPLY","Central observability artifacts"),
    ("SEC","Security Plane","Policies/controls/audit/compliance","CSF|80053|SRE|OTEL|IAM(policies)|SUPPLY(policies)|LLM(INJDEF)","API|EVENT|RAG|LLM(AGENT...)","Policy authority"),
    ("OPS","Operations Plane","Runbooks/incidents/DR/operations","CSF(RS/RC)|80053(IR/CP)|SRE|OTEL|EVENT(DLQ/REPLAY)|SUPPLY(runbooks)|RAG(runbooks)","IAM|API|LLM","Human operations"),
    ("SUPPLY","Supply Plane","CI/CD, SBOM, provenance, signing","CSF(GV)|80053(CM/SR)|SRE|API(SEMVER)|SUPPLY","OTEL|IAM|EVENT|LLM|RAG","Build security and releases"),
    ("BILLING","Billing Plane","Plans, entitlements, metering, payments","CSF(GV/PR)|80053(AU/AC)|SRE|OTEL|API|EVENT","IAM|LLM|RAG|SUPPLY","Usage-based governance"),
    ("TENANT","Tenant Plane","Tenant lifecycle, config, quotas, keys","CSF(GV/ID/PR)|80053(AC/IA/AU/CM)|SRE|OTEL|API|EVENT","IAM|LLM|RAG|SUPPLY","Tenant isolation & governance"),
]
df_root_map = pd.DataFrame(root_rows, columns=["root","plane","description","allowed_prefix_families","denied_prefix_families","notes"])

# --- 4) Root × Prefix Family matrix (ALLOW/DENY/CONDITIONAL) ---
roots = ["INGRESS","CORE","IAM","API","EVENT","LLM","RAG","OBS","SEC","OPS","SUPPLY","BILLING","TENANT"]
families = ["CSF","80053","SRE","OTEL","IAM","API","EVENT","SUPPLY","LLM","RAG"]

# From our previously defined decisions
decision_map = {
    "INGRESS": {"CSF":"ALLOW","80053":"ALLOW","SRE":"ALLOW","OTEL":"ALLOW","IAM":"ALLOW","API":"ALLOW","EVENT":"ALLOW","SUPPLY":"DENY","LLM":"DENY","RAG":"DENY"},
    "CORE":    {"CSF":"ALLOW","80053":"ALLOW","SRE":"ALLOW","OTEL":"ALLOW","IAM":"DENY","API":"ALLOW","EVENT":"ALLOW","SUPPLY":"DENY","LLM":"DENY","RAG":"DENY"},
    "IAM":     {"CSF":"ALLOW","80053":"ALLOW","SRE":"ALLOW","OTEL":"ALLOW","IAM":"ALLOW","API":"ALLOW","EVENT":"ALLOW","SUPPLY":"DENY","LLM":"DENY","RAG":"DENY"},
    "API":     {"CSF":"DENY","80053":"ALLOW","SRE":"ALLOW","OTEL":"ALLOW","IAM":"ALLOW","API":"ALLOW","EVENT":"DENY","SUPPLY":"DENY","LLM":"DENY","RAG":"DENY"},
    "EVENT":   {"CSF":"ALLOW","80053":"ALLOW","SRE":"ALLOW","OTEL":"ALLOW","IAM":"DENY","API":"DENY","EVENT":"ALLOW","SUPPLY":"DENY","LLM":"DENY","RAG":"DENY"},
    "LLM":     {"CSF":"ALLOW","80053":"ALLOW","SRE":"ALLOW","OTEL":"ALLOW","IAM":"DENY","API":"DENY","EVENT":"DENY","SUPPLY":"DENY","LLM":"ALLOW","RAG":"CONDITIONAL"},
    "RAG":     {"CSF":"ALLOW","80053":"ALLOW","SRE":"ALLOW","OTEL":"ALLOW","IAM":"DENY","API":"DENY","EVENT":"DENY","SUPPLY":"DENY","LLM":"CONDITIONAL","RAG":"ALLOW"},
    "OBS":     {"CSF":"ALLOW","80053":"ALLOW","SRE":"ALLOW","OTEL":"ALLOW","IAM":"DENY","API":"DENY","EVENT":"DENY","SUPPLY":"DENY","LLM":"DENY","RAG":"DENY"},
    "SEC":     {"CSF":"ALLOW","80053":"ALLOW","SRE":"ALLOW","OTEL":"ALLOW","IAM":"ALLOW","API":"DENY","EVENT":"DENY","SUPPLY":"ALLOW","LLM":"CONDITIONAL","RAG":"DENY"},
    "OPS":     {"CSF":"ALLOW","80053":"ALLOW","SRE":"ALLOW","OTEL":"ALLOW","IAM":"DENY","API":"DENY","EVENT":"ALLOW","SUPPLY":"ALLOW","LLM":"DENY","RAG":"ALLOW"},
    "SUPPLY":  {"CSF":"ALLOW","80053":"ALLOW","SRE":"ALLOW","OTEL":"DENY","IAM":"DENY","API":"ALLOW","EVENT":"DENY","SUPPLY":"ALLOW","LLM":"DENY","RAG":"DENY"},
    "BILLING": {"CSF":"ALLOW","80053":"ALLOW","SRE":"ALLOW","OTEL":"ALLOW","IAM":"DENY","API":"ALLOW","EVENT":"ALLOW","SUPPLY":"DENY","LLM":"DENY","RAG":"DENY"},
    "TENANT":  {"CSF":"ALLOW","80053":"ALLOW","SRE":"ALLOW","OTEL":"ALLOW","IAM":"DENY","API":"ALLOW","EVENT":"ALLOW","SUPPLY":"DENY","LLM":"DENY","RAG":"DENY"},
}

conditions = {
    ("LLM","RAG"): "ALLOW only RAG-CTXASM|RAG-CITE",
    ("RAG","LLM"): "ALLOW only LLM-OUTVAL",
    ("SEC","LLM"): "ALLOW only LLM-INJDEF",
}
matrix_rows = []
for r in roots:
    for f in families:
        decision = decision_map[r][f]
        cond = ""
        if decision == "CONDITIONAL":
            cond = conditions.get((r,f),"CONDITIONAL_ALLOWLIST")
        matrix_rows.append((r,f,decision,cond))
df_root_prefix_family_matrix = pd.DataFrame(matrix_rows, columns=["root","prefix_family","decision","condition"])

# --- 5) Descriptor catalog (explicit descriptors) ---
descriptor_rows = []

def add_desc(area, descriptor, allowed_types, family=None, notes=""):
    family = family or descriptor.split("_")[0]
    descriptor_rows.append((descriptor, area, family, allowed_types, notes))

# INGRESS
ingress_descriptors = [
    "WEBHOOK_RECEIVED","WEBHOOK_SIGNATURE_OK","WEBHOOK_SIGNATURE_FAIL","WEBHOOK_PARSE_OK","WEBHOOK_PARSE_FAIL",
    "REQUEST_AUTH_OK","REQUEST_AUTH_FAIL","REQUEST_AUTHZ_OK","REQUEST_AUTHZ_DENY",
    "RATE_LIMIT_APPLIED","RATE_LIMIT_BLOCKED",
    "INPUT_VALIDATION_OK","INPUT_VALIDATION_FAIL",
    "CANONICALIZE_APPLIED","UNICODE_NORMALIZED",
    "PII_DETECTED","REDACTION_APPLIED",
    "IDEMP_KEY_CREATED","IDEMP_HIT","DEDUPE_HIT","DEDUP_STORE_FAIL"
]
for d in ingress_descriptors:
    add_desc("INGRESS", d, "LOG")

# CORE
core_descriptors = [
    "SSOT_READ_OK","SSOT_READ_FAIL","FSM_STATE_LOADED","FSM_TRANSITION_ALLOWED","FSM_TRANSITION_DENIED","FSM_TRANSITION_APPLIED",
    "FSM_RECONCILE_STARTED","FSM_RECONCILE_DONE",
    "ROUTE_FLOW","ROUTE_AGENT","ROUTE_HUMAN",
    "RULE_MATCHED","RULE_NO_MATCH",
    "AUDIT_WRITE_OK","AUDIT_WRITE_FAIL","AUDIT_CHAIN_ADVANCED","AUDIT_CHAIN_FAIL"
]
for d in core_descriptors:
    add_desc("CORE", d, "LOG")

# IAM
iam_descriptors = [
    "OIDC_LOGIN_STARTED","OIDC_LOGIN_OK","OIDC_LOGIN_FAIL",
    "TOKEN_ISSUED","TOKEN_REFRESHED","TOKEN_REVOKED","TOKEN_INVALID",
    "SESSION_CREATED","SESSION_EXPIRED",
    "AUTHZ_ALLOW","AUTHZ_DENY",
    "RBAC_ROLE_ASSIGNED","RBAC_ROLE_REMOVED",
    "ABAC_POLICY_MATCHED","ABAC_POLICY_DENY",
    "MFA_REQUIRED","MFA_OK","MFA_FAIL",
    "SCIM_PROVISION_OK","SCIM_PROVISION_FAIL"
]
for d in iam_descriptors:
    add_desc("IAM", d, "LOG")

# API
api_descriptors = [
    "OAS_PUBLISHED","SCHEMA_VALIDATED","SCHEMA_BREAKING_CHANGE","BC_OK","BC_FAIL",
    "ERROR_MAPPED","ERROR_UNMAPPED","CDC_CONTRACT_OK","CDC_CONTRACT_FAIL"
]
for d in api_descriptors:
    add_desc("API", d, "LOG|DOC")

# EVENT
event_descriptors = [
    "OUTBOX_ENQUEUED","OUTBOX_DEQUEUED","OUTBOX_DISPATCH_OK","OUTBOX_DISPATCH_FAIL","OUTBOX_BACKLOG_HIGH",
    "RETRY_SCHEDULED","RETRY_EXHAUSTED",
    "DLQ_ENQUEUED","DLQ_REPROCESS_STARTED","DLQ_REPROCESS_OK","DLQ_REPROCESS_FAIL",
    "POISON_MESSAGE_DETECTED",
    "INBOX_MARKED_PROCESSED","INBOX_DUPLICATE"
]
for d in event_descriptors:
    add_desc("EVENT", d, "LOG")

# LLM
llm_descriptors = [
    "PLAN_GENERATED","PLAN_INVALID","PLAN_TRIMMED","ASSUMPTION_LISTED",
    "POLICY_EVALUATED","POLICY_ALLOWED","POLICY_DENIED",
    "EVIDENCE_REQUIRED","EVIDENCE_MISSING",
    "TOOL_PROPOSED","TOOL_ALLOWED","TOOL_REJECTED","TOOL_SCHEMA_OK","TOOL_SCHEMA_FAIL","TOOL_TIMEOUT","TOOL_ERROR",
    "INJECTION_SIGNAL_DETECTED","DATA_TREATED_AS_DATA",
    "OUTPUT_VALIDATION_OK","OUTPUT_VALIDATION_FAIL",
    "TOKEN_BUDGET_APPLIED","LATENCY_BUDGET_APPLIED","COST_BUDGET_APPLIED",
    "MODEL_ROUTED","MODEL_FALLBACK"
]
for d in llm_descriptors:
    add_desc("LLM", d, "LOG")

# RAG
rag_descriptors = [
    "INGEST_STARTED","INGEST_OK","INGEST_FAIL",
    "PARSE_OK","PARSE_FAIL","CHUNK_OK","CHUNK_FAIL",
    "EMBED_OK","EMBED_FAIL",
    "INDEX_BUILT","INDEX_UPDATED",
    "RETRIEVE_STARTED","RETRIEVE_EMPTY","RETRIEVE_OK",
    "HYBRID_MERGED","RERANK_OK","RERANK_FAIL","FRESHNESS_APPLIED",
    "CITATION_ATTACHED","CITATION_MISSING","GROUNDING_OK","GROUNDING_FAIL",
    "RETRIEVAL_EVAL_OK","RETRIEVAL_EVAL_FAIL"
]
for d in rag_descriptors:
    add_desc("RAG", d, "LOG")

# OBS signals (as metric/alert descriptors)
obs_descriptors = [
    "LATENCY_P50","LATENCY_P95","LATENCY_P99",
    "ERROR_RATE","REQUEST_RATE","SATURATION","QUEUE_DEPTH","DLQ_COUNT","RETRY_RATE",
    "BURN_RATE_FAST","BURN_RATE_SLOW",
    "ALERT_FIRED","ALERT_RESOLVED","DASHBOARD_UPDATED"
]
for d in obs_descriptors:
    add_desc("OBS", d, "METRIC|ALERT|LOG")

# SEC
sec_descriptors = [
    "LEAST_PRIVILEGE","EGRESS_FILTERING","SECRETS_ROTATED","KEY_ROTATED","ENCRYPTION_ENABLED","RETENTION_APPLIED",
    "VULN_FOUND","VULN_FIXED","ABUSE_DETECTED","ABUSE_BLOCKED"
]
for d in sec_descriptors:
    add_desc("SEC", d, "LOG|DOC")

# OPS
ops_descriptors = [
    "INCIDENT_DECLARED","INCIDENT_ESCALATED","MITIGATION_APPLIED","ROLLBACK_EXECUTED",
    "RESTORE_STARTED","RESTORE_OK","RESTORE_FAIL",
    "POSTMORTEM_CREATED","ACTION_ITEM_TRACKED"
]
for d in ops_descriptors:
    add_desc("OPS", d, "RUNBOOK|LOG")

# SUPPLY
supply_descriptors = [
    "SBOM_GENERATED","PROVENANCE_GENERATED","ARTIFACT_SIGNED","SLSA_LEVEL_SET",
    "DEPENDENCY_PINNED","VULN_SCAN_OK","VULN_SCAN_FAIL","SECRETS_SCAN_OK","SECRETS_SCAN_FAIL"
]
for d in supply_descriptors:
    add_desc("SUPPLY", d, "DOC|RUNBOOK|LOG")

# BILLING
billing_descriptors = [
    "PLAN_ASSIGNED","ENTITLEMENT_GRANTED","ENTITLEMENT_DENIED","METERING_RECORDED",
    "INVOICE_ISSUED","PAYMENT_SUCCEEDED","PAYMENT_FAILED","DUNNING_STARTED","DUNNING_RESOLVED"
]
for d in billing_descriptors:
    add_desc("BILLING", d, "LOG|DOC")

# TENANT
tenant_descriptors = [
    "TENANT_CREATED","TENANT_SUSPENDED","TENANT_REACTIVATED","TENANT_DELETED",
    "TENANT_CONFIG_UPDATED","TENANT_QUOTA_UPDATED","TENANT_KEYS_ROTATED"
]
for d in tenant_descriptors:
    add_desc("TENANT", d, "LOG|DOC")

df_descriptor_catalog = pd.DataFrame(descriptor_rows, columns=["descriptor","area","family","allowed_types","notes"]).sort_values(["area","descriptor"])

# --- 6) Descriptor family allow rules (pattern-based) ---
descriptor_family_rules = [
    ("INGRESS","WEBHOOK_*|REQUEST_*|INPUT_VALIDATION_*|RATE_LIMIT_*|UNICODE_*|PII_*|REDACTION_*|IDEMP_*|DEDUPE_*","OUTBOX_*|DLQ_*|RETRY_*|PLAN_*|TOOL_*|RETRIEVE_*|CITATION_*|TOKENS_*|COST_*","Ingress-only families"),
    ("CORE","SSOT_*|FSM_*|ROUTE_*|RULE_*|AUDIT_*","WEBHOOK_*|OIDC_*|TOKEN_*|OUTBOX_*|DLQ_*|PLAN_*|TOOL_*|RETRIEVE_*|CITATION_*|TOKENS_*","Core-only families"),
    ("IAM","OIDC_*|TOKEN_*|SESSION_*|AUTHZ_*|RBAC_*|ABAC_*|MFA_*|SCIM_*","WEBHOOK_*|FSM_*|OUTBOX_*|DLQ_*|PLAN_*|TOOL_*|RETRIEVE_*|CITATION_*|TOKENS_*","IAM-only families"),
    ("EVENT","OUTBOX_*|INBOX_*|RETRY_*|DLQ_*|POISON_*|QUEUE_*","WEBHOOK_*|OIDC_*|FSM_*|PLAN_*|TOOL_*|RETRIEVE_*|CITATION_*|TOKENS_*|COST_*","Event durability families"),
    ("LLM","PLAN_*|POLICY_*|EVIDENCE_*|TOOL_*|INJECTION_*|OUTPUT_VALIDATION_*|TOKEN_*|COST_*|MODEL_*","WEBHOOK_*|OIDC_*|FSM_*|OUTBOX_*|DLQ_*|INBOX_*|INGEST_*|EMBED_*|INDEX_*","LLM governance families"),
    ("RAG","INGEST_*|PARSE_*|CHUNK_*|EMBED_*|INDEX_*|RETRIEVE_*|HYBRID_*|RERANK_*|FRESHNESS_*|CITATION_*|GROUNDING_*|RETRIEVAL_EVAL_*","WEBHOOK_*|OIDC_*|FSM_*|OUTBOX_*|DLQ_*|PLAN_*|TOOL_*|TOKEN_*|COST_*","RAG-only families"),
    ("OBS","LATENCY_P*|ERROR_RATE|REQUEST_RATE|SATURATION|QUEUE_DEPTH|DLQ_COUNT|RETRY_RATE|BURN_*","WEBHOOK_*|TOKEN_ISSUED|PLAN_GENERATED","Observability signals"),
    ("SEC","LEAST_PRIVILEGE|EGRESS_FILTERING|SECRETS_*|KEY_*|ENCRYPTION_*|RETENTION_*|VULN_*|ABUSE_*","PLAN_*|TOOL_*|RETRIEVE_*|OUTBOX_*|FSM_*","Security control families"),
    ("OPS","INCIDENT_*|MITIGATION_*|ROLLBACK_*|RESTORE_*|POSTMORTEM_*|ACTION_ITEM_*|DLQ_*|REPLAY_*","TOKEN_ISSUED|WEBHOOK_RECEIVED|PLAN_GENERATED","Ops only"),
    ("SUPPLY","SBOM_*|PROVENANCE_*|ARTIFACT_*|SLSA_*|DEPENDENCY_*|VULN_SCAN_*|SECRETS_SCAN_*","WEBHOOK_*|FSM_*|OUTBOX_*|PLAN_*|RETRIEVE_*","Supply chain only"),
    ("BILLING","PLAN_*|ENTITLEMENT_*|METERING_*|INVOICE_*|PAYMENT_*|DUNNING_*","PLAN_GENERATED|RETRIEVE_*","Billing only"),
    ("TENANT","TENANT_*","PLAN_GENERATED|RETRIEVE_*|TOKEN_*","Tenant only"),
]
df_descriptor_family_rules = pd.DataFrame(descriptor_family_rules, columns=["area","allow_patterns","deny_patterns","notes"])

# --- 7) Signal catalog (OTEL-METRIC signals) ---
signal_rows = [
    ("LATENCY_P50","MS","Latency p50","OBS|INGRESS|CORE|EVENT|LLM|RAG|API|IAM|BILLING|TENANT","P50|HIGH|CRITICAL|W1M|W5M|W15M|W1H"),
    ("LATENCY_P95","MS","Latency p95","OBS|INGRESS|CORE|EVENT|LLM|RAG|API|IAM|BILLING|TENANT","P95|HIGH|CRITICAL|W1M|W5M|W15M|W1H"),
    ("LATENCY_P99","MS","Latency p99","OBS|INGRESS|CORE|EVENT|LLM|RAG|API|IAM|BILLING|TENANT","P99|HIGH|CRITICAL|LATENCY_SPIKE|W1M|W5M|W15M|W1H"),
    ("REQUEST_RATE","RATE","Requests per time","OBS|INGRESS|API","RATE_SPIKE|RATE_DROP|HIGH|W1M|W5M|W15M"),
    ("MESSAGE_RATE","RATE","Messages per time","OBS|INGRESS","RATE_SPIKE|RATE_DROP|HIGH|W1M|W5M|W15M"),
    ("ERROR_RATE","RATE","Errors per time","OBS|INGRESS|CORE|EVENT|LLM|RAG|API|IAM|BILLING|TENANT","HIGH|CRITICAL|BURN_FAST|BURN_SLOW|W1M|W5M|W15M"),
    ("SATURATION","RATIO","Saturation (generic)","OBS|CORE|EVENT|LLM|RAG|SUPPLY","SAT_HIGH|SAT_CRITICAL|W5M|W15M"),
    ("CPU_UTILIZATION","RATIO","CPU utilization","OBS|CORE|EVENT|LLM|RAG|SUPPLY","SAT_HIGH|SAT_CRITICAL|W5M|W15M"),
    ("MEMORY_UTILIZATION","RATIO","Memory utilization","OBS|CORE|EVENT|LLM|RAG|SUPPLY","SAT_HIGH|SAT_CRITICAL|W5M|W15M"),
    ("QUEUE_DEPTH","COUNT","Queue backlog depth","OBS|EVENT","DEPTH_HIGH|DEPTH_CRITICAL|W5M|W15M|W1H"),
    ("OUTBOX_DEPTH","COUNT","Outbox backlog depth","OBS|EVENT|CORE|BILLING","DEPTH_HIGH|DEPTH_CRITICAL|W5M|W15M|W1H"),
    ("DLQ_COUNT","COUNT","Dead letter queue count","OBS|EVENT","DLQ_HIGH|DLQ_CRITICAL|W5M|W15M|W1H"),
    ("RETRY_RATE","RATE","Retries per time","OBS|EVENT","RETRY_STORM|CRITICAL|W1M|W5M"),
    ("IDEMP_HIT_RATE","RATE","Idempotency hits per time","OBS|INGRESS|EVENT|CORE","HIGH|W5M|W15M"),
    ("DEDUPE_HIT_RATE","RATE","Deduplication hits per time","OBS|INGRESS|EVENT","HIGH|W5M|W15M"),
    ("POLICY_DENY_RATE","RATE","Policy denies per time","OBS|LLM","HIGH|CRITICAL|W5M|W15M"),
    ("AUTHZ_DENY_RATE","RATE","Authorization denies per time","OBS|IAM","AUTHZ_DENY_SPIKE|HIGH|CRITICAL|W5M"),
    ("QUOTA_EXCEEDED_RATE","RATE","Quota exceeded per time","OBS|TENANT|BILLING|LLM","HIGH|W5M|W15M"),
    ("TOKENS_PER_CONV","COUNT","Tokens per conversation","OBS|LLM","TOKEN_SPIKE|HIGH|CRITICAL|W15M"),
    ("TOKENS_RATE","RATE","Tokens per time","OBS|LLM","TOKEN_SPIKE|HIGH|CRITICAL|W5M"),
    ("COST_PER_TENANT","CURRENCY","Cost per tenant","OBS|LLM|BILLING","COST_SPIKE|HIGH|CRITICAL|W15M"),
    ("LLM_LATENCY_P99","MS","LLM latency p99","OBS|LLM","LATENCY_SPIKE|HIGH|CRITICAL|W5M"),
    ("RETRIEVAL_EMPTY_RATE","RATE","Retrieval queries with empty results","OBS|RAG","RETRIEVAL_EMPTY_SPIKE|HIGH|CRITICAL|W15M"),
    ("RETRIEVAL_PRECISION","RATIO","Retrieval precision (eval-derived)","OBS|RAG","HIGH|W1H|W1D"),
    ("CITATION_COVERAGE","RATIO","Citation coverage","OBS|RAG|LLM","CITATION_DROP|HIGH|CRITICAL|W15M"),
    ("GROUNDING_FAIL_RATE","RATE","Grounding failures per time","OBS|RAG|LLM","HIGH|CRITICAL|W15M"),
]
df_signal_catalog = pd.DataFrame(signal_rows, columns=["signal","unit_type","description","allowed_areas","allowed_threshold_tokens"])

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
