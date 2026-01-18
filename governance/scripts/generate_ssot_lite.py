import csv
import os
import zipfile
from pathlib import Path

# Setup directories
base_dir = Path("governance")
out_dir = base_dir / "definitions"
out_dir.mkdir(parents=True, exist_ok=True)

# Helper function to write CSV
def write_csv(filename, header, data):
    filepath = out_dir / filename
    with open(filepath, 'w', newline='', encoding='utf-8') as f:
        writer = csv.writer(f)
        writer.writerow(header)
        writer.writerows(data)
    print(f"Generated {filename}")
    return filename

generated_files = []

# --- 1) Official prefix registry ---
official_prefix_header = ["prefix", "semantics", "usage_scope", "allowed_roots", "notes"]
official_prefix_data = [
    ("OTEL", "OpenTelemetry Observability Signals", "GLOBAL", "ALL", "Standard prefix for all telemetry"),
    ("SRE", "Site Reliability Engineering Controls", "GLOBAL", "OBS|INFRA|CORE", "SLOs, Alerts, Incidents"),
    ("SEC", "Security & Compliance Controls", "GLOBAL", "SEC|IAM", "Audit, Policy, Access"),
    ("DATA", "Data Governance & Lifecycle", "GLOBAL", "DATA|CORE", "Schema, Catalog, Quality"),
    ("BIZ", "Business Logic & Domain Events", "GLOBAL", "BILLING|TENANT", "KPIs, Business Transactions"),
    ("AI", "Artificial Intelligence & ML", "GLOBAL", "LLM|RAG", "Model ops, Evaluation"),
    ("UX", "User Experience & Analytics", "GLOBAL", "INGRESS|CLIENT", "RUM, Client telemetry"),
]
generated_files.append(write_csv("OfficialPrefixRegistry.csv", official_prefix_header, official_prefix_data))

# --- 2) Descriptor Catalog ---
descriptor_header = ["descriptor_token", "category", "semantics", "applies_to"]
descriptor_data = [
    ("LATENCY", "SIGNAL", "Time taken to process request", "generic"),
    ("ERROR_RATE", "SIGNAL", "Fraction of failed requests", "generic"),
    ("AVAILABILITY", "SIGNAL", "Uptime percentage", "generic"),
    ("THROUGHPUT", "SIGNAL", "Requests per second", "generic"),
    ("SATURATION", "SIGNAL", "Resource utilization (cpu/mem)", "generic"),
    ("QUEUE_DEPTH", "SIGNAL", "Items pending in queue", "async"),
    ("LAG", "SIGNAL", "Time delay in processing", "async"),
    ("JITTER", "SIGNAL", "Variance in latency", "network"),
    ("PACKET_LOSS", "SIGNAL", "Dropped network packets", "network"),
    ("CACHE_HIT", "SIGNAL", "Cache hit count", "storage"),
    ("CACHE_MISS", "SIGNAL", "Cache miss count", "storage"),
    ("DB_CONN", "SIGNAL", "Database connections", "storage"),
    ("TOKEN_COUNT", "AI", "LLM Token usage", "llm"),
    ("COST", "AI", "Inference cost", "llm"),
    ("HALLUCINATION_RATE", "AI", "Detected fabrications", "llm"),
    ("RELEVANCE_SCORE", "AI", "RAG retrieval relevance", "rag"),
    ("TOXICITY_SCORE", "AI", "Safety check score", "safety"),
    ("LOGIN_SUCCESS", "AUTH", "Successful logins", "iam"),
    ("LOGIN_FAIL", "AUTH", "Failed login attempts", "iam"),
    ("MFA_CHALLENGE", "AUTH", "MFA requests", "iam"),
    ("ACL_DENY", "AUTH", "Access denied events", "iam"),
    ("ORDER_TOTAL", "BIZ", "Order value", "billing"),
    ("SUB_STATUS", "BIZ", "Subscription state", "billing"),
]
generated_files.append(write_csv("DescriptorCatalog.csv", descriptor_header, descriptor_data))

# --- 3) Extended Prefix Registry ---
extended_prefix_header = ["prefix", "parent_prefix", "semantics", "notes"]
extended_prefix_data = [
    ("OTEL-LOG", "OTEL", "Log entry", "Structured logs"),
    ("OTEL-METRIC", "OTEL", "Metric data point", "Timeseries"),
    ("OTEL-TRACE", "OTEL", "Trace span", "Distributed tracing"),
    ("SRE-SLO", "SRE", "Service Level Objective", "Target definition"),
    ("SRE-ALERT", "SRE", "Alert definition", "Threshold rule"),
    ("SRE-INC", "SRE", "Incident record", "Post-mortem"),
    ("SEC-AUDIT", "SEC", "Audit log entry", "Immutable record"),
    ("SEC-POLICY", "SEC", "Policy definition", "OPA/Sentinel"),
    ("AI-EVAL", "AI", "Evaluation run", "Offline testing"),
    ("AI-MODEL", "AI", "Model registry", "Model artifacts"),
    ("UX-EVENT", "UX", "Client interaction", "Click/View"),
    ("UX-SESSION", "UX", "User session", "Journey"),
]
generated_files.append(write_csv("ExtendedPrefixRegistry.csv", extended_prefix_header, extended_prefix_data))

