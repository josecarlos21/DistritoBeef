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
