# Cerrado crop labels: public point-year dataset, v1.0

## Main dataset

This dataset documents crop types and cropping sequences interpreted from satellite imagery
for sample locations in the Brazilian Cerrado. It accompanies the study's article and preserves
the recorded responses, harmonized labels, response support, and quality-control decisions.

Interpreters used MODIS Enhanced Vegetation Index (EVI) time series and Landsat composites
to assess crop types and cropping sequences, and recorded their responses in Collect Earth
Online (CEO). The source data are CSV response files downloaded from ten CEO projects.
The accompanying paper describes the full sampling, interpretation, review, and
quality-control methods.

`cerrado_crop_labels_point_year_v1.csv` is the complete public point-year dataset.
One row represents one stable CEO plot identifier (`plotid`) for one August–July agricultural
year. It contains 4,080 potential point-years: 170 plots × 24 agricultural years.
Start year 2001 means August 2001–July 2002; start year 2024 means August 2024–July 2025.
Longitude and latitude are decimal degrees, in that order.

All potential records are retained, including missing responses, system conflicts, auxiliary
non-crop conditions, and documented QC exclusions. There are 3,984 point-years with at least
one recorded response in the downloaded CEO files and 96 with none. The table marks 124 point-years as explicitly QC-excluded.
`qc_status = retained` means no documented exclusion was applied; it does not guarantee a resolved label.

## Files

- `cerrado_crop_labels_point_year_v1.csv`: main point-year table.
- `cerrado_crop_label_responses_v1.csv`: 10,800 source-response records without interpreter identities or notes. This supplementary ledger supports tracing raw CEO crop-system, crop-type, sequence, and cover-crop answers.
- `cerrado_crop_labels_analytical_subset_v1.csv`: derived convenience file containing the 1,806-record
  analytical subset reported in the paper; equivalent to filtering the main table on
  `training_candidate_before_cover_filter`. The main table remains the authoritative dataset.
- `crop_class_mapping.csv`: reference table linking standardized crop classes to their corresponding CEO crop-system, crop-type, or crop-sequence responses and class families.
- `data_dictionary.csv`: column descriptions and types for the main table.

Names, email addresses, assignment notes, and confidence comments are not distributed here.
The original downloaded CEO response files and internal working files contain identifying
metadata and are not part of this public release.

## Interpreters, support, and classes

Interpreter slots 1–3 are anonymous **within each plot**, not global person identifiers.
The same slot number on another plot can refer to another person.
The assignment file lists one interpreter twice for plot 44. That interpreter contributes at most one consolidated response per point-year;
the repeated slot is flagged and its public response fields are blank.
Repeated records for the same interpreter and point-year in the downloaded CEO response files
are consolidated into one response when their harmonized outcomes are identical.
Conflicting repeated outcomes are flagged rather than counted as independent responses.

Before QC or cover-crop filtering, the dataset contains 942 three-of-three crop agreements,
632 two-of-three crop majorities, and 287 two-of-two agreements. The remaining
`label_support_tier` categories cover single responses, system conflicts, crop-class
disagreements, auxiliary conditions, and missing data; counting this column across all
4,080 rows reproduces the paper's Table 1.
These counts describe responses available in the downloaded CEO files. Because some files may reflect
adjudication updates, they are not independent accuracy estimates or a preserved history of
pre-adjudication interpreter agreement.

The standardized classes are Soy, Corn, Cotton, Sugarcane, Rice, Other, Soy–corn, Soy–cotton,
and Soy–other. The latter three describe double-crop sequences.
`mapped_class` supplies a displayable class for agreement, majority, or single-response tiers
without a system conflict. It remains blank for unresolved or conflicting tiers.
A QC-excluded row can still retain its recorded class for audit purposes.
`majority_class` records a crop class when at least two distinct assigned interpreters provided
that same class. For example, if two interpreters recorded Soy and another recorded Not cropped,
`majority_class` is Soy, while `crop_system_conflict` is True. The conflicting record remains in
the complete dataset and is excluded from the default crop-label candidate subsets.
Having a value in `mapped_class` or `majority_class` does not by itself mean that a record meets
the subset rules. Select records using the candidate flags described below, together with the
desired `label_support_tier`.

