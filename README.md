# Satellite-based, collaborative workflow and audit dataset for crop-type and crop-rotation labels in the Brazilian Cerrado

This repository accompanies a study of crop-type and cropping-sequence labeling in the Brazilian Cerrado. Interpreters combined MODIS Enhanced Vegetation Index (EVI) time series with Landsat composites and recorded their observations in Collect Earth Online (CEO). The repository provides the public remotely interpreted crop-label tables and documentation for harmonization, interpreter response support, review, and quality control.

The accompanying paper describes the full sampling design, interpretation protocol, spatial screening, relocation procedures, adjudication, and exclusion criteria. This README provides an overview; [data/README.md](data/README.md) describes the released data and filtering rules in detail.

## Interpretation workflow

1. Sample locations were selected from MapBiomas temporary-crop areas and an irrigation field campaign.
2. Interpreters screened the spatial context of each point-year using satellite imagery. MODIS EVI time series supplied phenological evidence, while Landsat composites supplied spatial and seasonal context for crop-type and cropping-sequence interpretation.
3. Each location had three interpreter assignment slots. Available recorded responses were linked to those assignments; duplicated assignments were counted once, and missing responses and repeated records were tracked rather than counted as additional interpreters.
4. Recorded responses were harmonized into crop classes. Review, adjudication, documented exclusions, and reviewed relocations were recorded where recoverable.
5. The public point-year table preserves the complete sampling frame. Response-support tiers and separate candidate flags allow users to select a subset for their purpose.

Interpreter response support describes concordance among the available records. It does not establish independent label accuracy, and the downloaded CEO files may contain adjudication updates rather than the original pre-review responses.

## Data release

The main file is [data/cerrado_crop_labels_point_year_v1.csv](data/cerrado_crop_labels_point_year_v1.csv). One row represents one plot for one August–July agricultural year.

| Coverage metric | Count or period |
| --- | ---: |
| Sample locations | 170 |
| Agricultural years | 24 |
| Agricultural period | August 2001–July 2025 |
| Potential point-years in the released table | 4,080 |
| Point-years with at least one recorded CEO response | 3,984 |
| Point-years without a recorded response | 96 |
| Point-years marked as documented QC exclusions | 124 |

`agricultural_year` is the start year: 2001 means 2001–2002, and 2024 means 2024–2025. All potential point-years remain in the complete table, including QC-excluded records, missing responses, system conflicts, and non-cropped or irrigated observations. The 124 documented exclusions are marked in columns and remain available for audit; they are not a count of every record omitted from a crop-label subset.

The table includes original and final coordinates, anonymized interpreter responses, harmonized classes, response-support tiers, cover-crop evidence, QC status, and candidate flags. Names, emails, and unstructured interpretation notes are not included in the public release.

### Released files

| File | Purpose |
| --- | --- |
| [data/cerrado_crop_labels_point_year_v1.csv](data/cerrado_crop_labels_point_year_v1.csv) | Complete 4,080-row point-year table. |
| [data/cerrado_crop_label_responses_v1.csv](data/cerrado_crop_label_responses_v1.csv) | Anonymized source-response table with 10,800 records, preserving raw crop-system, crop-type, cropping-sequence, and cover-crop answers. |
| [data/cerrado_crop_labels_analytical_subset_v1.csv](data/cerrado_crop_labels_analytical_subset_v1.csv) | Derived convenience file: the 1,806-record analytical subset reported in the paper. Equivalent to filtering the main table on `training_candidate_before_cover_filter`. |
| [data/crop_class_mapping.csv](data/crop_class_mapping.csv) | Mapping from raw CEO crop-system, crop-type, and sequence answers to the standardized crop classes (Supplementary Table S1). |
| [data/data_dictionary.csv](data/data_dictionary.csv) | Column types and descriptions. |
| [data/README.md](data/README.md) | Detailed data documentation, QC decisions, coordinate handling, and subset rules. |
| [gee/modis.js](gee/modis.js) | Google Earth Engine script for the MODIS EVI time-series views used in interpretation. |
| [gee/landsat.js](gee/landsat.js) | Google Earth Engine script for the Landsat composite and image-chip views used in interpretation. |

