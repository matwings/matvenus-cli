# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.2.3] - 2026-04-16

### Changed
- Split `alphafold-protein-folding` command into two dedicated commands:
  - `alphafold-2-protein-folding` — AlphaFold2 single/multi-chain protein folding (`submission_mode`, `model_preset`)
  - `alphafold-3-protein-folding` — AlphaFold3 protein/DNA/RNA/ligand complex prediction (`sequences`, `model_seeds`)
- Removed the unified `alphafold-protein-folding` command (replaced by the above two).
- Regenerated CLI from updated OpenAPI specification.

### Added
- `upload-file-multipart` command: native multipart/form-data file upload via `--file <path>`. Preferred over `upload-file-base-64` for all file sizes — no base64 encoding required.

### Removed
- `upload-file-base-64` command: removed in favor of `upload-file-multipart` for all file uploads.

## [0.2.2] - 2026-03-30

### Changed
- Updated documentation with scoped package installation instructions.
- Added metadata to `package.json` (types, bugs, homepage).

## [0.2.1] - 2026-03-30

### Changed
- Renamed package to scoped name `@matwings/matvenus-cli` for better organization ownership.

### Added
- Added GitHub Actions workflow for automated NPM publication on release.

### Fixed
- Fixed GitHub repository URL in `package.json`.

## [0.2.0] - 2026-03-30

### Changed
- Modified authentication environment variable prefix from `API_` to `MATVENUS_`.
- Regenerated CLI with updated API specifications.
- Project name confirmed as `matvenus-cli`.

## [0.1.0] - 2026-03-30

### Added
- Initial project release.
- Support for protein folding prediction (AlphaFold2, AlphaFold3, ESMFold).
- Support for functional residue prediction (ESM2, VenusX).
- Support for protein function prediction (VenusG).
- Support for mutation prediction (VenusREM, VenusPrime).
- Support for molecular dynamics simulations (GROMACS).
- Support for de novo protein design (RFdiffusion, ProteinMPNN).
- Support for protein mining (VenusMine).
- Standardized CLI interface with `commander.js`.

### Changed
- Preparation for NPM publication.
