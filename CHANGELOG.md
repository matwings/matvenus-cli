# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