### Crop classes and selectable subsets

The standardized classes are **Soy, Corn, Cotton, Sugarcane, Rice, Other, Soy–corn, Soy–cotton, and Soy–other**. The final three describe double-crop sequences.

A recorded crop class does not automatically make a point-year suitable for a crop-label analysis. Users should select records using the candidate flags and response-support tier. Non-cropped and irrigated observations remain in the complete dataset as auxiliary categories.

Cover crop is an auxiliary attribute. The release supplies alternative cover-crop filtering policies; users must report which one they choose. When cover-crop evidence is retained as an attribute, the following subsets remain after the documented QC, coordinate, and explicit-use restrictions:

| Subset | Point-years | Selection |
| --- | ---: | --- |
| High support | 919 | Three matching assigned crop-class responses. |
| Expanded majority support | 1,540 | High support plus 621 records with two matching crop classes and a third different crop class. |
| At least two matching crop responses | 1,806 | Expanded majority support plus records with matching crop-class responses from two available assigned interpreters. |

These are overlapping subsets. Their counts must not be added together. Percentages for crop composition use the number of retained records in the selected subset, rather than all 4,080 potential point-years. See [data/README.md](data/README.md) for the exact flags and alternative cover-crop policies.

### Reproducing the paper's analytical subset

To select the 1,806-label subset reported in the paper, retain records where `training_candidate_before_cover_filter` is true, or use the derived file `data/cerrado_crop_labels_analytical_subset_v1.csv`. This selection retains cover-crop information as an attribute and includes the three-of-three agreement, two-of-three majority, and two-of-two agreement tiers. The flag identifies the paper's analytical selection; it does not certify suitability for every downstream training application.

## Interpretation guidance and Google Earth Engine resources

The [gee/](gee/) scripts listed under Released files generated the imagery views interpreters used. The interpreter guide documents the decision rules applied to those views.

| Resource | Role in interpretation |
| --- | --- |
| [gee/modis.js](gee/modis.js) | Generates MODIS EVI time-series views used to assess crop phenology. |
| [gee/landsat.js](gee/landsat.js) | Generates Landsat composite and image-chip views used to assess seasonal and spatial context. |
| `decision_rule/operational criteria used by interpreter.doc` | Interpreter guide covering crop-system and cropping-sequence decision rules, spatial screening, and interpretation limitations. |

The scripts run in the Google Earth Engine Code Editor and require an Earth Engine account.

The accompanying paper provides the methodological detail needed to interpret these resources.

## Reproducibility and use

### Reproducing the published summaries (public)

Dataset coverage, the response-support counts in the paper's Table 1, QC counts, and crop-composition results can all be reproduced from the public point-year table under an explicitly stated filtering policy. For example:

```python
import pandas as pd

df = pd.read_csv("data/cerrado_crop_labels_point_year_v1.csv")

# Response-support tiers before QC (paper's Table 1)
print(df["label_support_tier"].value_counts())

# Paper's analytical subset (cover-crop evidence retained as an attribute)
flag = df["training_candidate_before_cover_filter"].astype(str).str.lower() == "true"
subset = df[flag]
print(len(subset))                                   # expected: 1,806

# Retained records by response-support tier
print(subset["label_support_tier"].value_counts())

# Crop composition, as a percentage of retained records in the subset
print((subset["mapped_class"].value_counts(normalize=True) * 100).round(1))
```

### Source files and processing code (on request)

The public point-year table was derived from the ten original CEO response exports and the interpreter-assignment table. These files contain identifying metadata and are not distributed. The processing code that builds the point-year table from them operates on these restricted inputs and is available from the authors on request.

The release does not provide a complete history of every interpreter's pre-adjudication decision.

The labels may support downstream crop mapping, benchmarking, or model development after selection appropriate to the research question. Response support and QC flags do not certify independent accuracy.

## Citation and license

Cite the accompanying article when using these data, and identify the dataset version and filtering policy used. Add the article's final bibliographic details and the authors' chosen data license before publication.
