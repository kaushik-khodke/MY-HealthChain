# ADR-009: Enterprise HMS Suite & National ABDM / HL7 FHIR v4.0 Interoperability

* **Status:** Accepted
* **Date:** 2026-08-22
* **Deciders:** Lead Software Architect, Healthcare Standards Team, Compliance Officer

---

## 📌 Context
Traditional healthcare web applications either function as simple booking portals or lack regulatory interoperability with national health ecosystems. Hospitals require an integrated operational system capable of managing patient identity deduplication, inpatient bed admissions, computerized orders, surgical checklists, and national health identifier standards (ABDM) without vendor lock-in.

---

## 🏛️ Decision
We architected and implemented a modular **6-Phase Hospital Management System (HMS / HIS)** embedded directly into MyHealthChain:
1. **Phase 1 (Master Patient Index & UHID):** Levenshtein fuzzy string distance deduplication preventing duplicate patient records across municipal registries (`/hms/patient/fuzzy-check`).
2. **Phase 2 (Inpatient ADT & CPOE):** Full Admission, Discharge, Transfer lifecycle with 4-point digital discharge clearance and computerized physician order entry with CDSS (`/hms/adt/*`, `/hms/cpoe/*`).
3. **Phase 3 (Bedside Nursing eMAR):** Barcode scanning verifying the 5-Rights of clinical medication administration (`/hms/emar/administer`).
4. **Phase 4 (Diagnostics & RCM):** Specimen analyzer lifecycle tracking with historical delta check alerts and RIS/PACS DICOM study worklists (`/hms/diagnostics-rcm/*`).
5. **Phase 5 (Surgical Suite & Blood Bank):** Operation Theater module implementing the WHO Surgical Safety Checklist (Sign-In, Time-Out, Sign-Out), ASA physical status scores, PACU Aldrete recovery scoring, and blood cross-matching (`/hms/surgical-interop/ot/*`).
6. **Phase 6 (National ABDM & FHIR Interoperability):** Certified **HL7 FHIR v4.0 Resource Bundle** exporter (mapped to SNOMED CT and LOINC codes), 14-digit **Ayushman Bharat Health Account (ABHA)** card generation, and an immutable cryptographic SHA-256 compliance audit trail.

---

## ⚖️ Consequences

### Positives:
* **Regulatory Compliance:** Complies with ABDM, HL7 FHIR v4.0, HIPAA, and NABH clinical standards.
* **Patient Safety:** 5-Rights eMAR and WHO OT checklists drastically eliminate medical errors.
* **Unified Data Model:** Single relational schema in Supabase with instant WebSocket synchronization to all portals.

### Negatives:
* Requires healthcare personnel training for barcode scanners and multi-stage discharge clearance workflows.