# --- 4) Root Namespace Map ---
root_map_header = ["root_token", "semantics", "owner_domain", "criticality"]
root_map_data = [
    ("INGRESS", "API Gateway & Load Balancing", "Platform", "CRITICAL"),
    ("CORE", "Core Application Logic", "Product", "CRITICAL"),
    ("IAM", "Identity & Access Management", "Security", "CRITICAL"),
    ("BILLING", "Payments & Subscriptions", "Finance", "HIGH"),
    ("TENANT", "Tenant Isolation & Config", "Platform", "HIGH"),
    ("LLM", "LLM Orchestration & Inference", "AI", "HIGH"),
    ("RAG", "Retrieval Augmented Gen", "AI", "HIGH"),
    ("EVENT", "Event Bus & Messaging", "Platform", "CRITICAL"),
    ("OBS", "Observability Pipeline", "SRE", "HIGH"),
    ("SEC", "Security Scanners & WAF", "Security", "CRITICAL"),
    ("SUPPLY", "Software Supply Chain", "DevOps", "MED"),
    ("API", "Public API Surface", "Product", "HIGH"),
    ("CLIENT", "Web & Mobile Clients", "Product", "MED"),
]
generated_files.append(write_csv("RootNamespaceMap.csv", root_map_header, root_map_data))

# --- 5) Root/Prefix Family Matrix ---
root_prefix_header = ["root_token", "allowed_prefixes", "conditionals"]
root_prefix_data = [
    ("INGRESS", "OTEL|SRE|SEC|UX", "None"),
    ("CORE", "OTEL|SRE|BIZ|DATA", "No AI prefixes"),
    ("IAM", "OTEL|SRE|SEC", "Strict audit requirements"),
    ("BILLING", "OTEL|SRE|BIZ|SEC", "PCI context"),
    ("LLM", "OTEL|SRE|AI|SEC", "Full AI suite"),
    ("RAG", "OTEL|SRE|AI|DATA", "Data heavy"),
    ("EVENT", "OTEL|SRE", "Tracing mandatory"),
    ("SEC", "SRE|SEC|DATA", "Self-monitoring"),
]
generated_files.append(write_csv("RootPrefixFamilyMatrix.csv", root_prefix_header, root_prefix_data))

# --- 6) Signal Catalog ---
signal_header = ["signal_name", "base_descriptor", "unit", "data_type"]
signal_data = [
    ("LATENCY_P99", "LATENCY", "ms", "float"),
    ("LATENCY_P50", "LATENCY", "ms", "float"),
    ("ERROR_COUNT", "ERROR_RATE", "count", "int"),
    ("ERROR_PERCENT", "ERROR_RATE", "percent", "float"),
    ("CPU_USAGE", "SATURATION", "percent", "float"),
    ("MEM_USAGE", "SATURATION", "bytes", "int"),
    ("QUEUE_SIZE", "QUEUE_DEPTH", "count", "int"),
    ("DLQ_COUNT", "QUEUE_DEPTH", "count", "int"),
    ("TOKENS_IN", "TOKEN_COUNT", "count", "int"),
    ("TOKENS_OUT", "TOKEN_COUNT", "count", "int"),
    ("COST_USD", "COST", "usd", "decimal"),
    ("CITATION_DOCS", "RELEVANCE_SCORE", "count", "int"),
]
generated_files.append(write_csv("SignalCatalog.csv", signal_header, signal_data))

# --- 7) Threshold Catalog ---
threshold_header = ["token", "token_category", "semantics", "applies_to"]
threshold_data = [
    ("LOW", "SEVERITY", "Low severity threshold", "generic"),
    ("MED", "SEVERITY", "Medium severity threshold", "generic"),
    ("HIGH", "SEVERITY", "High severity threshold", "generic"),
    ("CRITICAL", "SEVERITY", "Critical threshold", "generic"),
    ("OK", "STATE", "Normal state token", "generic"),
    ("P50", "PERCENTILE", "Percentile p50 token", "latency"),
    ("P95", "PERCENTILE", "Percentile p95 token", "latency"),
    ("P99", "PERCENTILE", "Percentile p99 token", "latency"),
    ("BURN_FAST", "SLO", "Fast burn rate token", "slo"),
    ("BURN_SLOW", "SLO", "Slow burn rate token", "slo"),
]
generated_files.append(write_csv("ThresholdTokenCatalog.csv", threshold_header, threshold_data))

# --- 8) Alert Templates ---
alert_header = ["alert_name", "signal", "required_tokens", "allowed_roots", "notes"]
alert_data = [
    ("SRE-ALERT-LATENCY_P99-HIGH-W5M", "LATENCY_P99", "P99|HIGH|W5M", "ALL", "Canonical latency alert"),
    ("SRE-ALERT-ERROR_RATE-CRITICAL-W5M", "ERROR_RATE", "CRITICAL|W5M", "ALL", "Canonical error alert"),
    ("SRE-ALERT-BURN_FAST-CRITICAL-W5M", "ERROR_RATE", "BURN_FAST|CRITICAL|W5M", "CORE|OBS", "SLO burn fast"),
]
generated_files.append(write_csv("AlertTemplateCatalog.csv", alert_header, alert_data))

