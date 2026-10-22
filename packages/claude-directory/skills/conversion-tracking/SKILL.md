---
name: conversion-tracking
description: Verify available conversion and pixel diagnostics before launch; hand off tag changes to the account owner.
---

# Conversion tracking

Confirm the account with `list_connected_accounts` and `verify_platform_accounts`. Use `ga4_get_properties` to select the right property, `ga4_get_conversions` to inspect configured conversions, and `ga4_get_report` to check recorded events over a stated period. Read `get_pixel_health` for available pixel diagnostics.

A configured conversion is not proof that the right event fires or that the campaign optimizes toward it. Compare the intended business action with the evidence returned. Use `run_launch_preflight` for a campaign plan. Mark fields and checks unavailable from the tools as unverified.

For missing tags, event routing, or consent settings, describe the exact gap and have the account owner make the change in the platform or tag manager. This plugin does not publish tags or configure pixel destinations.

After changes, repeat the reads and confirm a test conversion in the platform's own diagnostics. Do not launch or scale until required tracking checks pass. Report the workspace, account, property, conversion action, observed evidence, and remaining gaps.