Per-slot raw-response columns join distinct values from repeated CEO response records using semicolons.
The response ledger retains each source row separately. `assigned_interpreter_slot` is missing
for unassigned or unmatched responses, which do not contribute to assigned-interpreter support.

## Documented QC and coordinates

Explicit exclusions are:

| Plot IDs | Agricultural-year starts excluded |
| --- | --- |
| 4, 25, 37, 146 | All 24 years |
| 20 | 2010, 2014, 2019, 2020 |
| 39, 105, 112, 155 | 2001–2006 |

For plot 11 in agricultural-year start 2006, a CEO interpretation note states:
"Don't use 2006, very noisy." This specific instruction is recorded as
`explicit_training_hold = True`: the point-year remains in the complete dataset but is
omitted from the default crop-label candidate subsets. It is tracked separately from the
124 documented QC exclusions listed above.
Completed adjudication reported for plots 10, 11, 12, 13, 14, 17, 21,
24, and 52 is recorded at plot level; no detailed year-specific adjudication log is asserted.
Generic CEO flags and uncertain wording do not automatically create further exclusions.

Original and interpretation coordinates are both retained. Eleven reviewed relocations have
been applied, including plot 10. Plots 18, 23, 150, and 163 have unresolved relocation metadata.
For those records, final coordinates remain the original coordinates and `location_status`
explicitly indicates the unresolved relocation. Default training flags hold them out.
A relocation does not independently establish label accuracy.

The study sampled 150 locations from MapBiomas temporary-crop areas and 20 from an irrigation
field campaign. `source_sample` is intended to identify which of these two sampling sources
each plot came from. It is currently blank because a verified table linking individual plot IDs
to those sources was not available when this release was prepared. The overall sample totals
are known; the source of each individual plot has not been verified in this release.

## Cover crops and downstream filtering

Cover crops remain an auxiliary attribute. `cover_crop_status` describes combined assigned-interpreter
evidence as yes, no, mixed, or missing. A mixed response is not recoded as No.
Three explicit candidate flags are supplied; users must state which policy they use.

### Reproducing the paper's analytical subset

To select the 1,806-label subset reported in the paper, retain records where
`training_candidate_before_cover_filter` is true, or use `cerrado_crop_labels_analytical_subset_v1.csv`. This selection retains cover-crop information
as an attribute and includes the three-of-three agreement, two-of-three majority, and two-of-two
agreement tiers. The flag identifies the paper's analytical selection; it does not certify
suitability for every downstream training application.

### All candidate flags


| Candidate flag | Records | Rule |
| --- | ---: | --- |
| `training_candidate_before_cover_filter` | 1,806 | At least two matching assigned crop classes; no conflicting crop-system responses or inconsistent repeated responses from the same interpreter; no documented QC exclusion or unresolved relocation; and no explicit instruction to omit the point-year from training (`explicit_training_hold`). Cover evidence is retained as an attribute. |
| `training_candidate_exclude_any_cover_yes` | 878 | The preceding rule, additionally removing any record with Yes evidence from an assigned interpreter. |
| `training_candidate_exclude_yes_plurality` | 1,223 | The preceding base rule, removing records where consistent Yes answers outnumber consistent No answers. Yes/No ties remain in this scenario. |

These flags include two-of-two agreement. To restrict to a three-of-three high-support subset,
also filter `label_support_tier == three_of_three_crop_agreement`. For the nested expanded subset,
use the three-of-three and two-of-three tiers only. Percentages must use the number of retained
records in the explicitly selected subset, not all 4,080 potential point-years.
No blanket cover-crop rule has been imposed on the complete point-year table, and these
candidate flags do not certify final training suitability.

## Reproduce and cite

### Published summaries (public)

Coverage, response-support (Table 1), QC, and crop-composition results can be reproduced from
`cerrado_crop_labels_point_year_v1.csv` using the stated candidate flag and
`label_support_tier`. See the repository README for a short worked example.

### Source files and processing code (on request)

This table was derived from the ten downloaded CEO response files and the interpreter-assignment
CSV. These contain identifying metadata and are not distributed. The processing code that builds
the point-year table from them operates on these restricted inputs and is available from the
authors on request.

### Citation and license

Use the accompanying article's final bibliographic details to cite this dataset, and state the
dataset version and the candidate flag or filtering policy used.
Add the authors' chosen data license to the repository; this preparation step does not assign one.