# --- 9) SLO Templates ---
slo_header = ["slo_name", "area", "sli_signal", "target_type", "window", "notes"]
slo_data = [
    ("SRE-SLO-INGRESS-ERROR_RATE-TARGET_AVAILABILITY-W28D", "INGRESS", "ERROR_RATE", "TARGET_AVAILABILITY", "W28D", "Ingress availability"),
    ("SRE-SLO-INGRESS-LATENCY_P99-TARGET_LATENCY-W28D", "INGRESS", "LATENCY_P99", "TARGET_LATENCY", "W28D", "Ingress latency"),
]
generated_files.append(write_csv("SLOTemplateCatalog.csv", slo_header, slo_data))

# --- 10) Dashboard Catalog ---
dashboard_header = ["dashboard_doc_name", "area", "notes"]
dashboard_data = [
    ("SRE-GS-OBS-DOC-DESIGN-DASHBOARD_INGRESS", "INGRESS", "Golden signals + ingress-specific"),
    ("SRE-GS-OBS-DOC-DESIGN-DASHBOARD_CORE", "CORE", "Golden signals + core-specific"),
]
generated_files.append(write_csv("DashboardCatalog.csv", dashboard_header, dashboard_data))

# --- 11) Artifact Rules ---
artifact_rules_header = ["artifact_type", "semantics", "allowed_roots", "allowed_prefixes", "naming_pattern"]
artifact_rules_data = [
    ("DOC-SPEC", "Specification document", "ALL", "CSF|80053", "DOC-SPEC"),
    ("ALERT", "Alert definition", "OBS|OPS", "SRE-ALERT", "SRE-ALERT-*"),
    ("LOG", "Log event name", "ALL_RUNTIME", "OTEL-LOG", "OTEL-LOG-<AREA>-<DESCRIPTOR>"),
]
generated_files.append(write_csv("ArtifactTypeRules.csv", artifact_rules_header, artifact_rules_data))

# --- 12) Lint Rules ---
lint_header = ["rule_id", "severity", "semantics", "scope"]
lint_data = [
    ("PREFIX_REQUIRED", "ERROR", "All artifacts must begin with allowed prefix", "GLOBAL"),
    ("ROOT_COMPATIBLE", "ERROR", "Prefix must be allowed for the root namespace", "GLOBAL"),
    ("NO_AMBIGUOUS_TOKENS", "WARN", "Disallow MISC/TEMP/NEW/OLD/FIX in names", "GLOBAL"),
]
generated_files.append(write_csv("LintRuleCatalog.csv", lint_header, lint_data))

# --- 13) Test Suite ---
test_suite_header = ["expected", "example_name", "reason"]
test_suite_data = [
    ("ALLOW", "OTEL-LOG-INGRESS-WEBHOOK_RECEIVED", "Valid ingress log event"),
    ("DENY", "OTEL-METRIC-INGRESS-DLQ_COUNT", "DLQ is EVENT-only metric"),
]
generated_files.append(write_csv("NamingTestSuite.csv", test_suite_header, test_suite_data))

# --- 14) Schemas ---
# Message Schema
msg_schema_header = ["column_name", "data_type", "nullable", "semantics", "index_hint"]
msg_schema_data = [
    ("message_id", "STRING", "NO", "PK (ULID/UUID)", "INDEX"),
    ("conversation_id", "STRING", "NO", "Conversation thread FK", "INDEX"),
    ("user_id", "STRING", "YES", "End-user identifier", "INDEX"),
    ("content_text", "STRING", "YES", "Text content", ""),
    ("is_pii", "BOOLEAN", "YES", "PII detected", "INDEX"),
]
generated_files.append(write_csv("ConversationMessageTableSchema.csv", msg_schema_header, msg_schema_data))

# Audit Schema
audit_schema_header = ["column_name", "data_type", "nullable", "semantics", "index_hint"]
audit_schema_data = [
    ("audit_id", "STRING", "NO", "PK (ULID)", "INDEX"),
    ("actor_id", "STRING", "YES", "Actor id", ""),
    ("decision_type", "STRING", "NO", "Decision/action type", "INDEX"),
    ("created_at", "TIMESTAMP", "NO", "Created", "INDEX"),
]
generated_files.append(write_csv("AuditLogTableSchema.csv", audit_schema_header, audit_schema_data))

# Zip everything
zip_path = base_dir / "system_tables_bundle.zip"
with zipfile.ZipFile(zip_path, "w", compression=zipfile.ZIP_DEFLATED) as z:
    for filename in generated_files:
        filepath = out_dir / filename
        z.write(filepath, arcname=filename)

print(f"Generated {len(generated_files)} CSV files in {out_dir}")
print(f"Created zip bundle at {zip_path}")
