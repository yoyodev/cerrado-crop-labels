# Vicarious Validation Protocol for Crop Type and Crop Rotation Mapping in the Brazilian Cerrado
This repository contains the reference data, documentation, and code used to support the study on crop type and crop-rotation labeling in the Brazilian Cerrado using Collect Earth Online (CEO), MODIS EVI time series, Landsat composites, and multi-interpreter quality control.

### Data

#### `data/final_labeled_dataset.csv`
This file contains the final quality-controlled reference dataset used in the study. Each record represents a **point-year**, meaning one sampled geographic location interpreted for one agricultural year between **2001 and 2024**. The dataset includes the standardized crop or crop-rotation label assigned after multi-interpreter review, adjudication, and quality control. Retained classes include **soy**, **corn**, **cotton**, **rice**, **sugarcane**, **soy-corn**, **soy-cotton**, **soy-other**, and other non-irrigated analytical classes used in the manuscript. Records that did not meet quality standards were removed prior to release. The final dataset contains **3,706 retained point-years** derived from **170 sampled locations** across the Brazilian Cerrado.

This dataset is intended for:
- training and validation of crop type and crop-rotation models,
- benchmarking classification workflows,
- reproducing summary statistics reported in the manuscript, and
- supporting transparent interpretation of the vicarious-validation workflow.

Where available, fields may include identifiers such as point or plot ID, interpretation year, final standardized class label, interpreter or adjudication metadata, interpreter notes, and quality-control flags retained for provenance.

#### `data/excluded_points_manifest.csv`
This file documents all point-years that were reviewed during interpretation but **excluded from the final labeled dataset**. The manifest is provided for transparency and reproducibility and records the reason each observation was removed during quality control. Common exclusion reasons include:
- point located on a **road, building, or other non-agricultural surface**,
- **mixed or marginal pixels** at field edges,
- ambiguous land cover within the pixel footprint,
- persistent **cloud contamination** or insufficient imagery for confident interpretation, and
- other quality-control failures noted during adjudication.

This manifest allows users to distinguish between observations that were sampled but rejected for quality reasons and observations that were retained in the final analysis. It can also be used to audit exclusion patterns, evaluate sampling constraints, and reproduce the dataset filtering steps described in the manuscript. Based on the manuscript, the exclusion log should account for **374 excluded point-years**.

#### `data/class_mapping_table.csv`
This lookup table documents how raw **Collect Earth Online (CEO)** survey responses were harmonized into the standardized analytical classes used in the study. It links questionnaire-level labels such as **Single Crop**, **Double Crop**, **Irrigated**, and **Not Cropped** to the final crop and crop-rotation categories used in the released dataset. The table is intended to improve transparency around label harmonization and support reproducibility of downstream analyses.

**Irrigated observations** and observations marked as **cover crop** were recorded during interpretation but **excluded from class-distribution analysis**.

### Decision rules and interpretation guidance

#### `decision_rule/operation criteria used by interpreter.doc`
This document provides the interpreter operating guide used during Collect Earth Online (CEO) labeling and adjudication. It summarizes the practical decision rules applied by interpreters to classify each point-year, including how to distinguish **non-cropped**, **single crop**, **double crop**, **irrigated**, and **other** observations using combined evidence from CEO imagery, MODIS EVI time series, and Landsat seasonal composites. The guide also documents exclusion criteria for mixed pixels, roads, field edges, cloud-contaminated observations, and other low-confidence cases, as well as the phenology-based heuristics used to separate major Cerrado classes such as **soy**, **soy-corn**, **soy-cotton**, and **sugarcane**.

### Google Earth Engine scripts

#### `gee/modis.js`
This Google Earth Engine script generates the **MODIS EVI time-series views** used to support phenology-based crop and rotation interpretation. It loads **MOD13Q1 EVI** observations, groups them into study-period segments aligned to the Cerrado agricultural calendar, and produces time-series charts for selected point locations. These curves help interpreters evaluate the number of growth peaks, timing of green-up, peak magnitude, and duration near peak greenness, which are key signals for distinguishing single cropping, double cropping, perennial systems such as sugarcane, and non-cropped years.

#### `gee/landsat.js`
This Google Earth Engine script generates the **Landsat seasonal composite and image-chip visualizations** used by interpreters to examine spatial and spectral context around each sampled point. The tool creates annual or seasonal composite chips, supports configurable RGB combinations and index views, and helps distinguish crops with similar MODIS phenology by revealing differences in color, texture, uniformity, and field structure. In this study, Landsat composites were especially important for confirming field boundaries, identifying mixed pixels, detecting irrigation infrastructure, and separating classes such as **soy-corn** and **soy-cotton** during shoulder-season periods. The script is included to document the spatial evidence layer used alongside MODIS time series in the labeling workflow.

### Notes on reproducibility

Together, these files support full reproducibility of the labeling workflow described in the manuscript. The repository includes:
- the final released point-year reference dataset,
- a transparent manifest of excluded observations,
- a class-mapping table linking raw CEO responses to analytical classes,
- the interpreter decision guide used during review and adjudication, and
- the Google Earth Engine scripts used to visualize MODIS phenology and Landsat seasonal context during interpretation.
